(function(plugin) {

  var U = "elementselection:";

  // Register a service (will appear on home page)
  plugin.createService("Element Selection Demo", U, "other", true);

  // Add a responder to the registered URI
  plugin.addURI(U, function(page) {
    page.type = "directory";
    page.metadata.title = "Element Selection Demo";
    
    var prop  = require("movian/prop");      // high-level wrapper (proxies/helpers)
    var nprop = require("native/prop");      // thin native bridge (direct)

    // We’ll also subscribe to nodes so we can suggest focus once
    // the cloner starts adding children (extra safety; auto-destroyed)
  var selectItem;
  var didSuggest = false;
  var didReselect = false;
    prop.subscribe(page.model.nodes, function(op) {
      if(!didSuggest && (op === 'addchild' || op === 'addchilds')) {
        if(selectItem) {
          try {
            console.log("Suggest after add:", op);
            nprop.suggestFocus(selectItem.root);
            didSuggest = true;
          } catch(e) {
            console.log("suggestFocus error:", e);
          }
        }
      }
    }, {autoDestroy: true, noInitialUpdate: true});

    // Reassert focus right after selection routes through deck (when
    // 'selectchild' for nodes fires), this occurs after OpenCloseFound
    // and ensures focus ends up on our chosen list item
    prop.subscribe(page.model.nodes, function(op) {
      if(op === 'selectchild' && selectItem && !didReselect) {
        try {
          // Re-assert both selection and focus once after deck switches
          console.log("Reselect + suggest after selectchild");
          nprop.select(selectItem.root);
          nprop.suggestFocus(selectItem.root);
          didReselect = true;
        } catch(e) {
          console.log("suggestFocus error (after selectchild):", e);
        }
      }
    }, {autoDestroy: true});

    // Append 4 bogus items
    page.appendItem("bogus://item1", "video", {
      title: "Item 1"
    });

    page.appendItem("bogus://item2", "video", {
      title: "Item 2"
    });

    selectItem = page.appendItem("bogus://item3", "video", {
      title: "Item 3 (Selected)"
    });


    page.appendItem("bogus://item4", "video", {
      title: "Item 4 x"
    });

    // Drive selection and focus for Item 3
    // Use native bridge to avoid any proxy interference
    try {
      console.log("Selecting Item 3 via native select");
      nprop.select(selectItem.root);
      console.log("Calling suggestFocus (native)");
      nprop.suggestFocus(selectItem.root);
    } catch(e) {
      console.log("native select/suggestFocus error:", e);
    }

    page.loading = false;

  });
})(this);