# Plugin Item Selection Support

This document outlines the changes made to add support for plugins to control initial item selection in Movian directory pages.

## Problem

By default, Movian always selects the first item in a plugin-generated directory page. There was no way for plugins to specify which item should be initially focused/selected.

## Solution

Modified the GLW list widget to check for a "selected" property on the page's nodes container and set the initial focus accordingly.

## Code Changes

### 1. Modified `src/ui/glw/glw_list.c`

Added code in `glw_list_layout_y()` to check for initial selection:

```c
// Set initial focused to selected item if no focused set
if(w->glw_focused == NULL && w->glw_originating_prop != NULL) {
  prop_t *selected = prop_get_by_name(w->glw_originating_prop, "selected", NULL);
  if(selected != NULL) {
    glw_t *c;
    TAILQ_FOREACH(c, &w->glw_childs, glw_parent_link) {
      if(c->glw_originating_prop == selected) {
        w->glw_focused = c;
        l->gsc.scroll_to_me = c;
        break;
      }
    }
  }
}
```

This code:
- Runs during list layout when no item is focused yet
- Checks if the list's originating prop (the `page.model.nodes` prop) has a "selected" child
- If found, finds the corresponding child widget and sets it as focused
- Also sets it as the scroll target

### 2. Created ElementSelection Plugin

**Location:** `plugin_examples/elementselection/`

**plugin.json:**
```json
{
  "type": "ecmascript",
  "apiversion": 1,
  "id": "ElementSelection",
  "file": "elementselection.js",
  "showtimeVersion": "5",
  "version": "1.0",
  "author": "Test",
  "title": "Element Selection Demo",
  "synopsis": "Demonstrates selecting the 3rd element in a list",
  "category": "test"
}
```

**elementselection.js:**
```javascript
(function(plugin) {
  var U = "elementselection:";

  plugin.createService("Element Selection Demo", U, "other", true);

  plugin.addURI(U, function(page) {
    page.type = "directory";
    page.metadata.title = "Element Selection Demo";

    page.appendItem("bogus://item1", "video", { title: "Item 1" });
    page.appendItem("bogus://item2", "video", { title: "Item 2" });
    page.appendItem("bogus://item3", "video", { title: "Item 3 (Selected)" });
    page.appendItem("bogus://item4", "video", { title: "Item 4" });

    // Select the 3rd item (index 2)
    if (page.items.length > 2) {
      page.model.nodes.selected = page.items[2].root;
    }

    page.loading = false;
  });
})(this);
```

The plugin demonstrates setting `page.model.nodes.selected` to the root prop of the desired item.

### 3. API Version Notes

- Used `"apiversion": 1` for legacy plugin API that provides `plugin.createService` and `plugin.addURI`
- API version 2 requires using module system directly (`require('movian/service')`)

## Usage in Plugins

To select an item in a plugin page:

```javascript
// After appending all items, before page.loading = false
page.model.nodes.selected = page.items[index].root;
```

Where `index` is the 0-based position of the item to select.

## Current Status

- Code compiles successfully
- Plugin loads and displays items
- Selection property is set on the prop tree
- UI code checks for selection but may not be working correctly
- Item 3 is not being selected as expected

## Testing

Use the "Debug Movian with ElementSelection" launch configuration to test.

## Files Modified

- `src/ui/glw/glw_list.c` - Added selection checking logic
- `plugin_examples/elementselection/plugin.json` - Plugin metadata
- `plugin_examples/elementselection/elementselection.js` - Plugin code

## Related Files

- `.vscode/launch.json` - Added preLaunchTask for build
- `.vscode/tasks.json` - Build task definition
- `DEBUGGING.md` - General debugging guide</content>
<parameter name="filePath">/home/roman/Code/movian/PLUGIN_SELECTION_SUPPORT.md