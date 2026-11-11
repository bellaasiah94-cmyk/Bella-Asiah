import React, { useState } from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { SAMPLE_PROJECT_KBC_HINDU, SAMPLE_PROJECT_INFORMATIKA } from '../../data/sampleProjects';
import {
  FolderKanban,
  Plus,
  Copy,
  Trash2,
  CheckCircle2,
  Download,
  Upload,
  Sparkles,
  Calendar,
  Layers,
  Edit2,
  ExternalLink,
} from 'lucide-react';

export const ManajemenProyekView: React.FC = () => {
  const {
    projects,
    activeProject,
    setActiveProjectId,
    createNewProject,
    deleteProject,
    duplicateProject,
    loadSample,
    updateActiveProject,
    setActiveView,
    exportProjectsJson,
    importProjectsJson,
  } = useAssessment();

  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [newProjectModal, setNewProjectModal] = useState(false);
  const [newTitleInput, setNewTitleInput] = useState('');

  const handleStartEditTitle = (id: string, currentTitle: string) => {
    setEditingTitleId(id);
    setTempTitle(currentTitle);
  };

  const handleSaveTitle = (id: string) => {
    if (tempTitle.trim()) {
      if (id === activeProject.id) {
        updateActiveProject({ title: tempTitle.trim() });
      }
    }
    setEditingTitleId(null);
  };

  const handleCreate = () => {
    if (newTitleInput.trim()) {
      createNewProject(newTitleInput.trim());
      setNewTitleInput('');
      setNewProjectModal(false);
      setActiveView('data-asesmen');
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importProjectsJson(content);
        if (ok) {
          alert('Berhasil memulihkan cadangan data proyek!');
        } else {
          alert('Format berkas cadangan JSON tidak valid.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">
            Modul 10: Manajemen Proyek Asesmen
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola, duplikasi, arsipkan, atau pulihkan proyek perangkat asesmen guru dengan penyimpanan persisten.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="cursor-pointer px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors">
            <Upload className="w-3.5 h-3.5 text-slate-600" />
            <span>Impor JSON</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>

          <button
            onClick={exportProjectsJson}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Cadangan JSON</span>
          </button>

          <button
            onClick={() => setNewProjectModal(true)}
            className="px-4 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white font-medium text-xs rounded-lg flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-amber-300" />
            <span>Buat Proyek Baru</span>
          </button>
        </div>
      </div>

      {/* Modal Buat Proyek Baru */}
      {newProjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Buat Paket Asesmen Baru
            </h3>
            <p className="text-xs text-slate-500">
              Masukkan judul atau nama paket asesmen (misal: "STS Sejarah Kelas VII Ganjil").
            </p>

            <input
              type="text"
              autoFocus
              value={newTitleInput}
              onChange={(e) => setNewTitleInput(e.target.value)}
              placeholder="Judul Proyek Asesmen..."
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setNewProjectModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                Batal
              </button>
              <button
                onClick={handleCreate}
                disabled={!newTitleInput.trim()}
                className="px-4 py-1.5 bg-emerald-900 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Buat Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((proj) => {
          const isActive = proj.id === activeProject.id;
          const isEditing = editingTitleId === proj.id;
          const kisiCount = proj.kisiKisi?.length || 0;
          const soalCount = proj.soalItems?.length || 0;

          return (
            <div
              key={proj.id}
              className={`bg-white rounded-xl p-5 border transition-all flex flex-col justify-between ${
                isActive
                  ? 'border-emerald-800 ring-2 ring-emerald-800/10 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div>
                {/* Top Badge Strip */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    {proj.isExample ? (
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold tracking-wider uppercase">
                        Contoh Resmi
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium uppercase">
                        Proyek Guru
                      </span>
                    )}
                    {isActive && (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Aktif
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono-num">
                    {new Date(proj.updatedAt).toLocaleDateString('id-ID')}
                  </span>
                </div>

                {/* Title */}
                {isEditing ? (
                  <div className="flex items-center gap-1 mb-2">
                    <input
                      type="text"
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle(proj.id)}
                      className="w-full text-xs p-1 border border-emerald-800 rounded"
                    />
                    <button
                      onClick={() => handleSaveTitle(proj.id)}
                      className="px-2 py-1 bg-emerald-900 text-white rounded text-xs"
                    >
                      OK
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3
                      onClick={() => {
                        setActiveProjectId(proj.id);
                        setActiveView('dashboard');
                      }}
                      className="text-sm font-bold text-slate-900 hover:text-emerald-900 transition-colors cursor-pointer leading-snug"
                    >
                      {proj.title}
                    </h3>
                    <button
                      onClick={() => handleStartEditTitle(proj.id, proj.title)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded"
                      title="Ganti Judul"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Meta details */}
                <div className="text-xs text-slate-500 space-y-1 mt-2">
                  <p className="truncate">
                    <span className="font-medium text-slate-700">{proj.mataPelajaran}</span> · {proj.kelas}
                  </p>
                  <p className="truncate text-[11px] text-slate-400">{proj.satuanPendidikan}</p>
                </div>

                {/* Counts */}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 text-xs font-mono-num text-slate-600">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Kisi-Kisi</span>
                    <span className="font-semibold text-slate-800">{kisiCount} butir</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Naskah Soal</span>
                    <span className="font-semibold text-slate-800">{soalCount} butir</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Status</span>
                    <span className="font-semibold text-emerald-800 capitalize">{proj.status}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between gap-2 mt-5 pt-3 border-t border-slate-100 text-xs">
                {isActive ? (
                  <button
                    onClick={() => setActiveView('dashboard')}
                    className="px-3 py-1.5 bg-emerald-900 text-white font-medium rounded-lg hover:bg-emerald-800 transition-colors flex items-center gap-1.5"
                  >
                    <span>Buka Dashboard</span>
                    <ExternalLink className="w-3 h-3 text-amber-300" />
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveProjectId(proj.id)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-lg transition-colors"
                  >
                    Pilih Proyek Ini
                  </button>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => duplicateProject(proj.id)}
                    className="p-1.5 text-slate-400 hover:text-emerald-800 rounded"
                    title="Duplikasi Proyek"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteProject(proj.id)}
                    disabled={projects.length <= 1}
                    className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30 rounded"
                    title="Hapus Proyek"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preset Official Template Loader */}
      <div className="bg-emerald-50/60 rounded-xl p-5 border border-emerald-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-800" />
            <h3 className="text-sm font-bold text-emerald-950 font-heading">
              Muat Ulang Proyek Contoh Demonstrasi Resmi
            </h3>
          </div>
        </div>
        <p className="text-xs text-slate-600">
          Gunakan contoh resmi ini sebagai tolok ukur standar kurikulum atau untuk demonstrasi langsung:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="bg-white p-3.5 rounded-lg border border-emerald-200 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-slate-800">
                Sejarah Kebudayaan Hindu & Insersi Panca Cinta
              </p>
              <p className="text-[11px] text-slate-500">
                Fase D / Kelas VII Madyama Widyalaya · Panduan 2026
              </p>
            </div>
            <button
              onClick={() => loadSample(SAMPLE_PROJECT_KBC_HINDU)}
              className="px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold rounded transition-colors whitespace-nowrap"
            >
              Muat Salinan
            </button>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-emerald-200 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-slate-800">
                Informatika & Berpikir Komputasional
              </p>
              <p className="text-[11px] text-slate-500">
                Fase D / Kelas VII Kurikulum Merdeka · Format Baku
              </p>
            </div>
            <button
              onClick={() => loadSample(SAMPLE_PROJECT_INFORMATIKA)}
              className="px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold rounded transition-colors whitespace-nowrap"
            >
              Muat Salinan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
