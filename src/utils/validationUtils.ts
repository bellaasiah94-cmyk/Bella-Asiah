import { AssessmentProject, ValidationItem } from '../types/assessment';

export function validateAssessmentPackage(project: AssessmentProject): {
  overallStatus: 'valid' | 'warning' | 'error';
  totalChecks: number;
  passedChecks: number;
  items: ValidationItem[];
} {
  const items: ValidationItem[] = [];

  const kisiCount = project.kisiKisi?.length || 0;
  const soalCount = project.soalItems?.length || 0;

  // 1. Periksa Jumlah Soal
  if (kisiCount === 0) {
    items.push({
      id: 'val-kisi-empty',
      title: 'Kisi-Kisi Masih Kosong',
      description: 'Belum ada butir kisi-kisi yang dibuat dalam proyek ini.',
      status: 'error',
      recommendation: 'Buka modul Kisi-Kisi dan klik "Hasilkan Kisi-Kisi dengan AI" atau tambahkan manual.',
    });
  } else if (kisiCount !== project.jumlahSoal) {
    items.push({
      id: 'val-kisi-count',
      title: 'Jumlah Kisi-Kisi Berbeda dengan Target',
      description: `Target jumlah soal diset ${project.jumlahSoal}, namun kisi-kisi saat ini memuat ${kisiCount} butir.`,
      status: 'warning',
      recommendation: 'Sesuaikan jumlah soal di form data asesmen atau tambahkan/kurangi butir di kisi-kisi.',
    });
  } else {
    items.push({
      id: 'val-kisi-count',
      title: 'Jumlah Kisi-Kisi Sesuai',
      description: `Jumlah butir kisi-kisi (${kisiCount}) sesuai dengan target (${project.jumlahSoal}).`,
      status: 'valid',
    });
  }

  // 2. Periksa Konsistensi Naskah Soal dengan Kisi-Kisi
  if (soalCount === 0) {
    items.push({
      id: 'val-soal-empty',
      title: 'Naskah Soal Belum Dihasilkan',
      description: 'Belum ada butir soal dalam naskah yang bersesuaian dengan kisi-kisi.',
      status: 'error',
      recommendation: 'Buka modul Naskah Soal dan buat butir soal sesuai indikator kisi-kisi.',
    });
  } else if (soalCount !== kisiCount) {
    items.push({
      id: 'val-soal-sync',
      title: 'Ketidaksinkronan Jumlah Soal dan Kisi-Kisi',
      description: `Terdapat ${kisiCount} butir kisi-kisi, namun naskah soal memuat ${soalCount} butir.`,
      status: 'warning',
      recommendation: 'Lakukan sinkronisasi atau regenerasi butir yang belum memiliki naskah soal.',
    });
  } else {
    items.push({
      id: 'val-soal-sync',
      title: 'Sinkronisasi Naskah dan Kisi-Kisi Utuh',
      description: `Seluruh ${soalCount} butir soal telah memiliki padanan di kisi-kisi dan kartu soal.`,
      status: 'valid',
    });
  }

  // 3. Periksa Urutan Nomor Soal
  const soalNumbers = (project.soalItems || []).map((s) => s.noSoal).sort((a, b) => a - b);
  const isSequenceCorrect = soalNumbers.every((num, idx) => num === idx + 1);
  if (!isSequenceCorrect && soalCount > 0) {
    items.push({
      id: 'val-sequence',
      title: 'Urutan Nomor Soal Tidak Terurut Runtut',
      description: 'Nomor butir soal tidak berurutan dari 1 sampai akhir atau terdapat nomor yang melompat.',
      status: 'warning',
      recommendation: 'Periksa kembali nomor soal di tabel atau klik tombol urutkan nomor otomatis.',
    });
  } else if (soalCount > 0) {
    items.push({
      id: 'val-sequence',
      title: 'Urutan Nomor Soal Runtut',
      description: `Nomor soal tersusun runtut dari 1 hingga ${soalCount}.`,
      status: 'valid',
    });
  }

  // 4. Periksa Kunci Jawaban Lengkap
  const missingKeys = (project.soalItems || []).filter(
    (s) => !s.kunciJawaban || s.kunciJawaban.trim() === ''
  );
  if (missingKeys.length > 0) {
    items.push({
      id: 'val-keys',
      title: 'Kunci Jawaban Belum Terisi Lengkap',
      description: `Terdapat ${missingKeys.length} butir soal (misal No. ${missingKeys.map((m) => m.noSoal).join(', ')}) yang belum memiliki kunci jawaban.`,
      status: 'error',
      recommendation: 'Lengkapi kunci jawaban di modul Kunci Jawaban.',
    });
  } else if (soalCount > 0) {
    items.push({
      id: 'val-keys',
      title: 'Kunci Jawaban Lengkap',
      description: 'Semua butir soal telah dilengkapi kunci jawaban dan pembahasan.',
      status: 'valid',
    });
  }

  // 5. Periksa Distribusi Level Kognitif (Bloom C1-C6)
  const levels = (project.kisiKisi || []).map((k) => k.levelKognitif);
  const hotsCount = levels.filter((lvl) => lvl === 'C4' || lvl === 'C5' || lvl === 'C6').length;
  if (kisiCount > 0 && hotsCount === 0) {
    items.push({
      id: 'val-hots',
      title: 'Tidak Ada Butir Soal Tingkat Tinggi (HOTS C4-C6)',
      description: 'Semua butir soal berada di level C1-C2 (hafalan/pemahaman rendah).',
      status: 'warning',
      recommendation: 'Kurikulum Merdeka dan KBC menganjurkan minimal 20-30% soal menuntut penalaran kritis (C4-C6).',
    });
  } else if (kisiCount > 0) {
    const hotsPct = Math.round((hotsCount / kisiCount) * 100);
    items.push({
      id: 'val-hots',
      title: 'Distribusi Kognitif Memadai',
      description: `Terdapat ${hotsCount} dari ${kisiCount} butir (${hotsPct}%) pada kategori HOTS (C4-C6).`,
      status: 'valid',
    });
  }

  // 6. Periksa Total Skor dan Rubrik Uraian
  const uraianItems = (project.soalItems || []).filter((s) => s.bentukSoal === 'Uraian');
  const missingRubric = uraianItems.filter(
    (u) => !(project.rubrikList || []).some((r) => r.noSoal === u.noSoal)
  );

  if (missingRubric.length > 0) {
    items.push({
      id: 'val-rubric',
      title: 'Rubrik Penskoran Uraian Belum Lengkap',
      description: `Terdapat ${missingRubric.length} butir soal uraian (No. ${missingRubric.map((m) => m.noSoal).join(', ')}) yang belum memiliki rubrik kriteria skor bertingkat.`,
      status: 'warning',
      recommendation: 'Buka modul Pedoman Penilaian dan hasilkan rubrik analitik untuk butir uraian tersebut.',
    });
  } else if (uraianItems.length > 0) {
    items.push({
      id: 'val-rubric',
      title: 'Rubrik Penskoran Uraian Lengkap',
      description: `Semua ${uraianItems.length} butir soal uraian telah memiliki pedoman rubrik penilaian analitik.`,
      status: 'valid',
    });
  }

  // 7. Periksa Rumus Nilai dan KKTP
  if (!project.kktp || project.kktp <= 0) {
    items.push({
      id: 'val-kktp',
      title: 'KKTP Belum Ditetapkan',
      description: 'Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) belum diisi nilai valid.',
      status: 'warning',
      recommendation: 'Tentukan batas ketuntasan (misal 70 atau 75) di formulir data asesmen.',
    });
  } else {
    items.push({
      id: 'val-kktp',
      title: 'KKTP dan Rumus Penskoran Jelas',
      description: `Batas ketercapaian: ${project.kktp} dengan rumus ${project.rumusNilai || 'Nilai = (Skor/SkorMax)*100'}.`,
      status: 'valid',
    });
  }

  const errorCount = items.filter((i) => i.status === 'error').length;
  const warningCount = items.filter((i) => i.status === 'warning').length;
  const passedChecks = items.filter((i) => i.status === 'valid').length;

  let overallStatus: 'valid' | 'warning' | 'error' = 'valid';
  if (errorCount > 0) {
    overallStatus = 'error';
  } else if (warningCount > 0) {
    overallStatus = 'warning';
  }

  return {
    overallStatus,
    totalChecks: items.length,
    passedChecks,
    items,
  };
}
