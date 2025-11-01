(function(plugin) {

  var U = "elementselection:";

  // Register a service (will appear on home page)
  plugin.createService("Element Selection Demo", U, "other", true);

  // Add a responder to the registered URI
  plugin.addURI(U, function(page) {
    page.type = "directory";
    page.metadata.title = "Element Selection Demo";
    
    var nprop = require("native/prop");      // thin native bridge (direct)
    var selectItem;

    // Append 4 bogus items
    page.appendItem("bogus://item1", "video", {
      title: "Item 1"
    });

    page.appendItem("bogus://item2", "video", {
      title: "Item 2"
    });

    page.appendItem("bogus://item1", "video", {
      title: "Item 1"
    });

    page.appendItem("bogus://item2", "video", {
      title: "Item 2"
    });

    page.appendItem("bogus://item1", "video", {
      title: "Item 1"
    });

    page.appendItem("bogus://item2", "video", {
      title: "Item 2"
    });
    page.appendItem("bogus://item1", "video", {
      title: "Item 1"
    });

    page.appendItem("bogus://item2", "video", {
      title: "Item 2"
    });
    page.appendItem("bogus://item1", "video", {
      title: "Item 1"
    });

    page.appendItem("bogus://item2", "video", {
      title: "Item 2"
    });
    page.appendItem("bogus://item1", "video", {
      title: "Item 1"
    });

    page.appendItem("bogus://item2", "video", {
      title: "Item 2"
    });
    page.appendItem("bogus://item1", "video", {
      title: "Item 1"
    });

    page.appendItem("bogus://item2", "video", {
      title: "Item 2"
    });
    page.appendItem("bogus://item1", "video", {
      title: "Item 1"
    });

    page.appendItem("bogus://item2", "video", {
      title: "Item 2"
    });
    page.appendItem("bogus://item1", "video", {
      title: "Item 1"
    });

    page.appendItem("bogus://item2", "video", {
      title: "Item 2"
    });
    page.appendItem("bogus://item1", "video", {
      title: "Item 1"
    });

    page.appendItem("bogus://item2", "video", {
      title: "Item 2"
    });
    page.appendItem("bogus://item1", "video", {
      title: "Item 1"
    });

    page.appendItem("bogus://item2", "video", {
      title: "Item 2"
    });
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

    // Drive selection for Item 3. With the core change, lists align focus
    // to explicit selection (including pending selects), so no suggest is required.
    try {
      console.log("Selecting Item 3");
      nprop.select(selectItem.root);
    } catch(e) {
      console.log("native select error:", e);
    }

    page.loading = false;

  });
})(this);