(() => {
  'use strict';

  const appversion = 'development';
  let loader = null;
  let crash = null;
  let crashInfo = null;
  let versionTag = null;
  let canvas = null;
  const encoder = new TextEncoder();

  let runtimeReady = false;

  function showLoader() {
    if (versionTag)
      versionTag.textContent = appversion;
    if (loader)
      loader.style.display = 'block';
  }

  function hideLoader() {
    if (loader)
      loader.style.display = 'none';
  }

  function showCrash(reason) {
    document.body.style.background = '#fff';
    hideLoader();
    if (canvas)
      canvas.style.display = 'none';
    if (crash)
      crash.style.display = 'block';
    if (crashInfo)
      crashInfo.textContent = [
      'Version: ' + appversion,
      'Event: ' + reason,
      'Running: ' + (runtimeReady ? 'yes' : 'no'),
      'Browser: ' + navigator.userAgent
    ].join('\n');
  }

  function bindUiElements() {
    loader = document.getElementById('loader');
    crash = document.getElementById('crash');
    crashInfo = document.getElementById('crashinfo');
    versionTag = document.getElementById('vertag');
    canvas = document.getElementById('canvas');
  }

  function openUrl(url) {
    const module = window.Module;
    const malloc = module && (module._malloc || window._malloc);
    const free = module && (module._free || window._free);
    const heap = (module && module.HEAPU8) || window.HEAPU8;

    if (!module || typeof module._wasm_openurl !== 'function' || !malloc || !free || !heap) {
      showCrash('WASM runtime is not ready for URL dispatch');
      return;
    }

    const bytes = encoder.encode(url + '\0');
    const ptr = malloc(bytes.length);
    if (!ptr) {
      showCrash('Out of memory while dispatching URL');
      return;
    }

    try {
      heap.set(bytes, ptr);
      module._wasm_openurl(ptr);
    } finally {
      free(ptr);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e) {
    e.preventDefault();

    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) {
      window.droppedfile = file;
      openUrl('dragndrop://' + file.name);
      return;
    }

    const item = e.dataTransfer && e.dataTransfer.items && e.dataTransfer.items[0];
    if (!item) {
      return;
    }

    item.getAsString(function(url) {
      if (url)
        openUrl(url);
    });
  }

  function startRuntime() {
    bindUiElements();

    if (!canvas) {
      showCrash('Canvas element not found in page');
      return;
    }

    window.droppedfile = null;
    window.Module = {
      canvas: canvas,
      locateFile: function(path) {
        return path;
      },
      onRuntimeInitialized: function() {
        runtimeReady = true;
        hideLoader();
      },
      onAbort: function(reason) {
        showCrash('Abort: ' + reason);
      },
      print: function() {
        console.log.apply(console, arguments);
      },
      printErr: function() {
        console.error.apply(console, arguments);
      }
    };

    document.addEventListener('dragover', handleDragOver, false);
    document.addEventListener('drop', handleDrop, false);

    const script = document.createElement('script');
    script.src = 'movian.js';
    script.async = true;
    script.onerror = function() {
      showCrash('Failed to load movian.js');
    };
    document.head.appendChild(script);

    showLoader();
    setTimeout(function() {
      if (!runtimeReady)
        showLoader();
    }, 1000);
  }

  window.addEventListener('error', function(e) {
    showCrash(e.message || 'Unhandled error');
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startRuntime, { once: true });
  } else {
    startRuntime();
  }
})();

