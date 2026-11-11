import { AssessmentProject } from '../types/assessment';

export const SAMPLE_PROJECT_KBC_HINDU: AssessmentProject = {
  id: 'contoh-kbc-hindu-vii',
  title: 'Asesmen Sumatif Sejarah Kebudayaan Hindu & Insersi Panca Cinta',
  status: 'final',
  isExample: true,
  createdAt: '2026-03-01T08:00:00.000Z',
  updatedAt: '2026-03-01T10:30:00.000Z',

  // Identitas Satuan Pendidikan & Guru
  satuanPendidikan: 'Madyama Widyalaya Negeri 1 Denpasar',
  satuanKerja: 'Kantor Wilayah Kementerian Agama Provinsi Bali',
  namaGuru: 'Bella Asiah',
  nipGuru: '19850412 201001 2 015',
  namaKepalaSekolah: 'Dr. I Wayan Sutarwan, M.Pd.',
  nipKepalaSekolah: '19740815 199903 1 004',
  tahunAjaran: '2026/2027',
  semester: '1 (Ganjil)',
  jenjang: 'SMP / Madyama Widyalaya',
  kelas: 'Fase D - Kelas VII',
  mataPelajaran: 'Sejarah Kebudayaan Hindu',
  jenisAsesmen: 'Sumatif Tengah Semester (STS)',
  kurikulum: 'Kurikulum Berbasis Cinta (KBC) Widyalaya',
  alokasiWaktu: '2 JP (80 Menit)',
  bukuAcuan: 'Buku Teks Utama Sejarah Kebudayaan Hindu Kelas VII Ditjen Bimas Hindu 2025 & Panduan KBC Widyalaya 2026',

  // Muatan Pembelajaran & KBC
  capaianPembelajaran: 'Peserta didik memahami sejarah perkembangan Agama Hindu di Asia Selatan, mengidentifikasi bukti-bukti peninggalan peradaban Lembah Sungai Sindhu, dan menginternalisasikan nilai-nilai Panca Cinta dalam menjaga warisan budaya adiluhung Nusantara.',
  tujuanPembelajaranList: [
    'Menjelaskan latar belakang dan perkembangan Agama Hindu di Asia Selatan (Lembah Sungai Sindhu).',
    'Mengidentifikasi peninggalan-peninggalan sejarah kebudayaan Hindu di Mohenjo Daro dan Harappa.',
    'Menganalisis nilai luhur toleransi dan harmoni (Tat Twam Asi & Tri Hita Karana) yang terkandung dalam peninggalan sejarah.',
    'Menampilkan keteladanan cinta ilmu dan rasa syukur atas keberagaman budaya peradaban manusia.'
  ],
  materiPokok: 'Sejarah Perkembangan Agama Hindu di Asia Selatan & Peninggalan Mohenjo Daro - Harappa',
  kbcTopic: 'Cinta Tuhan & Cinta Ilmu (Panca Cinta)',
  materiInsersiKBC: '1. Karakter religius melalui seni & budaya kearifan lokal. 2. Sejarah sebagai pelestarian pengetahuan dan karakter sosial (Tat Twam Asi).',
  referensiTeks: 'Peradaban Lembah Sungai Sindhu (Indus Valley Civilization) berpusat di kota kembar Mohenjo-Daro dan Harappa. Peradaban ini menunjukkan tata kota yang sangat maju, sistem sanitasi sauca (kebersihan), dan arsitektur pemandian umum (The Great Bath) yang mencerminkan pemurnian spiritual. Temuan Arca Pendeta Raja dan stempel pasupati menyiratkan pemujaan kepada Siwa Purba.',

  // Parameter Distribusi Asesmen
  jumlahSoal: 8,
  distribusiBentuk: {
    pg: 5,
    pgk: 1,
    uraian: 2,
    menjodohkan: 0,
    isian: 0,
    benarSalah: 0
  },
  distribusiLevel: {
    C1_C2: 3,
    C3_C4: 3,
    C5_C6: 2
  },
  skorMaksimal: 100,
  kktp: 75,
  rumusNilai: 'Nilai = (Skor Perolehan / Skor Maksimal) x 100',
  ketentuanTambahan: 'Soal disusun mengedepankan stimulus kontekstual, nilai cinta ilmu, dan penguatan karakter tanpa bias sara.',

  // 1. Kisi-Kisi
  kisiKisi: [
    {
      id: 'kisi-1',
      no: 1,
      capaianPembelajaran: 'Peserta didik memahami sejarah perkembangan Agama Hindu di Asia Selatan',
      tujuanPembelajaran: 'Menjelaskan latar belakang dan perkembangan Agama Hindu di Asia Selatan',
      materiAjar: 'Peradaban Lembah Sungai Sindhu',
      indikatorSoal: 'Disajikan narasi geografis, peserta didik dapat mengidentifikasi letak utama peradaban awal Hindu di Asia Selatan dengan tepat.',
      levelKognitif: 'C2',
      bentukSoal: 'PG',
      noSoal: 1
    },
    {
      id: 'kisi-2',
      no: 2,
      capaianPembelajaran: 'Peserta didik memahami sejarah perkembangan Agama Hindu di Asia Selatan',
      tujuanPembelajaran: 'Mengidentifikasi peninggalan-peninggalan sejarah kebudayaan Hindu di Mohenjo Daro dan Harappa',
      materiAjar: 'Tata Kota Mohenjo Daro & Harappa',
      indikatorSoal: 'Disajikan deskripsi tata kota kuno, peserta didik dapat menganalisis bukti kemajuan sistem sanitasi dan hubungannya dengan nilai Sauca (kebersihan).',
      levelKognitif: 'C4',
      bentukSoal: 'PG',
      noSoal: 2
    },
    {
      id: 'kisi-3',
      no: 3,
      capaianPembelajaran: 'Peserta didik memahami sejarah perkembangan Agama Hindu di Asia Selatan',
      tujuanPembelajaran: 'Mengidentifikasi peninggalan-peninggalan sejarah kebudayaan Hindu di Mohenjo Daro dan Harappa',
      materiAjar: 'Artefak Peninggalan Lembah Sindhu',
      indikatorSoal: 'Peserta didik dapat menentukan fungsi stempel bergambar tokoh bertanduk yang duduk bersila (Pasupati) dalam sistem religius awal.',
      levelKognitif: 'C3',
      bentukSoal: 'PG',
      noSoal: 3
    },
    {
      id: 'kisi-4',
      no: 4,
      capaianPembelajaran: 'Peserta didik memahami sejarah perkembangan Agama Hindu di Asia Selatan',
      tujuanPembelajaran: 'Menjelaskan latar belakang dan perkembangan Agama Hindu di Asia Selatan',
      materiAjar: 'Kedatangan Bangsa Arya dan Kebudayaan Weda',
      indikatorSoal: 'Peserta didik dapat mengkorelasikan percampuran bangsa Arya dan Dravida yang melahirkan kebudayaan Weda yang kaya.',
      levelKognitif: 'C3',
      bentukSoal: 'PG',
      noSoal: 4
    },
    {
      id: 'kisi-5',
      no: 5,
      capaianPembelajaran: 'Peserta didik memahami sejarah perkembangan Agama Hindu di Asia Selatan',
      tujuanPembelajaran: 'Menganalisis nilai luhur toleransi dan harmoni (Tat Twam Asi & Tri Hita Karana)',
      materiAjar: 'Nilai Panca Cinta dalam Sejarah Hindu',
      indikatorSoal: 'Disajikan studi kasus konflik modern, peserta didik dapat memilih penerapan ajaran Tat Twam Asi sebagai resolusi damai berbasis cinta kasih.',
      levelKognitif: 'C4',
      bentukSoal: 'PG',
      noSoal: 5
    },
    {
      id: 'kisi-6',
      no: 6,
      capaianPembelajaran: 'Peserta didik memahami sejarah perkembangan Agama Hindu di Asia Selatan',
      tujuanPembelajaran: 'Mengidentifikasi peninggalan-peninggalan sejarah kebudayaan Hindu di Mohenjo Daro dan Harappa',
      materiAjar: 'Ciri-Ciri Peradaban Lembah Sungai Sindhu',
      indikatorSoal: 'Disajikan beberapa pernyataan artefak, peserta didik dapat memilih semua pernyataan yang benar mengenai peninggalan Mohenjo Daro.',
      levelKognitif: 'C3',
      bentukSoal: 'PGK',
      noSoal: 6
    },
    {
      id: 'kisi-7',
      no: 7,
      capaianPembelajaran: 'Peserta didik memahami sejarah perkembangan Agama Hindu di Asia Selatan',
      tujuanPembelajaran: 'Menganalisis nilai luhur toleransi dan harmoni (Tat Twam Asi & Tri Hita Karana)',
      materiAjar: 'Konsep The Great Bath & Pemurnian Spiritual',
      indikatorSoal: 'Disajikan stimulus arsitektur pemandian umum kuno, peserta didik dapat menguraikan hubungan antara pelestarian air bersih dengan nilai Palemahan (Tri Hita Karana).',
      levelKognitif: 'C5',
      bentukSoal: 'Uraian',
      noSoal: 7
    },
    {
      id: 'kisi-8',
      no: 8,
      capaianPembelajaran: 'Peserta didik memahami sejarah perkembangan Agama Hindu di Asia Selatan',
      tujuanPembelajaran: 'Menampilkan keteladanan cinta ilmu dan rasa syukur atas keberagaman budaya peradaban manusia',
      materiAjar: 'Hikmah Pembelajaran Sejarah & Cinta Ilmu',
      indikatorSoal: 'Peserta didik dapat merumuskan 3 hikmah mempelajari sejarah peradaban Hindu kuno bagi penguatan karakter cinta tanah air dan pelestarian cagar budaya Nusantara.',
      levelKognitif: 'C6',
      bentukSoal: 'Uraian',
      noSoal: 8
    }
  ],

  // 2. Soal Items (Naskah Soal & Kartu Soal)
  soalItems: [
    {
      id: 'soal-1',
      noSoal: 1,
      bentukSoal: 'PG',
      stimulus: 'Peradaban kuno di Asia Selatan berkembang di sekitar aliran sungai besar yang subur, berhulu di Pegunungan Himalaya dan bermuara di Laut Arab.',
      pertanyaan: 'Aliran sungai yang menjadi pusat lahir dan berkembangnya peradaban perintis agama Hindu di India utara adalah...',
      pilihanJawaban: [
        { key: 'A', text: 'Sungai Gangga dan Sungai Yamuna' },
        { key: 'B', text: 'Sungai Sindhu (Indus)' },
        { key: 'C', text: 'Sungai Brahmaputra' },
        { key: 'D', text: 'Sungai Godavari' }
      ],
      kunciJawaban: 'B',
      pembahasan: 'Peradaban tertua yang menjadi akar kebudayaan Hindu di Asia Selatan berpusat di Lembah Sungai Sindhu (Indus Valley) pada kurun waktu 3000-1500 SM.',
      levelKognitif: 'C2',
      materi: 'Peradaban Lembah Sungai Sindhu',
      indikatorSoal: 'Disajikan narasi geografis, peserta didik dapat mengidentifikasi letak utama peradaban awal Hindu di Asia Selatan dengan tepat.',
      skorMaksimal: 10,
      needsTeacherCheck: false
    },
    {
      id: 'soal-2',
      noSoal: 2,
      bentukSoal: 'PG',
      stimulus: 'Penggalian arkeologis di Mohenjo Daro membuktikan adanya sistem saluran pembuangan tertutup di bawah jalan utama, sumur resapan, serta tempat sampah di sudut-sudut perumahan.',
      pertanyaan: 'Tata kota yang sangat teratur tersebut membuktikan bahwa masyarakat Lembah Sungai Sindhu telah mengamalkan nilai ajaran...',
      pilihanJawaban: [
        { key: 'A', text: 'Ahimsa (tanpa kekerasan)' },
        { key: 'B', text: 'Sauca (kebersihan lahir dan batin)' },
        { key: 'C', text: 'Satya (kebenaran kata)' },
        { key: 'D', text: 'Aparigraha (kesederhanaan)' }
      ],
      kunciJawaban: 'B',
      pembahasan: 'Sistem sanitasi canggih dan saluran tertutup merupakan bukti penerapan nilai Sauca, yaitu menjaga kesucian dan kebersihan lingkungan hidup sebagai wujud cinta alam.',
      levelKognitif: 'C4',
      materi: 'Tata Kota Mohenjo Daro & Harappa',
      indikatorSoal: 'Disajikan deskripsi tata kota kuno, peserta didik dapat menganalisis bukti kemajuan sistem sanitasi dan hubungannya dengan nilai Sauca.',
      skorMaksimal: 10,
      needsTeacherCheck: false
    },
    {
      id: 'soal-3',
      noSoal: 3,
      bentukSoal: 'PG',
      stimulus: 'Di reruntuhan Mohenjo Daro ditemukan stempel dari batu steatit yang menggambarkan sosok bertanduk tiga duduk dalam posisi yogisana dikelilingi oleh binatang seperti gajah, harimau, dan badak.',
      pertanyaan: 'Para sejarawan menyimpulkan bahwa stempel tersebut merupakan representasi awal dari pemujaan kepada...',
      pilihanJawaban: [
        { key: 'A', text: 'Dewa Brahma Sang Pencipta' },
        { key: 'B', text: 'Dewa Wisnu Sang Pemelihara' },
        { key: 'C', text: 'Pasupati (bentuk proto/kuno Dewa Siwa)' },
        { key: 'D', text: 'Dewa Indra penguasa petir' }
      ],
      kunciJawaban: 'C',
      pembahasan: 'Stempel Pasupati Seal menggambarkan figur yang menjadi proto-Siwa atau penguasa para satwa (Pasupati) yang hidup berdampingan secara damai.',
      levelKognitif: 'C3',
      materi: 'Artefak Peninggalan Lembah Sindhu',
      indikatorSoal: 'Peserta didik dapat menentukan fungsi stempel bergambar tokoh bertanduk yang duduk bersila dalam sistem religius awal.',
      skorMaksimal: 10,
      needsTeacherCheck: false
    },
    {
      id: 'soal-4',
      noSoal: 4,
      bentukSoal: 'PG',
      stimulus: 'Sekitar tahun 1500 SM, Bangsa Arya memasuki wilayah India utara dan berinteraksi secara intensif dengan penduduk asli Bangsa Dravida.',
      pertanyaan: 'Dampak positif dari percampuran kebudayaan antara Bangsa Arya dan Bangsa Dravida terhadap peradaban rohani Hindu adalah...',
      pilihanJawaban: [
        { key: 'A', text: 'Terhapusnya seluruh tradisi lokal bangsa Dravida tanpa bekas' },
        { key: 'B', text: 'Lahirnya sintesis peradaban agung dengan kodifikasi Kitab Suci Weda' },
        { key: 'C', text: 'Pemisahan wilayah secara mutlak antara dua bangsa' },
        { key: 'D', text: 'Berhentinya perkembangan seni pahat dan arsitektur batu' }
      ],
      kunciJawaban: 'B',
      pembahasan: 'Akulturasi damai kedua bangsa melahirkan peradaban Weda yang menggabungkan kedalaman filosofis Arya dengan tradisi devosional Dravida.',
      levelKognitif: 'C3',
      materi: 'Kedatangan Bangsa Arya dan Kebudayaan Weda',
      indikatorSoal: 'Peserta didik dapat mengkorelasikan percampuran bangsa Arya dan Dravida yang melahirkan kebudayaan Weda.',
      skorMaksimal: 10,
      needsTeacherCheck: false
    },
    {
      id: 'soal-5',
      noSoal: 5,
      bentukSoal: 'PG',
      stimulus: 'Dalam masyarakat multikultural saat ini, perbedaan latar belakang suku dan tradisi kerap kali memicu perselisihan jika tidak dilandasi rasa saling menghargai.',
      pertanyaan: 'Nilai Kurikulum Berbasis Cinta (KBC) yang bersumber dari ajaran "Tat Twam Asi" (Ia adalah kamu, kamu adalah dia) mengajarkan peserta didik agar...',
      pilihanJawaban: [
        { key: 'A', text: 'Memaksakan pandangan pribadi demi menjaga keseragaman di kelas' },
        { key: 'B', text: 'Memperlakukan orang lain sebagaimana kita ingin diperlakukan dengan penuh welas asih' },
        { key: 'C', text: 'Menghindari pergaulan dengan teman yang berbeda kebiasaan ibadah' },
        { key: 'D', text: 'Mengabaikan persoalan lingkungan asalkan tugas sekolah selesai' }
      ],
      kunciJawaban: 'B',
      pembahasan: 'Tat Twam Asi merupakan wujud nyata The Golden Rule dalam Hindu: memandang Atman dalam diri sesama adalah sama sehingga melahirkan cinta kasih sejati.',
      levelKognitif: 'C4',
      materi: 'Nilai Panca Cinta dalam Sejarah Hindu',
      indikatorSoal: 'Disajikan studi kasus konflik modern, peserta didik dapat memilih penerapan ajaran Tat Twam Asi sebagai resolusi damai.',
      skorMaksimal: 10,
      needsTeacherCheck: false
    },
    {
      id: 'soal-6',
      noSoal: 6,
      bentukSoal: 'PGK',
      stimulus: 'Perhatikan daftar temuan peninggalan peradaban Lembah Sungai Sindhu berikut ini.',
      pertanyaan: 'Manakah dari pernyataan berikut yang merupakan fakta sejarah tentang peninggalan Mohenjo Daro dan Harappa? (Pilih semua yang benar)',
      pilihanKompleks: [
        { text: 'Ditemukannya kolam pemandian umum besar (The Great Bath) yang dilapisi aspal alami kedap air', isCorrect: true },
        { text: 'Bangunan rumah penduduk dibuat dari batu bata tanah liat yang telah dibakar dengan ukuran standar', isCorrect: true },
        { text: 'Ditemukan piramida raksasa bertingkat sebagai tempat pemakaman para raja perang', isCorrect: false },
        { text: 'Ditemukan patung perunggu penari wanita (Dancing Girl) berukuran mungil dengan pose dinamis', isCorrect: true }
      ],
      kunciJawaban: 'Pernyataan 1, 2, dan 4 benar; Pernyataan 3 salah.',
      pembahasan: 'Peradaban Sindhu terkenal dengan The Great Bath, bata merah standar, dan patung Dancing Girl. Peradaban ini tidak membangun piramida makam.',
      levelKognitif: 'C3',
      materi: 'Ciri-Ciri Peradaban Lembah Sungai Sindhu',
      indikatorSoal: 'Disajikan beberapa pernyataan artefak, peserta didik dapat memilih semua pernyataan yang benar mengenai peninggalan Mohenjo Daro.',
      skorMaksimal: 15,
      needsTeacherCheck: false
    },
    {
      id: 'soal-7',
      noSoal: 7,
      bentukSoal: 'Uraian',
      stimulus: 'Arkeolog menemukan struktur The Great Bath di Mohenjo Daro dengan tangga turun di kedua ujungnya, dikelilingi serambi dan ruang ganti. Air disuplai dari sumur khusus dan dialirkan kembali melalui pipa pembilasan.',
      pertanyaan: 'Analisis kaitan antara konstruksi The Great Bath tersebut dengan pilar "Palemahan" dalam konsep Tri Hita Karana dan nilai kesucian spiritual air!',
      kunciJawaban: 'The Great Bath mencerminkan hubungan harmonis manusia dengan alam (Palemahan) di mana air diperlakukan secara terhormat dan dikelola dengan sistem drainase bersih. Dalam spiritualitas Hindu, air bukan hanya kebutuhan biologis melainkan sarana pembersihan raga dan batin (Sauca / Tirtha). Pelestarian sumber daya air secara bijak adalah perwujudan cinta lingkungan semesta.',
      pembahasan: 'Jawaban harus mengaitkan 3 poin utama: 1) Manajemen kebersihan air, 2) Konsep Palemahan Tri Hita Karana, 3) Makna penyucian batin.',
      levelKognitif: 'C5',
      materi: 'Konsep The Great Bath & Pemurnian Spiritual',
      indikatorSoal: 'Disajikan stimulus arsitektur pemandian umum kuno, peserta didik dapat menguraikan hubungan antara pelestarian air bersih dengan nilai Palemahan.',
      skorMaksimal: 15,
      needsTeacherCheck: false
    },
    {
      id: 'soal-8',
      noSoal: 8,
      bentukSoal: 'Uraian',
      stimulus: 'Sebagai penerus bangsa di era modern 2026, kita memiliki tanggung jawab moral untuk merawat ribuan situs cagar budaya peninggalan Hindu di Nusantara seperti Candi Prambanan, Muara Takus, Candi Penataran, hingga Pura Besakih.',
      pertanyaan: 'Rumuskan 3 (tiga) tindakan konkret yang dapat kamu lakukan sebagai pelajar di lingkungan sekolah maupun masyarakat sebagai wujud "Cinta Ilmu" dan "Cinta Tanah Air" dalam melestarikan warisan peradaban sejarah!',
      kunciJawaban: '1. Cinta Ilmu: Rajin membaca dan meneliti literasi sejarah kebudayaan dari sumber terpercaya serta memanfaatkan media digital secara positif untuk membuat konten edukasi cagar budaya. 2. Cinta Tanah Air: Tidak mencorat-coret (vandalisme), menjaga kebersihan saat mengunjungi situs bersejarah, dan menghormati tata krama sakral. 3. Kolaborasi: Mengajak teman lintas agama berdialog dan berkunjung saling menghargai kekayaan peradaban bangsa.',
      pembahasan: 'Kriteria jawaban dinilai berdasarkan relevansi dengan 3 ranah: kognitif/literasi, perilaku nyata di situs cagar budaya, dan semangat persatuan Bhinneka Tunggal Ika.',
      levelKognitif: 'C6',
      materi: 'Hikmah Pembelajaran Sejarah & Cinta Ilmu',
      indikatorSoal: 'Peserta didik dapat merumuskan 3 hikmah mempelajari sejarah peradaban Hindu kuno bagi penguatan karakter cinta tanah air.',
      skorMaksimal: 20,
      needsTeacherCheck: false
    }
  ],

  // 3. Rubrik Penilaian
  rubrikList: [
    {
      id: 'rubrik-soal-7',
      noSoal: 7,
      aspek: 'Kesesuaian Analisis Konsep Palemahan & The Great Bath',
      kriteriaSkor: [
        { skor: 15, deskripsi: 'Analisis sangat lengkap: menjelaskan fungsi arsitektur, menghubungkan dengan konsep Palemahan Tri Hita Karana, dan memaknai air sebagai sarana penyucian spiritual dengan runut.' },
        { skor: 10, deskripsi: 'Analisis cukup lengkap: menghubungkan arsitektur dengan konsep alam dan air, namun penjelasan nilai Tri Hita Karana kurang mendalam.' },
        { skor: 5, deskripsi: 'Analisis terbatas: hanya menyebutkan fakta fisik pemandian tanpa mengaitkan dengan nilai Palemahan dan spiritualitas.' },
        { skor: 0, deskripsi: 'Tidak menjawab atau jawaban tidak sesuai konteks pertanyaan.' }
      ]
    },
    {
      id: 'rubrik-soal-8',
      noSoal: 8,
      aspek: 'Perumusan Tindakan Konkret Cinta Ilmu & Cinta Tanah Air',
      kriteriaSkor: [
        { skor: 20, deskripsi: 'Merumuskan 3 tindakan yang sangat orisinal, terukur, dan realistis mencakup aspek literasi (cinta ilmu), etika pelestarian (anti-vandalisme), dan kerukunan bangsa.' },
        { skor: 14, deskripsi: 'Merumuskan 2 tindakan konkret dengan penjelasan logis dan relevan.' },
        { skor: 7, deskripsi: 'Merumuskan 1 tindakan konkret atau uraian masih bersifat umum/normatif.' },
        { skor: 0, deskripsi: 'Tidak menjawab atau jawaban tidak relevan.' }
      ]
    }
  ],

  // 4. Rekap Siswa
  rekapSiswaList: [
    { id: 'siswa-1', no: 1, nama: 'Ni Kadek Arisanti', nisn: '0087612341', skorDiperoleh: 95, nilai: 95, status: 'Tuntas', catatan: 'Sangat menguasai analisis sejarah & nilai KBC' },
    { id: 'siswa-2', no: 2, nama: 'I Made Raditya Putra', nisn: '0087612342', skorDiperoleh: 85, nilai: 85, status: 'Tuntas', catatan: 'Pilihan ganda sempurna, uraian no. 8 perlu pengayaan' },
    { id: 'siswa-3', no: 3, nama: 'I Gede Bayu Permana', nisn: '0087612343', skorDiperoleh: 78, nilai: 78, status: 'Tuntas', catatan: 'Memenuhi KKTP, pemahaman tata kota baik' },
    { id: 'siswa-4', no: 4, nama: 'Ni Putu Sinta Dewi', nisn: '0087612344', skorDiperoleh: 70, nilai: 70, status: 'Belum Tuntas', catatan: 'Perlu bimbingan remedial pada indikator analisis arsitektur kuno' },
    { id: 'siswa-5', no: 5, nama: 'I Komang Dharma Yoga', nisn: '0087612345', skorDiperoleh: 90, nilai: 90, status: 'Tuntas', catatan: 'Pemikiran reflektif cinta lingkungan sangat mendalam' }
  ],

  includeLJK: true,
  syncWarnings: [],
  lastValidatedAt: '2026-03-01T10:30:00.000Z',
  validatorNotes: 'Semua 8 butir soal selaras dengan indikator kisi-kisi dan alokasi skor total pas 100 poin.'
};

export const SAMPLE_PROJECT_INFORMATIKA: AssessmentProject = {
  id: 'contoh-informatika-vii',
  title: 'Asesmen Sumatif Informatika - Berpikir Komputasional & Perangkat Keras',
  status: 'final',
  isExample: true,
  createdAt: '2026-02-15T09:00:00.000Z',
  updatedAt: '2026-02-15T11:45:00.000Z',

  satuanPendidikan: 'SMP Negeri 1 Widyaswara',
  satuanKerja: 'Dinas Pendidikan dan Kebudayaan',
  namaGuru: 'Bella Asiah',
  nipGuru: '19850412 201001 2 015',
  namaKepalaSekolah: 'Muhamad Shofiyudin, S.Pd.',
  nipKepalaSekolah: '19790610 200312 1 008',
  tahunAjaran: '2026/2027',
  semester: '2 (Genap)',
  jenjang: 'SMP / Madyama Widyalaya',
  kelas: 'Fase D - Kelas VII',
  mataPelajaran: 'Informatika',
  jenisAsesmen: 'Sumatif Akhir Semester (SAS)',
  kurikulum: 'Kurikulum Merdeka',
  alokasiWaktu: '90 Menit',
  bukuAcuan: 'Buku Guru dan Buku Siswa Informatika Kelas VII Kemendikbudristek 2024',

  capaianPembelajaran: 'Peserta didik mampu menerapkan berpikir komputasional untuk menghasilkan beberapa solusi dalam menyelesaikan persoalan dengan data diskrit bervolume kecil dan mendisposisikan berpikir komputasional dalam bidang lain terutama dalam literasi sains; serta mendeskripsikan komponen, fungsi, dan cara kerja komputer.',
  tujuanPembelajaranList: [
    'Mengenal dan mengimplementasikan konsep fungsi (input-proses-output) sebagai mesin komputasi.',
    'Memodelkan persoalan logika dalam bentuk himpunan dan representasi bilangan.',
    'Memahami konsep perangkat lunak aplikasi perkantoran untuk pengolahan data dan presentasi.',
    'Mendeskripsikan fungsi komponen perangkat keras sistem komputer (input, proses, storage, output).'
  ],
  materiPokok: 'Berpikir Komputasional, Perangkat Lunak Aplikasi, Sistem Komputer & Jaringan',
  kbcTopic: 'Cinta Ilmu (Literasi Digital & Etika Komputasi)',
  materiInsersiKBC: 'Pemanfaatan teknologi secara bijak, perlindungan data pribadi, dan kolaborasi gotong royong.',
  referensiTeks: 'Materi mencakup konsep mesin komputasi matematis f(x), representasi himpunan biner/desimal, software perkantoran (word processor, spreadsheet, presentation), komponen hardware CPU, RAM, SSD, GPU, serta perangkat I/O.',

  jumlahSoal: 6,
  distribusiBentuk: {
    pg: 4,
    pgk: 0,
    uraian: 2,
    menjodohkan: 0,
    isian: 0,
    benarSalah: 0
  },
  distribusiLevel: {
    C1_C2: 2,
    C3_C4: 3,
    C5_C6: 1
  },
  skorMaksimal: 100,
  kktp: 75,
  rumusNilai: 'Nilai = (Skor Perolehan / Skor Maksimal) x 100',
  ketentuanTambahan: 'Mengikuti struktur standar format kisi-kisi dan kartu soal Kurikulum Merdeka.',

  kisiKisi: [
    {
      id: 'inf-kisi-1',
      no: 1,
      capaianPembelajaran: 'Peserta didik mampu menerapkan berpikir komputasional',
      tujuanPembelajaran: 'Mengenal dan mengimplementasikan konsep fungsi (input-proses-output)',
      materiAjar: 'Fungsi sebagai Mesin Komputasi',
      indikatorSoal: 'Peserta didik dapat menentukan nilai keluaran (output) dari mesin fungsi dengan aturan pengali dan penambah tertentu.',
      levelKognitif: 'C2',
      bentukSoal: 'PG',
      noSoal: 1
    },
    {
      id: 'inf-kisi-2',
      no: 2,
      capaianPembelajaran: 'Peserta didik mampu menerapkan berpikir komputasional',
      tujuanPembelajaran: 'Memodelkan persoalan logika dalam bentuk himpunan',
      materiAjar: 'Logika Himpunan & Sistem Bilangan',
      indikatorSoal: 'Peserta didik dapat menyelesaikan irisan himpunan minat kegiatan siswa di laboratorium TIK.',
      levelKognitif: 'C3',
      bentukSoal: 'PG',
      noSoal: 2
    },
    {
      id: 'inf-kisi-3',
      no: 3,
      capaianPembelajaran: 'Peserta didik mampu menerapkan praktik baik perkakas TIK',
      tujuanPembelajaran: 'Memahami konsep perangkat lunak aplikasi perkantoran',
      materiAjar: 'Aplikasi Pengolah Angka (Spreadsheet)',
      indikatorSoal: 'Disajikan tabel data, peserta didik dapat memilih formula rata-rata dan penjumlahan yang tepat.',
      levelKognitif: 'C3',
      bentukSoal: 'PG',
      noSoal: 3
    },
    {
      id: 'inf-kisi-4',
      no: 4,
      capaianPembelajaran: 'Peserta didik mampu mendeskripsikan komponen sistem komputer',
      tujuanPembelajaran: 'Mendeskripsikan fungsi perangkat keras komputer',
      materiAjar: 'Hardware Komputer (Storage & Memory)',
      indikatorSoal: 'Peserta didik dapat membedakan karakteristik kecepatan dan sifat penyimpanan antara RAM dan SSD.',
      levelKognitif: 'C2',
      bentukSoal: 'PG',
      noSoal: 4
    },
    {
      id: 'inf-kisi-5',
      no: 5,
      capaianPembelajaran: 'Peserta didik mampu menerapkan berpikir komputasional',
      tujuanPembelajaran: 'Memodelkan persoalan logika dalam bentuk representasi bilangan',
      materiAjar: 'Konversi Bilangan Biner ke Desimal',
      indikatorSoal: 'Disajikan bilangan biner 8-bit, peserta didik dapat menguraikan langkah konversi matematis ke bilangan desimal.',
      levelKognitif: 'C3',
      bentukSoal: 'Uraian',
      noSoal: 5
    },
    {
      id: 'inf-kisi-6',
      no: 6,
      capaianPembelajaran: 'Peserta didik mampu mendeskripsikan komponen sistem komputer',
      tujuanPembelajaran: 'Mendeskripsikan fungsi perangkat keras komputer',
      materiAjar: 'Troubleshooting & Analisis Kebutuhan Sistem Komputer',
      indikatorSoal: 'Disajikan studi kasus komputer lambat, peserta didik dapat mengevaluasi penyebab bottleneck dan merekomendasikan solusi upgrade yang efektif.',
      levelKognitif: 'C5',
      bentukSoal: 'Uraian',
      noSoal: 6
    }
  ],

  soalItems: [
    {
      id: 'inf-soal-1',
      noSoal: 1,
      bentukSoal: 'PG',
      stimulus: 'Sebuah mesin komputasi f(x) memiliki mekanisme kerja: masukkan nilai x, kalikan dengan 3, lalu kurangi dengan 5.',
      pertanyaan: 'Jika input yang dimasukkan ke dalam mesin fungsi adalah x = 7, maka output yang dihasilkan adalah...',
      pilihanJawaban: [
        { key: 'A', text: '14' },
        { key: 'B', text: '16' },
        { key: 'C', text: '21' },
        { key: 'D', text: '26' }
      ],
      kunciJawaban: 'B',
      pembahasan: 'f(7) = (7 x 3) - 5 = 21 - 5 = 16.',
      levelKognitif: 'C2',
      materi: 'Fungsi sebagai Mesin Komputasi',
      indikatorSoal: 'Peserta didik dapat menentukan nilai keluaran (output) dari mesin fungsi.',
      skorMaksimal: 10,
      needsTeacherCheck: false
    },
    {
      id: 'inf-soal-2',
      noSoal: 2,
      bentukSoal: 'PG',
      stimulus: 'Di kelas VII A terdapat 30 siswa. 18 siswa mengikuti ekstrakurikuler Robotika, 15 siswa mengikuti Desain Grafis, dan 5 siswa tidak mengikuti keduanya.',
      pertanyaan: 'Berapa banyak siswa yang mengikuti kedua ekstrakurikuler (Robotika dan Desain Grafis) sekaligus?',
      pilihanJawaban: [
        { key: 'A', text: '5 siswa' },
        { key: 'B', text: '8 siswa' },
        { key: 'C', text: '10 siswa' },
        { key: 'D', text: '12 siswa' }
      ],
      kunciJawaban: 'B',
      pembahasan: 'Total siswa yang ikut ekskul = 30 - 5 = 25. Jumlah anggota gabungan n(A ∪ B) = n(A) + n(B) - n(A ∩ B) -> 25 = 18 + 15 - n(A ∩ B) -> 25 = 33 - n(A ∩ B) -> n(A ∩ B) = 8 siswa.',
      levelKognitif: 'C3',
      materi: 'Logika Himpunan & Sistem Bilangan',
      indikatorSoal: 'Peserta didik dapat menyelesaikan irisan himpunan minat kegiatan siswa.',
      skorMaksimal: 10,
      needsTeacherCheck: false
    },
    {
      id: 'inf-soal-3',
      noSoal: 3,
      bentukSoal: 'PG',
      stimulus: 'Seorang guru ingin menghitung nilai rata-rata ulangan siswa yang berada pada sel D2 sampai dengan D31 pada aplikasi spreadsheet.',
      pertanyaan: 'Formula atau rumus yang paling tepat diketikkan pada lembar kerja adalah...',
      pilihanJawaban: [
        { key: 'A', text: '=SUM(D2:D31)' },
        { key: 'B', text: '=AVERAGE(D2:D31)' },
        { key: 'C', text: '=COUNT(D2:D31)' },
        { key: 'D', text: '=MEDIAN(D2:D31)' }
      ],
      kunciJawaban: 'B',
      pembahasan: 'Fungsi AVERAGE digunakan untuk mencari rata-rata nilai dalam suatu rentang (range) sel.',
      levelKognitif: 'C3',
      materi: 'Aplikasi Pengolah Angka (Spreadsheet)',
      indikatorSoal: 'Peserta didik dapat memilih formula rata-rata yang tepat.',
      skorMaksimal: 10,
      needsTeacherCheck: false
    },
    {
      id: 'inf-soal-4',
      noSoal: 4,
      bentukSoal: 'PG',
      stimulus: 'Sistem komputer membutuhkan memori utama berkecepatan tinggi dan media penyimpanan sekunder yang mampu menyimpan data permanen.',
      pertanyaan: 'Perbedaan mendasar antara RAM (Random Access Memory) dengan SSD (Solid State Drive) adalah...',
      pilihanJawaban: [
        { key: 'A', text: 'RAM bersifat volatile (data hilang saat listrik mati), sedangkan SSD bersifat non-volatile' },
        { key: 'B', text: 'RAM digunakan untuk menyimpan sistem operasi secara permanen, SSD untuk instruksi sementara' },
        { key: 'C', text: 'Kecepatan akses SSD jauh lebih cepat puluhan kali lipat dibandingkan RAM' },
        { key: 'D', text: 'RAM memiliki kapasitas jauh lebih besar dalam skala Terabyte dibandingkan SSD' }
      ],
      kunciJawaban: 'A',
      pembahasan: 'RAM adalah memori kerja utama yang bersifat volatile (mudah menguap jika daya mati), sedangkan SSD adalah secondary storage non-volatile.',
      levelKognitif: 'C2',
      materi: 'Hardware Komputer (Storage & Memory)',
      indikatorSoal: 'Peserta didik dapat membedakan karakteristik RAM dan SSD.',
      skorMaksimal: 10,
      needsTeacherCheck: false
    },
    {
      id: 'inf-soal-5',
      noSoal: 5,
      bentukSoal: 'Uraian',
      stimulus: 'Data dalam komputer direpresentasikan dalam bentuk deretan bilangan biner yang terdiri dari angka 0 dan 1.',
      pertanyaan: 'Konversikan bilangan biner 11010110(2) ke dalam bentuk bilangan desimal berbasis 10! Tuliskan langkah perhitungannya dengan lengkap!',
      kunciJawaban: 'Perhitungan: (1x2^7) + (1x2^6) + (0x2^5) + (1x2^4) + (0x2^3) + (1x2^2) + (1x2^1) + (0x2^0) = 128 + 64 + 0 + 16 + 0 + 4 + 2 + 0 = 214. Jadi, 11010110(2) = 214(10).',
      pembahasan: 'Setiap digit biner dikalikan dengan bobot 2 pangkat posisinya (mulai dari kanan pangkat 0). Hasil akhir adalah 214.',
      levelKognitif: 'C3',
      materi: 'Konversi Bilangan Biner ke Desimal',
      indikatorSoal: 'Peserta didik dapat menguraikan langkah konversi matematis bilangan biner ke desimal.',
      skorMaksimal: 25,
      needsTeacherCheck: false
    },
    {
      id: 'inf-soal-6',
      noSoal: 6,
      bentukSoal: 'Uraian',
      stimulus: 'Laboratorium komputer sekolah memiliki PC dengan prosesor Core i5 generasi baru, namun booting membutuhkan waktu lebih dari 4 menit dan sering mengalami "Not Responding" saat membuka beberapa tab browser bersamaan. PC tersebut saat ini menggunakan RAM 4GB DDR4 dan Harddisk mekanik (HDD) 5400 RPM berumur 5 tahun dengan kapasitas 500GB (terisi 400GB).',
      pertanyaan: 'Analisislah penyebab utama (bottleneck) yang menyebabkan komputer lambat tersebut, dan susunlah 2 rekomendasi upgrade perangkat keras paling efektif dengan anggaran terbatas agar komputer kembali responsif!',
      kunciJawaban: 'Analisis bottleneck: 1) Harddisk mekanik 5400 RPM yang lambat memiliki read/write speed rendah (~80-100MB/s) sehingga transfer file OS lambat; 2) Kapasitas RAM 4GB terlalu kecil untuk OS modern dan multi-tab browser sehingga sistem sering melakukan paging/virtual memory ke harddisk yang lambat. Rekomendasi: 1) Ganti sistem OS dengan SSD SATA/NVMe (kecepatan 500-2000MB/s) untuk drive C; 2) Tambah RAM minimal menjadi 8GB atau 16GB dual channel.',
      pembahasan: 'Kriteria jawaban: Menganalisis peran HDD bottleneck dan RAM paging, serta memberikan rekomendasi upgrade SSD dan penambahan RAM.',
      levelKognitif: 'C5',
      materi: 'Troubleshooting & Analisis Kebutuhan Sistem Komputer',
      indikatorSoal: 'Peserta didik dapat mengevaluasi penyebab bottleneck dan merekomendasikan solusi upgrade.',
      skorMaksimal: 35,
      needsTeacherCheck: false
    }
  ],

  rubrikList: [
    {
      id: 'inf-rubrik-5',
      noSoal: 5,
      aspek: 'Langkah Matematis Konversi Biner ke Desimal',
      kriteriaSkor: [
        { skor: 25, deskripsi: 'Menguraikan rumus pemangkatan basis 2 dengan benar untuk seluruh 8 bit dan menghasilkan nilai akhir 214.' },
        { skor: 15, deskripsi: 'Rumus dan penguraian benar, tetapi terjadi sedikit kesalahan penjumlahan hitung aritmatika di akhir.' },
        { skor: 8, deskripsi: 'Memahami prinsip kelipatan biner tetapi urutan pangkat terbalik atau rumus kurang lengkap.' },
        { skor: 0, deskripsi: 'Jawaban salah atau tidak menjawab.' }
      ]
    },
    {
      id: 'inf-rubrik-6',
      noSoal: 6,
      aspek: 'Ketepatan Analisis Komponen Bottleneck & Rekomendasi Hardware',
      kriteriaSkor: [
        { skor: 35, deskripsi: 'Analisis tajam mengidentifikasi HDD mekanik & RAM 4GB, serta memberikan solusi upgrade SSD dan penambahan RAM dengan pertimbangan efisiensi biaya.' },
        { skor: 25, deskripsi: 'Mampu mengidentifikasi minimal 1 komponen bottleneck dan memberikan saran upgrade SSD yang tepat.' },
        { skor: 12, deskripsi: 'Hanya menyarankan solusi umum (misal instal ulang / ganti processor baru) tanpa menyasar komponen bottleneck sesungguhnya.' },
        { skor: 0, deskripsi: 'Tidak menjawab atau jawaban tidak relevan.' }
      ]
    }
  ],

  rekapSiswaList: [
    { id: 'inf-s-1', no: 1, nama: 'Ahmad Fauzan', nisn: '0098123401', skorDiperoleh: 95, nilai: 95, status: 'Tuntas' },
    { id: 'inf-s-2', no: 2, nama: 'Bunga Citra Lestari', nisn: '0098123402', skorDiperoleh: 88, nilai: 88, status: 'Tuntas' },
    { id: 'inf-s-3', no: 3, nama: 'Christian Wijaya', nisn: '0098123403', skorDiperoleh: 78, nilai: 78, status: 'Tuntas' },
    { id: 'inf-s-4', no: 4, nama: 'Dinda Kirana', nisn: '0098123404', skorDiperoleh: 65, nilai: 65, status: 'Belum Tuntas', catatan: 'Perlu bimbingan konversi biner' }
  ],

  includeLJK: true,
  syncWarnings: [],
  lastValidatedAt: '2026-02-15T11:45:00.000Z',
  validatorNotes: 'Kisi-kisi terdistribusi sesuai CP kurikulum merdeka TIK kelas VII.'
};
