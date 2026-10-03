// ============================================================
//  ui.js — Interaksi UI pada form kalkulator
//  Tombol +/- input angka, format Rupiah otomatis saat mengetik,
//  dan tampil/sembunyi field jumlah istri.
// ============================================================

/**
 * Tampilkan/sembunyikan field jumlah istri berdasarkan pilihan radio
 * Dipanggil saat halaman pertama load & saat user mengubah pilihan
 */
function toggleJmlIstriField() {
  const field = document.getElementById("jmlIstriField");
  const checked = document.querySelector('input[name="pasangan"]:checked')?.value;
  if (!field) return;
  field.style.display = checked === "istri" ? "block" : "none";
}

/**
 * Pasang event listener untuk tombol +/- pada input number
 * (Anak laki, anak perempuan, jumlah istri)
 */
function initNumberButtons() {
  document.querySelectorAll(".number-input-row").forEach((row) => {
    const input = row.querySelector(".num-input");
    const btnMin = row.querySelectorAll(".num-btn")[0];
    const btnPlus = row.querySelectorAll(".num-btn")[1];

    if (!input || !btnMin || !btnPlus) return;

    btnMin.addEventListener("click", () => {
      const min = Number(input.min ?? 0);
      const cur = Number(input.value);
      if (cur > min) input.value = cur - 1;
    });

    btnPlus.addEventListener("click", () => {
      const max = input.max ? Number(input.max) : Infinity;
      const cur = Number(input.value);
      if (cur < max) input.value = cur + 1;
    });
  });
}

/**
 * Format input harta otomatis saat user mengetik
 * Angka diformat dengan titik pemisah ribuan (1.500.000)
 */
function initRupiahInputs() {
  const ids = ["hartaKotor", "hutang", "wasiat", "pemakaman"];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", () => {
      // Hapus semua karakter non-digit
      const raw = el.value.replace(/\D/g, "");
      const num = Number(raw);
      // Format ulang dengan titik
      el.value = isNaN(num) || raw === "" ? "" : new Intl.NumberFormat("id-ID").format(num);
    });
  });
}

// ── Inisialisasi UI form (dipanggil dari main.js) ─────────
export function initializeUI() {
  initNumberButtons();
  initRupiahInputs();
  toggleJmlIstriField();

  // Perbarui tampilan field jumlah istri saat radio berubah
  document.querySelectorAll('input[name="pasangan"]').forEach((radio) => {
    radio.addEventListener("change", toggleJmlIstriField);
  });
}
