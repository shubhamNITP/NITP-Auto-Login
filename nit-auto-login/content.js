// Runs in the ISOLATED world (default). This is the only place chrome.storage
// is available, so this script's job is: read saved credentials, fill the
// two input fields, then hand off to main-world.js (via postMessage) to
// actually trigger the page's own Sign in logic.
(function () {
  const LOG = (...args) => console.log('[NIT Auto Login]', ...args);

  chrome.storage.local.get(['nitUsername', 'nitPassword', 'autoSubmit'], (data) => {
    if (!data.nitUsername || !data.nitPassword) {
      LOG('No saved credentials yet — open the extension icon to set them.');
      return;
    }

    const autoSubmit = data.autoSubmit !== false; // default true
    let filled = false;

    function setNativeValue(el, value) {
      const proto = Object.getPrototypeOf(el);
      const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
      setter.call(el, value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function requestSubmit() {
      window.postMessage({ source: 'nit-auto-login', action: 'submit' }, window.location.origin);
      LOG('Asked page script to submit the form.');
    }

    function tryFill() {
      const userField = document.getElementById('username');
      const passField = document.getElementById('password');
      if (!userField || !passField) return false;

      setNativeValue(userField, data.nitUsername);
      setNativeValue(passField, data.nitPassword);
      LOG('Username/password fields filled.');

      if (autoSubmit) {
        // Give the page's own setup() (fires on window "load") time to run
        // first, then ask main-world.js to submit.
        if (document.readyState === 'complete') {
          setTimeout(requestSubmit, 400);
        } else {
          window.addEventListener('load', () => setTimeout(requestSubmit, 400), { once: true });
        }
      }
      return true;
    }

    if (tryFill()) {
      filled = true;
      return;
    }

    // Fields weren't in the DOM yet — watch for them.
    const observer = new MutationObserver(() => {
      if (filled) return;
      if (tryFill()) {
        filled = true;
        observer.disconnect();
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 10000);
  });
})();
