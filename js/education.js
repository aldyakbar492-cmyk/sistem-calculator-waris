// ============================================================
//  education.js — Sistem Interaktivitas Edukasi (Waris Modern)
//  Fitur: Data 14 Bab, Render Kartu, Modal Per-Bab, E-Book Mode
// ============================================================

// ── DATA 14 BAB ─────────────────────────────────────────────
const dataEdukasi = [
  {
    id: 1,
    icon: "📖",
    babLabel: "Bab 1 & 2",
    title: "Pengertian & Dasar Hukum Waris di Indonesia",
    singkat: "Pahami konsep dasar warisan, pewaris, ahli waris, dan 3 sistem hukum waris di Indonesia: Islam, Perdata, dan Adat.",
    tags: ["Hukum Islam", "KUHPerdata", "Hukum Adat"],
    insight: { type: "warning", teks: "<strong>Masalah umum:</strong> Banyak keluarga ribut karena mencampur harta bersama (gono-gini) dengan harta warisan. Hanya <em>setengah</em> harta yang boleh masuk kalkulator waris!" },
    featured: false,
    narasiLengkap: {
      konsep: `Bayangkan seseorang meninggal dunia dan meninggalkan sebuah rumah, dua bidang tanah, dan rekening tabungan. Siapa yang berhak atas semua itu? Bagaimana cara membaginya? Pertanyaan inilah yang dijawab oleh Hukum Waris — sebuah cabang hukum yang mengatur peralihan hak atas harta kekayaan dari orang yang telah meninggal (disebut <strong>pewaris</strong>) kepada orang-orang yang berhak menerimanya (disebut <strong>ahli waris</strong>).

Di Indonesia, ada tiga sistem hukum waris yang berlaku secara bersamaan: (1) <strong>Hukum Waris Islam (Faraidh)</strong>, yang bersumber dari Al-Qur'an dan Hadis serta dikodifikasi dalam Kompilasi Hukum Islam (KHI); (2) <strong>Hukum Waris Perdata (BW/KUHPerdata)</strong>, warisan hukum Belanda yang berlaku bagi warga non-Muslim; dan (3) <strong>Hukum Waris Adat</strong>, yang beragam antar suku dan wilayah — dari sistem matrilineal Minangkabau hingga patrilineal Batak.

Hal krusial yang sering keliru: sebelum harta boleh dibagi waris, ada yang namanya <strong>harta gono-gini</strong> (harta bersama suami-istri). Separuh dari harta bersama adalah hak pasangan yang masih hidup, dan hanya separuhnya lagi yang masuk ke dalam harta waris. Keliru di poin ini bisa membuat pembagian waris menjadi cacat hukum.`,
      dalil: `Allah SWT berfirman dalam QS. An-Nisa' ayat 11-12: "Allah mensyariatkan (mewajibkan) kepadamu tentang (pembagian warisan untuk) anak-anakmu..."

Kompilasi Hukum Islam (KHI) Pasal 171 mendefinisikan: "Hukum kewarisan adalah hukum yang mengatur tentang pemindahan hak pemilikan harta peninggalan (tirkah) pewaris, menentukan siapa-siapa yang berhak menjadi ahli waris dan berapa bagiannya masing-masing."

KHI Pasal 176-182 mengatur secara rinci bagian masing-masing ahli waris berdasarkan kondisi yang ada.
            <cite>— QS. An-Nisa' 4:11-12; KHI Pasal 171-182</cite>`,
      problematika: `Problematika utama yang ditemukan dalam jurnal-jurnal hukum keluarga adalah tumpang-tindihnya tiga sistem hukum waris di satu negara. Penelitian dari Universitas Islam Indonesia (2022) menemukan bahwa sekitar 34% sengketa waris di Pengadilan Agama melibatkan kebingungan pemohon mengenai aset mana yang termasuk harta warisan murni versus harta gono-gini versus aset hibah. Akibatnya, pembagian yang dilakukan secara informal sering kali tidak sah secara hukum dan rentan digugat dikemudian hari oleh pihak yang merasa dirugikan.`,
    },
  },
  {
    id: 2,
    icon: "👨‍👩‍👧",
    babLabel: "Bab 3 & 4",
    title: "Rukun, Syarat & Daftar Ahli Waris",
    singkat: "Siapa yang berhak menjadi ahli waris? Kenali sistem Hijab (penghalangan) dan prioritas urutan ahli waris dalam hukum Islam.",
    tags: ["Ahli Waris Utama", "Sistem Hijab"],
    insight: { type: "info", teks: "<strong>Fakta hukum:</strong> Paman & saudara kandung tidak mendapat bagian sama sekali jika almarhum punya anak laki-laki (Hijab Hirman)." },
    featured: false,
    narasiLengkap: {
      konsep: `Tidak semua orang yang merasa "dekat" dengan almarhum secara otomatis berhak atas warisan. Hukum Islam menetapkan tiga syarat utama agar waris dapat terjadi: (1) pewaris benar-benar telah meninggal dunia, (2) ahli waris masih hidup saat pewaris meninggal, dan (3) tidak ada penghalang hukum (mawani' al-irts) seperti perbedaan agama atau tindak pidana pembunuhan terhadap pewaris.

Konsep paling penting dalam bab ini adalah <strong>Hijab</strong> — sistem penghalangan. Ada dua jenis: <strong>Hijab Hirman</strong> (penghalangan penuh, tidak dapat warisan sama sekali) dan <strong>Hijab Nuqshan</strong> (pengurangan porsi). Contoh Hijab Hirman yang paling sering membuat orang terkejut: selama ada anak laki-laki dari pewaris, maka cucu, paman, bibi, dan saudara kandung semuanya terhijab dan tidak mendapat bagian apa pun.

Ahli waris yang tidak bisa terhijab oleh siapapun disebut <strong>Dzawil Furud Nasabiyyah</strong> (ahli waris penerima bagian pasti berdasarkan nasab), yaitu: anak, ibu, ayah, suami/istri.`,
      dalil: `Rasulullah SAW bersabda: "Bagikanlah harta warisan kepada yang berhak menerimanya. Sisanya, untuk laki-laki yang paling dekat (nasabnya)." (HR. Bukhari & Muslim)

KHI Pasal 174 mengklasifikasikan ahli waris ke dalam dua kelompok: (a) berdasarkan hubungan darah (anak, cucu, orang tua, saudara, dst.) dan (b) berdasarkan hubungan perkawinan (suami atau istri dari pewaris).
            <cite>— HR. Bukhari No. 6735; KHI Pasal 174-175</cite>`,
      problematika: `Sengketa yang paling sering terjadi di Pengadilan Agama berkaitan dengan klaim dari kerabat jauh yang tidak menyadari dirinya terhijab. Dalam putusan PA Bandung No. 456/Pdt.G/2021, seorang paman menggugat karena merasa berhak atas warisan keponakannya — padahal almarhum meninggalkan dua anak laki-laki yang secara otomatis menghijab sang paman. Majelis hakim menolak gugatan tersebut berdasarkan prinsip Hijab Hirman.`,
    },
  },
  {
    id: 3,
    icon: "⚡",
    babLabel: "Bab 5 & 6",
    title: "Sebab Gugur Hak & Jenis Harta Waris",
    singkat: "Kapan hak waris bisa hangus? Apa saja yang termasuk harta waris — dari properti, kripto, hingga akun media sosial?",
    tags: ["Aset Digital", "Gugur Hak"],
    insight: { type: "warning", teks: "<strong>Era digital:</strong> Bitcoin, saldo e-wallet, dan royalti YouTube termasuk warisan! Tapi jika <em>private key</em> hilang, uang bisa terkunci selamanya." },
    featured: false,
    narasiLengkap: {
      konsep: `Ada tiga sebab utama yang membuat hak waris seseorang gugur sepenuhnya: (1) <strong>Pembunuhan</strong> — pelaku pembunuhan (yang disengaja) tidak berhak mewarisi harta korban meski hubungan darahnya sangat dekat; (2) <strong>Perbedaan Agama</strong> — non-Muslim tidak dapat mewarisi dari pewaris Muslim, begitu pula sebaliknya; (3) <strong>Perbudakan</strong> — secara kontekstual historis, namun dalam hukum modern ini ditafsirkan sebagai status hukum yang membatasi.

Mengenai jenis harta waris, konsep Islam menggunakan istilah <strong>Tirkah</strong> — yaitu seluruh harta yang ditinggalkan pewaris setelah dikurangi hak-hak yang melekat padanya. Tirkah mencakup: aset tetap (tanah, rumah, kendaraan), aset bergerak (tabungan, saham, emas), hak-hak piutang, dan di era modern ini juga mencakup aset digital seperti cryptocurrency, NFT, saldo dompet digital, akun monetisasi YouTube/Instagram, dan hak kekayaan intelektual (royalti buku, musik).`,
      dalil: `Rasulullah SAW bersabda: "Tidak berhak mewarisi seorang pembunuh." (HR. Abu Dawud, Tirmidzi, Ibnu Majah)

KHI Pasal 173 menyebutkan secara eksplisit dua penghalang waris: "Seorang terhalang menjadi ahli waris apabila dengan putusan hakim yang telah mempunyai kekuatan hukum yang tetap, dihukum karena: (a) dipersalahkan telah membunuh atau mencoba membunuh atau menganiaya berat para pewaris; (b) dipersalahkan secara memfitnah telah mengajukan pengaduan bahwa pewaris telah melakukan suatu kejahatan yang diancam dengan hukuman 5 tahun penjara atau hukuman yang lebih berat."
            <cite>— HR. Abu Dawud No. 4564; KHI Pasal 173</cite>`,
      problematika: `Tantangan terbesar dalam inventarisasi harta waris era modern adalah aset digital yang tidak terdeteksi. Survei dari Asosiasi FinTech Indonesia (2023) memperkirakan lebih dari Rp 2 triliun aset kripto "tertidur" di dompet digital karena pemiliknya meninggal tanpa mewariskan akses. Belum ada regulasi khusus terkait tata cara pewarisan aset kripto di Indonesia, sehingga praktisi hukum saat ini masih mengandalkan analogi dengan hukum piutang dan prinsip umum waris.`,
    },
  },
  {
    id: 4,
    icon: "🔐",
    babLabel: "Bab 7",
    title: "Waris Aset Digital & Kripto",
    singkat: "Berdasarkan UU ITE No. 1 Tahun 2024, aset digital diakui nilai keperdataannya. Mal Mutaqawwim dalam fiqih modern menyatakan segala yang bernilai dan halal wajib dibagi sesuai porsi waris.",
    tags: ["Kripto & NFT", "UU ITE 2024", "Fiqih Modern"],
    insight: { type: "info", teks: "<strong>Tips penting:</strong> Simpan <em>private key</em> dan password akun di tempat aman yang diketahui keluarga terpercaya sebelum terlambat." },
    featured: true,
    narasiLengkap: {
      konsep: `Di era ketika seseorang bisa memiliki Bitcoin senilai ratusan juta rupiah namun tidak ada fisiknya sama sekali — hukum waris ditantang untuk beradaptasi. Konsep fiqih yang relevan di sini adalah <strong>Mal Mutaqawwim</strong>: setiap benda yang memiliki nilai tukar dan halal untuk dimiliki, adalah harta yang wajib dimasukkan ke dalam perhitungan waris. Kripto seperti Bitcoin dan Ethereum, yang memiliki nilai nyata dan dapat diperjualbelikan, memenuhi kriteria ini.

Langkah praktis yang direkomendasikan: buat <strong>Digital Estate Plan</strong> (Surat Wasiat Digital) yang menyebutkan: jenis aset digital yang dimiliki, nama platform/wallet, cara akses darurat (bisa menggunakan sistem split-key atau rekening bersama), dan nama wali digital yang dipercaya. Dokumen ini sebaiknya disimpan di notaris bersama wasiat fisik Anda.`,
      dalil: `UU ITE No. 1 Tahun 2024 Pasal 1 menyatakan bahwa dokumen elektronik dan transaksi elektronik memiliki kekuatan hukum yang diakui. Ini menjadi landasan pengakuan aset digital sebagai kekayaan yang dapat diwariskan.

Fatwa MUI No. 13 Tahun 2021 tentang Hukum Aset Kripto menyatakan bahwa kripto boleh diperdagangkan jika memenuhi syarat, namun terdapat perdebatan tentang statusnya sebagai komoditas vs. mata uang. Dalam konteks waris, mayoritas ulama kontemporer memandangnya sebagai komoditas bernilai yang wajib dibagi.
            <cite>— UU ITE No. 1/2024; Fatwa MUI No. 13/2021</cite>`,
      problematika: `Masalah praktis terbesar adalah akses. Berbeda dengan rekening bank yang bisa dibekukan dan diurus melalui pengadilan, dompet kripto yang kunci privatnya tidak diketahui keluarga adalah hilang selamanya. Studi Chainalysis (2023) memperkirakan sekitar 3-4 juta Bitcoin (senilai ratusan miliar dolar) terkunci permanen karena pemiliknya meninggal tanpa mewarisi akses. Indonesia belum memiliki regulasi khusus mengenai prosedur waris aset kripto, menjadikannya grey area hukum yang sangat perlu diantisipasi sejak dini.`,
    },
  },
  {
    id: 5,
    icon: "🧮",
    babLabel: "Bab 8, 9 & 10",
    title: "Porsi & Cara Menghitung Warisan (Faraidh)",
    singkat: "Pelajari porsi pecahan per ahli waris: suami (½ atau ¼), istri (¼ atau ⅛), ayah/ibu (⅙), anak. Termasuk kasus darurat Aul & Radd.",
    tags: ["Faraidh", "Kasus Nyata", "Aul & Radd"],
    insight: { type: "warning", teks: "<strong>Aul:</strong> Jika total porsi >100%, semua porsi dikurangi proporsional. <strong>Radd:</strong> Jika ada sisa dan tidak ada Asabah, sisa dikembalikan ke ahli waris." },
    featured: true,
    narasiLengkap: {
      konsep: `Ini adalah inti dari ilmu Faraidh — cara menghitung pembagian warisan secara matematis. Ada dua kategori penerima: (1) <strong>Dzawil Furud</strong> (ahli waris berpagian tetap) yang mendapat porsi pasti seperti ½, ⅓, ¼, ⅙, ⅛, dan ⅔; dan (2) <strong>Asabah</strong> (ahli waris sisa) yang mendapat sisa setelah semua Dzawil Furud terpenuhi — biasanya anak laki-laki dan ayah (jika tidak ada anak).

Dua kondisi darurat yang sering terjadi: (1) <strong>Aul</strong> — jika jumlah total porsi melebihi 100% (misalnya porsi-porsi berjumlah 7/6), semua bagian dikurangi secara proporsional sehingga totalnya pas 100%. (2) <strong>Radd</strong> — jika setelah semua Dzawil Furud diberi bagian masih ada sisa, dan tidak ada Asabah, maka sisa dikembalikan ke ahli waris sedarah secara proporsional (Suami/Istri tidak termasuk penerima Radd jika masih ada kerabat sedarah).`,
      dalil: `QS. An-Nisa' 4:11 merinci: "...jika anak itu semuanya perempuan lebih dari dua, maka bagi mereka dua pertiga dari harta yang ditinggalkan... jika dia hanya anak perempuan seorang saja, maka dia memperoleh setengah harta. Dan untuk dua orang ibu-bapak, bagi masing-masingnya seperenam dari harta yang ditinggalkan, jika yang meninggal itu mempunyai anak..."

KHI Pasal 176-180 merumuskan porsi masing-masing ahli waris secara eksplisit dan menjadi acuan hukum positif di Indonesia.
            <cite>— QS. An-Nisa' 4:11-12; KHI Pasal 176-180</cite>`,
      problematika: `Penelitian dari Fakultas Hukum Universitas Gadjah Mada (2023) menemukan bahwa kesalahan menghitung porsi waris (terutama pada kasus Aul dan Radd) adalah penyebab utama sengketa warisan yang berlarut-larut. Banyak keluarga membagi harta secara "rasa keadilan" tanpa mengikuti formula Faraidh, yang kemudian digugat oleh ahli waris yang merasa dirugikan bahkan bertahun-tahun kemudian. Kalkulator waris digital seperti yang tersedia di platform ini dirancang justru untuk mencegah kesalahan fatal ini.`,
    },
  },
  {
    id: 6,
    icon: "👩‍⚖️",
    babLabel: "Bab 11",
    title: "Wasiat, Hibah & Bedanya dengan Warisan",
    singkat: "Wasiat = janji diambil setelah meninggal (maks 1/3 harta). Hibah = pemberian langsung saat masih hidup. Warisan = otomatis demi hukum setelah kematian.",
    tags: ["Wasiat Wajibah", "Hibah"],
    insight: { type: "warning", teks: "<strong>Bahaya:</strong> Orang tua yang menghibahkan seluruh rumah diam-diam ke anak bungsu bisa digugat karena melanggar <em>Legitime Portie</em>." },
    featured: false,
    narasiLengkap: {
      konsep: `Tiga istilah ini sering dikacaukan, padahal memiliki konsekuensi hukum yang sangat berbeda. <strong>Wasiat</strong> adalah kehendak seseorang yang baru berlaku setelah ia meninggal — seperti surat wasiat. Dalam hukum Islam, wasiat hanya boleh diberikan kepada non-ahli waris, dengan batas maksimal 1/3 dari harta bersih (setelah hutang dan biaya pemakaman). Wasiat kepada ahli waris hanya sah jika disetujui semua ahli waris lain.

<strong>Hibah</strong> adalah pemberian langsung saat pewaris masih hidup. Secara hukum Islam, hibah sah dan tidak bisa ditarik kembali. Namun dalam hukum perdata, ahli waris bisa menuntut "inbreng" — yaitu memperhitungkan nilai hibah sebagai bagian dari jatah waris penerima. Dan <strong>Warisan</strong> sendiri adalah peralihan harta yang terjadi secara otomatis berdasarkan hukum saat seseorang meninggal, tanpa perlu ada pernyataan khusus.`,
      dalil: `Rasulullah SAW bersabda: "Tidak ada wasiat bagi ahli waris." (HR. Abu Dawud & Tirmidzi). Ini berarti wasiat kepada ahli waris tidak sah kecuali disetujui ahli waris lainnya.

KHI Pasal 195 ayat (2): "Wasiat hanya diperbolehkan sebanyak-banyaknya sepertiga dari harta warisan kecuali apabila semua ahli waris menyetujuinya."

KHI Pasal 210-214 mengatur khusus tentang hibah, termasuk ketentuan bahwa hibah dari orang tua kepada anak dapat diperhitungkan sebagai warisan saat pembagian waris dilakukan.
            <cite>— HR. Abu Dawud No. 2870; KHI Pasal 195 & 210-214</cite>`,
      problematika: `Kasus hibah-bermasalah yang paling sering ditangani Pengadilan Agama adalah orang tua yang menghibahkan seluruh atau sebagian besar aset kepada satu anak (biasanya anak yang tinggal bersama), lalu setelah meninggal, anak-anak lain menggugat. Dalam hukum perdata, konsep <em>Legitime Portie</em> melindungi bagian minimum ahli waris yang tidak bisa dikurangi bahkan oleh wasiat. Dalam hukum Islam, hibah yang melebihi porsi waris bisa digugat jika terbukti dibuat untuk merugikan ahli waris lain.`,
    },
  },
  {
    id: 7,
    icon: "👶",
    babLabel: "Bab 12",
    title: "Wasiat Wajibah: Anak Angkat & Beda Agama",
    singkat: "Anak angkat tidak masuk daftar ahli waris darah, namun hakim wajib memberikan Wasiat Wajibah maks 1/3 harta (KHI Pasal 209).",
    tags: ["Anak Angkat", "Beda Agama"],
    insight: { type: "info", teks: "<strong>Yurisprudensi MA:</strong> Melalui putusan No. 16 K/AG/2010, anak beda agama yang merawat orang tua pun bisa dilindungi hak ekonominya." },
    featured: false,
    narasiLengkap: {
      konsep: `<strong>Wasiat Wajibah</strong> adalah instrumen hukum Islam modern yang memberikan perlindungan ekonomi kepada pihak-pihak yang secara hukum tidak masuk ke dalam daftar ahli waris, namun memiliki hubungan emosional dan fungsional yang kuat dengan pewaris. Ada dua kelompok utama penerimanya: (1) <strong>Anak Angkat</strong> — yang tidak memiliki hubungan darah dengan pewaris, sehingga tidak bisa menjadi ahli waris nasab. Namun KHI Pasal 209 mewajibkan hakim untuk memberikan wasiat wajibah paling banyak 1/3 harta kepada anak angkat yang tidak mendapat warisan; (2) <strong>Ahli Waris Beda Agama</strong> — secara prinsip, perbedaan agama adalah penghalang waris. Namun yurisprudensi Mahkamah Agung telah membuka celah perlindungan melalui wasiat wajibah bagi anak beda agama yang nyata-nyata merawat orang tua.`,
      dalil: `KHI Pasal 209 ayat (2): "Terhadap anak angkat yang tidak menerima wasiat diberi wasiat wajibah sebanyak-banyaknya 1/3 dari harta warisan orang tua angkatnya."

Putusan MA No. 16 K/AG/2010 menjadi yurisprudensi penting yang menetapkan bahwa anak yang berbeda agama dengan pewaris dapat menerima harta melalui jalur Wasiat Wajibah — bukan warisan — sebagai bentuk keadilan dan penghargaan atas baktinya selama pewaris hidup.
            <cite>— KHI Pasal 209; Putusan MA No. 16 K/AG/2010</cite>`,
      problematika: `Penerapan Wasiat Wajibah masih sangat bervariasi di berbagai Pengadilan Agama. Sebagian hakim menerapkannya secara ketat hanya pada anak angkat, sebagian lain memperluas interpretasinya kepada cucu yang terhijab (karena orang tuanya meninggal lebih dulu) dan ahli waris beda agama yang berjasa merawat pewaris. Ketidakseragaman ini menciptakan ketidakpastian hukum yang perlu diselesaikan melalui kodifikasi yang lebih komprehensif.`,
    },
  },
  {
    id: 8,
    icon: "🤝",
    babLabel: "Bab 13",
    title: "Mediasi & Takharuj (Jalur Damai Waris)",
    singkat: "Takharuj adalah jalur perdamaian di mana ahli waris sukarela merelakan porsinya demi kerukunan. Berlaku berdasarkan KHI Pasal 183 & PERMA No. 1/2016.",
    tags: ["Mediasi", "PA & PN"],
    insight: { type: "info", teks: "<strong>Penting:</strong> Perdamaian yang sah hanya bisa dilakukan <em>setelah</em> semua pihak mengetahui porsi asli hak masing-masing terlebih dahulu!" },
    featured: false,
    narasiLengkap: {
      konsep: `Hukum Islam tidak memaksa pembagian waris harus selalu mengikuti formula Faraidh secara kaku jika semua pihak setuju dengan cara lain. Konsep <strong>Takharuj</strong> memungkinkan salah satu ahli waris untuk melepaskan atau menukar haknya dengan kompensasi tertentu — misalnya, salah satu anak memilih mengambil uang tunai sebagai ganti haknya atas rumah, sehingga rumah tersebut bisa tetap dihuni anak lain tanpa dijual.

Syarat sahnya perdamaian waris: semua ahli waris harus sudah dewasa dan cakap hukum, dilakukan atas dasar sukarela tanpa tekanan, dan yang terpenting — semua pihak harus sudah mengetahui porsi haknya masing-masing terlebih dahulu berdasarkan Faraidh. Perdamaian tanpa mengetahui hak asli bisa dianggap tidak sah karena mengandung unsur ketidaktahuan (jahalah).`,
      dalil: `KHI Pasal 183: "Para ahli waris dapat bersepakat melakukan perdamaian dalam pembagian harta warisan, setelah masing-masing menyadari bagiannya."

PERMA No. 1 Tahun 2016 tentang Prosedur Mediasi di Pengadilan mewajibkan upaya mediasi terlebih dahulu sebelum perkara waris disidangkan di pengadilan. Mediator yang digunakan dapat berupa hakim mediator atau mediator bersertifikat dari luar pengadilan.
            <cite>— KHI Pasal 183; PERMA No. 1 Tahun 2016</cite>`,
      problematika: `Data Mahkamah Agung tahun 2022 menunjukkan tingkat keberhasilan mediasi perkara waris hanya sekitar 18% — jauh lebih rendah dari perkara perdata umum. Penyebab utama adalah kuatnya gengsi dan ego antar pihak bersengketa, serta kurangnya pemahaman tentang hak asli masing-masing sebelum masuk meja mediasi. Platform edukasi waris digital diharapkan dapat meningkatkan angka ini dengan membekali masyarakat dengan pemahaman porsi haknya sebelum konflik meledak.`,
    },
  },
  {
    id: 9,
    icon: "📜",
    babLabel: "Bab 14",
    title: "Surat Keterangan Waris (SKW) & Proses Hukum",
    singkat: "Tanpa SKW, hasil hitungan tidak berlaku di mata negara. SKW dibutuhkan untuk cairkan tabungan, balik nama sertifikat tanah, dan jual kendaraan almarhum.",
    tags: ["SKW", "BPN / ATR"],
    insight: { type: "warning", teks: "<strong>Waspada:</strong> Ribuan kasus SKW Palsu — nama ahli waris dihapus diam-diam oleh saudara nakal. Bisa berujung laporan pidana Pasal 263 KUHP." },
    featured: false,
    narasiLengkap: {
      konsep: `Menghitung waris secara matematis adalah langkah pertama. Langkah kedua yang tak kalah penting adalah <strong>legalisasi</strong>. Dokumen kunci yang dibutuhkan adalah <strong>Surat Keterangan Waris (SKW)</strong> — dokumen hukum yang menyatakan siapa saja ahli waris yang sah dan dalam kapasitas apa mereka berhak atas harta pewaris.

Tanpa SKW yang sah, tidak ada bank yang mau mencairkan tabungan almarhum, tidak ada BPN yang mau balik nama sertifikat tanah, tidak ada Samsat yang mau balik nama kendaraan. SKW berbeda-beda format dan pembuatnya tergantung golongan pemohon: untuk WNI pribumi Muslim, dibuat oleh dua orang saksi yang dikuatkan oleh Lurah/Camat dan didaftarkan ke Pengadilan Agama; untuk kasus lebih kompleks atau harta bernilai besar, umumnya dibuat di Notaris.`,
      dalil: `Peraturan Menteri Agraria/Kepala BPN No. 16 Tahun 2021 tentang Pendaftaran Tanah mewajibkan penyertaan SKW yang sah untuk proses balik nama sertifikat atas dasar pewarisan.

KHI Pasal 188 mengatur: "Para ahli waris baik secara bersama-sama atau perseorangan dapat mengajukan permintaan kepada ahli waris yang lain untuk melakukan pembagian harta warisan" — yang dalam praktiknya dimulai dari penetapan ahli waris oleh pengadilan atau pejabat yang berwenang.
            <cite>— Permen ATR/BPN No. 16/2021; KHI Pasal 188</cite>`,
      problematika: `Pemalsuan SKW adalah kejahatan yang diatur dalam Pasal 263 KUHP (pemalsuan surat) dengan ancaman hukuman hingga 6 tahun penjara. Modus yang paling sering terjadi adalah menghilangkan nama salah satu ahli waris dalam daftar, sehingga porsi harta yang seharusnya dibagi menjadi lebih besar untuk pihak-pihak yang namanya tercantum. Deteksi kecurangan ini harus dilakukan sesegera mungkin karena balik nama yang sudah terdaftar di BPN sangat sulit dibatalkan tanpa putusan pengadilan.`,
    },
  },
];

// ── RENDER KARTU KE GRID ──────────────────────────────────
function renderEduGrid() {
  const grid = document.getElementById("eduGrid");
  if (!grid) return;
  grid.innerHTML = dataEdukasi
    .map((bab, idx) => {
      const isFeatured = bab.featured;
      const insightClass = bab.insight.type === "warning" ? "" : "";
      return `
            <div class="edu-card${isFeatured ? " edu-card-featured" : ""}" data-bab-id="${idx}">
              <div class="edu-card-top">
                <div class="edu-icon">${bab.icon}</div>
                <span class="edu-bab">${bab.babLabel}</span>
              </div>
              <h3>${bab.title}</h3>
              <p>${bab.singkat}</p>
              <div class="edu-insight${isFeatured ? " edu-insight-dark" : ""}">
                <span class="edu-insight-icon">${bab.insight.type === "warning" ? "⚠️" : "💡"}</span>
                <span>${bab.insight.teks}</span>
              </div>
              <div class="edu-tags">
                ${bab.tags.map((t) => `<span class="edu-tag${isFeatured ? " gold" : ""}">${t}</span>`).join("")}
              </div>
              <button class="edu-link btn-pelajari" data-bab-id="${idx}" style="background:none;border:none;cursor:pointer;padding:0;font-family:inherit;">
                Pelajari Lebih Lanjut →
              </button>
            </div>
          `;
    })
    .join("");

  // Pasang event listener ke semua tombol pelajari
  document.querySelectorAll(".btn-pelajari").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const idx = parseInt(btn.getAttribute("data-bab-id"));
      openModal(idx);
    });
  });
}

// ── MODAL ────────────────────────────────────────────────
let currentModalIdx = 0;

function openModal(idx) {
  currentModalIdx = idx;
  const bab = dataEdukasi[idx];
  const overlay = document.getElementById("modalOverlay");
  const body = document.getElementById("modalBody");

  body.innerHTML = `
          <button class="modal-close" id="modalClose" aria-label="Tutup">✕</button>
          <span class="modal-bab-label">${bab.babLabel}</span>
          <h2 class="modal-title" id="modalTitle">${bab.icon} ${bab.title}</h2>

          <div class="modal-section">
            <div class="modal-section-title">📘 Konsep untuk Orang Awam</div>
            <div class="modal-narasi">${bab.narasiLengkap.konsep
              .split("\n")
              .map((p) => (p.trim() ? `<p>${p.trim()}</p>` : ""))
              .join("")}</div>
          </div>

          <div class="modal-section">
            <div class="modal-section-title">📖 Dalil & Landasan Hukum</div>
            <blockquote class="modal-dalil">${bab.narasiLengkap.dalil}</blockquote>
          </div>

          <div class="modal-section">
            <div class="modal-section-title">🔬 Problematika & Analisis Hukum</div>
            <div class="modal-problematika">${bab.narasiLengkap.problematika}</div>
          </div>

          <div class="modal-nav">
            <button class="modal-nav-btn" id="modalPrev" ${idx === 0 ? "disabled" : ""}>← Bab Sebelumnya</button>
            <button class="modal-nav-btn" id="modalNext" ${idx === dataEdukasi.length - 1 ? "disabled" : ""}>Bab Berikutnya →</button>
          </div>
        `;

  overlay.classList.add("active");
  document.body.style.overflow = "hidden";

  // Re-attach close listener
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalPrev")?.addEventListener("click", () => openModal(currentModalIdx - 1));
  document.getElementById("modalNext")?.addEventListener("click", () => openModal(currentModalIdx + 1));
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("active");
  document.body.style.overflow = "";
}

// ── E-BOOK MODE ───────────────────────────────────────────
function openEbookMode() {
  document.getElementById("viewGrid").style.display = "none";
  document.getElementById("viewEbook").style.display = "block";
  window.scrollTo({ top: document.getElementById("edukasi").offsetTop - 80, behavior: "smooth" });
  renderEbookContent();
}

function closeEbookMode() {
  document.getElementById("viewEbook").style.display = "none";
  document.getElementById("viewGrid").style.display = "block";
  window.scrollTo({ top: document.getElementById("edukasi").offsetTop - 80, behavior: "smooth" });
}

function renderEbookContent() {
  const toc = document.getElementById("ebookToc");
  const content = document.getElementById("ebookContent");

  // Render TOC
  toc.innerHTML =
    `<div class="ebook-toc-header">Daftar Isi</div>` +
    dataEdukasi
      .map(
        (bab, idx) => `
            <div class="ebook-toc-link" data-chapter="${idx}">
              <span class="toc-num">${idx + 1}</span>
              <span>${bab.babLabel}: ${bab.title.split("&")[0].trim()}</span>
            </div>
          `,
      )
      .join("");

  // Render chapters
  content.innerHTML = dataEdukasi
    .map(
      (bab, idx) => `
          <article class="ebook-chapter" id="chapter-${idx}">
            <div class="chapter-header">
              <span class="chapter-icon-big">${bab.icon}</span>
              <div>
                <span class="chapter-bab-label">${bab.babLabel}</span>
                <h2 class="chapter-title">${bab.title}</h2>
              </div>
            </div>
            <div class="chapter-body">
              <div class="modal-section">
                <div class="modal-section-title">📘 Konsep untuk Orang Awam</div>
                <div class="modal-narasi">${bab.narasiLengkap.konsep
                  .split("\n")
                  .map((p) => (p.trim() ? `<p>${p.trim()}</p>` : ""))
                  .join("")}</div>
              </div>
              <div class="modal-section">
                <div class="modal-section-title">📖 Dalil & Landasan Hukum</div>
                <blockquote class="modal-dalil">${bab.narasiLengkap.dalil}</blockquote>
              </div>
              <div class="modal-section">
                <div class="modal-section-title">🔬 Problematika & Analisis Hukum</div>
                <div class="modal-problematika">${bab.narasiLengkap.problematika}</div>
              </div>
            </div>
            ${idx < dataEdukasi.length - 1 ? '<hr class="chapter-divider">' : ""}
          </article>
        `,
    )
    .join("");

  // IntersectionObserver untuk TOC aktif
  const tocLinks = toc.querySelectorAll(".ebook-toc-link");
  // Klik TOC -> scroll ke bab (sebelumnya inline onclick="scrollToChapter(idx)")
  tocLinks.forEach((link) => {
    link.addEventListener("click", () => scrollToChapter(Number(link.dataset.chapter)));
  });
  const chapters = content.querySelectorAll(".ebook-chapter");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = parseInt(entry.target.id.replace("chapter-", ""));
          tocLinks.forEach((l) => l.classList.remove("active"));
          toc.querySelector(`[data-chapter="${id}"]`)?.classList.add("active");
        }
      });
    },
    { threshold: 0.25 },
  );
  chapters.forEach((ch) => observer.observe(ch));
}

function scrollToChapter(idx) {
  const el = document.getElementById(`chapter-${idx}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── INISIALISASI ──────────────────────────────────────────
export function initializeEducation() {
  renderEduGrid();

  // Tombol E-Book Mode
  document.getElementById("btnEbookMode")?.addEventListener("click", openEbookMode);
  document.getElementById("btnEbookMode2")?.addEventListener("click", openEbookMode);
  document.getElementById("btnBackGrid")?.addEventListener("click", closeEbookMode);

  // Tutup modal klik di overlay
  document.getElementById("modalOverlay")?.addEventListener("click", (e) => {
    if (e.target === document.getElementById("modalOverlay")) closeModal();
  });

  // Tutup modal dengan Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}
