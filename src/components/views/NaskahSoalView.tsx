import React, { useState } from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { SoalItem, QuestionType, CognitiveLevel } from '../../types/assessment';
import {
  FileSpreadsheet,
  Sparkles,
  Printer,
  Plus,
  Trash2,
  RefreshCw,
  FolderSync,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';

export const NaskahSoalView: React.FC = () => {
  const { activeProject, updateActiveProject, syncAllDevices, setActiveView } = useAssessment();
  const [generatingAI, setGeneratingAI] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showLJK, setShowLJK] = useState(activeProject.includeLJK ?? true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const soalItems = activeProject.soalItems || [];

  const handleGenerateSoalAI = async () => {
    if (!activeProject.kisiKisi || activeProject.kisiKisi.length === 0) {
      setErrorMessage('Kisi-kisi soal masih kosong. Silakan buat atau generate kisi-kisi di Modul 3 terlebih dahulu.');
      return;
    }

    setGeneratingAI(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/gemini/generate-naskah-soal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: {
            title: activeProject.title,
            mataPelajaran: activeProject.mataPelajaran,
            kelas: activeProject.kelas,
            kurikulum: activeProject.kurikulum,
            bukuAcuan: activeProject.bukuAcuan,
          },
          kisiKisi: activeProject.kisiKisi,
        }),
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.success) {
        throw new Error(resJson.error || 'Gagal menghasilkan butir soal dari AI.');
      }

      const generated: any[] = resJson.data;
      if (Array.isArray(generated)) {
        const mappedSoal: SoalItem[] = generated.map((item: any, idx: number) => {
          const correspondingKisi = activeProject.kisiKisi[idx] || activeProject.kisiKisi[0];
          return {
            id: `soal-${Date.now()}-${item.noSoal || idx + 1}`,
            noSoal: item.noSoal || idx + 1,
            bentukSoal: (item.bentukSoal || correspondingKisi?.bentukSoal || 'PG') as QuestionType,
            stimulus: item.stimulus || undefined,
            pertanyaan: item.pertanyaan || 'Pertanyaan butir soal...',
            pilihanJawaban: item.pilihanJawaban || undefined,
            pilihanKompleks: item.pilihanKompleks || undefined,
            kunciJawaban: item.kunciJawaban || (item.bentukSoal === 'PG' ? 'A' : 'Jawaban ideal...'),
            pembahasan: item.pembahasan || 'Pembahasan butir soal...',
            levelKognitif: (item.levelKognitif || correspondingKisi?.levelKognitif || 'C2') as CognitiveLevel,
            materi: item.materi || correspondingKisi?.materiAjar || activeProject.materiPokok,
            indikatorSoal: item.indikatorSoal || correspondingKisi?.indikatorSoal || '',
            skorMaksimal: Number(item.skorMaksimal) || (item.bentukSoal === 'Uraian' ? 20 : 10),
            needsTeacherCheck: false,
          };
        });

        updateActiveProject({ soalItems: mappedSoal });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat menyusun naskah soal.');
    } finally {
      setGeneratingAI(false);
    }
  };

  const updateSoal = (index: number, field: keyof SoalItem, value: any) => {
    const updated = soalItems.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    updateActiveProject({ soalItems: updated });
  };

  const updateOptionText = (soalIdx: number, optKey: string, text: string) => {
    const soal = soalItems[soalIdx];
    if (!soal || !soal.pilihanJawaban) return;
    const updatedOptions = soal.pilihanJawaban.map((opt) => (opt.key === optKey ? { ...opt, text } : opt));
    updateSoal(soalIdx, 'pilihanJawaban', updatedOptions);
  };

  const addSoalManually = () => {
    const nextNo = soalItems.length + 1;
    const newSoal: SoalItem = {
      id: `soal-${Date.now()}-${nextNo}`,
      noSoal: nextNo,
      bentukSoal: 'PG',
      pertanyaan: 'Ketikkan teks pertanyaan baru di sini...',
      pilihanJawaban: [
        { key: 'A', text: 'Pilihan jawaban A' },
        { key: 'B', text: 'Pilihan jawaban B' },
        { key: 'C', text: 'Pilihan jawaban C' },
        { key: 'D', text: 'Pilihan jawaban D' },
      ],
      kunciJawaban: 'A',
      pembahasan: 'Pembahasan jawaban...',
      levelKognitif: 'C2',
      materi: activeProject.materiPokok || 'Materi...',
      indikatorSoal: 'Indikator soal...',
      skorMaksimal: 10,
    };
    updateActiveProject({ soalItems: [...soalItems, newSoal] });
    setEditingIndex(soalItems.length);
  };

  const removeSoal = (index: number) => {
    const filtered = soalItems.filter((_, i) => i !== index);
    const renumbered = filtered.map((s, i) => ({ ...s, noSoal: i + 1 }));
    updateActiveProject({ soalItems: renumbered });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">
            Modul 5: Naskah Soal Ujian & Lembar Jawaban (LJK)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Format baku siap cetak A4: stimulus autentik, opsi homogen tanpa petunjuk bocoran, dan ruang jawaban uraian.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-slate-700 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={showLJK}
              onChange={(e) => {
                setShowLJK(e.target.checked);
                updateActiveProject({ includeLJK: e.target.checked });
              }}
              className="rounded text-emerald-800"
            />
            <span>Sertakan Lembar LJK</span>
          </label>

          <button
            onClick={addSoalManually}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Soal</span>
          </button>

          <button
            onClick={handleGenerateSoalAI}
            disabled={generatingAI}
            className="px-4 py-1.5 bg-emerald-900 hover:bg-emerald-800 disabled:opacity-50 text-white font-medium text-xs rounded-lg flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap"
          >
            {generatingAI ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
                <span>Menyusun Butir Soal...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Hasilkan Soal dari Kisi-Kisi (AI)</span>
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

      {/* Naskah Soal Printable Sheet */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-8 sm:p-10 print-page space-y-6">
        {/* Kop Naskah Ujian Resmi */}
        <div className="border-b-2 border-slate-800 pb-4 text-center">
          <p className="text-xs font-bold tracking-widest text-slate-700 uppercase">
            {activeProject.satuanKerja}
          </p>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-heading uppercase mt-0.5">
            {activeProject.satuanPendidikan}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            NASKAH SOAL {activeProject.jenisAsesmen.toUpperCase()} TAHUN AJARAN {activeProject.tahunAjaran}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-200 text-left text-xs text-slate-800">
            <div>
              <span className="text-slate-500">Mata Pelajaran: </span>
              <span className="font-semibold">{activeProject.mataPelajaran}</span>
            </div>
            <div>
              <span className="text-slate-500">Kelas / Semester: </span>
              <span className="font-semibold">{activeProject.kelas} / {activeProject.semester}</span>
            </div>
            <div>
              <span className="text-slate-500">Alokasi Waktu: </span>
              <span className="font-semibold">{activeProject.alokasiWaktu}</span>
            </div>
            <div>
              <span className="text-slate-500">Penyusun: </span>
              <span className="font-semibold">{activeProject.namaGuru}</span>
            </div>
          </div>
        </div>

        {/* Petunjuk Pengerjaan */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
          <p className="font-bold text-slate-900">PETUNJUK UMUM:</p>
          <ol className="list-decimal list-inside space-y-0.5 pl-1">
            <li>Mulailah dengan berdoa sesuai agama dan keyakinan masing-masing.</li>
            <li>Tulislah nama, nomor peserta, dan kelas pada lembar jawaban yang telah disediakan.</li>
            <li>Periksa dan bacalah setiap butir soal dengan cermat sebelum menjawab.</li>
            <li>Pilihlah salah satu jawaban yang paling tepat dengan memberi tanda silang (X) pada lembar jawaban.</li>
            <li>Untuk soal uraian, jawablah secara sistematis dan jelas dengan memperhatikan langkah penyelesaian.</li>
          </ol>
        </div>

        {/* Butir Soal List */}
        <div className="space-y-6 pt-2">
          {soalItems.map((item, idx) => {
            const isEditing = editingIndex === idx;

            return (
              <div
                key={item.id}
                className="group p-3 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50/50 transition-colors relative"
              >
                {/* Stimulus jika ada */}
                {item.stimulus && (
                  <div className="mb-2 p-3 bg-amber-50/60 border border-amber-200 rounded text-xs text-slate-800 leading-relaxed">
                    <span className="font-semibold text-amber-900">[Stimulus]: </span>
                    {item.stimulus}
                  </div>
                )}

                {/* Nomor dan Pertanyaan */}
                <div className="flex items-start gap-2.5">
                  <span className="font-bold text-sm text-slate-900 font-mono-num shrink-0 pt-0.5">
                    {item.noSoal}.
                  </span>
                  <div className="flex-1 space-y-2">
                    {isEditing ? (
                      <textarea
                        rows={3}
                        value={item.pertanyaan}
                        onChange={(e) => updateSoal(idx, 'pertanyaan', e.target.value)}
                        className="w-full text-xs p-2 border border-slate-300 rounded focus:border-emerald-800 focus:outline-none"
                      />
                    ) : (
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                        {item.pertanyaan}
                      </p>
                    )}

                    {/* Opsi Pilihan Ganda */}
                    {item.pilihanJawaban && item.pilihanJawaban.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                        {item.pilihanJawaban.map((opt) => (
                          <div key={opt.key} className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded border border-slate-300 flex items-center justify-center font-bold text-[11px] text-slate-700 bg-white shrink-0 mt-0.5">
                              {opt.key}
                            </span>
                            {isEditing ? (
                              <input
                                type="text"
                                value={opt.text}
                                onChange={(e) => updateOptionText(idx, opt.key, e.target.value)}
                                className="w-full text-xs px-2 py-1 border border-slate-200 rounded"
                              />
                            ) : (
                              <span className="text-slate-700 leading-snug">{opt.text}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* PG Kompleks Checklist */}
                    {item.pilihanKompleks && item.pilihanKompleks.length > 0 && (
                      <div className="space-y-1.5 pt-2 text-xs">
                        {item.pilihanKompleks.map((comp, cIdx) => (
                          <div key={cIdx} className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200">
                            <input type="checkbox" disabled className="rounded text-emerald-800" />
                            <span className="text-slate-700">{comp.text}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Ruang Jawaban Uraian */}
                    {item.bentukSoal === 'Uraian' && (
                      <div className="mt-3 p-3 bg-slate-50 border border-dashed border-slate-300 rounded text-xs text-slate-400">
                        <p className="font-semibold text-slate-500 mb-2">Ruang Jawaban Peserta Didik:</p>
                        <div className="space-y-3">
                          <div className="border-b border-slate-300 h-3" />
                          <div className="border-b border-slate-300 h-3" />
                          <div className="border-b border-slate-300 h-3" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Inline action buttons */}
                <div className="no-print absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                  <button
                    onClick={() => setEditingIndex(isEditing ? null : idx)}
                    className="px-2 py-1 text-[11px] text-slate-700 hover:text-emerald-800 font-medium"
                  >
                    {isEditing ? 'Selesai Edit' : 'Edit Butir'}
                  </button>
                  <button
                    onClick={() => removeSoal(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    title="Hapus Soal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {soalItems.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs italic">
              Naskah soal belum dibuat. Klik "Hasilkan Soal dari Kisi-Kisi (AI)" atau "Tambah Soal" di kanan atas.
            </div>
          )}
        </div>
      </div>

      {/* Lembar Jawaban Komputer / Manual (LJK Grid) */}
      {showLJK && (
        <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-8 sm:p-10 print-page space-y-4">
          <div className="text-center pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold uppercase tracking-wider text-slate-900 font-heading">
              LEMBAR JAWABAN PILIHAN GANDA (LJK)
            </h3>
            <p className="text-xs text-slate-600 uppercase">
              Beri tanda silang (X) pada salah satu huruf pilihan jawaban yang dianggap benar
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs py-2 border-b border-slate-200">
            <div>
              <p><span className="w-24 inline-block text-slate-500">Nama Siswa</span>: ..............................................................</p>
              <p className="mt-1"><span className="w-24 inline-block text-slate-500">Nomor Peserta</span>: ..............................................................</p>
            </div>
            <div>
              <p><span className="w-24 inline-block text-slate-500">Kelas / Ruang</span>: ..............................................................</p>
              <p className="mt-1"><span className="w-24 inline-block text-slate-500">Tanda Tangan</span>: ..............................................................</p>
            </div>
          </div>

          {/* 50 Questions Grid (5 columns of 10 items) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {[0, 10, 20, 30, 40].map((startNum) => (
              <div key={startNum} className="space-y-1.5 border-r border-slate-200 pr-2 last:border-r-0">
                {Array.from({ length: 10 }).map((_, i) => {
                  const qNum = startNum + i + 1;
                  return (
                    <div key={qNum} className="flex items-center justify-between text-xs font-mono-num">
                      <span className="w-6 font-semibold text-slate-600 text-right pr-1">
                        {qNum}.
                      </span>
                      <div className="flex items-center gap-1">
                        {['A', 'B', 'C', 'D'].map((letter) => (
                          <span
                            key={letter}
                            className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center text-[10px] text-slate-600"
                          >
                            {letter.toLowerCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 italic pt-2">
            Perhatian: Teliti kembali hasil pekerjaan Anda sebelum dikumpulkan kepada pengawas ujian.
          </p>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2 no-print">
        <button
          onClick={() => setActiveView('kartu-soal')}
          className="text-xs text-slate-600 hover:text-slate-900 font-medium px-3 py-2"
        >
          Kembali ke Kartu Soal
        </button>
        <button
          onClick={() => {
            syncAllDevices();
            setActiveView('kunci-jawaban');
          }}
          className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white font-medium text-xs rounded-lg flex items-center gap-2 shadow-sm transition-colors"
        >
          <span>Lanjut ke Kunci Jawaban & Pembahasan</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
        </button>
      </div>
    </div>
  );
};
