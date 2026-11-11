import React from 'react';
import { AssessmentProvider, useAssessment } from './context/AssessmentContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { DataAsesmenView } from './components/views/DataAsesmenView';
import { ReferensiKbcView } from './components/views/ReferensiKbcView';
import { KisiKisiView } from './components/views/KisiKisiView';
import { KartuSoalView } from './components/views/KartuSoalView';
import { NaskahSoalView } from './components/views/NaskahSoalView';
import { KunciJawabanView } from './components/views/KunciJawabanView';
import { PedomanPenilaianView } from './components/views/PedomanPenilaianView';
import { ValidasiMutuView } from './components/views/ValidasiMutuView';
import { EksporPaketView } from './components/views/EksporPaketView';
import { ManajemenProyekView } from './components/views/ManajemenProyekView';

const MainContent: React.FC = () => {
  const { activeView } = useAssessment();

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'data-asesmen':
        return <DataAsesmenView />;
      case 'referensi-kbc':
        return <ReferensiKbcView />;
      case 'kisi-kisi':
        return <KisiKisiView />;
      case 'kartu-soal':
        return <KartuSoalView />;
      case 'naskah-soal':
        return <NaskahSoalView />;
      case 'kunci-jawaban':
        return <KunciJawabanView />;
      case 'pedoman-penilaian':
        return <PedomanPenilaianView />;
      case 'validasi':
        return <ValidasiMutuView />;
      case 'ekspor':
        return <EksporPaketView />;
      case 'proyek':
        return <ManajemenProyekView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/60 min-h-screen">
      {renderView()}
    </div>
  );
};

export default function App() {
  return (
    <AssessmentProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
        <Navbar />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <MainContent />
        </div>
      </div>
    </AssessmentProvider>
  );
}
