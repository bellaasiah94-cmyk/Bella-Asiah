import React, { useState } from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { KisiKisiItem, CognitiveLevel, QuestionType } from '../../types/assessment';
import {
  TableProperties,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  RefreshCw,
  Search,
  Filter,
  ArrowRight,
  AlertCircle,
  FolderSync,
  Layers,
} from 'lucide-react';

export const KisiKisiView: React.FC = () => {
  const { activeProject, updateActiveProject, setActiveView, syncAllDevices } = useAssessment();
  const [loadingAI, setLoadingAI] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterBentuk, setFilterBentuk] = useState<string>('all');

  const kisiList = activeProject.kisiKisi || [];

  const handleGenerateAI = async () => {
    if (!activeProject.capaianPembelajaran && (!activeProject.tujuanPembelajaranList || activeProject.tujuanPembelajaranList.length === 0)) {
      setErrorMessage('Isi Capaian Pembelajaran (CP) atau minimal satu Tujuan Pembelajaran (TP) di Modul 2 terlebih dahulu.');
      return;
    }

    setLoadingAI(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/gemini/generate-kisi-kisi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mataPelajaran: activeProject.mataPelajaran,
          kelas: activeProject.kelas,
          jenjang: activeProject.jenjang,
          capaianPembelajaran: activeProject.capaianPembelajaran,
          tujuanPembelajaranList: activeProject.tujuanPembelajaranList,
          materiPokok: activeProject.materiPokok,
          kbcTopic: activeProject.kbcTopic,
          materiInsersiKBC: activeProject.materiInsersiKBC,
          jumlahSoal: activeProject.jumlahSoal,
          distribusiBentuk: activeProject.distribusiBentuk,
          distribusiLevel: activeProject.distribusiLevel,
          ketentuanTambahan: activeProject.ketentuanTambahan,
        }),
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.success) {
        throw new Error(resJson.error || 'Gagal menghasilkan kisi-kisi.');
      }

      const rawItems = resJson.data;
      if (Array.isArray(rawItems)) {
        const mapped: KisiKisiItem[] = rawItems.map((item: any, idx: number) => ({
          id: `kisi-${Date.now()}-${idx + 1}`,
          no: idx + 1,
          capaianPembelajaran: item.capaianPembelajaran || activeProject.capaianPembelajaran,
          tujuanPembelajaran: item.tujuanPembelajaran || (activeProject.tujuanPembelajaranList?.[0] || ''),
          materiAjar: item.materiAjar || activeProject.materiPokok,
          indikatorSoal: item.indikatorSoal || 'Disajikan materi, peserta didik dapat menyelesaikan soal dengan tepat',
          levelKognitif: (item.levelKognitif || 'C2') as CognitiveLevel,
          bentukSoal: (item.bentukSoal || 'PG') as QuestionType,
          noSoal: item.noSoal || idx + 1,
        }));

        updateActiveProject({ kisiKisi: mapped });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat memanggil AI.');
    } finally {
      setLoadingAI(false);
    }
  };

  const updateItem = (id: string, field: keyof KisiKisiItem, value: any) => {
    const updated = kisiList.map((item) => (item.id === id ? { ...item, [field]: value } : item));
    updateActiveProject({ kisiKisi: updated });
  };

  const addItem = () => {
    const nextNo = kisiList.length + 1;
    const newItem: KisiKisiItem = {
      id: `kisi-${Date.now()}-${nextNo}`,
      no: nextNo,
      capaianPembelajaran: activeProject.capaianPembelajaran || 'Capaian Pembelajaran...',
      tujuanPembelajaran: activeProject.tujuanPembelajaranList?.[0] || 'Tujuan Pembelajaran...',
      materiAjar: activeProject.materiPokok || 'Materi...',
      indikatorSoal: 'Disajikan ..., peserta didik dapat ... dengan tepat',
      levelKognitif: 'C2',
      bentukSoal: 'PG',
      noSoal: nextNo,
    };
    updateActiveProject({ kisiKisi: [...kisiList, newItem] });
  };

  const removeItem = (id: string) => {
    const filtered = kisiList.filter((item) => item.id !== id);
    // Renumber
    const renumbered = filtered.map((item, idx) => ({
      ...item,
      no: idx + 1,
      noSoal: idx + 1,
    }));
    updateActiveProject({ kisiKisi: renumbered });
  };

  const duplicateItem = (item: KisiKisiItem) => {
    const nextNo = kisiList.length + 1;
    const duplicated: KisiKisiItem = {
      ...item,
      id: `kisi-${Date.now()}-${nextNo}`,
      no: nextNo,
      noSoal: nextNo,
    };
    updateActiveProject({ kisiKisi: [...kisiList, duplicated] });
  };

  const autoRenumber = () => {
    const renumbered = kisiList.map((item, idx) => ({
      ...item,
      no: idx + 1,
      noSoal: idx + 1,
    }));
    updateActiveProject({ kisiKisi: renumbered });
  };

  // Filter & Search
  const filteredKisi = kisiList.filter((item) => {
    const matchesSearch =
      item.indikatorSoal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.materiAjar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tujuanPembelajaran.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'all' || item.levelKognitif === filterLevel;
    const matchesBentuk = filterBentuk === 'all' || item.bentukSoal === filterBentuk;
    return matchesSearch && matchesLevel && matchesBentuk;
  });

  // Kognitif summary
  const c1Count = kisiList.filter((k) => k.levelKognitif === 'C1').length;
  const c2Count = kisiList.filter((k) => k.levelKognitif === 'C2').length;
  const c3Count = kisiList.filter((k) => k.levelKognitif === 'C3').length;
  const c4Count = kisiList.filter((k) => k.levelKognitif === 'C4').length;
  const c5Count = kisiList.filter((k) => k.levelKognitif === 'C5').length;
  const c6Count = kisiList.filter((k) => k.levelKognitif === 'C6').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">
            Modul 3: Matriks Kisi-Kisi Penulisan Soal (8 Kolom)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Format baku Kurikulum Merdeka & KBC: Nomor, CP, TP, Materi Ajar, Indikator Soal, Level Kognitif C1-C6, Bentuk Soal, dan Nomor Soal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={addItem}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Baris</span>
          </button>

          <button
            onClick={handleGenerateAI}
            disabled={loadingAI}
            className="px-4 py-1.5 bg-emerald-900 hover:bg-emerald-800 disabled:opacity-50 text-white font-medium text-xs rounded-lg flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap"
          >
            {loadingAI ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
                <span>Menyusun Kisi-Kisi...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Hasilkan Kisi-Kisi dengan AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Cognitive distribution telemetry strip */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs">
          <span className="font-semibold text-slate-700">Distribusi Level Kognitif:</span>
          <div className="flex items-center gap-1.5 font-mono-num text-[11px]">
            <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700">C1: {c1Count}</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700">C2: {c2Count}</span>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded font-medium">C3: {c3Count}</span>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded font-medium">C4: {c4Count}</span>
            <span className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded font-medium">C5: {c5Count}</span>
            <span className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded font-medium">C6: {c6Count}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={autoRenumber}
            className="text-xs text-slate-600 hover:text-slate-900 font-medium px-2 py-1 rounded bg-slate-50 border border-slate-200"
            title="Urutkan kembali penomoran soal 1 s/d N"
          >
            Urutkan Nomor
          </button>
          <button
            onClick={() => syncAllDevices()}
            className="text-xs text-emerald-800 hover:text-emerald-950 font-medium px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 flex items-center gap-1"
          >
            <FolderSync className="w-3.5 h-3.5" />
            <span>Sinkronkan ke Naskah Soal</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-100/70 p-2.5 rounded-xl border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari indikator, materi, atau tujuan..."
            className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700"
          >
            <option value="all">Semua Level</option>
            <option value="C1">C1 - Mengingat</option>
            <option value="C2">C2 - Memahami</option>
            <option value="C3">C3 - Menerapkan</option>
            <option value="C4">C4 - Menganalisis</option>
            <option value="C5">C5 - Mengevaluasi</option>
            <option value="C6">C6 - Mengkreasi</option>
          </select>

          <select
            value={filterBentuk}
            onChange={(e) => setFilterBentuk(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700"
          >
            <option value="all">Semua Bentuk</option>
            <option value="PG">Pilihan Ganda (PG)</option>
            <option value="PGK">PG Kompleks (PGK)</option>
            <option value="Uraian">Uraian</option>
            <option value="Menjodohkan">Menjodohkan</option>
            <option value="Isian">Isian Singkat</option>
            <option value="BenarSalah">Benar-Salah</option>
          </select>
        </div>
      </div>

      {/* The 8-Column Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-emerald-900 text-white font-semibold divide-x divide-emerald-800">
                <th className="py-2.5 px-3 w-12 text-center">No.</th>
                <th className="py-2.5 px-3 w-56">Capaian Pembelajaran (CP)</th>
                <th className="py-2.5 px-3 w-56">Tujuan Pembelajaran (TP)</th>
                <th className="py-2.5 px-3 w-44">Materi Ajar</th>
                <th className="py-2.5 px-3 min-w-[240px]">Indikator Soal</th>
                <th className="py-2.5 px-2.5 w-24 text-center">Level</th>
                <th className="py-2.5 px-2.5 w-28 text-center">Bentuk</th>
                <th className="py-2.5 px-2 w-16 text-center">No. Soal</th>
                <th className="py-2.5 px-2 w-20 text-center">Aksi</th>
              </tr>
              <tr className="bg-emerald-950 text-emerald-200 text-[10px] text-center font-mono-num border-t border-emerald-800">
                <td className="py-1">1</td>
                <td className="py-1">2</td>
                <td className="py-1">3</td>
                <td className="py-1">4</td>
                <td className="py-1">5</td>
                <td className="py-1">6</td>
                <td className="py-1">7</td>
                <td className="py-1">8</td>
                <td className="py-1">-</td>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredKisi.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2 px-3 text-center font-mono-num font-semibold text-slate-600 align-top">
                    {row.no}
                  </td>
                  <td className="py-2 px-3 align-top">
                    <textarea
                      rows={3}
                      value={row.capaianPembelajaran}
                      onChange={(e) => updateItem(row.id, 'capaianPembelajaran', e.target.value)}
                      className="w-full text-xs p-1.5 border border-slate-200 rounded focus:border-emerald-800 focus:outline-none"
                    />
                  </td>
                  <td className="py-2 px-3 align-top">
                    <textarea
                      rows={3}
                      value={row.tujuanPembelajaran}
                      onChange={(e) => updateItem(row.id, 'tujuanPembelajaran', e.target.value)}
                      className="w-full text-xs p-1.5 border border-slate-200 rounded focus:border-emerald-800 focus:outline-none"
                    />
                  </td>
                  <td className="py-2 px-3 align-top">
                    <textarea
                      rows={3}
                      value={row.materiAjar}
                      onChange={(e) => updateItem(row.id, 'materiAjar', e.target.value)}
                      className="w-full text-xs p-1.5 border border-slate-200 rounded focus:border-emerald-800 focus:outline-none"
                    />
                  </td>
                  <td className="py-2 px-3 align-top">
                    <textarea
                      rows={3}
                      value={row.indikatorSoal}
                      onChange={(e) => updateItem(row.id, 'indikatorSoal', e.target.value)}
                      className="w-full text-xs p-1.5 border border-slate-200 rounded focus:border-emerald-800 focus:outline-none font-medium text-slate-800"
                    />
                  </td>
                  <td className="py-2 px-2 align-top text-center">
                    <select
                      value={row.levelKognitif}
                      onChange={(e) => updateItem(row.id, 'levelKognitif', e.target.value as CognitiveLevel)}
                      className="text-xs px-2 py-1.5 border border-slate-300 rounded font-semibold text-slate-700 bg-white"
                    >
                      <option value="C1">C1</option>
                      <option value="C2">C2</option>
                      <option value="C3">C3</option>
                      <option value="C4">C4</option>
                      <option value="C5">C5</option>
                      <option value="C6">C6</option>
                    </select>
                  </td>
                  <td className="py-2 px-2 align-top text-center">
                    <select
                      value={row.bentukSoal}
                      onChange={(e) => updateItem(row.id, 'bentukSoal', e.target.value as QuestionType)}
                      className="text-xs px-2 py-1.5 border border-slate-300 rounded text-slate-700 bg-white"
                    >
                      <option value="PG">PG</option>
                      <option value="PGK">PGK</option>
                      <option value="Uraian">Uraian</option>
                      <option value="Menjodohkan">Menjodohkan</option>
                      <option value="Isian">Isian</option>
                      <option value="BenarSalah">Benar-Salah</option>
                    </select>
                  </td>
                  <td className="py-2 px-2 align-top text-center">
                    <input
                      type="number"
                      value={row.noSoal}
                      onChange={(e) => updateItem(row.id, 'noSoal', parseInt(e.target.value) || 1)}
                      className="w-12 text-center text-xs font-mono-num font-bold px-1 py-1 border border-slate-300 rounded"
                    />
                  </td>
                  <td className="py-2 px-2 align-top text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => duplicateItem(row)}
                        className="p-1 text-slate-400 hover:text-emerald-800 rounded"
                        title="Duplikasi Baris"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeItem(row.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Hapus Baris"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredKisi.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 text-xs italic">
                    Belum ada butir kisi-kisi. Klik tombol "Hasilkan Kisi-Kisi dengan AI" di kanan atas atau "Tambah Baris".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setActiveView('referensi-kbc')}
          className="text-xs text-slate-600 hover:text-slate-900 font-medium px-3 py-2"
        >
          Kembali ke Muatan Referensi
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              syncAllDevices();
              setActiveView('kartu-soal');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <span>Buka Kartu Soal</span>
          </button>
          <button
            onClick={() => {
              syncAllDevices();
              setActiveView('naskah-soal');
            }}
            className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white font-medium text-xs rounded-lg flex items-center gap-2 shadow-sm transition-colors"
          >
            <span>Lanjut ke Generator Naskah Soal</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
