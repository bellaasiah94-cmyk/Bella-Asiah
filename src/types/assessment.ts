export type CognitiveLevel = 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';

export type QuestionType = 
  | 'PG' // Pilihan Ganda
  | 'PGK' // Pilihan Ganda Kompleks
  | 'Uraian' // Uraian / Esai
  | 'Isian' // Isian Singkat
  | 'Menjodohkan' // Menjodohkan
  | 'BenarSalah'; // Benar - Salah

export type ProjectStatus = 'draft' | 'needs_review' | 'validated' | 'final';

export interface KisiKisiItem {
  id: string;
  no: number;
  capaianPembelajaran: string;
  tujuanPembelajaran: string;
  materiAjar: string;
  indikatorSoal: string;
  levelKognitif: CognitiveLevel;
  bentukSoal: QuestionType;
  noSoal: number;
}

export interface ChoiceOption {
  key: string; // 'A' | 'B' | 'C' | 'D' | 'E'
  text: string;
}

export interface MatchingPair {
  premise: string;
  response: string;
}

export interface SoalItem {
  id: string;
  noSoal: number;
  bentukSoal: QuestionType;
  stimulus?: string; // Teks bacaan, data, atau narasi stimulus
  pertanyaan: string;
  pilihanJawaban?: ChoiceOption[]; // Untuk PG
  pilihanKompleks?: Array<{ text: string; isCorrect: boolean }>; // Untuk PGK
  matchingPairs?: MatchingPair[]; // Untuk menjodohkan
  kunciJawaban: string; // Huruf atau uraian teks jawaban
  pembahasan: string;
  levelKognitif: CognitiveLevel;
  materi: string;
  indikatorSoal: string;
  skorMaksimal: number;
  needsTeacherCheck?: boolean;
}

export interface KartuSoalItem {
  id: string;
  noSoal: number;
  bukuAcuan: string;
  levelKognitif: CognitiveLevel;
  materi: string;
  indikatorSoal: string;
  bentukSoal: QuestionType;
  deskripsiSoal: string; // Teks soal lengkap + pilihan
  kunciJawaban: string;
  skorMaksimal: number;
}

export interface RubrikAspek {
  id: string;
  noSoal: number;
  aspek: string;
  kriteriaSkor: Array<{
    skor: number;
    deskripsi: string;
  }>;
}

export interface RekapSiswa {
  id: string;
  no: number;
  nama: string;
  nisn?: string;
  skorDiperoleh: number;
  nilai: number;
  status: 'Tuntas' | 'Belum Tuntas';
  catatan?: string;
}

export interface AssessmentProject {
  id: string;
  title: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  isExample?: boolean;

  // Identitas Satuan Pendidikan & Guru
  satuanPendidikan: string;
  satuanKerja: string;
  namaGuru: string;
  nipGuru: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  tahunAjaran: string;
  semester: string;
  jenjang: string;
  kelas: string;
  mataPelajaran: string;
  jenisAsesmen: string;
  kurikulum: string;
  alokasiWaktu: string;
  bukuAcuan: string;

  // Muatan Pembelajaran & Kurikulum Berbasis Cinta (KBC)
  capaianPembelajaran: string;
  tujuanPembelajaranList: string[];
  materiPokok: string;
  kbcTopic?: string; // Panca Cinta: Cinta Tuhan, Cinta Ilmu, Cinta Lingkungan, Cinta Diri & Sesama, Cinta Tanah Air
  materiInsersiKBC?: string; // Integrasi nilai (Tri Hita Karana, Tat Twam Asi, dsb)
  referensiTeks: string; // Sumber teks rujukan

  // Parameter Distribusi Asesmen
  jumlahSoal: number;
  distribusiBentuk: {
    pg: number;
    pgk: number;
    uraian: number;
    menjodohkan: number;
    isian: number;
    benarSalah: number;
  };
  distribusiLevel: {
    C1_C2: number; // Pemahaman & Mengingat
    C3_C4: number; // Aplikasi & Analisis
    C5_C6: number; // Evaluasi & Kreasi
  };
  skorMaksimal: number;
  kktp: number; // Kriteria Ketercapaian Tujuan Pembelajaran (KKM/KKTP, misal 75)
  rumusNilai: string;
  ketentuanTambahan: string;

  // 5 Perangkat Asesmen Terintegrasi
  kisiKisi: KisiKisiItem[];
  soalItems: SoalItem[];
  rubrikList: RubrikAspek[];
  rekapSiswaList: RekapSiswa[];
  includeLJK: boolean; // Lembar Jawaban Pilihan Ganda

  // Catatan Validasi & Sinkronisasi
  syncWarnings: string[];
  lastValidatedAt?: string;
  validatorNotes?: string;
}

export interface ValidationItem {
  id: string;
  title: string;
  description: string;
  status: 'valid' | 'warning' | 'error';
  recommendation?: string;
}
