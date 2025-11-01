# Element Selection & Focus Handoff

This note captures the full context, reasoning, and code changes made to reliably select and focus a specific list item (Item 3) from a Movian plugin, plus debugging guidance you can use to continue in a new session.

## Goal

- Build a simple plugin that appends several items and ensures Item 3 is both selected and focused when the page opens.
- As a proving step, explore how to bias selection/focus (e.g., second item) in core.

## What we learned (architecture)

- UI stack: GLW widgets (e.g., `list_y`, `deck`, `playfield`) receive selection/focus via the Prop system.
- Relevant prop events:
  - `PROP_ADD_SELECTED` – fired when a child is created with a selected flag; commonly triggered by cloners.
  - `PROP_SELECT_CHILD` – explicit parent-select-child event; the key signal for “this is the selected item.”
  - `PROP_SUGGEST_FOCUS` – a suggestion path for focus. This should move focus via widgets’ `gc_suggest_focus`.
- Focus flows in GLW:
  - `glw_get_focusable_child()` follows the current path first, then crawls the widget tree.
  - `glw_focus_set()` performs the actual focus change; logs include “Focus set to … by …”.
  - During page open, the skin often runs an initial heuristic (`OpenCloseFound`) which can briefly focus a details pane or the first list item before your selection lands.
- Lists and decks:
  - `list_y` renders the list of items; `deck` renders details for the selected item.
  - The skin (`glwskins/flat/pages/list.view`) includes a main list with `id: "scrollable"` and a details deck bound to the same model.

## Why selection flickered

- Early plugin selection/focus calls can be lost because the cloner may not have created children yet. A later `OpenCloseFound` (or other initial focus logic) then steals focus.
- Even after children exist, selection alone updates state/styling, but focus can remain where the skin initially set it (e.g., details view, first item, or a container).
- Nested lists (e.g., multi-option sublists in details) emit their own selection noise and can tug focus.

## Changes made in core

All paths below are relative to the repo root.

1) `src/ui/glw/glw_view_eval.c`
- Added GLW tracing around selection/suggest:
  - `PROP_ADD_SELECTED`: parent selects child when cloner creates a selected child.
  - `PROP_SELECT_CHILD`: parent selects child on explicit selection.
  - `PROP_SUGGEST_FOCUS`: parent suggests focus to a child.
- Implemented "pending suggest" delivery:
  - If `PROP_SUGGEST_FOCUS` arrives before the child exists, queue it on the cloner and deliver once the child is created.
- Cleaned up a misleading-indentation warning by bracing the `if(parent->glw_class->gc_select_child != NULL)` branch.

2) `src/ui/glw/glw_list.c`
- Implemented `glw_list_select_child()` and registered it for `list_y` and `list_x`:
  - Scrolls the selected child into view (`scroll_to_me`).
  - Finds a focusable leaf within the selected item and calls `glw_focus_set()`.
  - Key tweak: if selection comes from an explicit `PROP_SELECT_CHILD` and the list has `id == "scrollable"`, the focus change is done as INTERACTIVE. This makes it decisive and able to override early skin focus (`OpenCloseFound`). Otherwise, it uses AUTOMATIC to avoid tug-of-war in nested lists.
- Extra trace: log interactive child-focus events for lists.

3) `src/ui/glw/glw.c`
- Traced `glw_get_focusable_child()` to log by-path and crawl results.
- You’ll see logs like:
  - `get_focusable_child('…'): by-path -> '…'`
  - `get_focusable_child('…'): crawl -> '…'`
  - `get_focusable_child('…'): none`

4) `src/ecmascript/es_prop.c`
- Exposed `prop.suggestFocus(prop)` to JS, which routes to `PROP_SUGGEST_FOCUS`.

## Plugin changes (example)

File: `plugin_examples/elementselection/elementselection.js`

- Appends 4 items and targets Item 3 for selection and focus.
- Uses both `movian/prop` and `native/prop`:
  - Calls `native/prop.select(item.root)` and then `native/prop.suggestFocus(item.root)` after appends.
  - Subscribes to `page.model.nodes` to:
    - Suggest focus once when `addchild/addchilds` occurs (children now exist).
    - Once after the first `selectchild`, re-assert both selection and focus (a one-time “reselect + suggest”), which happens after the skin’s initial pass (deck/list) and defeats early focus.
- Emits console logs such as:
  - `Selecting Item 3 via native select`
  - `Calling suggestFocus (native)`
  - `Suggest after add: addchild`
  - `Reselect + suggest after selectchild`

## How to build and run

- Build: `make` (task is already configured in VS Code).
- Run Movian with GLW debug tracing enabled (so you can see focus/selection logs):

```bash
# Optional example (adjust to your run workflow):
./build.linux/movian -d --debug-glw
```

- Navigate to "Element Selection Demo" (from the example plugin) to open the page.

## What to look for in logs

Order may vary slightly, but around page open you should see:

- Early focus heuristic:
  - `Focus set to .//glwskins/... by OpenCloseFound` (this is expected and temporary)
- Selection events for the main list:
  - `PROP_SELECT_CHILD: parent 'list_y @ .//glwskins/flat/pages/list.view:12' selects child '...'`
  - `List 'list_y @ .//glwskins/flat/pages/list.view:12' select_child -> '...'`
- Focus discovery:
  - `get_focusable_child('loader @ .//glwskins/flat/pages/list.view:25 ...'): by-path -> '...'`
  - `get_focusable_child('...'): crawl -> '...'`
- Final focus handoff from list selection:
  - `Focus set to ... by SelectChild`
- Plugin logs:
  - `Selecting Item 3 via native select`
  - `Calling suggestFocus (native)`
  - `Suggest after add: addchild`
  - `Reselect + suggest after selectchild`

If nested lists generate repeated selection noise (e.g., multiopt views), that’s normal; they now use AUTOMATIC focus (not interactive) and shouldn’t steal focus from the main list.

## Edge cases and races we handled

- Suggesting focus before the cloner created children – fixed with pending suggest in the cloner so it’s delivered later.
- Initial skin focus (“OpenCloseFound”) overriding selection – the main list’s selection now uses INTERACTIVE focus (scoped to `id == "scrollable"`) so it wins.
- Nested list chatter (multiopt in item details) – left as AUTOMATIC so it doesn’t preempt the main list.

## Minimal contract for success

- Inputs: A selected prop for Item 3, and a suggest-focus intent for that item, after children exist.
- Behavior: The main list scrolls to the selected item and focuses it; details deck updates accordingly.
- Signals observed: `PROP_SELECT_CHILD` on the main list, a `List '...' select_child -> '...'` trace, and `Focus set to ... by SelectChild`.

## Next steps (if flicker persists)

- Confirm you see a `Focus set to ... by SelectChild` after the `PROP_SELECT_CHILD` for the main list. If not, include ~50 lines of GLW debug logs around the open sequence in a new session.
- If a specific nested list is still stealing focus afterwards, we can:
  - Add a tiny guard to ignore `selectOnFocus` during the very first open cycle on the main list only, or
  - Expand the interactive-handling rule to more precisely target only the primary list’s selection event.
- For skin-only experiments, you can temporarily disable `selectOnFocus` for the main cloner in `glwskins/flat/pages/list.view` to test the hypothesis.

## Files touched (summary)

- `src/ui/glw/glw_view_eval.c`
  - Added GLW_TRACE for selection/suggest
  - Added pending-suggest handling
  - Fixed indentation warning in `cloner_select_child`
- `src/ui/glw/glw_list.c`
  - Implemented/registered `glw_list_select_child()`
  - Interactive focus for main list (`id == "scrollable"`) on explicit selection
- `src/ui/glw/glw.c`
  - Added tracing in `glw_get_focusable_child()`
- `src/ecmascript/es_prop.c`
  - Exposed `prop.suggestFocus(prop)` to JS
- `plugin_examples/elementselection/elementselection.js`
  - Example plugin demonstrating append, select, suggest, and one-time reselect after `selectchild`

## Troubleshooting checklist

- Do you see `PROP_SELECT_CHILD` and `List '...' select_child -> '...'` for the main list?
- Do you see `Focus set to ... by SelectChild` after that?
- If focus still lands elsewhere immediately after, which widget prints the next `Focus set to ... by ...` and why?
- Confirm the main list is the one with `id: "scrollable"` (from `glwskins/flat/pages/list.view`).

---

With this, you can carry the context to a new session quickly and continue from runtime logs. If you paste the next 30–50 lines around the open sequence, we can make any remaining adjustments (e.g., tiny guard for a particularly aggressive nested list).

## Can a plugin do this without any app/core changes?

Short answer: not reliably with the current core and skin. You can sometimes make it appear to work with timing tricks, but there’s no robust plugin‑only way to guarantee that the list both selects and takes focus on Item 3 across runs/skins.

Why plugin‑only isn’t enough today
- No definitive “page fully loaded” signal in JS: You can subscribe to `model.nodes` (`addchild`/`selectchild`), but those fire while the skin’s Open/Close focus heuristics are still running. Ordering varies by device/skin.
- Selection ≠ focus: Before our change, `PROP_SELECT_CHILD` updated selection, but lists didn’t move focus in response. A later OpenCloseFound (or selectOnFocus in the skin) could set focus elsewhere and make the first item win.
- Suggesting focus alone can’t “elevate” focus: A bare `suggestFocus` hints inside the list, but if the list itself isn’t focused yet, external heuristics can still override it. Early suggestions can also be lost if children don’t exist yet.

What would be required for a plugin‑only solution
- A reliable “after view open and focus heuristics finished” event exposed to JS, or
- A JS API to set root focus directly on a specific cloned child (not just suggest), or
- Skin hooks that the plugin can trigger to focus the main list once the deck/list settle.

Workarounds (brittle)
- Re‑assert `select + suggestFocus` on a short timer until the list reports the target child is focused; stop after success. This is racey and can still flicker.
- Subscribe to `selectchild` and re‑assert once or twice after; helps, but wasn’t stable until we fixed the core focus handoff.

Practical alternatives with minimal surface area
- Keep the small core improvement we added (list aligns focus on explicit selection for the main list); this is targeted and safe.
- Or make a tiny skin tweak in `glwskins/flat/pages/list.view` to call the view’s `focus()` method on the main list (or disable `selectOnFocus` for the first frame). This avoids core changes but is still a code change.

Bottom line
- Without either a small core improvement (what we shipped) or a skin‑level hook, a pure plugin approach can’t guarantee the outcome deterministically across devices/skins.

## Update: selection alone now suffices

With the tiny core tweak that treats pending selects as explicit (interactive) selections in the cloner, the list now aligns focus to the selected item deterministically. That means the example plugin can simply call `prop.select(item.root)` (or `native/prop.select`) without any `suggestFocus` or addchild subscriptions.

Why this works now
- When selection arrives before children exist, the cloner marks that child as pending-selected and, upon creation, calls the list’s `gc_select_child` with the selected prop as origin.
- The list uses this origin to apply interactive focus for the main scrollable list and falls back to a queued suggest if immediate focus is blocked—no extra JS calls needed.

## Current status (Nov 1, 2025)

What works now
- Plugin can select an item (e.g., Item 3) and the list will focus it deterministically. No `suggestFocus` needed.
- If the selected item is initially off-screen, the list scrolls to reveal it.
- Main plugin (hdrezka): right-button context menu stays open; navigation in “Продолжить просмотр” works (no dead arrows).

Scope/guards we added to avoid regressions
- The main list (“scrollable”) only aligns focus to selection when it’s contextually safe: explicit selection and either focus is within the list or focus is not set yet. We always scroll, but we don’t steal focus from overlays/menus.
- Non-main lists only adjust focus if the current focus is inside that list.

Known limitations
- If a skin renames the main list id from “scrollable”, the special handling won’t trigger; selection will still scroll, but focus may not be promoted interactively. Adjust the id check or add a skin hook if that skin is targeted.
- Very exotic nested-list layouts may still require per-view tuning.

## Changelog (files touched and purpose)

- `src/ui/glw/glw_view_eval.c`
  - Treat pending-selected child as explicit selection by passing the selected prop as `origin` to `gc_select_child()`. Preserves intent and enables interactive focus.
- `src/ui/glw/glw_list.c`
  - Always call `scroll_to_me()` on selection so off-screen items are revealed.
  - Focus alignment rules:
    - Main list (“scrollable”): set focus for explicit selection only if focus is within the list or unset; otherwise don’t steal focus (menus stay open). Falls back to queued suggest if focus is busy.
    - Non-main lists: adjust focus only if current focus is within the list.
  - Minor: add a small per-list guard field, initialized in ctor, to help avoid repeated focus fights.
- `plugin_examples/elementselection/elementselection.js`
  - Simplified: use `native/prop.select(selectItem.root)` alone; removed `suggestFocus` and addchild subscription.

## Quick verify checklist

ElementSelection example
- Launch the plugin example. It should select Item 3 and the list should focus it. If Item 3 was off-screen, the list should scroll to reveal it.

Menu behavior (hdrezka)
- In the main list, press right to open the context menu. It should remain open (no auto-close flicker).
- Enter “Продолжить просмотр” and navigate with arrows; navigation should respond normally.

Optional debug for diagnostics
- Run with `-d --debug-glw`. Look for lines:
  - `PROP_SELECT_CHILD: ...` followed by `List 'list_y ...' select_child -> '...'`
  - For the main list: `interactive focus on child ...` only when appropriate; when a menu is open, you should not see the list steal focus back.

## Next steps for a new session

- Cross-skin validation: If you rely on a skin without id “scrollable”, either update the id check or add a small skin-level hook to call focus on the main list after open.
- Clean up traces: We can gate the added traces behind a compile-time flag or reduce verbosity.
- Expose a skin attribute toggle (optional): Allow a per-page flag to opt out of selection→focus for the main list during specific flows.
- Broader QA: Try other plugins with popups/overlays to confirm no focus steals occur.
