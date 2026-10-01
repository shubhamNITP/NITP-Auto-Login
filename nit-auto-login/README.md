# NIT Patna Intranet Auto Login

A tiny Chrome/Edge extension that saves your captive-portal username and
password **on your own device** (`chrome.storage.local`, never sent anywhere
else) and, whenever the login page at `192.168.10.17:8090` /
`194.168.10.17:8090` opens, fills the two fields and clicks **Sign in** for
you.

## Install (unpacked, ~30 seconds)

1. Unzip this folder somewhere permanent (don't delete it after — Chrome
   loads the extension straight from these files).
2. Open `chrome://extensions` in Chrome (or `edge://extensions` in Edge).
3. Turn on **Developer mode** (toggle, top-right).
4. Click **Load unpacked** and select this folder (`nit-auto-login`).
5. The extension icon appears in your toolbar.

## Set up your credentials

1. Click the extension icon in the toolbar.
2. Enter your intranet **Username** and **Password**.
3. Leave "Auto-click Sign in" checked if you want it to submit
   automatically, or uncheck it if you'd rather it just fill the fields and
   you click Sign in yourself.
4. Click **Save credentials**.

That's it. Next time the "Sign in to access this network" page loads (or
you open `http://192.168.10.17:8090`), the fields fill in and the form
submits on their own.

## Notes

- Credentials are stored only in your browser's local extension storage —
  they never leave your machine and aren't visible to the website.
- To change your saved credentials later, just click the icon and save
  again — it overwrites the old ones.
- To stop auto-login, either uncheck "Auto-click Sign in" in the popup, or
  disable/remove the extension from `chrome://extensions`.
- If your college changes the portal's IP address, add the new address to
  the `host_permissions` and `content_scripts.matches` arrays in
  `manifest.json` (same format as the existing entries), then reload the
  extension.
- Requires Chrome 111+ (for `"world": "MAIN"` content scripts). Any
  reasonably current Chrome/Edge already satisfies this.

## If the Sign in button still doesn't auto-click

After reloading the extension (`chrome://extensions` → the refresh icon on
this extension's card) and reopening the login page:

1. Open DevTools on the login page (`F12` → **Console** tab).
2. Look for lines starting with `[NIT Auto Login]` and
   `[NIT Auto Login - main world]`. They show exactly what happened step by
   step (fields filled, submit requested, whether `submitRequest()` was
   found and called, or whether it fell back to a simulated click).
3. If you see `"Could not find submitRequest() or the Sign in button"`,
   the site's script may not expose that function globally on your
   version of the portal — copy the console output and share it so the
   logic can be adjusted.
