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

  function getThreadEnvSnapshot() {
    return {
      crossOriginIsolated: !!window.crossOriginIsolated,
      hasSharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
      hasWorker: typeof Worker !== 'undefined',
      protocol: window.location && window.location.protocol ? window.location.protocol : 'unknown'
    };
  }

  function showCrash(reason) {
    const env = getThreadEnvSnapshot();
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
      'Browser: ' + navigator.userAgent,
      'crossOriginIsolated: ' + env.crossOriginIsolated,
      'SharedArrayBuffer: ' + env.hasSharedArrayBuffer,
      'Worker: ' + env.hasWorker,
      'Protocol: ' + env.protocol
    ].join('\n');
  }

  function bindUiElements() {
    loader = document.getElementById('loader');
    crash = document.getElementById('crash');
    crashInfo = document.getElementById('crashinfo');
    versionTag = document.getElementById('vertag');
    canvas = document.getElementById('canvas');
  }

  function getThreadEnvironmentError() {
    const env = getThreadEnvSnapshot();
    if (!env.crossOriginIsolated)
      return 'Missing cross-origin isolation (COOP/COEP headers)';
    if (!env.hasSharedArrayBuffer)
      return 'SharedArrayBuffer is unavailable in this browser context';
    if (!env.hasWorker)
      return 'Web Workers are unavailable in this browser context';
    return null;
  }

  /**
   * Set up the window.movian.request() API once the WASM runtime is ready.
   *
   * window.movian.request(path, method, body) → Promise<{status, headers, body}>
   *
   * Dispatches an HTTP request directly to a registered Movian HTTP handler
   * (e.g. /api/prop, /api/done, /api/open, /api/screenshot) without a TCP
   * connection.  This lets the host page — or a Service Worker — proxy
   * requests to Movian's internal REST API.
   *
   * Parameters:
   *   path   – URL path, optionally including query string (e.g. "/api/open?url=...")
   *   method – "GET" | "POST"  (default: "GET")
   *   body   – Uint8Array or null  (request body for POST requests)
   *
   * Returns a Promise that resolves with:
   *   { status: <number>, headers: <object>, body: <string> }
   *
   * Note: the dispatch runs synchronously in the calling context.  For calls
   * that touch asyncio_courier-based state (e.g. /api/prop subscriptions) the
   * caller should ensure the WASM asyncio thread is idle or use asyncio_run_task
   * coordination (future work).
   *
   * Example — open a URL in Movian from the host page:
   *   window.movian.request('/api/open?url=' + encodeURIComponent(myUrl));
   *
   * Example — list registered paths:
   *   window.movian.listPaths().then(console.log);
   */
  function setupMovianHttpApi() {
    const module = window.Module;
    if (!module || typeof module._movian_http_dispatch !== 'function') {
      return;  // WASM build without HTTP dispatch support
    }

    const HTTP_CMD_GET  = 0;
    const HTTP_CMD_POST = 2;

    function wasmRequest(path, method, body) {
      return new Promise(function(resolve) {
        const methodInt = (method && method.toUpperCase() === 'POST')
          ? HTTP_CMD_POST : HTTP_CMD_GET;

        // Allocate path string in WASM heap
        const pathBytes  = new TextEncoder().encode(path + '\0');
        const pathPtr    = module._malloc(pathBytes.length);
        module.HEAPU8.set(pathBytes, pathPtr);

        // Allocate body in WASM heap (may be null)
        let bodyPtr  = 0;
        let bodyLen  = 0;
        if (body instanceof Uint8Array && body.length > 0) {
          bodyPtr = module._malloc(body.length);
          module.HEAPU8.set(body, bodyPtr);
          bodyLen = body.length;
        }

        let respPtr = 0;
        try {
          respPtr = module._movian_http_dispatch(pathPtr, methodInt, bodyPtr, bodyLen);
        } finally {
          module._free(pathPtr);
          if (bodyPtr) module._free(bodyPtr);
        }

        let rawResponse = '';
        if (respPtr) {
          rawResponse = module.UTF8ToString(respPtr);
          module._free(respPtr);
        }

        // Parse the raw HTTP response: split headers from body
        const sep = rawResponse.indexOf('\r\n\r\n');
        const headerSection = sep >= 0 ? rawResponse.slice(0, sep) : rawResponse;
        const bodySection   = sep >= 0 ? rawResponse.slice(sep + 4) : '';

        const lines   = headerSection.split('\r\n');
        const status  = lines[0] ? (parseInt(lines[0].split(' ')[1], 10) || 0) : 0;
        const headers = {};
        for (let i = 1; i < lines.length; i++) {
          const colon = lines[i].indexOf(':');
          if (colon > 0) {
            const k = lines[i].slice(0, colon).trim().toLowerCase();
            const v = lines[i].slice(colon + 1).trim();
            headers[k] = v;
          }
        }

        resolve({ status: status, headers: headers, body: bodySection });
      });
    }

    function wasmListPaths() {
      return new Promise(function(resolve) {
        const module = window.Module;
        if (!module || typeof module._movian_http_list_paths !== 'function') {
          resolve([]);
          return;
        }
        const ptr = module._movian_http_list_paths();
        let result = [];
        if (ptr) {
          try {
            result = JSON.parse(module.UTF8ToString(ptr));
          } catch(e) {}
          module._free(ptr);
        }
        resolve(result);
      });
    }

    window.movian = window.movian || {};
    window.movian.request   = wasmRequest;
    window.movian.listPaths = wasmListPaths;
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

    // Current WASM build is pthread-enabled and requires SAB + COOP/COEP.
    const threadEnvError = getThreadEnvironmentError();
    if (threadEnvError) {
      showCrash(threadEnvError + '. Use the provided COOP/COEP server helper.');
      return;
    }

    window.droppedfile = null;
    window.Module = {
      canvas: canvas,
      mainScriptUrlOrBlob: 'movian.js',
      locateFile: function(path) {
        return path;
      },
      onRuntimeInitialized: function() {
        runtimeReady = true;
        hideLoader();
        setupMovianHttpApi();
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

