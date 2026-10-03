// ============================================================
//  main.js — Entry point tunggal aplikasi WarisModern
//  Hanya merangkai module; seluruh logika ada di file js/ masing-masing.
//  (Dimuat dari index.html lewat <script type="module">)
// ============================================================

import { initializeNavbar } from "./navbar.js";
import { initializeFAQ } from "./faq.js";
import { initializeEducation } from "./education.js";
import { initializeUI } from "./ui.js";
import { initializeCalculator } from "./calculator.js";
import { initializeTheme } from "./theme.js";
import { initializePdfDownload } from "./pdf.js";

// ── Jalankan semua inisialisasi saat DOM siap ─────────────
// (urutan sama dengan urutan pendaftaran listener di script.js asli)
function initializeApp() {
  initializeEducation();
  initializeNavbar();
  initializeFAQ();
  initializeUI();
  initializeCalculator();
  initializeTheme();
  initializePdfDownload();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}
