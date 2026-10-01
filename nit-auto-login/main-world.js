// Runs in the page's own MAIN world (Chrome 111+). Unlike content.js, this
// script has genuine access to window.submitRequest and friends, because
// it executes in the same JS context as httpclient.js / cyberoamAjax.js.
(function () {
  const LOG = (...args) => console.log('[NIT Auto Login - main world]', ...args);

  function isAlreadyLoggedIn() {
    const view = document.getElementById('loggedin-view');
    return !!(view && getComputedStyle(view).display !== 'none');
  }

  function attemptSubmit(retriesLeft) {
    if (isAlreadyLoggedIn()) {
      LOG('Already showing the logged-in view — nothing to do.');
      return;
    }

    if (typeof window.submitRequest === 'function') {
      try {
        window.submitRequest();
        LOG('Called submitRequest() directly.');
        return;
      } catch (e) {
        LOG('submitRequest() threw an error, will try a click instead:', e);
      }
    } else {
      LOG('submitRequest() not defined yet.');
    }

    // Fallback: dispatch a real click sequence on the Sign in element.
    const btn = document.getElementById('loginbutton');
    const target = (btn && btn.closest('a')) || btn;
    if (target) {
      ['mousedown', 'mouseup', 'click'].forEach((type) => {
        target.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window }));
      });
      LOG('Dispatched a click on the Sign in button as a fallback.');
      return;
    }

    if (retriesLeft > 0) {
      LOG(`Sign in button/function not ready, retrying (${retriesLeft} left)...`);
      setTimeout(() => attemptSubmit(retriesLeft - 1), 500);
    } else {
      LOG('Gave up: could not find submitRequest() or the Sign in button.');
    }
  }

  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    if (!event.data || event.data.source !== 'nit-auto-login') return;
    if (event.data.action === 'submit') {
      attemptSubmit(6);
    }
  });
})();
