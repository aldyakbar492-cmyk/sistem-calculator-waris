// ============================================================
//  calculator.js — Logika Perhitungan Waris (KHI / Faraidh)
//  FIX: Porsi sisa (asabah) dihitung dinamis dari porsi pasangan + ortu
//  FIX: Ayah & Ibu diperhitungkan dengan porsi 1/6 yang benar
//  FIX: Kasus hanya anak perempuan (tanpa anak laki) ditangani
//  FIX: Aul & Radd diterapkan otomatis
// ============================================================
//
//  Isi module (berurutan):
//   1. hitungWarisan()                         — perhitungan inti (rumus TIDAK diubah)
//   2. getInputs() / showResult()              — baca form & tampilkan pesan
//   3. renderHasil() / renderPenjelasanHasil() — render hasil ke DOM
//   4. initializeCalculator()                  — pasang event tombol "Hitung"
//
//  FIX (dari ui.js asli): semua getElementById memakai optional chaining (?.)
//       agar tidak crash jika elemen belum ada / ID salah; input angka default "0".
// ============================================================

import { formatRupiah, parseNumber, formatFraksi } from "./helpers.js";

// Data hasil perhitungan terakhir — dipakai pdf.js untuk membuat laporan.
// (Menggantikan window._lastHasilData agar tidak memakai variabel global.)
let lastHasilData = null;

export function getLastHasilData() {
  return lastHasilData;
}

/**
 * Fungsi utama: hitung warisan berdasarkan data form
 * @param {Object} data - data dari getInputs()
 * @returns {{ bersih, pengurangan, hasil, catatan }}
 */
export function hitungWarisan(data) {
  // ── 1. Parse semua angka ──────────────────────────────────
  const harta = parseNumber(data.hartaKotor);
  const hutang = parseNumber(data.hutang);
  const wasiat = parseNumber(data.wasiat);
  const pemakaman = parseNumber(data.pemakaman);

  // ── 2. Hitung harta bersih siap waris ────────────────────
  const totalPengurangan = hutang + wasiat + pemakaman;
  let bersih = harta - totalPengurangan;
  if (bersih < 0) bersih = 0;

  const pengurangan = { harta, hutang, wasiat, pemakaman, totalPengurangan };

  // ── 3. Baca data ahli waris ───────────────────────────────
  const pasangan = data.pasangan;
  const jmlIstri = Math.max(1, Math.min(4, Number(data.jmlIstri) || 1));
  const anakL = Math.max(0, Number(data.anakLaki) || 0);
  const anakP = Math.max(0, Number(data.anakPerempuan) || 0);
  const adaAyah = Boolean(data.ayah);
  const adaIbu = Boolean(data.ibu);
  const adaKakek = Boolean(data.kakek);
  const adaNenek = Boolean(data.nenek);
  const saudaraL = Math.max(0, Number(data.saudaraLaki) || 0);
  const saudaraP = Math.max(0, Number(data.saudaraPerempuan) || 0);

  const adaAnak = anakL + anakP > 0;
  const adaAyahEfektif = adaAyah; // Ayah efektif menghijab saudara dan kakek
  const adaAnakLakiEfektif = anakL > 0; // Anak laki menghijab saudara

  // ── 4. Sistem Hijab ───────────────────────────────────────
  let hijab = []; // daftar ahli waris yang terhalang

  // Kakek dihijab oleh Ayah
  const kakekTerhijab = adaKakek && adaAyah;
  if (kakekTerhijab) {
    hijab.push({ nama: "Kakek", ikon: "👴", alasan: "Kakek tidak mendapatkan warisan karena terhalang (mahjoob) oleh keberadaan Ayah kandung pewaris." });
  }
  const adaKakekEfektif = adaKakek && !kakekTerhijab;

  // Nenek dihijab oleh Ibu atau Ayah
  const nenekTerhijabIbu = adaNenek && adaIbu;
  const nenekTerhijabAyah = adaNenek && adaAyah;
  const nenekTerhijab = nenekTerhijabIbu || nenekTerhijabAyah;
  if (nenekTerhijab && adaNenek) {
    const penghalang = adaIbu ? "Ibu kandung" : "Ayah kandung";
    hijab.push({ nama: "Nenek", ikon: "👵", alasan: `Nenek tidak mendapatkan warisan karena terhalang oleh keberadaan ${penghalang} pewaris.` });
  }
  const adaNenekEfektif = adaNenek && !nenekTerhijab;

  // Saudara dihijab oleh: Ayah, Anak Laki-laki, atau Kakek efektif
  const saudaraTerhijab = (saudaraL > 0 || saudaraP > 0) && (adaAyah || anakL > 0 || adaKakekEfektif);
  if (saudaraTerhijab && (saudaraL > 0 || saudaraP > 0)) {
    let penghalangSaudara = [];
    if (adaAyah) penghalangSaudara.push("Ayah kandung");
    if (anakL > 0) penghalangSaudara.push("Anak Laki-laki");
    if (adaKakekEfektif) penghalangSaudara.push("Kakek");
    if (saudaraL > 0) hijab.push({ nama: `Saudara Laki-laki (${saudaraL} orang)`, ikon: "👦", alasan: `Saudara laki-laki kandung tidak mendapatkan warisan karena terhalang oleh: ${penghalangSaudara.join(", ")}.` });
    if (saudaraP > 0) hijab.push({ nama: `Saudara Perempuan (${saudaraP} orang)`, ikon: "👧", alasan: `Saudara perempuan kandung tidak mendapatkan warisan karena terhalang oleh: ${penghalangSaudara.join(", ")}.` });
  }
  const saudaraLEfektif = saudaraTerhijab ? 0 : saudaraL;
  const saudaraPEfektif = saudaraTerhijab ? 0 : saudaraP;
  const adaSaudara = saudaraLEfektif + saudaraPEfektif > 0;

  // ── 5. Hitung porsi setiap ahli waris ────────────────────
  let porsi = {};
  let catatan = [];

  // — Pasangan —
  if (pasangan === "istri") {
    const bagianIstri = adaAnak ? 1 / 8 : 1 / 4;
    porsi["Istri"] = bagianIstri;
    if (jmlIstri > 1) {
      catatan.push(`Porsi istri (${adaAnak ? "1/8" : "1/4"}) dibagi rata untuk ${jmlIstri} orang istri.`);
    }
  } else if (pasangan === "suami") {
    porsi["Suami"] = adaAnak ? 1 / 4 : 1 / 2;
  }

  // — Ayah —
  if (adaAyah) {
    if (adaAnak) {
      porsi["Ayah"] = 1 / 6;
    } else {
      porsi["Ayah"] = "asabah";
    }
  }

  // — Ibu —
  if (adaIbu) {
    if (adaAnak) {
      porsi["Ibu"] = 1 / 6;
    } else if (adaSaudara || saudaraLEfektif + saudaraPEfektif >= 2) {
      // Jika ada 2+ saudara dan tidak ada anak: ibu dapat 1/6
      porsi["Ibu"] = 1 / 6;
      catatan.push("Ibu mendapat 1/6 karena ada 2 atau lebih saudara kandung pewaris.");
    } else {
      porsi["Ibu"] = 1 / 3;
      catatan.push("Ibu mendapat 1/3 karena tidak ada anak kandung. Porsi berkurang menjadi 1/6 jika ada 2 atau lebih saudara kandung pewaris.");
    }
  }

  // — Kakek Efektif (hanya jika tidak ada Ayah) —
  if (adaKakekEfektif) {
    if (adaAnak) {
      porsi["Kakek"] = 1 / 6;
    } else {
      porsi["Kakek"] = "asabah";
    }
  }

  // — Nenek Efektif (hanya jika tidak ada Ibu/Ayah) —
  if (adaNenekEfektif) {
    porsi["Nenek"] = 1 / 6;
    catatan.push("Nenek mendapat porsi 1/6 sebagai pengganti Ibu/Ayah yang tidak ada.");
  }

  // ── Hitung sisa (asabah) ──────────────────────────────────
  let totalPorsiTetap = 0;
  for (const [key, val] of Object.entries(porsi)) {
    if (val !== "asabah") totalPorsiTetap += val;
  }
  let sisaUntukAsabah = Math.max(0, 1 - totalPorsiTetap);

  // — Anak —
  if (adaAnak) {
    const totalUnit = anakL * 2 + anakP;
    if (anakL > 0) {
      porsi["Anak Laki-laki"] = ((anakL * 2) / totalUnit) * sisaUntukAsabah;
    }
    if (anakP > 0) {
      if (anakL > 0) {
        porsi["Anak Perempuan"] = (anakP / totalUnit) * sisaUntukAsabah;
      } else {
        if (anakP === 1) {
          porsi["Anak Perempuan"] = 1 / 2;
          catatan.push("Hanya 1 anak perempuan tanpa anak laki: mendapat porsi tetap 1/2.");
        } else {
          porsi["Anak Perempuan"] = 2 / 3;
          catatan.push(`${anakP} anak perempuan tanpa anak laki: total porsi 2/3 dibagi rata.`);
        }
      }
    }
  } else if (adaAyah) {
    // Ayah asabah jika tidak ada anak
    porsi["Ayah"] = sisaUntukAsabah;
    catatan.push("Tidak ada anak kandung: Ayah mengambil sisa harta sebagai Asabah.");
  } else if (adaKakekEfektif && !adaAyah) {
    porsi["Kakek"] = sisaUntukAsabah;
    catatan.push("Tidak ada anak atau ayah: Kakek mengambil sisa harta sebagai Asabah.");
  } else if (adaSaudara) {
    // Saudara sebagai asabah
    const totalUnitSaudara = saudaraLEfektif * 2 + saudaraPEfektif;
    if (saudaraLEfektif > 0) {
      porsi["Saudara Laki-laki"] = ((saudaraLEfektif * 2) / totalUnitSaudara) * sisaUntukAsabah;
    }
    if (saudaraPEfektif > 0) {
      if (saudaraLEfektif > 0) {
        porsi["Saudara Perempuan"] = (saudaraPEfektif / totalUnitSaudara) * sisaUntukAsabah;
      } else {
        // Hanya saudara perempuan saja (tanpa anak, tanpa ayah)
        if (saudaraPEfektif === 1) {
          porsi["Saudara Perempuan"] = 1 / 2;
          catatan.push("1 saudara perempuan kandung tanpa asabah lain: mendapat 1/2.");
        } else {
          porsi["Saudara Perempuan"] = 2 / 3;
          catatan.push(`${saudaraPEfektif} saudara perempuan kandung: total 2/3 dibagi rata.`);
        }
      }
    }
  }

  // ── 6. Terapkan Aul & Radd ────────────────────────────────
  let totalPorsiAkhir = 0;
  for (const [key, val] of Object.entries(porsi)) {
    if (typeof val === "number") totalPorsiAkhir += val;
  }

  if (totalPorsiAkhir > 1 + 0.001) {
    const faktorAul = 1 / totalPorsiAkhir;
    catatan.push(`⚠ Kondisi AUL terjadi (total porsi ${(totalPorsiAkhir * 100).toFixed(1)}% > 100%). Semua porsi dikurangi secara proporsional.`);
    for (const key in porsi) {
      if (typeof porsi[key] === "number") porsi[key] *= faktorAul;
    }
  } else if (totalPorsiAkhir < 1 - 0.001 && !adaAyah && !adaAnak && !adaKakekEfektif && !adaSaudara) {
    const penerima = Object.keys(porsi).filter((k) => typeof porsi[k] === "number" && porsi[k] > 0);
    if (penerima.length > 0) {
      const faktorRadd = 1 / totalPorsiAkhir;
      catatan.push(`ℹ Kondisi RADD terjadi (ada sisa ${((1 - totalPorsiAkhir) * 100).toFixed(1)}%). Sisa dikembalikan ke ahli waris secara proporsional.`);
      for (const key of penerima) {
        porsi[key] *= faktorRadd;
      }
    }
  }

  // ── 7. Konversi ke nilai Rupiah ───────────────────────────
  let hasil = [];

  const meta = {
    Istri: { warna: "gold", ikon: "👩", status: "Pasangan (Janda)", jenisBagian: "Dzawil Furud (Bagian Tertentu)" },
    Suami: { warna: "blue", ikon: "👨", status: "Pasangan (Duda)", jenisBagian: "Dzawil Furud (Bagian Tertentu)" },
    Ayah: { warna: "blue", ikon: "👴", status: "Orang Tua Laki-laki", jenisBagian: adaAnak ? "Dzawil Furud (1/6)" : "Asabah (Sisa)" },
    Ibu: { warna: "gold", ikon: "👵", status: "Orang Tua Perempuan", jenisBagian: "Dzawil Furud (Bagian Tertentu)" },
    Kakek: { warna: "blue", ikon: "👴", status: "Kakek (pengganti Ayah)", jenisBagian: adaAnak ? "Dzawil Furud (1/6)" : "Asabah (Sisa)" },
    Nenek: { warna: "gold", ikon: "👵", status: "Nenek (pengganti Ibu)", jenisBagian: "Dzawil Furud (1/6)" },
    "Anak Laki-laki": { warna: "anak-l", ikon: "👦", status: "Keturunan Laki-laki", jenisBagian: "Asabah (Sisa setelah Dzawil Furud)" },
    "Anak Perempuan": { warna: "anak-p", ikon: "👧", status: "Keturunan Perempuan", jenisBagian: anakL > 0 ? "Asabah (bersama Anak Laki-laki)" : "Dzawil Furud (½ atau ⅔)" },
    "Saudara Laki-laki": { warna: "saudara", ikon: "🧑", status: "Saudara Kandung Laki-laki", jenisBagian: "Asabah (Sisa)" },
    "Saudara Perempuan": { warna: "saudara", ikon: "👩", status: "Saudara Kandung Perempuan", jenisBagian: saudaraLEfektif > 0 ? "Asabah (bersama Saudara Laki-laki)" : "Dzawil Furud (½ atau ⅔)" },
  };

  // Alasan dan dalil per ahli waris
  const alasanDalil = {
    Istri: {
      alasan: adaAnak
        ? `Istri mendapat 1/8 karena pewaris meninggalkan anak. Jika ada beberapa istri (${jmlIstri > 1 ? jmlIstri + " istri" : "1 istri"}), porsi 1/8 dibagi rata di antara mereka.`
        : `Istri mendapat 1/4 karena pewaris tidak meninggalkan anak.`,
      dalil: 'QS An-Nisa ayat 12: "...Jika mereka mempunyai anak, maka kamu mendapat seperempat dari harta yang ditinggalkan..."',
    },
    Suami: {
      alasan: adaAnak ? `Suami mendapat 1/4 karena pewaris (istri) meninggalkan anak.` : `Suami mendapat 1/2 karena pewaris (istri) tidak meninggalkan anak.`,
      dalil: 'QS An-Nisa ayat 12: "Para suami memperoleh setengah dari harta yang ditinggalkan istri-istrimu jika mereka tidak mempunyai anak..."',
    },
    Ayah: {
      alasan: adaAnak
        ? `Ayah mendapat bagian tetap 1/6 karena ada anak yang menjadi asabah. Sisanya diambil asabah.`
        : `Ayah mendapat seluruh sisa harta (asabah) karena tidak ada anak. Ayah juga menjadi penghalang (hijab) bagi saudara pewaris.`,
      dalil: 'QS An-Nisa ayat 11: "...Jika orang yang meninggal itu mempunyai beberapa saudara, maka ibunya mendapat seperenam..."',
    },
    Ibu: {
      alasan: adaAnak
        ? `Ibu mendapat 1/6 karena ada anak pewaris.`
        : saudaraL + saudaraP >= 2
          ? `Ibu mendapat 1/6 karena ada dua atau lebih saudara kandung pewaris.`
          : `Ibu mendapat 1/3 karena tidak ada anak dan tidak ada dua saudara atau lebih.`,
      dalil: 'QS An-Nisa ayat 11: "...Jika pewaris tidak mempunyai anak dan ia diwarisi oleh kedua orang tua, maka ibunya mendapat sepertiga..."',
    },
    Kakek: {
      alasan: adaAnak ? `Kakek mendapat 1/6 (menggantikan posisi Ayah yang tidak ada) karena ada anak pewaris.` : `Kakek mengambil sisa harta (asabah) karena tidak ada anak dan tidak ada Ayah.`,
      dalil: "Berdasarkan ijma' ulama dan hadis: Kakek menempati posisi Ayah dalam hal warisan jika Ayah tidak ada.",
    },
    Nenek: {
      alasan: `Nenek mendapat 1/6 karena menggantikan posisi Ibu yang tidak ada.`,
      dalil: "Berdasarkan hadis: Rasulullah ﷺ memberikan bagian 1/6 kepada nenek jika ibu tidak ada.",
    },
    "Anak Laki-laki": {
      alasan:
        anakP > 0
          ? `Anak laki-laki berstatus asabah dan mendapat sisa harta setelah bagian dzawil furud. Bersama anak perempuan, perbandingannya 2:1 (laki mendapat dua kali bagian perempuan).`
          : `Anak laki-laki berstatus asabah dan mengambil seluruh sisa harta setelah bagian dzawil furud (pasangan, orang tua).`,
      dalil: 'QS An-Nisa ayat 11: "...bagian seorang anak lelaki sama dengan bagian dua orang anak perempuan..."',
    },
    "Anak Perempuan": {
      alasan:
        anakL > 0
          ? `Anak perempuan berstatus asabah bersama anak laki-laki dengan perbandingan 1:2 (setengah dari bagian anak laki-laki).`
          : anakP === 1
            ? `1 anak perempuan tanpa anak laki-laki mendapat bagian tetap 1/2.`
            : `${anakP} anak perempuan tanpa anak laki-laki mendapat total 2/3 yang dibagi rata di antara mereka.`,
      dalil: 'QS An-Nisa ayat 11: "...jika anak perempuan itu seorang saja, maka ia memperoleh setengah harta..."',
    },
    "Saudara Laki-laki": {
      alasan: `Saudara laki-laki kandung bertindak sebagai asabah dan mengambil sisa harta karena tidak ada anak, ayah, atau kakek.`,
      dalil: 'QS An-Nisa ayat 176: "...mereka berdua mendapat dua pertiga dari harta yang ditinggalkan oleh yang meninggal..."',
    },
    "Saudara Perempuan": {
      alasan:
        saudaraLEfektif > 0
          ? `Saudara perempuan kandung berstatus asabah bersama saudara laki-laki dengan perbandingan 1:2.`
          : saudaraPEfektif === 1
            ? `1 saudara perempuan kandung tanpa asabah laki-laki: mendapat 1/2.`
            : `${saudaraPEfektif} saudara perempuan kandung: total 2/3 dibagi rata.`,
      dalil: 'QS An-Nisa ayat 176: "...Jika ia (yang meninggal) perempuan dan mempunyai saudara laki-laki, maka saudara laki-lakinya mewarisi seluruh hartanya..."',
    },
  };

  for (const [nama, fraksi] of Object.entries(porsi)) {
    if (typeof fraksi !== "number" || fraksi <= 0) continue;

    const m = meta[nama] || { warna: "blue", ikon: "👤", status: "Ahli Waris", jenisBagian: "—" };
    const bagian = bersih * fraksi;
    const al = alasanDalil[nama] || { alasan: "—", dalil: "—" };

    let jumlah = 1;
    let bagianPerOrang = bagian;
    let labelJumlah = "";

    if (nama === "Istri" && jmlIstri > 1) {
      jumlah = jmlIstri;
      bagianPerOrang = bagian / jmlIstri;
      labelJumlah = `${jmlIstri} istri`;
    } else if (nama === "Anak Laki-laki" && anakL > 1) {
      jumlah = anakL;
      bagianPerOrang = bagian / anakL;
      labelJumlah = `${anakL} orang`;
    } else if (nama === "Anak Perempuan" && anakP > 1) {
      jumlah = anakP;
      bagianPerOrang = bagian / anakP;
      labelJumlah = `${anakP} orang`;
    } else if (nama === "Saudara Laki-laki" && saudaraLEfektif > 1) {
      jumlah = saudaraLEfektif;
      bagianPerOrang = bagian / saudaraLEfektif;
      labelJumlah = `${saudaraLEfektif} orang`;
    } else if (nama === "Saudara Perempuan" && saudaraPEfektif > 1) {
      jumlah = saudaraPEfektif;
      bagianPerOrang = bagian / saudaraPEfektif;
      labelJumlah = `${saudaraPEfektif} orang`;
    }

    hasil.push({
      nama,
      ikon: m.ikon,
      warna: m.warna,
      status: m.status,
      jenisBagian: m.jenisBagian,
      fraksi,
      bagian,
      jumlah,
      bagianPerOrang,
      labelJumlah,
      alasan: al.alasan,
      dalil: al.dalil,
    });
  }

  return { bersih, pengurangan, hasil, catatan, hijab, inputData: { anakL, anakP, adaAyah, adaIbu, adaKakekEfektif, adaNenekEfektif, saudaraLEfektif, saudaraPEfektif, pasangan, jmlIstri } };
}

/**
 * Ambil semua nilai input dari form kalkulator
 * @returns {Object} data form
 */
function getInputs() {
  return {
    hartaKotor: document.getElementById("hartaKotor")?.value || "0",
    hutang: document.getElementById("hutang")?.value || "0",
    wasiat: document.getElementById("wasiat")?.value || "0",
    pemakaman: document.getElementById("pemakaman")?.value || "0",

    anakLaki: document.getElementById("anakLaki")?.value || "0",
    anakPerempuan: document.getElementById("anakPerempuan")?.value || "0",

    ayah: document.getElementById("adaAyah")?.checked || false,
    ibu: document.getElementById("adaIbu")?.checked || false,
    kakek: document.getElementById("adaKakek")?.checked || false,
    nenek: document.getElementById("adaNenek")?.checked || false,

    saudaraLaki: document.getElementById("saudaraLaki")?.value || "0",
    saudaraPerempuan: document.getElementById("saudaraPerempuan")?.value || "0",

    // Radio button — undefined jika tidak ada yang dipilih (tidak akan crash)
    pasangan: document.querySelector('input[name="pasangan"]:checked')?.value,

    // FIX: jmlIstri sekarang aman karena elemen ada di HTML (id="jmlIstri")
    jmlIstri: document.getElementById("jmlIstri")?.value || "1",
  };
}

/**
 * Tampilkan hasil ke panel hasil
 * @param {string} html - konten HTML yang akan dimasukkan
 */
function showResult(html) {
  const box = document.getElementById("resultSummaryBox");
  if (!box) {
    console.error("❌ Elemen #resultSummaryBox tidak ditemukan di HTML!");
    return;
  }
  box.innerHTML = html;
}

// ── Render hasil ke DOM ───────────────────────────────────
function renderHasil(hasil, data) {
  const { bersih, pengurangan, hasil: ahliWaris, catatan, hijab, inputData } = hasil;

  // ── Bagian 1: Flow Pengurangan Harta (improved) ────────
  let html = `<div class="result-flow">`;

  // Harta Kotor
  html += `
          <div class="flow-item">
            <div class="flow-step-icon">1</div>
            <div class="flow-content">
              <div class="flow-label">Harta Kotor</div>
              <div class="flow-amount">Rp ${formatRupiah(pengurangan.harta)}</div>
            </div>
          </div>`;

  if (pengurangan.hutang > 0) {
    html += `<div class="flow-connector"></div>
          <div class="flow-item">
            <div class="flow-step-icon">2</div>
            <div class="flow-content">
              <div class="flow-label">Dikurangi Hutang</div>
              <div class="flow-amount neg">− Rp ${formatRupiah(pengurangan.hutang)}</div>
            </div>
          </div>`;
  }
  if (pengurangan.wasiat > 0) {
    html += `<div class="flow-connector"></div>
          <div class="flow-item">
            <div class="flow-step-icon">3</div>
            <div class="flow-content">
              <div class="flow-label">Dikurangi Wasiat</div>
              <div class="flow-amount neg">− Rp ${formatRupiah(pengurangan.wasiat)}</div>
            </div>
          </div>`;
  }
  if (pengurangan.pemakaman > 0) {
    html += `<div class="flow-connector"></div>
          <div class="flow-item">
            <div class="flow-step-icon">4</div>
            <div class="flow-content">
              <div class="flow-label">Dikurangi Biaya Pemakaman</div>
              <div class="flow-amount neg">− Rp ${formatRupiah(pengurangan.pemakaman)}</div>
            </div>
          </div>`;
  }

  html += `<div class="flow-connector"></div>
          <div class="flow-item flow-highlight">
            <div class="flow-step-icon">✓</div>
            <div class="flow-content">
              <div class="flow-label">Harta Bersih Siap Waris</div>
              <div class="flow-amount">Rp ${formatRupiah(bersih)}</div>
            </div>
          </div>
        </div>`;

  // ── Bagian 2: Daftar ahli waris ────────────────────────
  if (ahliWaris.length === 0) {
    html += `
      <div style="text-align:center; padding: 24px 16px; margin-top: 16px;">
        <p style="color: var(--gold); font-weight: 600;">
          ⚠️ Tidak ada ahli waris yang diisi. Silakan centang/pilih setidaknya satu ahli waris.
        </p>
      </div>`;
  } else {
    html += `<div class="aw-section-label">Pembagian per Ahli Waris</div>`;
    html += `<div class="aw-cards-grid">`;

    ahliWaris.forEach((item) => {
      const persen = (item.fraksi * 100).toFixed(2);
      const fraksiLabel = formatFraksi(item.fraksi);
      html += `
            <div class="aw-card warna-${item.warna}">
              <div class="aw-card-header">
                <div class="aw-icon-wrap">${item.ikon}</div>
                <div class="aw-name-block">
                  <div class="aw-name">${item.nama}</div>
                  <div class="aw-status">${item.status}</div>
                </div>
                <div class="aw-amount-block">
                  <div class="aw-total">Rp ${formatRupiah(item.bagian)}</div>
                  ${item.jumlah > 1 ? `<div class="aw-per-orang">@ Rp ${formatRupiah(item.bagianPerOrang)} / orang</div>` : ""}
                </div>
              </div>
              <div class="aw-details">
                <div class="aw-detail-pill">
                  <div class="aw-detail-key">Dasar Bagian</div>
                  <div class="aw-detail-val">${fraksiLabel}</div>
                </div>
                <div class="aw-detail-pill">
                  <div class="aw-detail-key">Persentase</div>
                  <div class="aw-detail-val">${persen}%</div>
                </div>
                <div class="aw-detail-pill" style="grid-column:1/-1;">
                  <div class="aw-detail-key">Jenis Bagian</div>
                  <div class="aw-detail-val">${item.jenisBagian}</div>
                </div>
              </div>
              <div class="aw-alasan-box">${item.alasan}</div>
            </div>`;
    });

    html += `</div>`;
  }

  // ── Bagian 3: Catatan hukum ────────────────────────────
  if (catatan.length > 0) {
    html += `
      <div class="result-catatan">
        <div class="catatan-title">📌 Catatan Hukum</div>
        <ul class="catatan-list">
          ${catatan.map((c) => `<li>${c}</li>`).join("")}
        </ul>
      </div>`;
  }

  // ── Tampilkan ke DOM ────────────────────────────────────
  showResult(html);

  // ── Tampilkan tombol download PDF ──────────────────────
  const pdfWrap = document.getElementById("downloadPdfWrap");
  if (pdfWrap) {
    pdfWrap.style.display = "block";
    // Store data for PDF generation
    lastHasilData = { hasil, data };
  }

  // ── Render Panel Penjelasan ────────────────────────────
  renderPenjelasanHasil(hasil, data);
}

function renderPenjelasanHasil(hasil, data) {
  const { bersih, pengurangan, hasil: ahliWaris, hijab, inputData } = hasil;
  const panel = document.getElementById("hasilPenjelasanPanel");
  if (!panel) return;

  const { anakL, anakP, adaAyah, adaIbu, saudaraLEfektif, saudaraPEfektif } = inputData;

  // ── A. Tahapan Perhitungan ─────────────────────────────
  let tahapanHtml = `<div class="tahapan-panel">
          <div class="tahapan-title">Tahapan Perhitungan</div>
          <div class="tahapan-list">`;

  const tahapan = [
    { label: "Total Harta", nilai: `Rp ${formatRupiah(pengurangan.harta)}`, warna: "" },
    { label: "Dikurangi Hutang", nilai: pengurangan.hutang > 0 ? `− Rp ${formatRupiah(pengurangan.hutang)}` : "Tidak ada", warna: pengurangan.hutang > 0 ? "red" : "" },
    { label: "Dikurangi Wasiat", nilai: pengurangan.wasiat > 0 ? `− Rp ${formatRupiah(pengurangan.wasiat)}` : "Tidak ada", warna: pengurangan.wasiat > 0 ? "red" : "" },
    { label: "Dikurangi Biaya Pengurusan Jenazah", nilai: pengurangan.pemakaman > 0 ? `− Rp ${formatRupiah(pengurangan.pemakaman)}` : "Tidak ada", warna: pengurangan.pemakaman > 0 ? "red" : "" },
    { label: "Harta Bersih Siap Waris", nilai: `Rp ${formatRupiah(bersih)}`, warna: "green", active: true },
    { label: "Identifikasi Ahli Waris", nilai: ahliWaris.length > 0 ? `${ahliWaris.length} ahli waris berhak` : "Tidak ada ahli waris", warna: "gold" },
    { label: "Pembagian Warisan", nilai: "Sesuai ketentuan faraidh (KHI)", warna: "" },
    { label: "Hasil Akhir Telah Dihitung", nilai: "✓ Lihat rincian di atas", warna: "green", active: true },
  ];

  tahapan.forEach((t, i) => {
    const isLast = i === tahapan.length - 1;
    tahapanHtml += `
            <div class="tahapan-item">
              <div class="tahapan-connector">
                <div class="tahapan-circle ${t.active ? "active" : ""}">${i + 1}</div>
                ${!isLast ? '<div class="tahapan-line"></div>' : ""}
              </div>
              <div class="tahapan-content">
                <div class="tahapan-label">${t.label}</div>
                <div class="tahapan-nilai ${t.warna}">${t.nilai}</div>
              </div>
            </div>`;
  });
  tahapanHtml += `</div></div>`;

  // ── B. Penjelasan Umum ─────────────────────────────────
  const penjelasanUmumHtml = `<div class="penjelasan-umum">
          <strong>Bagaimana Sistem Ini Menghitung?</strong><br>
          Pembagian warisan dalam Islam (faraidh) dilakukan dengan urutan: pertama harta dibersihkan dari hutang, wasiat, dan biaya jenazah. Setelah itu, harta bersih dibagi ke ahli waris berdasarkan <em>dzawil furud</em> (bagian pasti seperti 1/2, 1/4, 1/8, 1/3, 1/6, 2/3) terlebih dahulu. Sisa harta kemudian diberikan ke <em>asabah</em> (seperti anak laki-laki, ayah). Jika total porsi melebihi 100% terjadi <strong>Aul</strong> (semua dikurangi proporsional). Jika ada sisa dan tidak ada asabah terjadi <strong>Radd</strong> (sisa dikembalikan ke ahli waris). Urutan prioritas dan sistem penghalang (hijab) menentukan siapa yang berhak.
        </div>`;

  // ── C. Detail Setiap Ahli Waris ───────────────────────
  let detailHtml = "";
  if (ahliWaris.length > 0) {
    detailHtml = `<div class="detail-ahliwaris-panel">
            <div class="tahapan-title" style="margin-bottom:12px;">Detail & Alasan Per Ahli Waris</div>`;

    ahliWaris.forEach((item) => {
      const fraksiLabel = formatFraksi(item.fraksi);
      detailHtml += `
              <div class="detail-ahliwaris-item">
                <div class="detail-header-row">
                  <span class="detail-ikon">${item.ikon}</span>
                  <div class="detail-nama-wrap">
                    <div class="detail-nama">${item.nama}</div>
                    <div class="detail-status">${item.status}</div>
                  </div>
                  <div class="detail-nominal">Rp ${formatRupiah(item.bagian)}</div>
                </div>
                <div class="detail-rows">
                  <div class="detail-kv">
                    <div class="detail-kv-key">Jenis Bagian</div>
                    <div class="detail-kv-val">${item.jenisBagian}</div>
                  </div>
                  <div class="detail-kv">
                    <div class="detail-kv-key">Porsi</div>
                    <div class="detail-kv-val">${fraksiLabel} (${(item.fraksi * 100).toFixed(2)}%)</div>
                  </div>
                  ${
                    item.jumlah > 1
                      ? `
                  <div class="detail-kv">
                    <div class="detail-kv-key">Jumlah Orang</div>
                    <div class="detail-kv-val">${item.jumlah} orang</div>
                  </div>
                  <div class="detail-kv">
                    <div class="detail-kv-key">Per Orang</div>
                    <div class="detail-kv-val">Rp ${formatRupiah(item.bagianPerOrang)}</div>
                  </div>`
                      : ""
                  }
                </div>
                <div class="detail-alasan">💡 ${item.alasan}</div>
                <div class="detail-dalil"><strong>Dasar Hukum:</strong> ${item.dalil}</div>
              </div>`;
    });

    detailHtml += `</div>`;
  }

  // ── D. Panel Hijab ─────────────────────────────────────
  let hijabHtml = "";
  if (hijab && hijab.length > 0) {
    hijabHtml = `<div class="hijab-panel">
            <div class="hijab-title">🚫 Ahli Waris Terhalang (Sistem Hijab)</div>`;
    hijab.forEach((h) => {
      hijabHtml += `
              <div class="hijab-item">
                <span class="hijab-ikon">${h.ikon}</span>
                <div class="hijab-info">
                  <div class="hijab-nama">${h.nama}</div>
                  <div class="hijab-alasan">${h.alasan}</div>
                </div>
                <span class="hijab-badge">Tidak Mewaris</span>
              </div>`;
    });
    hijabHtml += `</div>`;
  }

  // ── E. Referensi Dalil Utama ───────────────────────────
  const dalilHtml = `<div class="result-catatan" style="margin-top:12px;">
          <div class="catatan-title">📖 Referensi Dalil Utama Faraidh</div>
          <ul class="catatan-list">
            <li><strong>QS An-Nisa ayat 11</strong> — Porsi anak laki-laki dan perempuan, serta bagian ayah/ibu jika ada anak.</li>
            <li><strong>QS An-Nisa ayat 12</strong> — Bagian suami/istri (1/2, 1/4, 1/8, 1/4) tergantung ada tidaknya anak.</li>
            <li><strong>QS An-Nisa ayat 176</strong> — Bagian saudara kandung laki-laki dan perempuan (kalalah).</li>
            <li><strong>Kompilasi Hukum Islam (KHI)</strong> — Dasar hukum positif warisan Islam di Indonesia.</li>
          </ul>
        </div>`;

  // ── Rakit Panel Penjelasan ─────────────────────────────
  panel.style.display = "block";
  panel.innerHTML = `
          <div class="hasil-penjelasan">
            <div class="penjelasan-header" id="penjelasanToggleBtn">
              <span style="font-size:1.1rem;">🔍</span>
              <h4>Mengapa Hasilnya Seperti Ini?</h4>
              <span class="penjelasan-chevron">▼</span>
            </div>
            <div class="penjelasan-body open" id="penjelasanBody">
              ${penjelasanUmumHtml}
              ${tahapanHtml}
              ${detailHtml}
              ${hijabHtml}
              ${dalilHtml}
            </div>
          </div>`;

  // Toggle accordion
  document.getElementById("penjelasanToggleBtn")?.addEventListener("click", () => {
    const btn = document.getElementById("penjelasanToggleBtn");
    const body = document.getElementById("penjelasanBody");
    btn?.classList.toggle("open");
    body?.classList.toggle("open");
  });
}

// ── Loading & instruksi hasil ─────────────────────────────
const LOADING_DURATION_MS = 3000;
let isCalculating = false;
let btnHitungHtml = "";

// Panel hasil di sebelah kanan form (desktop) atau di bawahnya (layar kecil)?
function isResultBesideForm() {
  const btn = document.getElementById("btnHitung")?.getBoundingClientRect();
  const panel = document.getElementById("resultPanel")?.getBoundingClientRect();
  return Boolean(btn && panel && panel.left > btn.left + btn.width / 2);
}

function startLoading(btn) {
  btnHitungHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="btn-spinner" aria-hidden="true"></span><span>Menghitung...</span>';

  const notice = document.getElementById("calcNotice");
  if (notice) notice.style.display = "none";
  // sembunyikan hasil lama selama loading
  ["hasilPenjelasanPanel", "downloadPdfWrap"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });

  const lokasi = isResultBesideForm() ? "di panel sebelah kanan" : "di panel bawah";
  showResult(`
    <div class="calc-loading">
      <div class="calc-spinner" aria-hidden="true"></div>
      <div class="calc-loading-title">Sedang menghitung pembagian waris...</div>
      <div class="calc-loading-sub">Mohon tunggu, hasil akan tampil ${lokasi}.</div>
    </div>
  `);


  ensureResultPanelVisible();
}

// Desktop: pastikan bagian atas panel hasil terlihat (tidak tertutup navbar),
// dengan menggulung sesedikit mungkin agar tombol & instruksi tetap terlihat.
function ensureResultPanelVisible() {
  if (!isResultBesideForm()) return;
  const top = document.getElementById("resultPanel")?.getBoundingClientRect().top;
  if (top !== undefined && top < 90) window.scrollBy({ top: top - 90, behavior: "smooth" });
}

function stopLoading(btn) {
  btn.disabled = false;
  btn.innerHTML = btnHitungHtml;
}

function showCalcNotice() {
  const notice = document.getElementById("calcNotice");
  if (!notice) return;
  notice.textContent = isResultBesideForm()
    ? "✅ Perhitungan selesai! Lihat hasilnya di sebelah kanan →"
    : "✅ Perhitungan selesai! Lihat hasilnya di bawah ↓";
  notice.style.display = "flex";
}

function scrollToResult() {
  document.getElementById("resultPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── Inisialisasi kalkulator (dipanggil dari main.js) ──────
export function initializeCalculator() {
  // ── Tombol Hitung Warisan ───────────────────────────────
  const btnHitung = document.getElementById("btnHitung");

  // FIX: Guard — jika tombol tidak ditemukan, log error informatif
  if (!btnHitung) {
    console.error("❌ Elemen #btnHitung tidak ditemukan! Pastikan ID tombol di HTML adalah 'btnHitung'.");
    return;
  }

  btnHitung.addEventListener("click", () => {
    if (isCalculating) return; // abaikan klik saat loading

    // Ambil semua input
    const data = getInputs();

    // Validasi minimal: harta kotor harus diisi
    const hartaKotor = Number(String(data.hartaKotor).replace(/\./g, "").replace(/,/g, ""));
    if (hartaKotor <= 0) {
      showResult(`
        <div style="text-align:center; padding: 32px 16px;">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">⚠️</div>
          <p style="color: var(--color-error, #ef4444); font-weight: 600; font-size: 1rem;">
            Mohon masukkan nilai Harta Kotor terlebih dahulu.
          </p>
        </div>
      `);
      document.getElementById("hartaKotor")?.focus();
      return;
    }

    // Loading 3 detik -> hitung -> tampilkan hasil + instruksi
    isCalculating = true;
    startLoading(btnHitung);

    setTimeout(() => {
      try {
        const hasil = hitungWarisan(data);
        renderHasil(hasil, data);
        showCalcNotice();
        const panel = document.getElementById("resultPanel");
        if (panel) panel.scrollTop = 0; // panel hasil bisa punya scroll sendiri (desktop)
        // Layar kecil (hasil di bawah form): beri waktu membaca instruksi, lalu gulung ke hasil.
        // Desktop: panel hasil menempel di kanan, tidak perlu menggulung halaman.
        if (!isResultBesideForm()) setTimeout(scrollToResult, 800);
      } finally {
        stopLoading(btnHitung);
        isCalculating = false;
      }
    }, LOADING_DURATION_MS);
  });
}
