// ============================================================
//  navbar.js — Navbar, mobile menu & navigasi antar halaman (tab)
//  File ini WAJIB ada karena dipanggil dari main.js
// ============================================================

export function initializeNavbar() {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const navbar = document.getElementById("navbar");

  // ── Toggle mobile menu ──────────────────────────────────
  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", String(isOpen));
      hamburger.classList.toggle("open", isOpen);
    });

    // Tutup menu saat klik link di dalam mobile menu
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ── Navbar shrink saat scroll ───────────────────────────
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 60);
    });
  }

  // ── Navigasi tab: tiap menu navbar = satu halaman ───────
  initializePageNavigation();
}

// ── Halaman (tab) ─────────────────────────────────────────
// Id halaman sama dengan hash di href (#beranda, #edukasi, ...).
const PAGES = ["beranda", "kalkulator", "edukasi", "faq"];
const PAGE_ALIAS = { mengapa: "beranda" }; // hash lama yang diarahkan ke halaman

function pageFromHash(hash) {
  const name = PAGE_ALIAS[hash] || hash;
  return PAGES.includes(name) ? name : null;
}

function showPage(name) {
  document.querySelectorAll(".page-view").forEach((view) => {
    view.classList.toggle("active", view.dataset.page === name);
  });
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${name}`);
  });
  window.scrollTo({ top: 0, behavior: "instant" });
}

function initializePageNavigation() {
  // Semua link internal (navbar, tombol hero, CTA, footer) berpindah halaman
  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const name = pageFromHash(link.getAttribute("href").slice(1));
    if (!name) return;
    event.preventDefault();
    if (pageFromHash(location.hash.slice(1)) === name) showPage(name);
    else location.hash = name; // memicu "hashchange" -> showPage
  });

  // Tombol back/forward browser
  window.addEventListener("hashchange", () => {
    showPage(pageFromHash(location.hash.slice(1)) || "beranda");
  });

  showPage(pageFromHash(location.hash.slice(1)) || "beranda");
}
