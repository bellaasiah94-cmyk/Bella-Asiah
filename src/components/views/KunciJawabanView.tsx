import React, { useState } from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { SoalItem } from '../../types/assessment';
import {
  KeyRound,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Save,
  Printer,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const KunciJawabanView: React.FC = () => {
  const { activeProject, updateActiveProject, setActiveView } = useAssessment();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const soalItems = activeProject.soalItems || [];
  const pgItems = soalItems.filter((s) => s.bentukSoal === 'PG');
  const nonPgItems = soalItems.filter((s) => s.bentukSoal !== 'PG');

  const updateSoal = (noSoal: number, field: keyof SoalItem, value: any) => {
    const updated = soalItems.map((s) => (s.noSoal === noSoal ? { ...s, [field]: value } : s));
    updateActiveProject({ soalItems: updated });
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Split PG items into 2 columns for neat standard table display (e.g. 1-15 and 16-30)
  const halfPg = Math.ceil(pgItems.length / 2);
  const leftPg = pgItems.slice(0, halfPg);
  const rightPg = pgItems.slice(halfPg);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">
            Modul 6: Kunci Jawaban & Pembahasan Mendalam
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kunci resmi pilihan ganda, rubrik jawaban ideal uraian, verifikasi logika/hitungan, dan catatan telaah guru.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Tersimpan
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-amber-300" />
            <span>Simpan Kunci</span>
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

      {/* Main Printable Document Card */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-8 sm:p-10 print-page space-y-6">
        {/* Kop Dokumen Kunci */}
        <div className="text-center pb-4 border-b-2 border-slate-800">
          <p className="text-xs font-bold tracking-widest text-slate-700 uppercase">
            {activeProject.satuanKerja}
          </p>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-heading uppercase mt-0.5">
            {activeProject.satuanPendidikan}
          </h2>
          <p className="text-xs font-semibold text-slate-800 uppercase mt-1">
            KUNCI JAWABAN DAN PEDOMAN PENSKORAN
          </p>
          <p className="text-xs text-slate-600">
            KEGIATAN {activeProject.jenisAsesmen.toUpperCase()} TAHUN PELAJARAN {activeProject.tahunAjaran}
          </p>

          <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-800">
            <p><strong>Mata Pelajaran:</strong> {activeProject.mataPelajaran}</p>
            <p><strong>Kelas / Semester:</strong> {activeProject.kelas} / {activeProject.semester}</p>
            <p><strong>Penyusun:</strong> {activeProject.namaGuru}</p>
          </div>
        </div>

        {/* Bagian A: Tabel Kunci Pilihan Ganda (Format Baku 2 Kolom) */}
        {pgItems.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-1.5">
              A. Kunci Jawaban Soal Pilihan Ganda
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Kolom 1 */}
              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-emerald-900 text-white font-semibold">
                    <tr className="divide-x divide-emerald-800">
                      <th className="py-2 px-3 w-14 text-center">No.</th>
                      <th className="py-2 px-3 w-28 text-center">Kunci</th>
                      <th className="py-2 px-3 w-16 text-center">Skor</th>
                      <th className="py-2 px-3">Pembahasan Ringkas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {leftPg.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-center font-bold font-mono-num text-slate-700">
                          {item.noSoal}.
                        </td>
                        <td className="py-2 px-3 text-center">
                          <select
                            value={item.kunciJawaban}
                            onChange={(e) => updateSoal(item.noSoal, 'kunciJawaban', e.target.value)}
                            className="text-xs px-2 py-1 font-bold font-mono-num text-emerald-900 bg-emerald-50 border border-emerald-200 rounded"
                          >
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="E">E</option>
                          </select>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <input
                            type="number"
                            value={item.skorMaksimal}
                            onChange={(e) => updateSoal(item.noSoal, 'skorMaksimal', parseInt(e.target.value) || 0)}
                            className="w-12 text-center text-xs font-mono-num px-1 py-1 border border-slate-200 rounded"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <textarea
                            rows={1}
                            value={item.pembahasan}
                            onChange={(e) => updateSoal(item.noSoal, 'pembahasan', e.target.value)}
                            className="w-full text-[11px] p-1 border border-slate-200 rounded focus:outline-none"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Kolom 2 */}
              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-emerald-900 text-white font-semibold">
                    <tr className="divide-x divide-emerald-800">
                      <th className="py-2 px-3 w-14 text-center">No.</th>
                      <th className="py-2 px-3 w-28 text-center">Kunci</th>
                      <th className="py-2 px-3 w-16 text-center">Skor</th>
                      <th className="py-2 px-3">Pembahasan Ringkas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {rightPg.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-center font-bold font-mono-num text-slate-700">
                          {item.noSoal}.
                        </td>
                        <td className="py-2 px-3 text-center">
                          <select
                            value={item.kunciJawaban}
                            onChange={(e) => updateSoal(item.noSoal, 'kunciJawaban', e.target.value)}
                            className="text-xs px-2 py-1 font-bold font-mono-num text-emerald-900 bg-emerald-50 border border-emerald-200 rounded"
                          >
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="E">E</option>
                          </select>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <input
                            type="number"
                            value={item.skorMaksimal}
                            onChange={(e) => updateSoal(item.noSoal, 'skorMaksimal', parseInt(e.target.value) || 0)}
                            className="w-12 text-center text-xs font-mono-num px-1 py-1 border border-slate-200 rounded"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <textarea
                            rows={1}
                            value={item.pembahasan}
                            onChange={(e) => updateSoal(item.noSoal, 'pembahasan', e.target.value)}
                            className="w-full text-[11px] p-1 border border-slate-200 rounded focus:outline-none"
                          />
                        </td>
                      </tr>
                    ))}
                    {rightPg.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-slate-400 text-xs italic">
                          -
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bagian B: Kunci Jawaban Soal Non-PG (Uraian & PGK) */}
        {nonPgItems.length > 0 && (
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-1.5">
              B. Kunci Jawaban & Panduan Penyelesaian Soal Non-Objektif (Uraian / PGK)
            </h3>

            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-emerald-900 text-white font-semibold divide-x divide-emerald-800">
                  <tr>
                    <th className="py-2 px-3 w-14 text-center">No.</th>
                    <th className="py-2 px-3 w-28 text-center">Bentuk</th>
                    <th className="py-2 px-3 min-w-[280px]">Jawaban Ideal & Langkah Penyelesaian</th>
                    <th className="py-2 px-3 w-24 text-center">Skor Max</th>
                    <th className="py-2 px-3 w-32 text-center no-print">Verifikasi Guru</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {nonPgItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 text-center font-bold font-mono-num text-slate-700 align-top">
                        {item.noSoal}.
                      </td>
                      <td className="py-3 px-3 text-center align-top">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700 text-[11px]">
                          {item.bentukSoal}
                        </span>
                      </td>
                      <td className="py-3 px-3 align-top space-y-2">
                        <textarea
                          rows={4}
                          value={item.kunciJawaban}
                          onChange={(e) => updateSoal(item.noSoal, 'kunciJawaban', e.target.value)}
                          className="w-full text-xs p-2 border border-slate-200 rounded font-medium text-slate-800 focus:outline-none focus:border-emerald-800"
                        />
                        {item.pembahasan && (
                          <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
                            <strong>Catatan Penilaian: </strong>{item.pembahasan}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center align-top">
                        <input
                          type="number"
                          value={item.skorMaksimal}
                          onChange={(e) => updateSoal(item.noSoal, 'skorMaksimal', parseInt(e.target.value) || 0)}
                          className="w-14 text-center text-xs font-mono-num font-bold px-1 py-1 border border-slate-300 rounded"
                        />
                        <span className="text-[10px] text-slate-400 block mt-0.5">Poin</span>
                      </td>
                      <td className="py-3 px-3 text-center align-top no-print">
                        <button
                          onClick={() => updateSoal(item.noSoal, 'needsTeacherCheck', !item.needsTeacherCheck)}
                          className={`px-2 py-1 text-[11px] rounded font-medium transition-colors ${
                            item.needsTeacherCheck
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          }`}
                        >
                          {item.needsTeacherCheck ? 'Perlu Telaah' : 'Sudah Valid'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Rumus Perhitungan Skor Resmi */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-800 space-y-2">
          <p className="font-bold text-slate-900">RUMUS PERHITUNGAN NILAI AKHIR:</p>
          <div className="p-3 bg-white border border-slate-300 rounded font-mono text-center text-xs sm:text-sm font-semibold text-emerald-950">
            Nilai Akhir = (Skor Perolehan / Skor Maksimal) x 100
          </div>
          <p className="text-[11px] text-slate-500">
            Skor total maksimal seluruh butir: {activeProject.skorMaksimal} poin. Nilai minimum tercapai (KKTP): {activeProject.kktp}.
          </p>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2 no-print">
        <button
          onClick={() => setActiveView('naskah-soal')}
          className="text-xs text-slate-600 hover:text-slate-900 font-medium px-3 py-2"
        >
          Kembali ke Naskah Soal
        </button>
        <button
          onClick={() => setActiveView('pedoman-penilaian')}
          className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white font-medium text-xs rounded-lg flex items-center gap-2 shadow-sm transition-colors"
        >
          <span>Lanjut ke Pedoman Penskoran & Rubrik</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
        </button>
      </div>
    </div>
  );
};
