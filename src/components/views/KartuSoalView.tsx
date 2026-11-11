import React, { useState } from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { SoalItem, CognitiveLevel, QuestionType } from '../../types/assessment';
import {
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Printer,
  Copy,
  Trash2,
  FolderSync,
  Save,
  Check,
  Eye,
  Grid,
} from 'lucide-react';

export const KartuSoalView: React.FC = () => {
  const { activeProject, updateActiveProject, syncAllDevices, setActiveView } = useAssessment();
  const [selectedSoalIndex, setSelectedSoalIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');
  const [saveToast, setSaveToast] = useState(false);

  const soalItems = activeProject.soalItems || [];
  const currentSoal = soalItems[selectedSoalIndex] || null;

  const handleUpdateCurrentSoal = (field: keyof SoalItem, value: any) => {
    if (!currentSoal) return;
    const updated = soalItems.map((s, idx) => (idx === selectedSoalIndex ? { ...s, [field]: value } : s));
    updateActiveProject({ soalItems: updated });
  };

  const handleUpdateOption = (optKey: string, text: string) => {
    if (!currentSoal || !currentSoal.pilihanJawaban) return;
    const updatedOptions = currentSoal.pilihanJawaban.map((opt) =>
      opt.key === optKey ? { ...opt, text } : opt
    );
    handleUpdateCurrentSoal('pilihanJawaban', updatedOptions);
  };

  const handleDuplicateCurrent = () => {
    if (!currentSoal) return;
    const nextNo = soalItems.length + 1;
    const duplicated: SoalItem = {
      ...currentSoal,
      id: `soal-${Date.now()}-${nextNo}`,
      noSoal: nextNo,
    };
    updateActiveProject({ soalItems: [...soalItems, duplicated] });
    setSelectedSoalIndex(soalItems.length);
  };

  const handleDeleteCurrent = () => {
    if (!currentSoal || soalItems.length <= 1) {
      alert('Minimal harus ada 1 butir soal tersimpan.');
      return;
    }
    const filtered = soalItems.filter((_, idx) => idx !== selectedSoalIndex);
    const renumbered = filtered.map((s, idx) => ({ ...s, noSoal: idx + 1 }));
    updateActiveProject({ soalItems: renumbered });
    setSelectedSoalIndex(Math.max(0, selectedSoalIndex - 1));
  };

  const handlePrint = () => {
    window.print();
  };

  if (soalItems.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 border border-slate-200 text-center space-y-4 max-w-xl mx-auto my-12">
        <CreditCard className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">Kartu Soal Belum Tersedia</h3>
        <p className="text-xs text-slate-500">
          Kartu soal bersumber dari kisi-kisi dan naskah soal yang sinkron. Buat kisi-kisi terlebih dahulu, lalu klik tombol sinkronisasi.
        </p>
        <div className="pt-2">
          <button
            onClick={() => {
              syncAllDevices();
              setActiveView('kisi-kisi');
            }}
            className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-medium rounded-lg"
          >
            Buka Kisi-Kisi Soal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">
            Modul 4: Kartu Soal Terintegrasi (Format Baku)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Setiap butir tersinkronisasi dengan kisi-kisi dan naskah soal: identitas sekolah, buku acuan, level kognitif, indikator, stimulus, dan kunci.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setViewMode('single')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'single'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mode Kartu Tunggal
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lihat Seluruh Kartu
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak A4</span>
          </button>
        </div>
      </div>

      {/* Number Tabs for Single View */}
      {viewMode === 'single' && (
        <div className="no-print bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-3xl">
            {soalItems.map((item, idx) => {
              const isSelected = idx === selectedSoalIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedSoalIndex(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-mono-num font-semibold shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-emerald-900 text-amber-300 shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.noSoal}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setSelectedSoalIndex((prev) => Math.max(0, prev - 1))}
              disabled={selectedSoalIndex === 0}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50"
              title="Soal Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono-num text-slate-600 font-medium px-2">
              {selectedSoalIndex + 1} / {soalItems.length}
            </span>
            <button
              onClick={() => setSelectedSoalIndex((prev) => Math.min(soalItems.length - 1, prev + 1))}
              disabled={selectedSoalIndex === soalItems.length - 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50"
              title="Soal Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-slate-300 mx-1">|</span>
            <button
              onClick={handleDuplicateCurrent}
              className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-800 hover:bg-slate-100"
              title="Duplikasi Kartu Ini"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={handleDeleteCurrent}
              className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-slate-100"
              title="Hapus Kartu Ini"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Render Single Card or All Cards */}
      <div className="space-y-8">
        {(viewMode === 'single' ? [currentSoal] : soalItems).map((item, idx) => {
          if (!item) return null;
          return (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-300 shadow-sm p-6 sm:p-8 print-page"
            >
              {/* Card Title Kop */}
              <div className="text-center pb-4 border-b border-slate-300">
                <h3 className="text-base font-bold tracking-wider text-slate-900 font-heading">
                  KARTU SOAL
                </h3>
                <p className="text-xs font-semibold text-slate-700 uppercase">
                  TAHUN PELAJARAN {activeProject.tahunAjaran}
                </p>
              </div>

              {/* Identity Header */}
              <div className="grid grid-cols-2 gap-4 py-3 text-xs border-b border-slate-300 text-slate-800">
                <div className="space-y-1">
                  <div className="flex">
                    <span className="w-28 font-medium text-slate-600">Jenjang Sekolah</span>
                    <span className="font-semibold">: {activeProject.jenjang}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 font-medium text-slate-600">Mata Pelajaran</span>
                    <span className="font-semibold">: {activeProject.mataPelajaran}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 font-medium text-slate-600">Kelas / Semester</span>
                    <span className="font-semibold">: {activeProject.kelas} / {activeProject.semester}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex">
                    <span className="w-28 font-medium text-slate-600">Satuan Kerja</span>
                    <span className="font-semibold">: {activeProject.satuanKerja}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 font-medium text-slate-600">Penyusun</span>
                    <span className="font-semibold">: {activeProject.namaGuru}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 font-medium text-slate-600">Bentuk Soal</span>
                    <span className="font-semibold text-emerald-800">: {item.bentukSoal}</span>
                  </div>
                </div>
              </div>

              {/* Card Body Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-12 border border-slate-300 mt-4 text-xs divide-y md:divide-y-0 md:divide-x divide-slate-300">
                {/* Left Side: Kompetensi, Materi, Indikator (5 cols) */}
                <div className="md:col-span-5 p-4 space-y-4 bg-slate-50/50">
                  <div>
                    <span className="block font-bold text-slate-800 mb-1">
                      Capaian Pembelajaran (CP) / Kompetensi:
                    </span>
                    <p className="text-slate-700 leading-relaxed text-[11px] bg-white p-2.5 rounded border border-slate-200">
                      {activeProject.capaianPembelajaran || 'Belum diisi'}
                    </p>
                  </div>

                  <div>
                    <span className="block font-bold text-slate-800 mb-1">Materi:</span>
                    {viewMode === 'single' ? (
                      <input
                        type="text"
                        value={item.materi}
                        onChange={(e) => handleUpdateCurrentSoal('materi', e.target.value)}
                        className="w-full text-xs p-2 bg-white rounded border border-slate-200 focus:outline-none focus:border-emerald-800"
                      />
                    ) : (
                      <p className="text-slate-800 font-medium">{item.materi}</p>
                    )}
                  </div>

                  <div>
                    <span className="block font-bold text-slate-800 mb-1">Indikator Soal:</span>
                    {viewMode === 'single' ? (
                      <textarea
                        rows={3}
                        value={item.indikatorSoal}
                        onChange={(e) => handleUpdateCurrentSoal('indikatorSoal', e.target.value)}
                        className="w-full text-xs p-2 bg-white rounded border border-slate-200 focus:outline-none focus:border-emerald-800"
                      />
                    ) : (
                      <p className="text-slate-700 leading-relaxed text-[11px]">{item.indikatorSoal}</p>
                    )}
                  </div>
                </div>

                {/* Right Side: Buku Acuan, Parameter, Deskripsi Soal (7 cols) */}
                <div className="md:col-span-7 p-4 space-y-4">
                  {/* Top strip of card right side */}
                  <div className="grid grid-cols-3 gap-2 pb-3 border-b border-slate-200">
                    <div>
                      <span className="block text-[11px] text-slate-500 font-medium">Buku Acuan / Rujukan:</span>
                      <p className="font-semibold text-slate-800 text-[11px] truncate">
                        {activeProject.bukuAcuan}
                      </p>
                    </div>
                    <div className="text-center">
                      <span className="block text-[11px] text-slate-500 font-medium">No. Soal:</span>
                      <p className="font-bold text-slate-900 text-sm font-mono-num">{item.noSoal}</p>
                    </div>
                    <div className="text-center">
                      <span className="block text-[11px] text-slate-500 font-medium">Level Kognitif:</span>
                      <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold font-mono-num text-xs mt-0.5">
                        {item.levelKognitif}
                      </span>
                    </div>
                  </div>

                  {/* Stimulus & Deskripsi Soal */}
                  <div>
                    <span className="block font-bold text-slate-800 mb-1">
                      Deskripsi Soal & Stimulus:
                    </span>
                    {item.stimulus && (
                      <div className="mb-2 p-2.5 bg-amber-50/50 border border-amber-200/80 rounded text-[11px] text-slate-700 italic">
                        <span className="font-semibold not-italic text-amber-900">[Stimulus]: </span>
                        {item.stimulus}
                      </div>
                    )}

                    <div className="p-3 bg-white border border-slate-200 rounded text-xs space-y-2.5">
                      {viewMode === 'single' ? (
                        <textarea
                          rows={3}
                          value={item.pertanyaan}
                          onChange={(e) => handleUpdateCurrentSoal('pertanyaan', e.target.value)}
                          className="w-full text-xs p-2 border border-slate-200 rounded focus:border-emerald-800 focus:outline-none font-medium"
                        />
                      ) : (
                        <p className="font-semibold text-slate-800">{item.pertanyaan}</p>
                      )}

                      {/* Options for PG */}
                      {item.pilihanJawaban && item.pilihanJawaban.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          {item.pilihanJawaban.map((opt) => (
                            <div key={opt.key} className="flex items-center gap-2 text-xs">
                              <span
                                className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] ${
                                  opt.key === item.kunciJawaban
                                    ? 'bg-emerald-800 text-white'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {opt.key}
                              </span>
                              {viewMode === 'single' ? (
                                <input
                                  type="text"
                                  value={opt.text}
                                  onChange={(e) => handleUpdateOption(opt.key, e.target.value)}
                                  className="w-full text-xs px-2 py-1 border border-slate-200 rounded"
                                />
                              ) : (
                                <span className="text-slate-700">{opt.text}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Kunci Jawaban & Skor Maksimal */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200">
                      <span className="block text-[11px] text-emerald-800 font-semibold">Kunci Jawaban:</span>
                      <p className="text-xs font-bold text-emerald-950 mt-0.5">{item.kunciJawaban}</p>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                      <span className="block text-[11px] text-slate-600 font-semibold">Skor Maksimal:</span>
                      <p className="text-xs font-bold text-slate-900 mt-0.5 font-mono-num">{item.skorMaksimal} Poin</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
