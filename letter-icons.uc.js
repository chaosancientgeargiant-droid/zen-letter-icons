(() => {
  // Emoji picker order (top rows, 7 per row) -> letters A-Z
  const MAP = {
    "😀": "A", "😃": "B", "😄": "C", "😁": "D", "😆": "E", "😅": "F", "🤣": "G",
    "😂": "H", "🙂": "I", "🙃": "J", "🫠": "K", "😉": "L", "😊": "M", "😇": "N",
    "🥰": "O", "😍": "P", "🤩": "Q", "😘": "R", "😗": "S", "☺️": "T", "😚": "U",
    "😙": "V", "🥲": "W", "😋": "X", "😛": "Y", "😜": "Z",
  };

  const strip = (s) => s.replace(/\uFE0F/g, "");
  const TABLE = Object.fromEntries(
    Object.entries(MAP).map(([k, v]) => [strip(k), v])
  );

  // "😀  A" -> "A  A" (only the leading emoji is replaced). null if no match.
  function convert(s) {
    if (!s) return null;
    const t = strip(s);
    for (const k of Object.keys(TABLE)) {
      if (t.startsWith(k)) return TABLE[k] + t.slice(k.length);
    }
    return null;
  }

  // ---- Space indicator (bottom bar / sidebar) ----
  const SELECTOR =
    ".zen-current-workspace-indicator-icon, .zen-workspace-icon";

  function swap(el) {
    const letter = TABLE[strip(el.textContent).trim()];
    if (letter && el.textContent !== letter) el.textContent = letter;
  }

  // ---- Right-click space list menu ----
  const MENU_ID = "zenWorkspaceMoreActions";
  const attached = new WeakSet();

  function fixMenu(popup) {
    popup
      .querySelectorAll("menuitem.zen-workspace-context-menu-item")
      .forEach((mi) => {
        for (const attr of ["label", "value"]) {
          const v = mi.getAttribute(attr);
          const n = convert(v);
          if (n && n !== v) mi.setAttribute(attr, n);
        }
        mi.querySelectorAll("label").forEach((l) => {
          const v = l.getAttribute("value");
          const nv = convert(v);
          if (nv && nv !== v) l.setAttribute("value", nv);
          const nt = convert(l.textContent);
          if (nt && nt !== l.textContent) l.textContent = nt;
        });
      });
  }

  function attachMenu() {
    const popup = document.getElementById(MENU_ID);
    if (!popup || attached.has(popup)) return;
    attached.add(popup);
    new MutationObserver(() => fixMenu(popup)).observe(popup, {
      childList: true,
      subtree: true,
    });
    popup.addEventListener("popupshowing", () => fixMenu(popup));
    fixMenu(popup);
  }

  function swapAll() {
    document.querySelectorAll(SELECTOR).forEach(swap);
    attachMenu();
  }

  swapAll();
  new MutationObserver(swapAll).observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
  });
})();
