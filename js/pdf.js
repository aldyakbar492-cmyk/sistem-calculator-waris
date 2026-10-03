// ============================================================
//  PDF GENERATION — Laporan Waris (jsPDF direct-write)
//  Root cause fix: html2canvas gagal merender elemen off-screen
//  atau elemen dengan z-index negatif. Solusi: tulis langsung
//  ke jsPDF tanpa html2canvas — 100% reliabel di semua browser.

import { getLastHasilData } from "./calculator.js";
import { formatRupiah, formatFraksi } from "./helpers.js";

export function initializePdfDownload() {
  document.getElementById("btnDownloadPdf")?.addEventListener("click", generatePdfLaporan);
}

function generatePdfLaporan() {
  // ── VALIDASI: pastikan data tersedia ─────────────────────
  if (!getLastHasilData()) {
    alert("Silakan lakukan perhitungan terlebih dahulu sebelum mengunduh PDF.");
    return;
  }

  const { hasil, data } = getLastHasilData();
  const { bersih, pengurangan, hasil: ahliWaris, catatan, hijab, inputData } = hasil;

  // Validasi tambahan
  if (bersih === undefined || bersih === null) {
    alert("Data perhitungan tidak valid. Silakan hitung ulang terlebih dahulu.");
    return;
  }
  if (!ahliWaris || ahliWaris.length === 0) {
    alert("Tidak ada ahli waris yang terdaftar. Silakan periksa data dan hitung ulang.");
    return;
  }

  const btn = document.getElementById("btnDownloadPdf");
  if (btn) {
    btn.textContent = "⏳ Menyiapkan PDF...";
    btn.disabled = true;
  }

  // ── AMBIL jsPDF dari bundle html2pdf ─────────────────────
  // html2pdf.bundle menyertakan jsPDF. Terdapat beberapa cara
  // expose tergantung versi: window.jspdf.jsPDF atau window.jsPDF
  let jsPDF = null;
  if (window.jspdf && window.jspdf.jsPDF) {
    jsPDF = window.jspdf.jsPDF;
  } else if (window.jsPDF) {
    jsPDF = window.jsPDF;
  }
  if (!jsPDF) {
    alert("Library PDF belum siap. Coba muat ulang halaman lalu hitung ulang.");
    if (btn) {
      btn.innerHTML = "<span>⬇</span><span>Download Laporan Waris (PDF)</span>";
      btn.disabled = false;
    }
    return;
  }

  const now = new Date();
  const tglStr = now.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
  const jamStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  // ── INISIALISASI DOKUMEN PDF ──────────────────────────────
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const PW = 210; // A4 lebar mm
  const PH = 297; // A4 tinggi mm
  const ML = 15; // margin kiri
  const MR = 15; // margin kanan
  const CW = PW - ML - MR; // content width
  let y = 0; // cursor Y

  // ── HELPER: cek page break ────────────────────────────────
  function checkPage(needed) {
    if (y + needed > PH - 18) {
      doc.addPage();
      y = 15;
    }
  }

  // ── HELPER: wrapText & tulis multi-line ──────────────────
  function writeWrapped(text, x, startY, maxW, lineH, opts) {
    const lines = doc.splitTextToSize(text, maxW);
    lines.forEach((line, i) => {
      checkPage(lineH);
      if (opts && opts.align === "right") {
        doc.text(line, x + maxW, startY + i * lineH, { align: "right" });
      } else {
        doc.text(line, x, startY + i * lineH, opts || {});
      }
    });
    return lines.length * lineH;
  }

  // ── HELPER: rect dengan fill ─────────────────────────────
  function fillRect(x, ry, w, h, hexColor) {
    doc.setFillColor(...hexToRgb(hexColor));
    doc.rect(x, ry, w, h, "F");
  }

  // ── HELPER: hex to RGB array ──────────────────────────────
  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  }

  // ── HELPER: garis horizontal ──────────────────────────────
  function hLine(lx, ly, lw, hexColor, lw2) {
    doc.setDrawColor(...hexToRgb(hexColor || "#e2e8f0"));
    doc.setLineWidth(lw2 || 0.3);
    doc.line(lx, ly, lx + lw, ly);
  }

  // ── HELPER: Section Header ────────────────────────────────
  function sectionHeader(label, icon) {
    checkPage(16);
    fillRect(ML, y, CW, 8, "#0f172a");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(icon + "  " + label, ML + 4, y + 5.5);
    doc.setTextColor(15, 23, 42);
    y += 10;
  }

  // ════════════════════════════════════════════════════════
  // A. HEADER / COVER
  // ════════════════════════════════════════════════════════
  // Background navy cover
  fillRect(0, 0, PW, 52, "#0f172a");

  // Judul utama
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("LAPORAN PEMBAGIAN WARIS ISLAM", PW / 2, 18, { align: "center" });

  // Sub judul
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 200, 230);
  doc.text("Berdasarkan Kompilasi Hukum Islam (KHI) & Faraidh", PW / 2, 26, { align: "center" });

  // Tanggal & waktu
  doc.setFontSize(8.5);
  doc.setTextColor(245, 158, 11);
  doc.text("Tanggal Perhitungan: " + tglStr + "  |  Pukul: " + jamStr + " WIB", PW / 2, 33, { align: "center" });

  // Badge bawah cover
  doc.setFontSize(7.5);
  doc.setTextColor(200, 220, 255);
  doc.text("WarisModern — Platform Edukasi & Kalkulator Waris Indonesia", PW / 2, 40, { align: "center" });

  // Garis emas di bawah cover
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(1);
  doc.line(ML, 50, PW - MR, 50);

  y = 60;
  doc.setTextColor(15, 23, 42);

  // ════════════════════════════════════════════════════════
  // B. RINGKASAN HARTA
  // ════════════════════════════════════════════════════════
  sectionHeader("RINGKASAN HARTA PENINGGALAN", "B.");

  // Tabel ringkasan harta — kolom label + nilai
  const hartaRows = [{ label: "Harta Kotor", nilai: "Rp " + formatRupiah(pengurangan.harta), bold: false, bg: "#f8fafc", color: "#0f172a" }];
  if (pengurangan.hutang > 0) hartaRows.push({ label: "Dikurangi Hutang", nilai: "- Rp " + formatRupiah(pengurangan.hutang), bold: false, bg: "#fff9f0", color: "#b45309" });
  if (pengurangan.wasiat > 0) hartaRows.push({ label: "Dikurangi Wasiat", nilai: "- Rp " + formatRupiah(pengurangan.wasiat), bold: false, bg: "#fff9f0", color: "#b45309" });
  if (pengurangan.pemakaman > 0) hartaRows.push({ label: "Dikurangi Biaya Pemakaman", nilai: "- Rp " + formatRupiah(pengurangan.pemakaman), bold: false, bg: "#fff9f0", color: "#b45309" });
  hartaRows.push({ label: "HARTA BERSIH SIAP WARIS", nilai: "Rp " + formatRupiah(bersih), bold: true, bg: "#dbeafe", color: "#1e40af" });

  const colLabelW = CW * 0.62;
  const colValW = CW * 0.38;
  const rowH = 8;

  hartaRows.forEach((row) => {
    checkPage(rowH + 2);
    // bg row
    fillRect(ML, y, CW, rowH, row.bg);
    // border
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.rect(ML, y, CW, rowH, "S");
    // label
    doc.setFontSize(8.5);
    doc.setFont("helvetica", row.bold ? "bold" : "normal");
    doc.setTextColor(...hexToRgb(row.color || "#334155"));
    doc.text(row.label, ML + 3, y + 5.5);
    // nilai (right align)
    doc.setFont("helvetica", "bold");
    doc.text(row.nilai, ML + CW - 3, y + 5.5, { align: "right" });
    y += rowH;
  });

  y += 8;

  // ════════════════════════════════════════════════════════
  // C. DATA AHLI WARIS (ringkasan input)
  // ════════════════════════════════════════════════════════
  checkPage(20);
  sectionHeader("DATA AHLI WARIS", "C.");

  // Kumpulkan data ahli waris dari inputData
  const { anakL, anakP, adaAyah, adaIbu, adaKakekEfektif, adaNenekEfektif, saudaraLEfektif, saudaraPEfektif, pasangan, jmlIstri } = inputData || {};

  const inputRows = [];
  if (pasangan === "istri") inputRows.push({ ahli: "Istri", jumlah: jmlIstri || 1 });
  if (pasangan === "suami") inputRows.push({ ahli: "Suami", jumlah: 1 });
  if (adaAyah) inputRows.push({ ahli: "Ayah", jumlah: 1 });
  if (adaIbu) inputRows.push({ ahli: "Ibu", jumlah: 1 });
  if (adaKakekEfektif) inputRows.push({ ahli: "Kakek", jumlah: 1 });
  if (adaNenekEfektif) inputRows.push({ ahli: "Nenek", jumlah: 1 });
  if (anakL > 0) inputRows.push({ ahli: "Anak Laki-laki", jumlah: anakL });
  if (anakP > 0) inputRows.push({ ahli: "Anak Perempuan", jumlah: anakP });
  if (saudaraLEfektif > 0) inputRows.push({ ahli: "Saudara Laki-laki", jumlah: saudaraLEfektif });
  if (saudaraPEfektif > 0) inputRows.push({ ahli: "Saudara Perempuan", jumlah: saudaraPEfektif });

  if (inputRows.length === 0) {
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 116, 139);
    doc.text("(Data ahli waris diambil dari hasil perhitungan)", ML + 3, y + 5);
    y += 10;
  } else {
    // Header tabel
    const c1W = CW * 0.65,
      c2W = CW * 0.35;
    fillRect(ML, y, CW, 7.5, "#1e3a5f");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Ahli Waris", ML + 3, y + 5);
    doc.text("Jumlah", ML + c1W + c2W / 2, y + 5, { align: "center" });
    y += 7.5;

    inputRows.forEach((row, idx) => {
      checkPage(7.5);
      const bg = idx % 2 === 0 ? "#f8fafc" : "#ffffff";
      fillRect(ML, y, CW, 7, bg);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.rect(ML, y, CW, 7, "S");
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.text(row.ahli, ML + 3, y + 5);
      doc.setFont("helvetica", "bold");
      doc.text(String(row.jumlah) + " orang", ML + c1W + c2W / 2, y + 5, { align: "center" });
      y += 7;
    });
  }

  // Hijab (ahli waris terhalang)
  if (hijab && hijab.length > 0) {
    y += 4;
    checkPage(10);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 83, 9);
    doc.text("Ahli Waris Terhalang (Mahjub/Hijab):", ML, y);
    y += 5;
    hijab.forEach((h) => {
      checkPage(6);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(7.5);
      const txt = "  x  " + h.nama + ": " + h.alasan;
      const wrapped = doc.splitTextToSize(txt, CW);
      wrapped.forEach((line) => {
        checkPage(5);
        doc.text(line, ML, y);
        y += 4.5;
      });
    });
  }

  y += 8;

  // ════════════════════════════════════════════════════════
  // D. HASIL PEMBAGIAN — TABEL UTAMA
  // ════════════════════════════════════════════════════════
  checkPage(30);
  sectionHeader("HASIL PEMBAGIAN WARISAN", "D.");

  const hasPerOrang = ahliWaris.some((i) => i.jumlah > 1);

  // Lebar kolom
  let colW;
  if (hasPerOrang) {
    colW = [CW * 0.2, CW * 0.22, CW * 0.13, CW * 0.12, CW * 0.18, CW * 0.15];
  } else {
    colW = [CW * 0.23, CW * 0.26, CW * 0.16, CW * 0.13, CW * 0.22];
  }
  const colLabels = hasPerOrang ? ["Nama Ahli Waris", "Status / Jenis", "Fraksi", "Persen", "Nominal Diterima", "Per Orang"] : ["Nama Ahli Waris", "Status / Jenis", "Fraksi", "Persen", "Nominal Diterima"];

  // Header tabel
  fillRect(ML, y, CW, 9, "#0f172a");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  let cx = ML;
  colLabels.forEach((label, i) => {
    const align = i >= 2 ? "center" : "left";
    doc.text(label, cx + (align === "center" ? colW[i] / 2 : 3), y + 6, { align });
    cx += colW[i];
  });
  y += 9;

  // Baris data
  ahliWaris.forEach((item, idx) => {
    // Estimasi tinggi baris (nama bisa panjang)
    const namaLines = doc.splitTextToSize(item.nama, colW[0] - 4).length;
    const statusLines = doc.splitTextToSize(item.jenisBagian || "-", colW[1] - 4).length;
    const rowHeight = Math.max(namaLines, statusLines) * 5 + 4;

    checkPage(rowHeight + 2);

    const bg = idx % 2 === 0 ? "#f0f6ff" : "#ffffff";
    fillRect(ML, y, CW, rowHeight, bg);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.rect(ML, y, CW, rowHeight, "S");

    cx = ML;
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);

    // Nama
    doc.setFont("helvetica", "bold");
    const namaArr = doc.splitTextToSize(item.nama, colW[0] - 4);
    namaArr.forEach((ln, li) => doc.text(ln, cx + 3, y + 5.5 + li * 4.5));
    cx += colW[0];

    // Status / jenisBagian
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(7);
    const statusArr = doc.splitTextToSize(item.jenisBagian || "-", colW[1] - 4);
    statusArr.forEach((ln, li) => doc.text(ln, cx + 3, y + 5.5 + li * 4));
    cx += colW[1];

    // Fraksi
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(37, 99, 235);
    doc.text(formatFraksi(item.fraksi), cx + colW[2] / 2, y + 5.5, { align: "center" });
    cx += colW[2];

    // Persen
    doc.setTextColor(37, 99, 235);
    doc.setFontSize(7.5);
    doc.text((item.fraksi * 100).toFixed(2) + "%", cx + colW[3] / 2, y + 5.5, { align: "center" });
    cx += colW[3];

    // Nominal
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    const nomArr = doc.splitTextToSize("Rp " + formatRupiah(item.bagian), colW[4] - 4);
    nomArr.forEach((ln, li) => doc.text(ln, cx + colW[4] - 3, y + 5.5 + li * 4.5, { align: "right" }));
    cx += colW[4];

    // Per Orang (jika ada)
    if (hasPerOrang) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      if (item.jumlah > 1) {
        doc.text("Rp " + formatRupiah(item.bagianPerOrang), cx + colW[5] - 3, y + 4, { align: "right" });
        doc.setFontSize(7);
        doc.text("(" + item.jumlah + " orang)", cx + colW[5] - 3, y + 8, { align: "right" });
      } else {
        doc.text("-", cx + colW[5] / 2, y + 5.5, { align: "center" });
      }
    }

    y += rowHeight;
  });

  // Baris TOTAL
  checkPage(9);
  fillRect(ML, y, CW, 9, "#0f172a");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL DIBAGIKAN", ML + 3, y + 6);
  doc.text("100%", ML + colW[0] + colW[1] + colW[2] + colW[3] / 2, y + 6, { align: "center" });
  doc.setTextColor(245, 158, 11);
  const totalX = ML + colW[0] + colW[1] + colW[2] + colW[3] + colW[4] - 3;
  doc.text("Rp " + formatRupiah(bersih), totalX, y + 6, { align: "right" });
  y += 11;

  y += 6;

  // ════════════════════════════════════════════════════════
  // E. RINGKASAN AKHIR
  // ════════════════════════════════════════════════════════
  checkPage(30);
  sectionHeader("RINGKASAN AKHIR & KESIMPULAN", "E.");

  // Box ringkasan
  const totalDibagi = ahliWaris.reduce((sum, i) => sum + i.bagian, 0);
  const sisa = bersih - totalDibagi;

  const ringkasanItems = [
    { label: "Total Harta Siap Waris", nilai: "Rp " + formatRupiah(bersih) },
    { label: "Total Dibagikan ke " + ahliWaris.length + " Ahli Waris", nilai: "Rp " + formatRupiah(totalDibagi) },
    { label: "Sisa Pembagian", nilai: Math.abs(sisa) < 1 ? "Rp 0 (habis terbagi)" : "Rp " + formatRupiah(sisa) },
  ];

  ringkasanItems.forEach((r, idx) => {
    checkPage(8);
    const bg = idx === 0 ? "#dbeafe" : idx === 1 ? "#f0fdf4" : "#fef9c3";
    fillRect(ML, y, CW, 7.5, bg);
    doc.setDrawColor(200, 210, 230);
    doc.setLineWidth(0.2);
    doc.rect(ML, y, CW, 7.5, "S");
    doc.setFontSize(8.5);
    doc.setFont("helvetica", idx === 0 ? "bold" : "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(r.label, ML + 3, y + 5.3);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235);
    doc.text(r.nilai, ML + CW - 3, y + 5.3, { align: "right" });
    y += 7.5;
  });

  y += 6;

  // Kesimpulan narasi
  checkPage(20);
  fillRect(ML, y, CW, 5, "#e0f2fe");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 64, 175);
  doc.text("Kesimpulan Perhitungan:", ML + 3, y + 3.5);
  y += 7;

  const narasiTeks =
    "Berdasarkan perhitungan hukum waris Islam (Faraidh) sesuai Kompilasi Hukum Islam (KHI), " +
    "harta peninggalan senilai Rp " +
    formatRupiah(pengurangan.harta) +
    " setelah dikurangi kewajiban (hutang, wasiat, biaya pemakaman) menjadi harta bersih siap waris " +
    "sebesar Rp " +
    formatRupiah(bersih) +
    ", yang kemudian dibagikan kepada " +
    ahliWaris.length +
    " ahli waris berhak " +
    "sesuai ketentuan fara'idh dengan porsi yang telah ditetapkan syariat Islam.";

  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(8.5);
  const narasiLines = doc.splitTextToSize(narasiTeks, CW - 6);
  narasiLines.forEach((line) => {
    checkPage(5.5);
    doc.text(line, ML + 3, y);
    y += 5;
  });

  y += 5;

  // ── Catatan Hukum ────────────────────────────────────────
  if (catatan && catatan.length > 0) {
    checkPage(14);
    fillRect(ML, y, CW, 6, "#fef3c7");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 83, 9);
    doc.text("Catatan Hukum:", ML + 3, y + 4);
    y += 7;

    catatan.forEach((c) => {
      const stripped = c.replace(/^[⚠ℹ]\s*/u, "");
      const lines = doc.splitTextToSize("• " + stripped, CW - 6);
      lines.forEach((line) => {
        checkPage(5.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(51, 65, 85);
        doc.setFontSize(8);
        doc.text(line, ML + 3, y);
        y += 4.8;
      });
    });

    y += 4;
  }

  // ── Landasan Hukum ───────────────────────────────────────
  checkPage(30);
  fillRect(ML, y, CW, 6, "#dbeafe");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 64, 175);
  doc.text("Landasan Hukum & Dalil:", ML + 3, y + 4);
  y += 7;

  const dalil = [
    "QS An-Nisa: 11  —  Porsi anak laki-laki & perempuan, serta ayah/ibu jika ada anak kandung.",
    "QS An-Nisa: 12  —  Bagian suami/istri tergantung ada tidaknya anak kandung pewaris.",
    "QS An-Nisa: 176  —  Bagian saudara kandung laki-laki dan perempuan (kalalah).",
    "KHI Pasal 171-182  —  Dasar hukum positif warisan Islam di Indonesia.",
  ];
  dalil.forEach((d) => {
    const lines = doc.splitTextToSize("• " + d, CW - 6);
    lines.forEach((line) => {
      checkPage(5.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(8);
      doc.text(line, ML + 3, y);
      y += 4.8;
    });
  });

  y += 6;

  // ── Disclaimer & Footer ──────────────────────────────────
  checkPage(22);
  fillRect(ML, y, CW, 18, "#f1f5f9");
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.rect(ML, y, CW, 18, "S");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(51, 65, 85);
  doc.text("Disclaimer:", ML + 3, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  const disclaimerTxt = "Dokumen ini bersifat edukatif dan tidak merupakan nasihat hukum resmi. " + "Untuk kepastian hukum, konsultasikan dengan notaris, pengacara, atau hakim Pengadilan Agama.";
  const dLines = doc.splitTextToSize(disclaimerTxt, CW - 6);
  dLines.forEach((line, i) => {
    doc.text(line, ML + 3, y + 9 + i * 4);
  });
  y += 22;

  // Nomor halaman di setiap halaman
  const pageCount = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    // Footer stripe
    fillRect(0, PH - 10, PW, 10, "#0f172a");
    doc.setTextColor(180, 200, 230);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("WarisModern | " + tglStr, ML, PH - 4);
    doc.text("Hal " + p + " / " + pageCount, PW - MR, PH - 4, { align: "right" });
  }

  // ── SIMPAN FILE PDF ──────────────────────────────────────
  // FIX: Instagram in-app browser & WebView memblokir doc.save() (blob download).
  // Solusi: coba doc.save() dulu, kalau gagal fallback buka PDF di tab baru via data URL.
  const fileName = "laporan-waris-" + now.toISOString().slice(0, 10) + ".pdf";

  try {
    // Deteksi apakah browser adalah in-app WebView (Instagram, Facebook, TikTok, dll)
    const ua = navigator.userAgent || "";
    const isInAppBrowser = /Instagram|FBAN|FBAV|FB_IAB|Twitter|Line\/|KAKAOTALK|Snapchat|Pinterest|TikTok/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);

    if (isInAppBrowser || isIOS) {
      // Fallback: buka PDF sebagai data URL di tab/jendela baru
      // Ini bekerja di IG browser karena tidak bergantung pada blob download
      const pdfDataUri = doc.output("datauristring");
      const newWin = window.open("", "_blank");
      if (newWin) {
        newWin.document.write(
          `<!DOCTYPE html>
                <html><head><meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Laporan Waris</title>
                <style>
                  body { margin:0; background:#1e293b; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; font-family:sans-serif; padding:16px; box-sizing:border-box; }
                  h2 { color:#f8fafc; font-size:1rem; margin-bottom:12px; text-align:center; }
                  p { color:#94a3b8; font-size:0.85rem; text-align:center; margin-bottom:20px; }
                  a.btn { display:inline-block; background:#2563eb; color:#fff; padding:12px 28px; border-radius:8px; text-decoration:none; font-weight:600; font-size:0.95rem; margin-bottom:12px; }
                  iframe { width:100%; max-width:800px; height:80vh; border:none; border-radius:8px; }
                </style>
                </head><body>
                <h2>📄 Laporan Waris Siap</h2>
                <p>Browser Instagram tidak mendukung download otomatis.<br>Tekan tombol di bawah untuk membuka / menyimpan PDF.</p>
                <a class="btn" href="${pdfDataUri}" download="${fileName}">⬇ Simpan PDF</a>
                <br>
                <iframe src="${pdfDataUri}"></iframe>
                </body></html>`,
        );
        newWin.document.close();
      } else {
        // Jika pop-up diblokir, langsung navigasi
        window.location.href = pdfDataUri;
      }
    } else {
      // Browser normal: gunakan doc.save() standar
      doc.save(fileName);
    }
  } catch (err) {
    // Ultimate fallback: coba buka sebagai blob URL
    try {
      const pdfBlob = doc.output("blob");
      const blobUrl = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      }, 1000);
    } catch (e) {
      alert("Gagal mengunduh PDF. Coba buka halaman ini di browser Chrome atau Safari.");
    }
  }

  if (btn) {
    btn.innerHTML = "<span>⬇</span><span>Download Laporan Waris (PDF)</span>";
    btn.disabled = false;
  }
}
