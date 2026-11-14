(() => {
  // Emoji picker order (top rows, 7 per row) -> letters A-Z
  const MAP = {
    "😀": "A", "😃": "B", "😄": "C", "😁": "D", "😆": "E", "😅": "F", "🤣": "G",
    "😂": "H", "🙂": "I", "🙃": "J", "🫠": "K", "😉": "L", "😊": "M", "😇": "N",
    "🥰": "O", "😍": "P", "🤩": "Q", "😘": "R", "😗": "S", "☺️": "T", "😚": "U",
    "😙": "V", "🥲": "W", "😋": "X", "😛": "Y", "😜": "Z",
  };

  const strip = (s) => s.replace(/\uFE0F/g, "").trim();
  const TABLE = Object.fromEntries(
    Object.entries(MAP).map(([k, v]) => [strip(k), v])
  );

  const SELECTOR = ".zen-current-workspace-indicator-icon";

  function swap(el) {
    const letter = TABLE[strip(el.textContent)];
    if (letter && el.textContent !== letter) el.textContent = letter;
  }

  function swapAll() {
    document.querySelectorAll(SELECTOR).forEach(swap);
  }

  swapAll();
  new MutationObserver(swapAll).observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
  });
})();
