import React, { useState } from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import {
  BookOpen,
  Sparkles,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Heart,
  RefreshCw,
  FileText,
} from 'lucide-react';

export const ReferensiKbcView: React.FC = () => {
  const { activeProject, updateActiveProject, setActiveView } = useAssessment();
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [rawText, setRawText] = useState(activeProject.referensiTeks || '');
  const [newTpText, setNewTpText] = useState('');

  const pancaCintaList = [
    {
      title: '1. Cinta Tuhan',
      desc: 'Parahyangan, Sraddha & Bhakti, kesadaran ketuhanan dalam semesta dan persembahyangan.',
    },
    {
      title: '2. Cinta Ilmu',
      desc: 'Tattwa, literasi digital, penalaran kritis inovatif, dan pembelajaran sepanjang hayat.',
    },
    {
      title: '3. Cinta Lingkungan',
      desc: 'Palemahan, Bhuana Agung & Bhuana Alit, budaya Sauca (kebersihan) dan Aparigraha (hemat energi).',
    },
    {
      title: '4. Cinta Diri dan Sesama',
      desc: 'Pawongan, Tat Twam Asi ("Aku adalah kamu"), komunikasi welas asih, dan Tri Kaya Parisudha.',
    },
    {
      title: '5. Cinta Tanah Air',
      desc: 'Wasudhaiva Kutumbakam ("Dunia satu keluarga"), Bhinneka Tunggal Ika, dan kearifan lokal Nusantara.',
    },
  ];

  const handleExtractAI = async () => {
    if (!rawText || rawText.trim().length < 15) {
      setExtractError('Masukkan atau tempel teks referensi materi pembelajaran terlebih dahulu.');
      return;
    }

    setExtracting(true);
    setExtractError(null);

    try {
      const response = await fetch('/api/gemini/extract-reference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText,
          jenjang: activeProject.jenjang,
          mataPelajaran: activeProject.mataPelajaran,
        }),
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.success) {
        throw new Error(resJson.error || 'Gagal mengekstraksi referensi.');
      }

      const data = resJson.data;
      updateActiveProject({
        referensiTeks: rawText,
        capaianPembelajaran: data.capaianPembelajaran || activeProject.capaianPembelajaran,
        tujuanPembelajaranList: data.tujuanPembelajaranList || activeProject.tujuanPembelajaranList,
        materiPokok: data.materiPokok || activeProject.materiPokok,
        kbcTopic: data.kbcTopic || activeProject.kbcTopic,
        materiInsersiKBC: data.materiInsersiKBC || activeProject.materiInsersiKBC,
      });
    } catch (err: any) {
      setExtractError(err.message || 'Gagal memanggil layanan ekstraksi AI.');
    } finally {
      setExtracting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setRawText(text);
        updateActiveProject({ referensiTeks: text });
      }
    };
    reader.readAsText(file);
  };

  const addTpItem = () => {
    if (!newTpText.trim()) return;
    const current = activeProject.tujuanPembelajaranList || [];
    updateActiveProject({
      tujuanPembelajaranList: [...current, newTpText.trim()],
    });
    setNewTpText('');
  };

  const removeTpItem = (index: number) => {
    const current = [...(activeProject.tujuanPembelajaranList || [])];
    current.splice(index, 1);
    updateActiveProject({ tujuanPembelajaranList: current });
  };

  const updateTpItem = (index: number, val: string) => {
    const current = [...(activeProject.tujuanPembelajaranList || [])];
    current[index] = val;
    updateActiveProject({ tujuanPembelajaranList: current });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">
            Modul 2: Muatan Materi, CP, TP & Insersi Kurikulum Berbasis Cinta
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pondasi pembelajaran otentik: AI tidak boleh mengarang CP/TP. Periksa dan sempurnakan rumusan sebelum masuk pembuatan kisi-kisi.
          </p>
        </div>
      </div>

      {/* Ekstraktor Dokumen / Teks */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Upload className="w-4 h-4 text-emerald-800" />
            <span>A. Ekstraksi Dokumen / Teks Rujukan Pembelajaran</span>
          </div>
          <label className="cursor-pointer text-xs font-medium text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>Unggah TXT / Silabus</span>
            <input
              type="file"
              accept=".txt,.md,.json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Tempelkan Ringkasan Materi, Bab Buku, atau Silabus Mata Pelajaran:
          </label>
          <textarea
            rows={5}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Contoh: Salin teks silabus bab tertentu, kompetensi dasar, ringkasan teori, atau sumber belajar dari dokumen PDF yang Anda miliki..."
            className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800"
          />
        </div>

        {extractError && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{extractError}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <p className="text-[11px] text-slate-500">
            AI akan menganalisis teks untuk mengekstrak Capaian Pembelajaran, rincian Tujuan Pembelajaran (TP), dan rekomendasi insersi Panca Cinta.
          </p>
          <button
            onClick={handleExtractAI}
            disabled={extracting}
            className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 disabled:opacity-50 text-white font-medium text-xs rounded-lg flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap"
          >
            {extracting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
                <span>Menganalisis Teks...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Ekstrak CP & TP dengan AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Capaian Pembelajaran (CP) & Materi Pokok */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">
          <BookOpen className="w-4 h-4 text-emerald-800" />
          <span>B. Verifikasi Capaian Pembelajaran (CP) & Materi Pokok</span>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Capaian Pembelajaran (CP) <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            value={activeProject.capaianPembelajaran}
            onChange={(e) => updateActiveProject({ capaianPembelajaran: e.target.value })}
            placeholder="Rumusan Capaian Pembelajaran fase bersangkutan..."
            className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Materi Pokok / Lingkup Materi <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={activeProject.materiPokok}
            onChange={(e) => updateActiveProject({ materiPokok: e.target.value })}
            placeholder="Contoh: Sejarah Perkembangan Agama Hindu di Asia Selatan"
            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800"
          />
        </div>
      </div>

      {/* Editor Tujuan Pembelajaran (TP) */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-800" />
            <span>C. Rincian Tujuan Pembelajaran (TP) yang Diuji</span>
          </div>
          <span className="text-xs font-mono-num text-slate-500">
            {activeProject.tujuanPembelajaranList?.length || 0} Butir TP
          </span>
        </div>

        <div className="space-y-2.5">
          {(activeProject.tujuanPembelajaranList || []).map((tp, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-6 text-center text-xs font-bold text-slate-400 font-mono-num shrink-0">
                {idx + 1}.
              </span>
              <input
                type="text"
                value={tp}
                onChange={(e) => updateTpItem(idx, e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800"
              />
              <button
                onClick={() => removeTpItem(idx)}
                className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition-colors shrink-0"
                title="Hapus TP"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {(!activeProject.tujuanPembelajaranList || activeProject.tujuanPembelajaranList.length === 0) && (
            <p className="text-xs text-slate-400 italic py-2">
              Belum ada Tujuan Pembelajaran yang dimasukkan. Tambahkan di bawah atau gunakan ekstraksi AI.
            </p>
          )}

          {/* Form Tambah TP */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={newTpText}
              onChange={(e) => setNewTpText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTpItem()}
              placeholder="Ketik Tujuan Pembelajaran baru lalu tekan Tambah..."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
            />
            <button
              onClick={addTpItem}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah TP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Integrasi Kurikulum Berbasis Cinta (Panca Cinta & Tri Hita Karana) */}
      <div className="bg-white rounded-xl p-5 border border-emerald-200 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">
          <Heart className="w-4 h-4 text-emerald-800" />
          <span>D. Insersi Kurikulum Berbasis Cinta (KBC - Panca Cinta)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Topik Panca Cinta Utama
            </label>
            <select
              value={activeProject.kbcTopic || ''}
              onChange={(e) => updateActiveProject({ kbcTopic: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="">-- Pilih Topik Panca Cinta --</option>
              {pancaCintaList.map((p, i) => (
                <option key={i} value={p.title}>
                  {p.title}
                </option>
              ))}
              <option value="Integrasi Lintas Panca Cinta">Integrasi Lintas Panca Cinta</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Dipilih sesuai tema materi pembelajaran dan panduan Widyalaya 2026.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Materi Insersi Karakter & Kearifan Lokal
            </label>
            <input
              type="text"
              value={activeProject.materiInsersiKBC || ''}
              onChange={(e) => updateActiveProject({ materiInsersiKBC: e.target.value })}
              placeholder="Contoh: Tri Hita Karana, Tat Twam Asi, Sauca, Tri Kaya Parisudha"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Nilai etika luhur yang diintegrasikan dalam konteks/stimulus butir soal.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setActiveView('data-asesmen')}
          className="text-xs text-slate-600 hover:text-slate-900 font-medium px-3 py-2"
        >
          Kembali ke Data Asesmen
        </button>
        <button
          onClick={() => setActiveView('kisi-kisi')}
          className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white font-medium text-xs rounded-lg flex items-center gap-2 shadow-sm transition-colors"
        >
          <span>Lanjut ke Generator Kisi-Kisi</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
        </button>
      </div>
    </div>
  );
};
