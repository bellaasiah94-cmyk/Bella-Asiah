import React from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import {
  TableProperties,
  CreditCard,
  FileSpreadsheet,
  KeyRound,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Download,
  Heart,
  BookOpen,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { activeProject, setActiveView, syncAllDevices } = useAssessment();

  const kisiCount = activeProject.kisiKisi?.length || 0;
  const soalCount = activeProject.soalItems?.length || 0;
  const rubrikCount = activeProject.rubrikList?.length || 0;
  const rekapCount = activeProject.rekapSiswaList?.length || 0;

  // Level Distribution
  const c1c2 = (activeProject.kisiKisi || []).filter(
    (k) => k.levelKognitif === 'C1' || k.levelKognitif === 'C2'
  ).length;
  const c3c4 = (activeProject.kisiKisi || []).filter(
    (k) => k.levelKognitif === 'C3' || k.levelKognitif === 'C4'
  ).length;
  const c5c6 = (activeProject.kisiKisi || []).filter(
    (k) => k.levelKognitif === 'C5' || k.levelKognitif === 'C6'
  ).length;

  const devices = [
    {
      id: 'kisi-kisi',
      num: '01',
      title: 'Kisi-Kisi Penulisan Soal',
      desc: 'Matriks 8 kolom memuat CP, TP, materi ajar, indikator soal, level kognitif, bentuk soal, dan nomor soal.',
      status: kisiCount > 0 ? `${kisiCount} Butir Terpetakan` : 'Belum Dibuat',
      isReady: kisiCount > 0,
      icon: <TableProperties className="w-5 h-5 text-emerald-800" />,
      cta: 'Buka Kisi-Kisi',
    },
    {
      id: 'kartu-soal',
      num: '02',
      title: 'Kartu Soal Terformat',
      desc: 'Format resmi kartu butir soal berisikan identitas satuan kerja, penyusun, buku acuan, kunci, dan stimulus.',
      status: soalCount > 0 ? `${soalCount} Kartu Sinkron` : 'Belum Ada',
      isReady: soalCount > 0,
      icon: <CreditCard className="w-5 h-5 text-emerald-800" />,
      cta: 'Buka Kartu Soal',
    },
    {
      id: 'naskah-soal',
      num: '03',
      title: 'Naskah Soal & Lembar LJK',
      desc: 'Naskah ujian siap cetak A4 dengan petunjuk pengerjaan, opsi jawaban homogen, stimulus, dan grid lembar jawaban.',
      status: soalCount > 0 ? `${soalCount} Soal Siap Ujian` : 'Belum Ada',
      isReady: soalCount > 0,
      icon: <FileSpreadsheet className="w-5 h-5 text-emerald-800" />,
      cta: 'Buka Naskah Soal',
    },
    {
      id: 'kunci-jawaban',
      num: '04',
      title: 'Kunci Jawaban & Pembahasan',
      desc: 'Tabel kunci PG beserta pembahasan komprehensif dan jawaban ideal uraian dengan telaah logika/matematis.',
      status: soalCount > 0 ? 'Tersedia Pembahasan' : 'Belum Ada',
      isReady: soalCount > 0,
      icon: <KeyRound className="w-5 h-5 text-emerald-800" />,
      cta: 'Buka Kunci Jawaban',
    },
    {
      id: 'pedoman-penilaian',
      num: '05',
      title: 'Pedoman Penilaian & Penskoran',
      desc: 'Pedoman penskoran transparan, rubrik analitik per kriteria capaian, rumus nilai akhir, dan rekap hasil peserta didik.',
      status: rubrikCount > 0 ? `${rubrikCount} Rubrik & Rekap` : 'Perlu Rubrik',
      isReady: rubrikCount > 0,
      icon: <Award className="w-5 h-5 text-emerald-800" />,
      cta: 'Buka Pedoman & Rekap',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hero Banner with Bella Asiah Branding */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 rounded-2xl p-6 sm:p-8 text-white shadow-sm border border-emerald-800/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-amber-400/30 text-amber-300 text-xs font-medium mb-3">
            <Heart className="w-3.5 h-3.5 text-amber-400" />
            <span>Zona Asesmen Bersama Bella Asiah</span>
            <span aria-hidden="true">·</span>
            <span>Kurikulum Merdeka & Kurikulum Berbasis Cinta</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 font-heading">
            Sistem Pembuatan Lima Perangkat Asesmen Terintegrasi
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-5">
            Membantu pendidik merancang paket asesmen berkualitas nasional secara sinkron dan otomatis:
            mulai dari kisi-kisi terukur, kartu butir soal, naskah ujian, kunci pembahasan, hingga pedoman rubrik penskoran.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveView('kisi-kisi')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs sm:text-sm rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Kelola Kisi-Kisi Soal</span>
            </button>
            <button
              onClick={() => setActiveView('validasi')}
              className="px-4 py-2 bg-emerald-800/90 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm rounded-lg border border-emerald-600/50 transition-colors flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Validasi Mutu Paket</span>
            </button>
            <button
              onClick={() => setActiveView('ekspor')}
              className="px-4 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-medium text-xs sm:text-sm rounded-lg border border-slate-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Unduh Dokumen Lengkap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Project Quick Overview Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
        <div className="px-3 py-1">
          <p className="text-xs text-slate-500">Mata Pelajaran</p>
          <p className="text-sm font-semibold text-slate-800 truncate mt-0.5">{activeProject.mataPelajaran}</p>
          <p className="text-xs text-slate-400 mt-1">{activeProject.kelas}</p>
        </div>
        <div className="px-3 py-1">
          <p className="text-xs text-slate-500">Target Soal</p>
          <p className="text-sm font-semibold text-slate-800 font-mono-num mt-0.5">
            {kisiCount} / {activeProject.jumlahSoal} Butir
          </p>
          <p className="text-xs text-slate-400 mt-1">
            PG: {activeProject.distribusiBentuk.pg} · Uraian: {activeProject.distribusiBentuk.uraian}
          </p>
        </div>
        <div className="px-3 py-1">
          <p className="text-xs text-slate-500">Distribusi Kognitif</p>
          <div className="flex items-center gap-2 mt-0.5 text-xs font-mono-num">
            <span className="text-emerald-700 font-medium">C1-C2: {c1c2}</span>
            <span className="text-blue-700 font-medium">C3-C4: {c3c4}</span>
            <span className="text-amber-700 font-medium">C5-C6: {c5c6}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Taksonomi Bloom Revisi</p>
        </div>
        <div className="px-3 py-1">
          <p className="text-xs text-slate-500">KKTP & Skor Max</p>
          <p className="text-sm font-semibold text-slate-800 font-mono-num mt-0.5">
            KKTP: {activeProject.kktp} | Max: {activeProject.skorMaksimal}
          </p>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            {activeProject.status === 'final' ? 'Status: Siap Ujian' : 'Status: Penyiapan'}
          </p>
        </div>
      </div>

      {/* 5 Integrated Assessment Devices Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              5 Perangkat Asesmen Terpadu
            </h3>
            <p className="text-xs text-slate-500">
              Setiap perubahan pada satu modul otomatis disinkronkan ke seluruh perangkat turunan.
            </p>
          </div>
          <button
            onClick={() => syncAllDevices()}
            className="text-xs text-emerald-800 hover:text-emerald-950 font-medium flex items-center gap-1.5"
          >
            <span>Sinkronkan Ulang Semua</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((d) => (
            <div
              key={d.id}
              onClick={() => setActiveView(d.id)}
              className="bg-white rounded-xl p-5 border border-slate-200 hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    {d.icon}
                  </div>
                  <span className="text-xs font-mono-num text-slate-400 font-semibold">
                    {d.num}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-900 transition-colors">
                  {d.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {d.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className={`font-medium ${d.isReady ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {d.status}
                </span>
                <span className="text-slate-400 group-hover:text-emerald-800 font-medium flex items-center gap-1 transition-colors">
                  {d.cta}
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          ))}

          {/* Insersi Kurikulum Berbasis Cinta Box */}
          <div className="bg-gradient-to-br from-emerald-50 to-amber-50/50 rounded-xl p-5 border border-emerald-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 text-emerald-900 font-bold text-xs">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>Panca Cinta & Karakter Widyalaya</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                {activeProject.kbcTopic || 'Cinta Ilmu & Cinta Tuhan'}
              </h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {activeProject.materiInsersiKBC ||
                  'Mengintegrasikan etika Tri Kaya Parisudha (Manacika, Wacika, Kayika) dan cinta semesta Tat Twam Asi ke dalam butir stimulus asesmen.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-200/50 flex items-center justify-between text-xs">
              <span className="text-emerald-800 font-medium">Panduan Dirjen Bimas Hindu 2026</span>
              <button
                onClick={() => setActiveView('referensi-kbc')}
                className="text-emerald-900 hover:underline font-semibold"
              >
                Atur Insersi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
