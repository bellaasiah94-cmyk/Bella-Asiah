import React, { useState } from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { 
  Building2, 
  UserCheck, 
  Calendar, 
  BookOpen, 
  Sliders, 
  Check, 
  AlertCircle,
  Save,
  ArrowRight
} from 'lucide-react';

export const DataAsesmenView: React.FC = () => {
  const { activeProject, updateActiveProject, setActiveView } = useAssessment();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (field: string, value: any) => {
    updateActiveProject({ [field]: value });
  };

  const handleBentukChange = (type: string, value: number) => {
    const updated = {
      ...activeProject.distribusiBentuk,
      [type]: Math.max(0, value),
    };
    const total = Object.values(updated).reduce((a, b) => a + b, 0);
    updateActiveProject({
      distribusiBentuk: updated,
      jumlahSoal: total,
    });
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const isComplete = 
    activeProject.satuanPendidikan &&
    activeProject.namaGuru &&
    activeProject.mataPelajaran &&
    activeProject.kelas;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">
            Modul 1: Data Identitas & Parameter Asesmen
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Informasi ini menjadi dasar resmi kop surat, kisi-kisi, kartu soal, naskah ujian, dan pedoman penskoran.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <Check className="w-3.5 h-3.5" />
              Tersimpan
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-amber-300" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      {!isComplete && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Kelengkapan Data Diperlukan</p>
            <p className="text-amber-800 mt-0.5">
              Beberapa identitas penting belum diisi. Pastikan nama satuan pendidikan, guru penyusun, mata pelajaran, dan kelas terisi sebelum menghasilkan kisi-kisi.
            </p>
          </div>
        </div>
      )}

      {/* Form Section 1: Identitas Lembaga & Penyusun */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">
          <Building2 className="w-4 h-4 text-emerald-800" />
          <span>A. Identitas Satuan Pendidikan & Penyusun</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Satuan Pendidikan / Nama Sekolah <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={activeProject.satuanPendidikan}
              onChange={(e) => handleChange('satuanPendidikan', e.target.value)}
              placeholder="Contoh: SMP Negeri 1 Widyaswara / SMA N 1 Empang"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Satuan Kerja / Instansi Induk
            </label>
            <input
              type="text"
              value={activeProject.satuanKerja}
              onChange={(e) => handleChange('satuanKerja', e.target.value)}
              placeholder="Contoh: Dinas Pendidikan dan Kebudayaan / Kanwil Kemenag"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Nama Guru / Penyusun Asesmen <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={activeProject.namaGuru}
              onChange={(e) => handleChange('namaGuru', e.target.value)}
              placeholder="Contoh: Bella Asiah"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              NIP Guru (Opsional)
            </label>
            <input
              type="text"
              value={activeProject.nipGuru}
              onChange={(e) => handleChange('nipGuru', e.target.value)}
              placeholder="Contoh: 19850412 201001 2 015"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Nama Kepala Sekolah / Pimpinan
            </label>
            <input
              type="text"
              value={activeProject.namaKepalaSekolah}
              onChange={(e) => handleChange('namaKepalaSekolah', e.target.value)}
              placeholder="Contoh: Dr. I Wayan Sutarwan, M.Pd."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              NIP Kepala Sekolah
            </label>
            <input
              type="text"
              value={activeProject.nipKepalaSekolah}
              onChange={(e) => handleChange('nipKepalaSekolah', e.target.value)}
              placeholder="Contoh: 19740815 199903 1 004"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800"
            />
          </div>
        </div>
      </div>

      {/* Form Section 2: Kurikulum, Jenjang & Kelas */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">
          <BookOpen className="w-4 h-4 text-emerald-800" />
          <span>B. Kurikulum, Jenjang & Mata Pelajaran</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Kerangka Kurikulum
            </label>
            <select
              value={activeProject.kurikulum}
              onChange={(e) => handleChange('kurikulum', e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800"
            >
              <option value="Kurikulum Merdeka">Kurikulum Merdeka (Standar Nasional)</option>
              <option value="Kurikulum Berbasis Cinta (KBC) Widyalaya">Kurikulum Berbasis Cinta (KBC) Widyalaya</option>
              <option value="Integrasi Kurikulum Merdeka & KBC">Integrasi Kurikulum Merdeka & KBC</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Jenjang Pendidikan
            </label>
            <select
              value={activeProject.jenjang}
              onChange={(e) => handleChange('jenjang', e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800"
            >
              <option value="SD / Adi Widyalaya">SD / Adi Widyalaya (Fase A - C)</option>
              <option value="SMP / Madyama Widyalaya">SMP / Madyama Widyalaya (Fase D)</option>
              <option value="SMA / SMK / Utama Widyalaya">SMA / SMK / Utama Widyalaya (Fase E - F)</option>
              <option value="TK / Pratama Widyalaya">TK / Pratama Widyalaya (Fase Fondasi)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Kelas & Fase <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={activeProject.kelas}
              onChange={(e) => handleChange('kelas', e.target.value)}
              placeholder="Contoh: Fase D - Kelas VII"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Mata Pelajaran <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={activeProject.mataPelajaran}
              onChange={(e) => handleChange('mataPelajaran', e.target.value)}
              placeholder="Contoh: Sejarah Kebudayaan Hindu / Informatika"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Jenis Asesmen
            </label>
            <select
              value={activeProject.jenisAsesmen}
              onChange={(e) => handleChange('jenisAsesmen', e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800"
            >
              <option value="Sumatif Akhir Semester (SAS)">Sumatif Akhir Semester (SAS)</option>
              <option value="Sumatif Tengah Semester (STS)">Sumatif Tengah Semester (STS)</option>
              <option value="Asesmen Formatif / Ulangan Harian">Asesmen Formatif / Ulangan Harian</option>
              <option value="Asesmen Diagnostik Kognitif & Non Kognitif">Asesmen Diagnostik</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Tahun Ajaran & Semester
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={activeProject.tahunAjaran}
                onChange={(e) => handleChange('tahunAjaran', e.target.value)}
                placeholder="2026/2027"
                className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg"
              />
              <select
                value={activeProject.semester}
                onChange={(e) => handleChange('semester', e.target.value)}
                className="w-full text-xs px-2 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="1 (Ganjil)">1 (Ganjil)</option>
                <option value="2 (Genap)">2 (Genap)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Alokasi Waktu Pengerjaan
            </label>
            <input
              type="text"
              value={activeProject.alokasiWaktu}
              onChange={(e) => handleChange('alokasiWaktu', e.target.value)}
              placeholder="Contoh: 90 Menit / 2 JP (80 Menit)"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Buku Acuan / Sumber Rujukan
            </label>
            <input
              type="text"
              value={activeProject.bukuAcuan}
              onChange={(e) => handleChange('bukuAcuan', e.target.value)}
              placeholder="Contoh: Buku Teks Utama Kemendikbudristek 2024 / Ditjen Bimas Hindu 2025"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Form Section 3: Komposisi Bentuk & Level Soal */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Sliders className="w-4 h-4 text-emerald-800" />
            <span>C. Komposisi Bentuk Soal & Ketuntasan (KKTP)</span>
          </div>
          <span className="text-xs font-mono-num font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            Total Target: {activeProject.jumlahSoal} Butir Soal
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Pilihan Ganda (PG)</label>
            <input
              type="number"
              min="0"
              value={activeProject.distribusiBentuk.pg}
              onChange={(e) => handleBentukChange('pg', parseInt(e.target.value) || 0)}
              className="w-full text-xs font-mono-num px-2.5 py-1.5 border border-slate-300 rounded bg-white text-center font-bold text-slate-800"
            />
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
            <label className="block text-[11px] font-medium text-slate-600 mb-1">PG Kompleks (PGK)</label>
            <input
              type="number"
              min="0"
              value={activeProject.distribusiBentuk.pgk}
              onChange={(e) => handleBentukChange('pgk', parseInt(e.target.value) || 0)}
              className="w-full text-xs font-mono-num px-2.5 py-1.5 border border-slate-300 rounded bg-white text-center font-bold text-slate-800"
            />
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Uraian / Esai</label>
            <input
              type="number"
              min="0"
              value={activeProject.distribusiBentuk.uraian}
              onChange={(e) => handleBentukChange('uraian', parseInt(e.target.value) || 0)}
              className="w-full text-xs font-mono-num px-2.5 py-1.5 border border-slate-300 rounded bg-white text-center font-bold text-slate-800"
            />
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Menjodohkan</label>
            <input
              type="number"
              min="0"
              value={activeProject.distribusiBentuk.menjodohkan}
              onChange={(e) => handleBentukChange('menjodohkan', parseInt(e.target.value) || 0)}
              className="w-full text-xs font-mono-num px-2.5 py-1.5 border border-slate-300 rounded bg-white text-center font-bold text-slate-800"
            />
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Isian Singkat</label>
            <input
              type="number"
              min="0"
              value={activeProject.distribusiBentuk.isian}
              onChange={(e) => handleBentukChange('isian', parseInt(e.target.value) || 0)}
              className="w-full text-xs font-mono-num px-2.5 py-1.5 border border-slate-300 rounded bg-white text-center font-bold text-slate-800"
            />
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Benar - Salah</label>
            <input
              type="number"
              min="0"
              value={activeProject.distribusiBentuk.benarSalah}
              onChange={(e) => handleBentukChange('benarSalah', parseInt(e.target.value) || 0)}
              className="w-full text-xs font-mono-num px-2.5 py-1.5 border border-slate-300 rounded bg-white text-center font-bold text-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Batas Ketuntasan (KKTP)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={activeProject.kktp}
              onChange={(e) => handleChange('kktp', parseInt(e.target.value) || 75)}
              className="w-full text-xs font-mono-num px-3 py-2 border border-slate-300 rounded-lg"
            />
            <p className="text-[11px] text-slate-500 mt-0.5">Nilai &ge; {activeProject.kktp} dinyatakan Tuntas</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Skor Maksimal Total
            </label>
            <input
              type="number"
              min="10"
              max="200"
              value={activeProject.skorMaksimal}
              onChange={(e) => handleChange('skorMaksimal', parseInt(e.target.value) || 100)}
              className="w-full text-xs font-mono-num px-3 py-2 border border-slate-300 rounded-lg"
            />
            <p className="text-[11px] text-slate-500 mt-0.5">Basis perhitungan penskoran ujian</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Rumus Penentuan Nilai
            </label>
            <input
              type="text"
              value={activeProject.rumusNilai}
              onChange={(e) => handleChange('rumusNilai', e.target.value)}
              className="w-full text-xs font-mono-num px-3 py-2 border border-slate-300 rounded-lg"
            />
            <p className="text-[11px] text-slate-500 mt-0.5">Transparan sesuai pedoman penilaian</p>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setActiveView('dashboard')}
          className="text-xs text-slate-600 hover:text-slate-900 font-medium px-3 py-2"
        >
          Kembali ke Dashboard
        </button>
        <button
          onClick={() => setActiveView('referensi-kbc')}
          className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white font-medium text-xs rounded-lg flex items-center gap-2 shadow-sm transition-colors"
        >
          <span>Lanjut ke Muatan Referensi & CP/TP</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
        </button>
      </div>
    </div>
  );
};
