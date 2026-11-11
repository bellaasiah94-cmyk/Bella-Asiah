import React from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Download, 
  Sparkles, 
  FolderSync,
  Layers
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeProject, 
    updateActiveProject, 
    setActiveView, 
    syncAllDevices 
  } = useAssessment();

  const handleStatusChange = (newStatus: any) => {
    updateActiveProject({ status: newStatus });
  };

  const getStatusBadge = () => {
    switch (activeProject.status) {
      case 'final':
        return {
          label: 'Paket Final',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />,
        };
      case 'validated':
        return {
          label: 'Tervalidasi',
          color: 'bg-teal-100 text-teal-800 border-teal-300',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />,
        };
      case 'needs_review':
        return {
          label: 'Perlu Ditinjau',
          color: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />,
        };
      default:
        return {
          label: 'Draft Pengerjaan',
          color: 'bg-slate-100 text-slate-700 border-slate-300',
          icon: <FileText className="w-3.5 h-3.5 text-slate-500" />,
        };
    }
  };

  const statusInfo = getStatusBadge();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="flex items-center justify-between px-6 py-3.5 gap-8">
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-emerald-900 flex items-center justify-center text-amber-400 font-bold text-lg shadow-sm">
            Z
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight whitespace-nowrap">
              Zona Asesmen
            </h1>
            <p className="text-xs text-amber-800 font-medium whitespace-nowrap">
              Bersama Bella Asiah
            </p>
          </div>
        </div>

        {/* Zone 2: Project Info & Synchronized Meta */}
        <div className="hidden md:flex items-center gap-4 text-xs text-slate-600 truncate max-w-xl">
          <span className="font-semibold text-slate-800 truncate" title={activeProject.title}>
            {activeProject.title}
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="whitespace-nowrap">{activeProject.mataPelajaran}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="whitespace-nowrap">{activeProject.kelas}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium shrink-0">
            {statusInfo.icon}
            <span>{statusInfo.label}</span>
          </div>
        </div>

        {/* Zone 3: Primary Action & Quick Utilities */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => syncAllDevices()}
            title="Sinkronkan nomor, materi, dan indikator antar 5 perangkat"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
          >
            <FolderSync className="w-3.5 h-3.5 text-slate-600" />
            <span>Sinkronkan Perangkat</span>
          </button>

          <button
            onClick={() => setActiveView('validasi')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Audit Mutu</span>
          </button>

          <button
            onClick={() => setActiveView('ekspor')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span>Ekspor Paket</span>
          </button>
        </div>
      </div>
    </header>
  );
};
