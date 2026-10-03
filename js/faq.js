// ============================================================
//  faq.js — Inisialisasi accordion FAQ
//  File ini WAJIB ada karena dipanggil dari main.js
// ============================================================

export function initializeFAQ() {
  const faqCards = document.querySelectorAll(".faq-card");

  if (faqCards.length === 0) return; // Tidak ada elemen FAQ, keluar

  faqCards.forEach((card) => {
    const question = card.querySelector(".faq-q");
    const answer = card.querySelector(".faq-a");

    if (!question || !answer) return;

    // Set initial state — semua tertutup
    answer.style.maxHeight = "0";
    answer.style.overflow = "hidden";
    answer.style.transition = "max-height 0.35s ease, opacity 0.35s ease";
    answer.style.opacity = "0";

    question.style.cursor = "pointer";

    // Tambahkan ikon toggle
    if (!question.querySelector(".faq-toggle-icon")) {
      const icon = document.createElement("span");
      icon.className = "faq-toggle-icon";
      icon.textContent = "+";
      icon.style.cssText = "margin-left:auto; font-size:1.4rem; font-weight:300; transition:transform 0.3s ease; flex-shrink:0;";
      question.style.display = "flex";
      question.style.alignItems = "center";
      question.style.gap = "8px";
      question.appendChild(icon);
    }

    question.addEventListener("click", () => {
      const isOpen = card.classList.contains("faq-open");

      // Tutup semua yang lain
      faqCards.forEach((c) => {
        if (c !== card) {
          c.classList.remove("faq-open");
          const a = c.querySelector(".faq-a");
          const i = c.querySelector(".faq-toggle-icon");
          if (a) {
            a.style.maxHeight = "0";
            a.style.opacity = "0";
          }
          if (i) i.style.transform = "rotate(0deg)";
        }
      });

      // Toggle yang diklik
      if (isOpen) {
        card.classList.remove("faq-open");
        answer.style.maxHeight = "0";
        answer.style.opacity = "0";
        const icon = question.querySelector(".faq-toggle-icon");
        if (icon) icon.style.transform = "rotate(0deg)";
      } else {
        card.classList.add("faq-open");
        answer.style.maxHeight = answer.scrollHeight + "px";
        answer.style.opacity = "1";
        const icon = question.querySelector(".faq-toggle-icon");
        if (icon) icon.style.transform = "rotate(45deg)";
      }
    });
  });
}
