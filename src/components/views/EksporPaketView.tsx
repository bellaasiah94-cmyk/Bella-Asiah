import React, { useState } from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { exportToDocx, exportToExcel, exportToPdf } from '../../utils/exportUtils';
import {
  Download,
  FileText,
  FileSpreadsheet,
  Printer,
  TableProperties,
  CreditCard,
  KeyRound,
  Award,
  CheckCircle2,
  Share2,
} from 'lucide-react';

export const EksporPaketView: React.FC = () => {
  const { activeProject } = useAssessment();
  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<'kisi' | 'kartu' | 'naskah' | 'kunci' | 'rubrik'>('kisi');

  const handleExportDocx = async (mode: 'all' | 'kisi' | 'kartu' | 'naskah' | 'kunci' | 'rubrik') => {
    setDownloadingDocx(true);
    try {
      await exportToDocx(activeProject, mode);
    } catch (err) {
      console.error(err);
      alert('Gagal menghasilkan file Word (.docx).');
    } finally {
      setDownloadingDocx(false);
    }
  };

  const handleExportExcel = () => {
    try {
      exportToExcel(activeProject);
    } catch (err) {
      console.error(err);
      alert('Gagal menghasilkan file Excel (.xlsx).');
    }
  };

  const handleExportPdf = () => {
    try {
      exportToPdf(activeProject);
    } catch (err) {
      console.error(err);
      alert('Gagal menghasilkan file PDF.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">
            Modul 9: Preview & Ekspor Paket Asesmen
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Unduh berkas sungguhan berformat resmi Microsoft Word (.docx), Excel (.xlsx), atau cetak dokumen A4.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Cetak Seluruh Paket (A4)</span>
        </button>
      </div>

      {/* Ekspor Action Center (Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
        {/* Word Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Microsoft Word (.DOCX)</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Format dokumen terformat A4 dengan margin standar, kop surat, tabel kisi-kisi, kartu soal, dan rubrik.
            </p>
          </div>

          <div className="space-y-1.5 pt-2">
            <button
              onClick={() => handleExportDocx('all')}
              disabled={downloadingDocx}
              className="w-full py-2 px-3 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadingDocx ? 'Membuat Word...' : 'Unduh Bundel 5 Perangkat'}</span>
            </button>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={() => handleExportDocx('kisi')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium rounded transition-colors"
              >
                Kisi-Kisi Saja
              </button>
              <button
                onClick={() => handleExportDocx('naskah')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium rounded transition-colors"
              >
                Naskah Soal Saja
              </button>
            </div>
          </div>
        </div>

        {/* Excel Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Microsoft Excel (.XLSX)</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Buku kerja Excel multi-sheet memuat tabel kisi-kisi, kunci penskoran, serta rekapitulasi nilai peserta didik.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleExportExcel}
              className="w-full py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Workbook Excel (.xlsx)</span>
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-1.5">
              3 Sheet: Kisi-Kisi, Kunci, Rekap Nilai Siswa
            </p>
          </div>
        </div>

        {/* PDF Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 mb-3">
              <Printer className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">PDF & Cetak Langsung</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Ekspor berkas PDF ringkas atau gunakan dialog cetak browser (Ctrl + P / Simpan sebagai PDF) tata letak A4.
            </p>
          </div>

          <div className="space-y-1.5 pt-2">
            <button
              onClick={handleExportPdf}
              className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Ringkasan PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="w-full py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium rounded transition-colors"
            >
              Dialog Cetak Browser (A4)
            </button>
          </div>
        </div>
      </div>

      {/* Document Live Preview Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="no-print border-b border-slate-200 px-4 pt-3 bg-slate-50 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActivePreviewTab('kisi')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activePreviewTab === 'kisi'
                ? 'border-emerald-800 text-emerald-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Kisi-Kisi Soal ({activeProject.kisiKisi?.length || 0})
          </button>
          <button
            onClick={() => setActivePreviewTab('kartu')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activePreviewTab === 'kartu'
                ? 'border-emerald-800 text-emerald-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Kartu Soal ({activeProject.soalItems?.length || 0})
          </button>
          <button
            onClick={() => setActivePreviewTab('naskah')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activePreviewTab === 'naskah'
                ? 'border-emerald-800 text-emerald-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Naskah Ujian & LJK
          </button>
          <button
            onClick={() => setActivePreviewTab('kunci')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activePreviewTab === 'kunci'
                ? 'border-emerald-800 text-emerald-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            4. Kunci Jawaban
          </button>
          <button
            onClick={() => setActivePreviewTab('rubrik')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activePreviewTab === 'rubrik'
                ? 'border-emerald-800 text-emerald-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            5. Pedoman & Rekap
          </button>
        </div>

        {/* Preview Content Area */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Preview */}
          <div className="text-center pb-4 border-b border-slate-200">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {activeProject.satuanKerja}
            </p>
            <h3 className="text-base font-bold text-slate-900 uppercase mt-0.5">
              {activeProject.satuanPendidikan}
            </h3>
            <p className="text-xs text-slate-700 mt-1">
              Mata Pelajaran: {activeProject.mataPelajaran} | Kelas: {activeProject.kelas} | Tahun Ajaran: {activeProject.tahunAjaran}
            </p>
          </div>

          {/* Tab 1: Kisi-kisi preview */}
          {activePreviewTab === 'kisi' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-emerald-900 text-white font-semibold">
                  <tr className="divide-x divide-emerald-800">
                    <th className="p-2 text-center w-10">No</th>
                    <th className="p-2 w-48">Materi Ajar</th>
                    <th className="p-2">Indikator Soal</th>
                    <th className="p-2 text-center w-16">Level</th>
                    <th className="p-2 text-center w-16">Bentuk</th>
                    <th className="p-2 text-center w-12">No.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(activeProject.kisiKisi || []).map((k) => (
                    <tr key={k.id} className="hover:bg-slate-50">
                      <td className="p-2 text-center font-bold">{k.no}</td>
                      <td className="p-2 font-medium">{k.materiAjar}</td>
                      <td className="p-2 text-slate-700">{k.indikatorSoal}</td>
                      <td className="p-2 text-center font-bold text-emerald-800">{k.levelKognitif}</td>
                      <td className="p-2 text-center">{k.bentukSoal}</td>
                      <td className="p-2 text-center font-bold">{k.noSoal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 2: Kartu preview */}
          {activePreviewTab === 'kartu' && (
            <div className="space-y-4">
              {(activeProject.soalItems || []).slice(0, 3).map((item) => (
                <div key={item.id} className="border border-slate-300 rounded-lg p-4 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-800 pb-2 border-b border-slate-200">
                    <span>KARTU SOAL NOMOR {item.noSoal} ({item.bentukSoal})</span>
                    <span className="text-emerald-800">Level: {item.levelKognitif}</span>
                  </div>
                  <p><strong>Indikator:</strong> {item.indikatorSoal}</p>
                  {item.stimulus && <p className="italic text-slate-600 bg-amber-50 p-2 rounded">Stimulus: {item.stimulus}</p>}
                  <p className="font-semibold text-slate-900">{item.pertanyaan}</p>
                  <p className="text-emerald-900 font-bold">Kunci: {item.kunciJawaban} | Skor Max: {item.skorMaksimal}</p>
                </div>
              ))}
              {(activeProject.soalItems?.length || 0) > 3 && (
                <p className="text-xs text-slate-400 italic text-center">
                  Menampilkan 3 kartu pertama. Seluruh {activeProject.soalItems?.length} kartu tercakup saat diunduh atau dicetak.
                </p>
              )}
            </div>
          )}

          {/* Tab 3: Naskah preview */}
          {activePreviewTab === 'naskah' && (
            <div className="space-y-4 text-xs">
              {(activeProject.soalItems || []).slice(0, 5).map((item) => (
                <div key={item.id} className="space-y-1.5 pb-3 border-b border-slate-100 last:border-b-0">
                  <p className="font-semibold text-slate-800">
                    {item.noSoal}. {item.pertanyaan}
                  </p>
                  {item.pilihanJawaban && (
                    <div className="grid grid-cols-2 gap-2 pl-4 text-slate-600">
                      {item.pilihanJawaban.map((opt) => (
                        <div key={opt.key}>{opt.key}. {opt.text}</div>
                      ))}
                    </div>
                  )}
                  {item.bentukSoal === 'Uraian' && (
                    <p className="italic text-slate-400 pl-4">[Ruang pengerjaan jawaban uraian...]</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Kunci preview */}
          {activePreviewTab === 'kunci' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-emerald-900 text-white font-semibold">
                  <tr>
                    <th className="p-2 text-center w-12">No</th>
                    <th className="p-2 w-20">Bentuk</th>
                    <th className="p-2">Kunci Jawaban</th>
                    <th className="p-2 text-center w-20">Skor Max</th>
                    <th className="p-2">Pembahasan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(activeProject.soalItems || []).map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-2 text-center font-bold">{s.noSoal}</td>
                      <td className="p-2">{s.bentukSoal}</td>
                      <td className="p-2 font-bold text-emerald-900">{s.kunciJawaban}</td>
                      <td className="p-2 text-center font-bold">{s.skorMaksimal}</td>
                      <td className="p-2 text-slate-600">{s.pembahasan || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 5: Rubrik preview */}
          {activePreviewTab === 'rubrik' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <p className="font-bold text-slate-800">Rumus Penentuan Nilai:</p>
                <p className="font-mono text-emerald-900 mt-0.5">{activeProject.rumusNilai}</p>
                <p className="text-slate-500 mt-1">Batas Ketercapaian (KKTP): {activeProject.kktp}</p>
              </div>

              {(activeProject.rubrikList || []).map((r) => (
                <div key={r.id} className="border border-slate-200 rounded p-3 space-y-2">
                  <p className="font-bold text-slate-800">Rubrik Soal No. {r.noSoal}: {r.aspek}</p>
                  <div className="space-y-1">
                    {r.kriteriaSkor.map((k, idx) => (
                      <div key={idx} className="flex gap-2 text-slate-700">
                        <span className="font-bold w-12 shrink-0">Skor {k.skor}:</span>
                        <span>{k.deskripsi}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
