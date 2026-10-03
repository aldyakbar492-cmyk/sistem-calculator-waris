# WarisModern

Kalkulator & edukasi waris Indonesia (HTML + CSS + JavaScript vanilla, ES Modules).

## Menjalankan
ES Modules tidak bisa dibuka lewat `file://`. Jalankan server lokal dari folder ini:

    python -m http.server 8000     # lalu buka http://localhost:8000

(atau gunakan ekstensi Live Server di VS Code).

## Struktur
- `index.html` — struktur halaman (section diberi komentar banner)
- `css/` — 14 file; urutan muat ada di `index.html` (`dark-mode.css` dan `responsive.css` paling akhir)
- `js/main.js` — entry point; meng-import navbar, faq, education, ui, calculator, theme, pdf
- `js/calculator.js` — rumus waris + render hasil; `js/pdf.js` — laporan PDF; `js/helpers.js` — utilitas
- `assets/` — images & icons

## Navigasi (tab)
Setiap menu navbar adalah halaman sendiri (`#beranda`, `#kalkulator`, `#edukasi`, `#faq`) — logikanya di `js/navbar.js`,
markup dibungkus `<div class="page-view" data-page="...">` di `index.html`.
- Beranda: Hero + Mengapa Penting + CTA · Kalkulator · Edukasi: materi + modal + tabel referensi · FAQ

## Kalkulator
Klik "Hitung Warisan" → loading 3 detik (`LOADING_DURATION_MS` di `js/calculator.js`) → hasil tampil di panel kanan + instruksi.
