import React, { createContext, useContext, useState, useEffect } from 'react';
import { AssessmentProject, KisiKisiItem, SoalItem, RubrikAspek, RekapSiswa } from '../types/assessment';
import { SAMPLE_PROJECT_KBC_HINDU, SAMPLE_PROJECT_INFORMATIKA } from '../data/sampleProjects';

const STORAGE_KEY = 'zona_asesmen_bella_asiah_projects_v1';
const ACTIVE_PROJECT_KEY = 'zona_asesmen_bella_asiah_active_id';

interface AssessmentContextType {
  projects: AssessmentProject[];
  activeProject: AssessmentProject;
  activeView: string;
  setActiveView: (view: string) => void;
  setActiveProjectId: (id: string) => void;
  createNewProject: (title?: string) => AssessmentProject;
  updateActiveProject: (updates: Partial<AssessmentProject> | ((prev: AssessmentProject) => AssessmentProject)) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  loadSample: (sample: AssessmentProject) => void;
  syncAllDevices: () => void;
  importProjectsJson: (jsonString: string) => boolean;
  exportProjectsJson: () => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<AssessmentProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load projects from localStorage', e);
    }
    return [SAMPLE_PROJECT_KBC_HINDU, SAMPLE_PROJECT_INFORMATIKA];
  });

  const [activeProjectId, setActiveProjectIdState] = useState<string>(() => {
    const savedId = localStorage.getItem(ACTIVE_PROJECT_KEY);
    if (savedId && projects.some((p) => p.id === savedId)) {
      return savedId;
    }
    return SAMPLE_PROJECT_KBC_HINDU.id;
  });

  const [activeView, setActiveView] = useState<string>('dashboard');

  // Save projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to localStorage', e);
    }
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_PROJECT_KEY, activeProjectId);
  }, [activeProjectId]);

  const activeProject =
    projects.find((p) => p.id === activeProjectId) || projects[0] || SAMPLE_PROJECT_KBC_HINDU;

  const setActiveProjectId = (id: string) => {
    if (projects.some((p) => p.id === id)) {
      setActiveProjectIdState(id);
    }
  };

  const createNewProject = (title?: string): AssessmentProject => {
    const newProj: AssessmentProject = {
      id: `proj-${Date.now()}`,
      title: title || 'Proyek Asesmen Baru Kurikulum Merdeka',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      satuanPendidikan: 'SMP / SMA Unggulan',
      satuanKerja: 'Dinas Pendidikan & Kebudayaan',
      namaGuru: 'Bella Asiah',
      nipGuru: '-',
      namaKepalaSekolah: 'Kepala Sekolah, M.Pd.',
      nipKepalaSekolah: '-',
      tahunAjaran: '2026/2027',
      semester: '1 (Ganjil)',
      jenjang: 'SMP / Madyama Widyalaya',
      kelas: 'Fase D - Kelas VII',
      mataPelajaran: 'Pendidikan Agama Hindu dan Budi Pekerti',
      jenisAsesmen: 'Sumatif Tengah Semester (STS)',
      kurikulum: 'Kurikulum Berbasis Cinta (KBC) Widyalaya',
      alokasiWaktu: '90 Menit',
      bukuAcuan: 'Buku Teks Kurikulum Merdeka / Ditjen Bimas Hindu 2026',
      capaianPembelajaran: '',
      tujuanPembelajaranList: [],
      materiPokok: '',
      kbcTopic: 'Cinta Tuhan & Cinta Ilmu',
      materiInsersiKBC: 'Pancasila & Karakter Budi Pekerti Luhur',
      referensiTeks: '',
      jumlahSoal: 5,
      distribusiBentuk: { pg: 4, pgk: 0, uraian: 1, menjodohkan: 0, isian: 0, benarSalah: 0 },
      distribusiLevel: { C1_C2: 2, C3_C4: 2, C5_C6: 1 },
      skorMaksimal: 100,
      kktp: 75,
      rumusNilai: 'Nilai = (Skor Perolehan / Skor Maksimal) x 100',
      ketentuanTambahan: 'Kembangkan butir soal kontekstual dan analitis.',
      kisiKisi: [],
      soalItems: [],
      rubrikList: [],
      rekapSiswaList: [
        { id: 'sis-1', no: 1, nama: 'Aditya Pratama', skorDiperoleh: 0, nilai: 0, status: 'Belum Tuntas' },
        { id: 'sis-2', no: 2, nama: 'Dian Permatasari', skorDiperoleh: 0, nilai: 0, status: 'Belum Tuntas' },
        { id: 'sis-3', no: 3, nama: 'Ketut Wijaya', skorDiperoleh: 0, nilai: 0, status: 'Belum Tuntas' },
      ],
      includeLJK: true,
      syncWarnings: [],
    };

    setProjects((prev) => [newProj, ...prev]);
    setActiveProjectIdState(newProj.id);
    return newProj;
  };

  const updateActiveProject = (
    updates: Partial<AssessmentProject> | ((prev: AssessmentProject) => AssessmentProject)
  ) => {
    setProjects((prevList) =>
      prevList.map((p) => {
        if (p.id !== activeProject.id) return p;
        const updated =
          typeof updates === 'function' ? updates(p) : { ...p, ...updates };
        return {
          ...updated,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const deleteProject = (id: string) => {
    if (projects.length <= 1) {
      alert('Minimal harus ada satu proyek asesmen yang tersimpan.');
      return;
    }
    const remaining = projects.filter((p) => p.id !== id);
    setProjects(remaining);
    if (activeProjectId === id) {
      setActiveProjectIdState(remaining[0].id);
    }
  };

  const duplicateProject = (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;
    const duplicated: AssessmentProject = {
      ...JSON.parse(JSON.stringify(target)),
      id: `proj-${Date.now()}`,
      title: `${target.title} (Salinan)`,
      isExample: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects((prev) => [duplicated, ...prev]);
    setActiveProjectIdState(duplicated.id);
  };

  const loadSample = (sample: AssessmentProject) => {
    const clone: AssessmentProject = {
      ...JSON.parse(JSON.stringify(sample)),
      id: `sample-${Date.now()}`,
      title: `${sample.title} [Duplikat Baru]`,
      isExample: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects((prev) => [clone, ...prev]);
    setActiveProjectIdState(clone.id);
  };

  // Sinkronisasi Terpadu: Pastikan Kisi-Kisi dan Naskah Soal sinkron nomor, indikator, level, dan bentuk
  const syncAllDevices = () => {
    if (!activeProject.kisiKisi || activeProject.kisiKisi.length === 0) return;

    const existingSoalMap = new Map<number, SoalItem>();
    (activeProject.soalItems || []).forEach((s) => existingSoalMap.set(s.noSoal, s));

    const updatedSoalItems: SoalItem[] = activeProject.kisiKisi.map((k) => {
      const existing = existingSoalMap.get(k.noSoal);
      if (existing) {
        return {
          ...existing,
          bentukSoal: k.bentukSoal,
          levelKognitif: k.levelKognitif,
          materi: k.materiAjar,
          indikatorSoal: k.indikatorSoal,
        };
      }
      return {
        id: `soal-${Date.now()}-${k.noSoal}`,
        noSoal: k.noSoal,
        bentukSoal: k.bentukSoal,
        pertanyaan: `Pertanyaan untuk indikator: ${k.indikatorSoal}`,
        pilihanJawaban:
          k.bentukSoal === 'PG'
            ? [
                { key: 'A', text: 'Pilihan jawaban A' },
                { key: 'B', text: 'Pilihan jawaban B' },
                { key: 'C', text: 'Pilihan jawaban C' },
                { key: 'D', text: 'Pilihan jawaban D' },
              ]
            : undefined,
        kunciJawaban: k.bentukSoal === 'PG' ? 'A' : 'Kunci jawaban uraian...',
        pembahasan: 'Pembahasan butir soal...',
        levelKognitif: k.levelKognitif,
        materi: k.materiAjar,
        indikatorSoal: k.indikatorSoal,
        skorMaksimal: k.bentukSoal === 'Uraian' ? 20 : 10,
        needsTeacherCheck: true,
      };
    });

    updateActiveProject({
      soalItems: updatedSoalItems,
      syncWarnings: [],
    });
  };

  const importProjectsJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id) {
        setProjects(parsed);
        setActiveProjectIdState(parsed[0].id);
        return true;
      }
    } catch (e) {
      console.error('Import failed', e);
    }
    return false;
  };

  const exportProjectsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `backup_zona_asesmen_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <AssessmentContext.Provider
      value={{
        projects,
        activeProject,
        activeView,
        setActiveView,
        setActiveProjectId,
        createNewProject,
        updateActiveProject,
        deleteProject,
        duplicateProject,
        loadSample,
        syncAllDevices,
        importProjectsJson,
        exportProjectsJson,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};
