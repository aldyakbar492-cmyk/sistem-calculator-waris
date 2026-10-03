// ============================================================
//  DARK MODE — Toggle & localStorage persistence
// ============================================================
export function initializeTheme() {
  const savedTheme = localStorage.getItem("waris-theme") || "light";
  applyTheme(savedTheme);

  const btns = [document.getElementById("darkModeBtn"), document.getElementById("darkModeBtnMobile"), document.getElementById("darkModeBtnHamburger")];
  btns.forEach((btn) => {
    if (!btn) return;
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem("waris-theme", next);
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const isDark = theme === "dark";
  const icon = isDark ? "☀️" : "🌙";
  const label = isDark ? "☀️ Mode Terang" : "🌙 Mode Gelap";
  const btn = document.getElementById("darkModeBtn");
  const btnMobile = document.getElementById("darkModeBtnMobile");
  const btnHamburger = document.getElementById("darkModeBtnHamburger");
  if (btn) btn.textContent = icon;
  if (btnMobile) btnMobile.textContent = label;
  if (btnHamburger) btnHamburger.textContent = icon;
}
