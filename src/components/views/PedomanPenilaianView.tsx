import React, { useState } from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { RubrikAspek, RekapSiswa } from '../../types/assessment';
import {
  Award,
  Sparkles,
  Plus,
  Trash2,
  Printer,
  RefreshCw,
  Save,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Calculator,
  UserCheck,
} from 'lucide-react';

export const PedomanPenilaianView: React.FC = () => {
  const { activeProject, updateActiveProject, setActiveView } = useAssessment();
  const [generatingRubrik, setGeneratingRubrik] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentScore, setNewStudentScore] = useState<number>(0);

  const rubrikList = activeProject.rubrikList || [];
  const rekapList = activeProject.rekapSiswaList || [];
  const soalItems = activeProject.soalItems || [];

  const handleGenerateRubrikAI = async () => {
    if (soalItems.length === 0) {
      setErrorMessage('Naskah soal belum tersedia. Hasilkan naskah soal terlebih dahulu di Modul 5.');
      return;
    }

    setGeneratingRubrik(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/gemini/generate-kunci-rubrik', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          soalItems,
          mataPelajaran: activeProject.mataPelajaran,
          kelas: activeProject.kelas,
        }),
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.success) {
        throw new Error(resJson.error || 'Gagal menghasilkan rubrik penskoran.');
      }

      const generated: any[] = resJson.data;
      if (Array.isArray(generated)) {
        const mappedRubrik: RubrikAspek[] = generated.map((r: any, idx: number) => ({
          id: `rubrik-${Date.now()}-${idx + 1}`,
          noSoal: r.noSoal || idx + 1,
          aspek: r.aspek || 'Kriteria Penilaian Kualitas Jawaban',
          kriteriaSkor: Array.isArray(r.kriteriaSkor)
            ? r.kriteriaSkor
            : [
                { skor: 15, deskripsi: 'Menjawab secara utuh dan logis' },
                { skor: 5, deskripsi: 'Menjawab sebagian konsep dasar' },
                { skor: 0, deskripsi: 'Tidak menjawab atau salah total' },
              ],
        }));

        updateActiveProject({ rubrikList: mappedRubrik });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat membuat rubrik.');
    } finally {
      setGeneratingRubrik(false);
    }
  };

  const addRubrikRow = (rubrikId: string) => {
    const updated = rubrikList.map((r) => {
      if (r.id !== rubrikId) return r;
      return {
        ...r,
        kriteriaSkor: [...r.kriteriaSkor, { skor: 5, deskripsi: 'Kriteria deskriptor baru...' }],
      };
    });
    updateActiveProject({ rubrikList: updated });
  };

  const removeRubrikRow = (rubrikId: string, kIndex: number) => {
    const updated = rubrikList.map((r) => {
      if (r.id !== rubrikId) return r;
      const kList = [...r.kriteriaSkor];
      kList.splice(kIndex, 1);
      return { ...r, kriteriaSkor: kList };
    });
    updateActiveProject({ rubrikList: updated });
  };

  const updateRubrikKriteria = (
    rubrikId: string,
    kIndex: number,
    field: 'skor' | 'deskripsi',
    value: any
  ) => {
    const updated = rubrikList.map((r) => {
      if (r.id !== rubrikId) return r;
      const kList = [...r.kriteriaSkor];
      kList[kIndex] = { ...kList[kIndex], [field]: value };
      return { ...r, kriteriaSkor: kList };
    });
    updateActiveProject({ rubrikList: updated });
  };

  // Student Recap Management
  const addStudent = () => {
    if (!newStudentName.trim()) return;
    const nextNo = rekapList.length + 1;
    const skorMax = activeProject.skorMaksimal || 100;
    const nilai = Math.round((newStudentScore / skorMax) * 100);
    const status = nilai >= activeProject.kktp ? 'Tuntas' : 'Belum Tuntas';

    const newRec: RekapSiswa = {
      id: `sis-${Date.now()}-${nextNo}`,
      no: nextNo,
      nama: newStudentName.trim(),
      skorDiperoleh: newStudentScore,
      nilai,
      status,
      catatan: status === 'Tuntas' ? 'Telah mencapai KKTP' : 'Perlu bimbingan / remedial',
    };

    updateActiveProject({ rekapSiswaList: [...rekapList, newRec] });
    setNewStudentName('');
    setNewStudentScore(0);
  };

  const updateStudentScore = (id: string, newScore: number) => {
    const skorMax = activeProject.skorMaksimal || 100;
    const updated = rekapList.map((s) => {
      if (s.id !== id) return s;
      const nilai = Math.round((newScore / skorMax) * 100);
      const status: 'Tuntas' | 'Belum Tuntas' = nilai >= activeProject.kktp ? 'Tuntas' : 'Belum Tuntas';
      return {
        ...s,
        skorDiperoleh: newScore,
        nilai,
        status,
      };
    });
    updateActiveProject({ rekapSiswaList: updated });
  };

  const removeStudent = (id: string) => {
    const filtered = rekapList.filter((s) => s.id !== id);
    const renumbered = filtered.map((s, idx) => ({ ...s, no: idx + 1 }));
    updateActiveProject({ rekapSiswaList: renumbered });
  };

  const handlePrint = () => {
    window.print();
  };

  // Recap statistics
  const totalStudents = rekapList.length;
  const tuntasStudents = rekapList.filter((s) => s.status === 'Tuntas').length;
  const tuntasPct = totalStudents > 0 ? Math.round((tuntasStudents / totalStudents) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">
            Modul 7: Pedoman Penskoran, Rubrik & Rekap Nilai
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pedoman penskoran transparan, rubrik analitik per kriteria capaian, rumus nilai, dan rekapitulasi hasil belajar peserta didik.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateRubrikAI}
            disabled={generatingRubrik}
            className="px-4 py-1.5 bg-emerald-900 hover:bg-emerald-800 disabled:opacity-50 text-white font-medium text-xs rounded-lg flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap"
          >
            {generatingRubrik ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
                <span>Menyusun Rubrik...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Hasilkan Rubrik dengan AI</span>
              </>
            )}
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak A4</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-800 no-print">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Document Content */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-8 sm:p-10 print-page space-y-6">
        {/* Kop */}
        <div className="text-center pb-4 border-b-2 border-slate-800">
          <p className="text-xs font-bold tracking-widest text-slate-700 uppercase">
            {activeProject.satuanKerja}
          </p>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-heading uppercase mt-0.5">
            {activeProject.satuanPendidikan}
          </h2>
          <p className="text-xs font-semibold text-slate-800 uppercase mt-1">
            PEDOMAN PENILAIAN, PENSKORAN & REKAPITULASI HASIL BELAJAR
          </p>
          <p className="text-xs text-slate-600">
            Mata Pelajaran: {activeProject.mataPelajaran} | Kelas: {activeProject.kelas} | Tahun Ajaran: {activeProject.tahunAjaran}
          </p>
        </div>

        {/* 1. Rumus Penskoran & Ketuntasan */}
        <div className="p-4 bg-emerald-50/60 rounded-lg border border-emerald-200 text-xs text-slate-800 space-y-2">
          <div className="flex items-center gap-2 font-bold text-emerald-950">
            <Calculator className="w-4 h-4 text-emerald-800" />
            <span>1. RUMUS PERHITUNGAN NILAI & KRITERIA KETERCAPAIAN (KKTP)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="bg-white p-3 rounded border border-emerald-200 text-center">
              <span className="block text-[11px] text-slate-500">Rumus Penentuan Nilai:</span>
              <p className="font-mono font-bold text-emerald-900 text-sm mt-1">
                {activeProject.rumusNilai || 'Nilai = (Skor Diperoleh / Skor Maksimal) x 100'}
              </p>
            </div>

            <div className="bg-white p-3 rounded border border-emerald-200 text-center">
              <span className="block text-[11px] text-slate-500">Batas Ketercapaian (KKTP):</span>
              <p className="font-bold text-slate-900 text-sm mt-1 font-mono-num">
                Nilai &ge; {activeProject.kktp} (Tuntas) | &lt; {activeProject.kktp} (Belum Tuntas)
              </p>
            </div>
          </div>
        </div>

        {/* 2. Rubrik Penskoran Uraian / Non-PG */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-sm font-bold text-slate-900">
              2. Rubrik Penilaian Analitik Soal Non-Objektif / Uraian
            </h3>
            <span className="text-xs text-slate-500 font-mono-num">
              {rubrikList.length} Rubrik Ditetapkan
            </span>
          </div>

          {rubrikList.map((rubrik) => (
            <div key={rubrik.id} className="border border-slate-300 rounded-lg overflow-hidden text-xs">
              <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-300 font-semibold text-slate-800">
                <span>Soal Nomor {rubrik.noSoal}: {rubrik.aspek}</span>
                <button
                  onClick={() => addRubrikRow(rubrik.id)}
                  className="no-print text-[11px] text-emerald-800 hover:underline font-medium"
                >
                  + Tambah Baris Kriteria
                </button>
              </div>

              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                  <tr className="divide-x divide-slate-200">
                    <th className="py-2 px-3 w-20 text-center">Skor</th>
                    <th className="py-2 px-3">Deskripsi Kriteria Ketercapaian Jawaban</th>
                    <th className="py-2 px-2 w-14 text-center no-print">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {rubrik.kriteriaSkor.map((kriteria, kIdx) => (
                    <tr key={kIdx} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 text-center align-top">
                        <input
                          type="number"
                          value={kriteria.skor}
                          onChange={(e) =>
                            updateRubrikKriteria(rubrik.id, kIdx, 'skor', parseInt(e.target.value) || 0)
                          }
                          className="w-12 text-center font-bold font-mono-num text-xs p-1 border border-slate-200 rounded"
                        />
                      </td>
                      <td className="py-2 px-3 align-top">
                        <textarea
                          rows={2}
                          value={kriteria.deskripsi}
                          onChange={(e) =>
                            updateRubrikKriteria(rubrik.id, kIdx, 'deskripsi', e.target.value)
                          }
                          className="w-full text-xs p-1.5 border border-slate-200 rounded focus:outline-none"
                        />
                      </td>
                      <td className="py-2 px-2 text-center align-top no-print">
                        <button
                          onClick={() => removeRubrikRow(rubrik.id, kIdx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Hapus Kriteria"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          {rubrikList.length === 0 && (
            <div className="p-6 text-center text-slate-400 text-xs italic border border-dashed border-slate-300 rounded-lg">
              Belum ada rubrik analitik. Klik "Hasilkan Rubrik dengan AI" untuk membuat rubrik otomatis bagi butir soal uraian.
            </div>
          )}
        </div>

        {/* 3. Tabel Rekapitulasi Nilai Peserta Didik */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                3. Rekapitulasi Hasil Penilaian Peserta Didik
              </h3>
              <p className="text-[11px] text-slate-500">
                Ketuntasan otomatis dihitung: ({tuntasStudents} dari {totalStudents} siswa tuntas - {tuntasPct}%)
              </p>
            </div>
          </div>

          <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-emerald-900 text-white font-semibold divide-x divide-emerald-800">
                <tr>
                  <th className="py-2 px-3 w-12 text-center">No.</th>
                  <th className="py-2 px-3 min-w-[200px]">Nama Peserta Didik</th>
                  <th className="py-2 px-3 w-28 text-center">Skor Diperoleh</th>
                  <th className="py-2 px-3 w-24 text-center">Nilai (0-100)</th>
                  <th className="py-2 px-3 w-32 text-center">Status (KKTP)</th>
                  <th className="py-2 px-2 w-14 text-center no-print">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rekapList.map((siswa) => (
                  <tr key={siswa.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 text-center font-bold font-mono-num text-slate-600">
                      {siswa.no}.
                    </td>
                    <td className="py-2 px-3 font-semibold text-slate-800">
                      {siswa.nama}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max={activeProject.skorMaksimal}
                        value={siswa.skorDiperoleh}
                        onChange={(e) => updateStudentScore(siswa.id, parseInt(e.target.value) || 0)}
                        className="w-16 text-center font-bold font-mono-num text-xs p-1 border border-slate-300 rounded"
                      />
                    </td>
                    <td className="py-2 px-3 text-center font-bold font-mono-num text-slate-900">
                      {siswa.nilai}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          siswa.status === 'Tuntas'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {siswa.status}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center no-print">
                      <button
                        onClick={() => removeStudent(siswa.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Student Bar */}
          <div className="no-print bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-slate-700">Tambah Siswa:</span>
            <input
              type="text"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              placeholder="Nama lengkap siswa..."
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs flex-1 min-w-[180px]"
            />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Skor:</span>
              <input
                type="number"
                min="0"
                max={activeProject.skorMaksimal}
                value={newStudentScore}
                onChange={(e) => setNewStudentScore(parseInt(e.target.value) || 0)}
                className="w-16 text-center font-mono-num px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
              />
            </div>
            <button
              onClick={addStudent}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-1 font-medium text-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Rekap</span>
            </button>
          </div>
        </div>

        {/* Official Signatures Kop */}
        <div className="grid grid-cols-2 gap-8 pt-8 text-xs text-slate-800">
          <div className="text-center space-y-1">
            <p>Mengetahui,</p>
            <p>Kepala {activeProject.satuanPendidikan}</p>
            <div className="h-16" />
            <p className="font-bold underline">{activeProject.namaKepalaSekolah}</p>
            <p className="text-slate-500">NIP. {activeProject.nipKepalaSekolah}</p>
          </div>

          <div className="text-center space-y-1">
            <p>Denpasar / Kota, ..................... 2026</p>
            <p>Guru Mata Pelajaran</p>
            <div className="h-16" />
            <p className="font-bold underline">{activeProject.namaGuru}</p>
            <p className="text-slate-500">NIP. {activeProject.nipGuru}</p>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2 no-print">
        <button
          onClick={() => setActiveView('kunci-jawaban')}
          className="text-xs text-slate-600 hover:text-slate-900 font-medium px-3 py-2"
        >
          Kembali ke Kunci Jawaban
        </button>
        <button
          onClick={() => setActiveView('validasi')}
          className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white font-medium text-xs rounded-lg flex items-center gap-2 shadow-sm transition-colors"
        >
          <span>Lanjut ke Validasi Mutu Asesmen</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
        </button>
      </div>
    </div>
  );
};
