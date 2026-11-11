import React from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import {
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  TableProperties,
  CreditCard,
  FileSpreadsheet,
  KeyRound,
  Award,
  ShieldCheck,
  Download,
  FolderKanban,
  HeartHandshake,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  shortTag: string;
  icon: React.ReactNode;
  badge?: number | string;
}

export const Sidebar: React.FC = () => {
  const { activeProject, activeView, setActiveView } = useAssessment();

  const kisiCount = activeProject.kisiKisi?.length || 0;
  const soalCount = activeProject.soalItems?.length || 0;
  const rubrikCount = activeProject.rubrikList?.length || 0;

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard & Ringkasan',
      shortTag: 'Beranda',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'data-asesmen',
      label: '1. Data Asesmen',
      shortTag: 'Parameter',
      icon: <ClipboardList className="w-4 h-4" />,
    },
    {
      id: 'referensi-kbc',
      label: '2. Referensi & Nilai KBC',
      shortTag: 'CP / TP',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: 'kisi-kisi',
      label: '3. Kisi-Kisi Soal',
      shortTag: '8 Kolom',
      icon: <TableProperties className="w-4 h-4" />,
      badge: kisiCount,
    },
    {
      id: 'kartu-soal',
      label: '4. Kartu Soal',
      shortTag: 'Kartu',
      icon: <CreditCard className="w-4 h-4" />,
      badge: soalCount,
    },
    {
      id: 'naskah-soal',
      label: '5. Naskah Soal & LJK',
      shortTag: 'Ujian',
      icon: <FileSpreadsheet className="w-4 h-4" />,
      badge: soalCount,
    },
    {
      id: 'kunci-jawaban',
      label: '6. Kunci & Pembahasan',
      shortTag: 'Kunci',
      icon: <KeyRound className="w-4 h-4" />,
    },
    {
      id: 'pedoman-penilaian',
      label: '7. Pedoman Penskoran',
      shortTag: 'Rubrik',
      icon: <Award className="w-4 h-4" />,
      badge: rubrikCount > 0 ? `${rubrikCount} rubrik` : undefined,
    },
    {
      id: 'validasi',
      label: '8. Validasi Mutu Asesmen',
      shortTag: 'Audit',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      id: 'ekspor',
      label: '9. Preview & Ekspor Paket',
      shortTag: 'Download',
      icon: <Download className="w-4 h-4" />,
    },
    {
      id: 'proyek',
      label: '10. Manajemen Proyek',
      shortTag: 'Daftar',
      icon: <FolderKanban className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 shrink-0 flex flex-col justify-between border-r border-slate-800">
      <div className="py-4">
        {/* Profile / Host Badge */}
        <div className="px-5 mb-5 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-800/80 border border-amber-400/40 flex items-center justify-center text-amber-300 font-medium text-xs">
              BA
            </div>
            <div>
              <p className="text-xs font-semibold text-white tracking-wide">
                Bella Asiah
              </p>
              <p className="text-[11px] text-emerald-400">
                Pakar Asesmen & Kurikulum
              </p>
            </div>
          </div>
          <div className="mt-3 px-2.5 py-1.5 rounded bg-emerald-950/60 border border-emerald-800/50 flex items-center gap-2 text-[11px] text-emerald-200">
            <HeartHandshake className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Kurikulum Berbasis Cinta & Merdeka</span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`${isActive ? 'text-amber-400' : 'text-slate-400'}`}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`ml-2 px-1.5 py-0.5 text-[10px] font-mono-num rounded ${
                      isActive
                        ? 'bg-emerald-950 text-amber-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400">
        <p className="font-medium text-slate-300">5 Perangkat Terintegrasi</p>
        <p className="mt-0.5 text-[10px] text-slate-500">
          Format Baku Kemendikbud & Kemenag Widyalaya
        </p>
      </div>
    </aside>
  );
};
