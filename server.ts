import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// System instruction for the expert Indonesian curriculum assessment designer
const ASSESSMENT_SYSTEM_INSTRUCTION = `
Anda adalah Pakar Asesmen Pendidikan Indonesia, Kurikulum Merdeka, Kurikulum Berbasis Cinta (KBC) Widyalaya (Kemenag Ditjen Bimas Hindu), dan Taksonomi Bloom Terkoreksi (C1-C6).
Tugas Anda adalah menghasilkan perangkat asesmen pendidikan yang terukur, ilmiah, berkarakter luhur, obyektif, dan bebas bias SARA.
Perhatikan prinsip:
1. Keselarasan Indikator: Indikator harus spesifik, terukur, berawalan 'Disajikan...', dan selaras dengan Tujuan Pembelajaran (TP) serta Capaian Pembelajaran (CP).
2. Level Kognitif Sebenarnya: Nilai tuntutan kognitif sebenarnya (C1 Mengingat, C2 Memahami, C3 Menerapkan/Menghitung, C4 Menganalisis/Menelaah, C5 Mengevaluasi/Menilai, C6 Mengkreasi/Merumuskan ide). Jangan terjebak kata kerja operasional semata.
3. Kualitas Butir Pilihan Ganda: Opsi A, B, C, D homogen panjangnya, masuk akal, distraktor logis, hanya ada 1 jawaban benar. Hindari 'semua benar/salah'.
4. Soal Uraian: Perintah harus jelas, ada stimulus kontekstual, dan memungkinkan penskoran bertahap dengan rubrik analitik.
5. Insersi Nilai Panca Cinta (KBC): Bila diminta, integrasikan nilai Panca Cinta (Cinta Tuhan, Cinta Ilmu, Cinta Lingkungan, Cinta Diri & Sesama, Cinta Tanah Air) serta kearifan lokal secara harmonis dan mendidik.
Format selalu dalam Bahasa Indonesia yang baik dan benar.
`;

// Helper for calling Gemini with retry and exponential backoff
async function generateWithRetry(modelName: string, contents: any, config: any, retries = 3): Promise<any> {
  if (!ai) {
    throw new Error('API Key Gemini belum terkonfigurasi. Pastikan GEMINI_API_KEY tersedia.');
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config,
      });
      return response;
    } catch (err: any) {
      console.warn(`Gemini API call attempt ${attempt} failed:`, err.message);
      if (attempt === retries) {
        throw err;
      }
      // Wait with exponential backoff: 800ms, 1600ms, etc.
      await new Promise((resolve) => setTimeout(resolve, attempt * 800));
    }
  }
}

// Helper for parsing clean JSON from Gemini output
function parseJsonSafe(text: string | undefined): any {
  if (!text) return null;
  const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error('Failed to parse regex match as JSON', e);
      }
    }
    throw new Error('Gagal mengurai respon AI sebagai format JSON terstruktur.');
  }
}

// 1. Ekstraksi Dokumen Referensi
app.post('/api/gemini/extract-reference', async (req: Request, res: Response) => {
  try {
    const { rawText, jenjang, mataPelajaran } = req.body;
    if (!rawText || typeof rawText !== 'string' || rawText.trim().length < 10) {
      return res.status(400).json({ error: 'Teks referensi materi terlalu pendek atau kosong.' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'API Key Gemini belum terkonfigurasi. Pastikan GEMINI_API_KEY tersedia di panel Secrets.',
      });
    }

    const prompt = `
Analisis dokumen/teks referensi pembelajaran berikut untuk jenjang ${jenjang || 'Sekolah'} mata pelajaran ${mataPelajaran || 'Umum'}:
"""
${rawText.slice(0, 8000)}
"""

Ekstrak dan rumuskan:
1. Capaian Pembelajaran (CP) utama yang komprehensif.
2. Daftar Tujuan Pembelajaran (TP) terukur (antara 2 hingga 5 butir TP).
3. Materi Pokok esensial.
4. Topik Panca Cinta yang relevan (Pilih salah satu: Cinta Tuhan, Cinta Ilmu, Cinta Lingkungan, Cinta Diri dan Sesama, Cinta Tanah Air).
5. Materi Insersi Karakter / KBC (konsep nilai kearifan yang dapat diintegrasikan).
6. Ringkasan singkat esensi materi.

Balas HANYA dalam format JSON dengan struktur:
{
  "capaianPembelajaran": "string",
  "tujuanPembelajaranList": ["string"],
  "materiPokok": "string",
  "kbcTopic": "string",
  "materiInsersiKBC": "string",
  "summary": "string"
}
`;

    const response = await generateWithRetry('gemini-3.8-flash', prompt, {
      systemInstruction: ASSESSMENT_SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
    });

    const result = parseJsonSafe(response.text);
    return res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in /api/gemini/extract-reference:', error);
    return res.status(500).json({ error: error.message || 'Terjadi kesalahan pemrosesan AI.' });
  }
});

// 2. Generator Kisi-Kisi Soal (8 Kolom Kurikulum Merdeka)
app.post('/api/gemini/generate-kisi-kisi', async (req: Request, res: Response) => {
  try {
    const {
      mataPelajaran,
      kelas,
      jenjang,
      capaianPembelajaran,
      tujuanPembelajaranList,
      materiPokok,
      kbcTopic,
      materiInsersiKBC,
      jumlahSoal,
      distribusiBentuk,
      distribusiLevel,
      ketentuanTambahan,
    } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'API Key Gemini belum terkonfigurasi di server.',
      });
    }

    const totalCount = Number(jumlahSoal) || 5;
    const pgCount = Number(distribusiBentuk?.pg) || Math.floor(totalCount * 0.7);
    const uraianCount = Number(distribusiBentuk?.uraian) || (totalCount - pgCount);

    const prompt = `
Buatlah tabel Kisi-Kisi Soal Kurikulum Merdeka yang presisi dengan ketentuan:
- Mata Pelajaran: ${mataPelajaran || 'Umum'}
- Kelas / Jenjang: ${kelas || 'Fase D - Kelas VII'} (${jenjang || 'SMP'})
- Capaian Pembelajaran (CP): ${capaianPembelajaran || 'Sesuai kurikulum berlaku'}
- Tujuan Pembelajaran (TP): ${(tujuanPembelajaranList || []).join('; ') || 'Sesuai materi'}
- Materi Pokok: ${materiPokok || 'Topik utama'}
- Insersi Kurikulum Berbasis Cinta (KBC): Topik ${kbcTopic || 'Cinta Ilmu'}, Nilai: ${materiInsersiKBC || 'Karakter budi pekerti'}
- Jumlah Total Soal: ${totalCount} butir.
- Komposisi Bentuk Soal: PG=${pgCount}, Uraian=${uraianCount}, dll.
- Ketentuan Tambahan: ${ketentuanTambahan || 'Distribusi kognitif berimbang C1-C6'}.

Format Keluaran JSON HARUS berupa objek dengan key "kisiKisi":
[
  {
    "no": 1,
    "capaianPembelajaran": "string",
    "tujuanPembelajaran": "string",
    "materiAjar": "string",
    "indikatorSoal": "Disajikan ..., peserta didik dapat ... dengan tepat",
    "levelKognitif": "C2" (pilih satu: C1, C2, C3, C4, C5, C6),
    "bentukSoal": "PG" (pilih: PG, PGK, Uraian, Menjodohkan, Isian, BenarSalah),
    "noSoal": 1
  }
]
Pastikan jumlah butir tepat ${totalCount} dan nomor urut 1 sampai ${totalCount}.
`;

    const response = await generateWithRetry('gemini-3.8-flash', prompt, {
      systemInstruction: ASSESSMENT_SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
    });

    const result = parseJsonSafe(response.text);
    return res.json({ success: true, data: result.kisiKisi || result });
  } catch (error: any) {
    console.error('Error in /api/gemini/generate-kisi-kisi:', error);
    return res.status(500).json({ error: error.message || 'Gagal menghasilkan kisi-kisi.' });
  }
});

// 3. Generator Naskah Soal & Kartu Soal Sinkron
app.post('/api/gemini/generate-naskah-soal', async (req: Request, res: Response) => {
  try {
    const { project, kisiKisi } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'API Key Gemini belum terkonfigurasi di server.',
      });
    }

    if (!kisiKisi || !Array.isArray(kisiKisi) || kisiKisi.length === 0) {
      return res.status(400).json({ error: 'Data kisi-kisi belum ada untuk membuat naskah soal.' });
    }

    const prompt = `
Buatlah butir naskah soal asesmen yang SINKRON 100% dengan kisi-kisi berikut:
Mata Pelajaran: ${project.mataPelajaran}
Kelas: ${project.kelas}
Kurikulum: ${project.kurikulum}

Daftar Kisi-Kisi Butir:
${JSON.stringify(
  kisiKisi.map((k: any) => ({
    noSoal: k.noSoal,
    bentukSoal: k.bentukSoal,
    levelKognitif: k.levelKognitif,
    materi: k.materiAjar,
    indikatorSoal: k.indikatorSoal,
  })),
  null,
  2
)}

PETUNJUK KETAT:
1. Untuk PG: Berikan 4 pilihan jawaban (A, B, C, D) yang masuk akal dan satu kunci jawaban yang jelas.
2. Untuk Uraian: Berikan pertanyaan berbasis stimulus/studi kasus yang menuntut penalaran, serta kunci jawaban ideal yang jelas.
3. Untuk PGK: Berikan daftar pernyataan dengan status benar/salah.
4. Setiap butir soal harus memuat kunci jawaban yang pasti, pembahasan singkat, skor maksimal (PG bobot 10, Uraian 15-25), serta catatan jika ada ketidakpastian.

Balas HANYA dalam format JSON dengan format:
{
  "soalItems": [
    {
      "noSoal": 1,
      "bentukSoal": "PG",
      "stimulus": "Teks stimulus pembuka atau konteks kasus...",
      "pertanyaan": "Pertanyaan pokok...",
      "pilihanJawaban": [
        { "key": "A", "text": "..." },
        { "key": "B", "text": "..." },
        { "key": "C", "text": "..." },
        { "key": "D", "text": "..." }
      ],
      "pilihanKompleks": [],
      "kunciJawaban": "B",
      "pembahasan": "Penjelasan mengapa B benar...",
      "levelKognitif": "C2",
      "materi": "...",
      "indikatorSoal": "...",
      "skorMaksimal": 10,
      "needsTeacherCheck": false
    }
  ]
}
`;

    const response = await generateWithRetry('gemini-3.8-flash', prompt, {
      systemInstruction: ASSESSMENT_SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
    });

    const result = parseJsonSafe(response.text);
    return res.json({ success: true, data: result.soalItems || result });
  } catch (error: any) {
    console.error('Error in /api/gemini/generate-naskah-soal:', error);
    return res.status(500).json({ error: error.message || 'Gagal menghasilkan butir soal.' });
  }
});

// 4. Generator Rubrik & Pedoman Penskoran
app.post('/api/gemini/generate-kunci-rubrik', async (req: Request, res: Response) => {
  try {
    const { soalItems, mataPelajaran, kelas } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'API Key Gemini belum terkonfigurasi di server.',
      });
    }

    const uraianAndComplex = (soalItems || []).filter(
      (s: any) => s.bentukSoal === 'Uraian' || s.bentukSoal === 'PGK'
    );

    if (uraianAndComplex.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const prompt = `
Susunlah Rubrik Penskoran Analitik untuk soal non-objektif (Uraian dan Pilihan Ganda Kompleks) berikut ini:
Mata Pelajaran: ${mataPelajaran}
Kelas: ${kelas}

Soal-soal yang dinilai:
${JSON.stringify(
  uraianAndComplex.map((s: any) => ({
    noSoal: s.noSoal,
    bentukSoal: s.bentukSoal,
    pertanyaan: s.pertanyaan,
    kunciJawaban: s.kunciJawaban,
    skorMaksimal: s.skorMaksimal,
  })),
  null,
  2
)}

Buatlah rubrik bertingkat dengan kriteria skor parsial (misal: skor maksimal, skor parsial atas, skor parsial bawah, dan 0 bila tidak menjawab/salah).

Balas HANYA JSON:
{
  "rubrikList": [
    {
      "noSoal": 1,
      "aspek": "Aspek yang dinilai...",
      "kriteriaSkor": [
        { "skor": 15, "deskripsi": "Deskripsi kualitas jawaban sempurna..." },
        { "skor": 10, "deskripsi": "Deskripsi kualitas jawaban cukup lengkap..." },
        { "skor": 5, "deskripsi": "Deskripsi kualitas jawaban kurang memadai..." },
        { "skor": 0, "deskripsi": "Tidak menjawab atau keliru total." }
      ]
    }
  ]
}
`;

    const response = await generateWithRetry('gemini-3.8-flash', prompt, {
      systemInstruction: ASSESSMENT_SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
    });

    const result = parseJsonSafe(response.text);
    return res.json({ success: true, data: result.rubrikList || result });
  } catch (error: any) {
    console.error('Error in /api/gemini/generate-kunci-rubrik:', error);
    return res.status(500).json({ error: error.message || 'Gagal menghasilkan rubrik penskoran.' });
  }
});

// 5. Audit Mutu & Validasi AI
app.post('/api/gemini/audit-quality', async (req: Request, res: Response) => {
  try {
    const { project } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'API Key Gemini belum terkonfigurasi di server.',
      });
    }

    const summaryPayload = {
      title: project.title,
      mataPelajaran: project.mataPelajaran,
      kelas: project.kelas,
      jumlahSoal: project.jumlahSoal,
      kisiKisiCount: (project.kisiKisi || []).length,
      soalCount: (project.soalItems || []).length,
      kisiKisiSample: (project.kisiKisi || []).slice(0, 10).map((k: any) => ({
        noSoal: k.noSoal,
        level: k.levelKognitif,
        bentuk: k.bentukSoal,
        indikator: k.indikatorSoal,
      })),
      soalSample: (project.soalItems || []).slice(0, 10).map((s: any) => ({
        noSoal: s.noSoal,
        pertanyaan: s.pertanyaan.slice(0, 80),
        kunci: s.kunciJawaban,
      })),
    };

    const prompt = `
Sebagai Auditor Ahli Asesmen Pendidikan Nasional, lakukan tinjauan audit mutu komprehensif terhadap paket asesmen ini:
${JSON.stringify(summaryPayload, null, 2)}

Periksa 5 dimensi:
1. Kesesuaian jumlah butir soal dengan kisi-kisi.
2. Keselarasan indikator soal dengan pertanyaan yang diajukan.
3. Kualitas distraktor dan kejelasan kunci jawaban.
4. Keseimbangan level kognitif Bloom (C1-C6) agar tidak melulu hafalan tingkat rendah.
5. Keadilan rubrik penskoran.

Balas HANYA JSON:
{
  "overallStatus": "valid" | "warning" | "needs_revision",
  "scoreOutOf100": number,
  "summaryNotes": "Ulasan singkat profesional...",
  "checks": [
    {
      "id": "check_1",
      "title": "Kesesuaian Kisi-Kisi dan Naskah Soal",
      "status": "valid" | "warning" | "error",
      "description": "Temuan...",
      "recommendation": "Saran perbaikan..."
    }
  ]
}
`;

    const response = await generateWithRetry('gemini-3.8-flash', prompt, {
      systemInstruction: ASSESSMENT_SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
    });

    const result = parseJsonSafe(response.text);
    return res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in /api/gemini/audit-quality:', error);
    return res.status(500).json({ error: error.message || 'Gagal melakukan audit mutu.' });
  }
});

// Vite Middleware for Development / Static Serve for Production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server Zona Asesmen Bersama Bella Asiah running on http://localhost:${PORT}`);
  });
}

startServer();
