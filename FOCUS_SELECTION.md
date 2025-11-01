# Movian internals: where items live and how focus/selection works

This note summarizes how Movian stores items created by plugins, how those items become UI widgets, and the paths by which they get focused and selected. File and symbol names reference this repository.

## Big picture

- Plugins create items in a property tree (“props”).
- The UI (GLW) subscribes to those props and creates widgets (one widget per item) using cloners/vectorizers.
- Focus is a GLW concern (which widget is currently focused). Selection is first and foremost a prop concern (which child prop is “selected” under a directory prop). The two are bridged at a few points.

## Where items are stored (props)

Core data structure: `struct prop` in `src/prop/prop_i.h` (public API in `src/prop/prop.h`). Relevant fields inside `prop_t` (see `src/prop/prop_core.c` for logic):

- Children: `hp_childs` (TAILQ of child props)
- Selected child pointer: `hp_selected`
- Parent pointer: `hp_parent`
- Type: `hp_type` (e.g., `PROP_DIR`, `PROP_INT`, etc.)

Creation and storage:

- Plugins (JS) call `page.appendItem(...)`, which ultimately creates child props under the page’s content node (directory). The JS/C bridge is in `src/ecmascript/es_prop.c` and related page APIs.
- When children are added, subscribers are notified. Subscriptions are established by the UI layer.

Selection in props:

- Selecting a child is performed by `prop_select_ex(prop_t *child, ...)` in `src/prop/prop_core.c`.
  - It sets `parent->hp_selected = child`.
  - It notifies subscribers with event type `PROP_SELECT_CHILD`.
- When a subscriber asks for initial children, a child may be delivered with the `PROP_ADD_SELECTED` flag (see `gen_add_flags()` in `src/prop/prop_core.c`), informing the UI which one is selected.

Linking selection:

- `src/prop/prop_linkselected.c` keeps an external prop linked to the currently selected child of a directory. This is used widely for e.g. detail panes.

## How props become UI widgets

Key bridge: `src/ui/glw/glw_view_eval.c`.

- The UI subscribes to the prop tree backing a view. When a child prop is added, the code in `cloner_add_child0()` or `vectorizer_add_element()` creates a GLW widget for it.
  - `cloner_add_child0(...)` (around line ~1410) constructs a `glw_clone_t` for each child prop and creates a new widget (`c->c_w = glw_create(...)`).
  - The mapping between a prop and its widget is stored via a tag (`prop_tag_set`) so we can later find the widget from the prop.
- Parent widget child list:
  - GLW widgets are represented by `glw_t` (see `src/ui/glw/glw.h`). Children live in `w->glw_childs` (a TAILQ). This is how UI elements are stored in memory once created.

Selection hint at creation time:

- If a prop child arrives with the `PROP_ADD_SELECTED` flag, and the parent widget implements `.gc_select_child`, the cloner immediately calls it (see `glw_view_eval.c`, in `cloner_add_child0()`):
  - `if(flags & PROP_ADD_SELECTED && parent->glw_class->gc_select_child != NULL)
       parent->glw_class->gc_select_child(parent, c->c_w, NULL);`
- This is how an already-selected item in the prop tree can cause its corresponding widget to gain focus/visibility quickly.

## Focus in GLW (UI)

Key files: `src/ui/glw/glw.c`, `src/ui/glw/glw_navigation.c`, and widget classes such as `src/ui/glw/glw_list.c`.

Important concepts/fields in `glw_t` (`glw.h`):

- `glw_childs`: children widgets in a TAILQ
- `glw_focused`: currently focused immediate child (focus path crawls down one level at a time)
- `glw_focus_weight`: determines if a widget is focusable (`glw_is_focusable(w)` is true if weight > 0)
- Focus path flags (e.g., `GLW_IN_FOCUS_PATH`)

Focus-setting core:

- `glw_focus_set(glw_root_t *gr, glw_t *w, int how, const char *whom)` in `glw.c` sets focus, walking up and signaling each parent with either
  - `GLW_SIGNAL_FOCUS_CHILD_AUTOMATIC` (non-interactive) or
  - `GLW_SIGNAL_FOCUS_CHILD_INTERACTIVE` (interactive focus, e.g., from user input).
- `glw_get_focusable_child(glw_t *w)` finds a focusable descendant when initial focus is needed:
  - It tries to follow existing focus path (`glw_focus_by_path()`), otherwise crawls the subtree (`glw_focus_crawl1()`) to find the first focusable.
- Navigation helpers in `glw_navigation.c` (`glw_navigate_first/last/step`) iterate siblings and use `glw_get_focusable_child()` to pick focus targets.

Widget classes can react to focus signals:

- For lists, `src/ui/glw/glw_list.c` handles focus-related signals:
  - `GLW_SIGNAL_FOCUS_CHILD_INTERACTIVE` ensures the focused item is scrolled into view (see `scroll_to_me()`), and updates internal scroll control state.

## Selection → Focus bridge in the UI

When props say “this child is selected,” the UI needs to focus the corresponding widget. Two bridges exist:

1) At child creation time, via `PROP_ADD_SELECTED` (described above), the cloner invokes `.gc_select_child` on the parent widget class.

2) When `PROP_SELECT_CHILD` events arrive on an already-populated list/vectorizer, `glw_view_eval.c` routes that selection to the parent widget’s `.gc_select_child` method as well (search for `PROP_SELECT_CHILD` handling):

- In vectorizer/cloner paths, on selection events, `gc_select_child(parent, child_widget, origin_prop)` is called when available. The parent (e.g., list) should then bring that child into view and focus its focusable leaf.

For lists (`glw_list.c`), `.gc_select_child` typically:

- Sets `w->glw_focused = child_widget`
- Requests scroll to make it visible (`l->gsc.scroll_to_me = child_widget`)
- Calls `glw_focus_set(..., GLW_FOCUS_SET_INTERACTIVE, ...)` on the child’s focusable leaf so the keyboard focus follows selection.

## Focus → Selection bridge (optional)

Interactive focus (user navigation) may need to update selection so that other UI parts (like description panes) reflect the item under focus. There are a couple approaches the codebase uses:

- Some views link selection to focused items using `prop_linkselected` to keep a prop (e.g., `current`) in sync with the currently focused item’s prop.
- A widget can, upon `GLW_SIGNAL_FOCUS_CHILD_INTERACTIVE`, call `prop_select_ex()` on the focused child’s originating prop to update `hp_selected`. This is optional and depends on the widget.

Out of the box, selection is primarily prop-driven. Focus can be driven by selection via `.gc_select_child` as described.

## Event flow for Up/Down navigation

- Key input is turned into actions (e.g., `ACTION_UP`, `ACTION_DOWN`).
- Events are delivered with `glw_event_to_widget()` (`glw.c`), descending the focus path and then bubbling up if not handled.
- Lists use `glw_navigate_vertical`/`glw_navigate_horizontal` (see class definitions in `glw_list.c`) to move focus between items.
- If a view flips from List ↔ Grid on Up/Down, it’s because that key path ends up at a control handling view mode (a sibling settings control or a higher-level view switcher) rather than the list, which indicates initial focus landed on (or bubbled to) the wrong widget. That’s a focus targetting issue rather than core list navigation.

## Key files and functions (quick index)

- Prop system (data and selection):
  - `src/prop/prop_core.c`
    - `prop_select_ex()` — sets `hp_selected` and fires `PROP_SELECT_CHILD`
    - `gen_add_flags()` — marks initial `PROP_ADD_SELECTED`
  - `src/prop/prop_linkselected.c` — links selection to another prop
  - `src/prop/prop.h` — public prop APIs and flags

- JS bridge (plugins):
  - `src/ecmascript/es_prop.c` — prop access from JS; `prop.select(...)`
  - Page/item creation handled via page APIs bridged here and related modules

- GLW (UI core):
  - `src/ui/glw/glw.c`
    - `glw_focus_set()` — set focus
    - `glw_get_focusable_child()` — find initial focus target
    - `glw_focus_crawl1()` — crawl subtree for focusable
  - `src/ui/glw/glw_navigation.c` — keyboard/remote navigation logic
  - `src/ui/glw/glw_list.c` — vertical/horizontal list widgets
    - Handles scroll/visibility and reacts to focus signals
    - Implements `.gc_select_child` to honor selection
  - `src/ui/glw/glw_view_eval.c` — glue between props and GLW widgets
    - `cloner_add_child0()` / `vectorizer_add_element()` create widgets
    - On `PROP_ADD_SELECTED`/`PROP_SELECT_CHILD`, calls parent’s `.gc_select_child`

## How a plugin selects/focuses an item

- From JS, after creating items, you can select a specific item by:
  - `prop.select(page.items[index].root);`  — directly fires selection on the item’s prop
  - Or, if using the page model, `page.model.nodes.selected = page.items[index].root;`
- The selection triggers `PROP_SELECT_CHILD` upstream, which the UI observes and maps to focusing the corresponding widget via `.gc_select_child`.

## Common pitfalls

- Forcing focus/selection in layout code (e.g., during list render) conflicts with navigation and prop-driven selection.
- Picking the initial focus in the wrong container can land on invisible controls like “Page layout,” making Up/Down switch view modes instead of moving within the list.
- If initial focus must be biased (e.g., second item), prefer doing it narrowly for list widgets and only during the very first automatic focus, not on every focus recalculation.

## TL;DR data flow

1) Plugin appends items → creates child props under a directory prop.
2) UI subscribes and creates a widget per child prop (cloner/vectorizer) → widgets live under `glw_t.glw_childs`.
3) Selection:
   - Prop: `prop_select_ex(child)` sets `parent->hp_selected` and notifies.
   - UI: On `PROP_ADD_SELECTED`/`PROP_SELECT_CHILD`, parent widget’s `.gc_select_child` focuses the corresponding child widget.
4) Focus:
   - `glw_focus_set()` manages focus path and signals.
   - Navigation moves focus between widgets; optional bridges can sync focus → selection.


## Tracing recipe: map plugin items → widgets → focus (no behavior changes)

Below are small, low-risk, temporary breadcrumbs you can add to print exactly:
- Which prop (child) got cloned into which widget
- When selection requests arrive and which widget they target
- When focus changes and what prop that focused widget originates from

These snippets only add logs; they don’t change logic. Revert them after debugging.

1) Log when a prop child is turned into a widget

File: `src/ui/glw/glw_view_eval.c` in `cloner_add_child0(...)` right after `c->c_w = glw_create(...)`:

```c
#include "prop/prop_i.h" // for prop_get_DN()
// ...existing code...
c->c_w = glw_create(gr, sc->sc_cloner_class, parent, b, p,
        scope,
        sc->sc_cloner_body->file,
        sc->sc_cloner_body->line);
// Add after the line above
TRACE(TRACE_DEBUG, "GLW",
  "Clone child → widget: prop=%s widget=%p class=%s flags=%s",
  prop_get_DN(p, 1), c->c_w,
  c->c_w->glw_class ? c->c_w->glw_class->gc_name : "?",
  (flags & PROP_ADD_SELECTED) ? "ADD_SELECTED" : "");
```

Also log when `.gc_select_child` is invoked at creation time (still in `cloner_add_child0`):

```c
if(flags & PROP_ADD_SELECTED && parent->glw_class->gc_select_child != NULL) {
  TRACE(TRACE_DEBUG, "GLW",
    "gc_select_child on create: parent=%p(%s) childW=%p prop=%s",
    parent,
    parent->glw_class ? parent->glw_class->gc_name : "?",
    c->c_w, prop_get_DN(p, 1));
  parent->glw_class->gc_select_child(parent, c->c_w, NULL);
}
```

If your page uses the vectorizer path, do the same kind of log in `vectorizer_add_element(...)`.

2) Log selection events routed from props to widgets

Where `PROP_SELECT_CHILD` is handled (still in `glw_view_eval.c`), right before calling parent’s `gc_select_child`, add:

```c
TRACE(TRACE_DEBUG, "GLW",
  "gc_select_child on select: parent=%p(%s) childW=%p origin=%s",
  parent,
  parent->glw_class ? parent->glw_class->gc_name : "?",
  child_widget, prop_get_DN(origin, 1));
```

3) Log when lists move focus due to interactive navigation

File: `src/ui/glw/glw_list.c`, inside `glw_list_callback()` under `GLW_SIGNAL_FOCUS_CHILD_INTERACTIVE` (after `scroll_to_me(l, extra);`), add:

```c
glw_t *cw = extra;
if(cw && cw->glw_originating_prop)
  TRACE(TRACE_DEBUG, "GLW",
    "List interactive focus: widget=%p childClass=%s origin=%s",
    cw,
    cw->glw_class ? cw->glw_class->gc_name : "?",
    prop_get_DN(cw->glw_originating_prop, 1));
```

4) Log all focus changes centrally

File: `src/ui/glw/glw.c`, in `glw_focus_set(...)` right after `gr->gr_current_focus = w;` and before returning:

```c
extern const char *prop_get_DN(prop_t *p, int compact);
static prop_t *get_originating_prop(glw_t *w); // already present in this file

prop_t *orig = w ? get_originating_prop(w) : NULL;
TRACE(TRACE_DEBUG, "GLW",
  "Focus → %p class=%s origin=%s how=%d by=%s",
  w,
  (w && w->glw_class) ? w->glw_class->gc_name : "(null)",
  orig ? prop_get_DN(orig, 1) : "(none)",
  how, whom);
```

5) Build and run

- Build as usual (`make`).
- Run Movian and open your plugin page. Collect logs (stdout/stderr). If you need more verbosity for GLW, ensure debug logging includes the `GLW` tag at `TRACE_DEBUG` level (this depends on your runtime logging setup; if needed, temporarily raise logs in code by replacing some `TRACE_DEBUG` with `TRACE_INFO`).

6) Interpreting the breadcrumbs

- Clone child → widget: Shows the prop DN (path) that generated each widget and its class.
- gc_select_child on create/select: Shows when selection from props targets a specific child widget.
- List interactive focus: Shows the prop behind the item that received interactive focus.
- Focus →: Central record of who currently has focus and its originating prop.

With these, you can verify whether initial focus lands on a list item (good) or on an auxiliary control like “Page layout” (bad), and why (e.g., a selection event targeted it, or initial focus fallback picked a non-list).

7) Clean up

- Revert the added TRACE lines after you’ve captured the needed evidence, to keep logs quiet and avoid any accidental performance impact.

