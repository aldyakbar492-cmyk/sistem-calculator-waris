// ============================================================
//  helpers.js — Utilitas format & parsing angka
//  FIX: parseNumber sekarang aman untuk input Number maupun string kosong
// ============================================================

/**
 * Format angka ke format Rupiah (tanpa simbol Rp)
 * Contoh: 1500000 → "1.500.000"
 */
export function formatRupiah(value) {
  const num = Number(value);
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat("id-ID").format(num);
}

/**
 * Ambil angka dari input string (hapus titik pemisah ribuan & koma desimal)
 * FIX: Konversi ke String terlebih dahulu agar .replace() tidak crash
 * jika value berupa Number (misal: 0) atau null/undefined
 * Contoh: "600.000.000" → 600000000
 */
export function parseNumber(value) {
  if (value === null || value === undefined || value === "") return 0;
  const cleaned = String(value).replace(/\./g, "").replace(/,/g, "").trim();
  const result = Number(cleaned);
  return isNaN(result) ? 0 : result;
}

/**
 * Format pecahan menjadi teks yang mudah dibaca
 * Contoh: 0.125 → "1/8", 0.1667 → "1/6"
 */
export function formatFraksi(nilai) {
  const toleransi = 0.0001;
  const fraksi = [
    { nilai: 1 / 2, label: "½ (1/2)" },
    { nilai: 1 / 4, label: "¼ (1/4)" },
    { nilai: 1 / 8, label: "⅛ (1/8)" },
    { nilai: 1 / 3, label: "⅓ (1/3)" },
    { nilai: 2 / 3, label: "⅔ (2/3)" },
    { nilai: 1 / 6, label: "⅙ (1/6)" },
  ];
  for (const f of fraksi) {
    if (Math.abs(nilai - f.nilai) < toleransi) return f.label;
  }
  return `${(nilai * 100).toFixed(2)}%`;
}
