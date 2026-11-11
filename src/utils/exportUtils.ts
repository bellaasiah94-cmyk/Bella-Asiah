import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  AlignmentType,
} from 'docx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AssessmentProject } from '../types/assessment';

// Helper to format clean filename
function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9_\-]/g, '_').substring(0, 50);
}

// Helper for quick bold paragraph
function boldP(text: string, size = 20): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size })],
  });
}

// Helper for normal paragraph
function normalP(text: string, size = 20): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size })],
  });
}

// Helper for italic paragraph
function italicP(text: string, size = 20): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, italics: true, size })],
  });
}

// -------------------------------------------------------------
// 1. EKSPOR XLSX (EXCEL)
// -------------------------------------------------------------
export function exportToExcel(project: AssessmentProject) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Kisi-Kisi
  const kisiData = (project.kisiKisi || []).map((k) => ({
    'No': k.no,
    'Capaian Pembelajaran (CP)': k.capaianPembelajaran,
    'Tujuan Pembelajaran (TP)': k.tujuanPembelajaran,
    'Materi Ajar': k.materiAjar,
    'Indikator Soal': k.indikatorSoal,
    'Level Kognitif': k.levelKognitif,
    'Bentuk Soal': k.bentukSoal,
    'No Soal': k.noSoal,
  }));
  const wsKisi = XLSX.utils.json_to_sheet(kisiData);
  XLSX.utils.book_append_sheet(wb, wsKisi, 'Kisi-Kisi Soal');

  // Sheet 2: Kunci Jawaban & Bobot
  const kunciData = (project.soalItems || []).map((s) => ({
    'No Soal': s.noSoal,
    'Bentuk': s.bentukSoal,
    'Level Kognitif': s.levelKognitif,
    'Kunci Jawaban': s.kunciJawaban,
    'Skor Maksimal': s.skorMaksimal,
    'Pembahasan / Pedoman Jawaban': s.pembahasan || '',
  }));
  const wsKunci = XLSX.utils.json_to_sheet(kunciData);
  XLSX.utils.book_append_sheet(wb, wsKunci, 'Kunci & Penskoran');

  // Sheet 3: Rekap Nilai Siswa
  const rekapData = (project.rekapSiswaList || []).map((r) => ({
    'No': r.no,
    'Nama Siswa': r.nama,
    'NISN': r.nisn || '-',
    'Skor Diperoleh': r.skorDiperoleh,
    'Skor Maksimal': project.skorMaksimal,
    'Nilai Akhir': r.nilai,
    'Status Ketercapaian (KKTP)': r.status,
    'Catatan Guru': r.catatan || '',
  }));
  const wsRekap = XLSX.utils.json_to_sheet(rekapData);
  XLSX.utils.book_append_sheet(wb, wsRekap, 'Rekap Hasil Belajar');

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `Perangkat_Asesmen_${sanitizeFilename(project.title)}.xlsx`);
}

// -------------------------------------------------------------
// 2. EKSPOR DOCX (MICROSOFT WORD)
// -------------------------------------------------------------
export async function exportToDocx(
  project: AssessmentProject,
  mode: 'all' | 'kisi' | 'kartu' | 'naskah' | 'kunci' | 'rubrik' = 'all'
) {
  const sectionsChildren: any[] = [];

  // Kop Header Umum
  const addHeader = (title: string) => {
    return [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `${project.satuanKerja.toUpperCase()}\n${project.satuanPendidikan.toUpperCase()}`,
            bold: true,
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 150 },
        children: [
          new TextRun({
            text: `PERANGKAT ASESMEN: ${title.toUpperCase()}`,
            bold: true,
            size: 26,
            underline: {},
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Mata Pelajaran: ${project.mataPelajaran}  |  Kelas/Semester: ${project.kelas} (${project.semester})  |  Tahun Ajaran: ${project.tahunAjaran}`,
            italics: true,
            size: 20,
          }),
        ],
        spacing: { after: 200 },
      }),
    ];
  };

  // 1. KISI-KISI TABLE
  if (mode === 'all' || mode === 'kisi') {
    sectionsChildren.push(...addHeader('Kisi-Kisi Penulisan Soal'));

    const kisiTableRows = [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({ children: [boldP('No')], width: { size: 5, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [boldP('Capaian Pembelajaran (CP)')], width: { size: 25, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [boldP('Tujuan Pembelajaran (TP)')], width: { size: 25, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [boldP('Materi Ajar')], width: { size: 15, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [boldP('Indikator Soal')], width: { size: 20, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [boldP('Level')], width: { size: 5, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [boldP('Bentuk')], width: { size: 5, type: WidthType.PERCENTAGE } }),
        ],
      }),
      ...(project.kisiKisi || []).map(
        (k) =>
          new TableRow({
            children: [
              new TableCell({ children: [normalP(String(k.noSoal))] }),
              new TableCell({ children: [normalP(k.capaianPembelajaran)] }),
              new TableCell({ children: [normalP(k.tujuanPembelajaran)] }),
              new TableCell({ children: [normalP(k.materiAjar)] }),
              new TableCell({ children: [normalP(k.indikatorSoal)] }),
              new TableCell({ children: [normalP(k.levelKognitif)] }),
              new TableCell({ children: [normalP(k.bentukSoal)] }),
            ],
          })
      ),
    ];

    sectionsChildren.push(
      new Table({
        rows: kisiTableRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
      })
    );

    sectionsChildren.push(new Paragraph({ text: '', spacing: { after: 300 } }));
  }

  // 2. KARTU SOAL
  if (mode === 'all' || mode === 'kartu') {
    sectionsChildren.push(...addHeader('Kartu Soal'));

    (project.soalItems || []).forEach((item) => {
      const cardRows = [
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `KARTU BUTIR SOAL NOMOR ${item.noSoal} (${item.bentukSoal})`,
                      bold: true,
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [boldP('Mata Pelajaran:')] }),
            new TableCell({ children: [normalP(project.mataPelajaran)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [boldP('Kelas / Fase:')] }),
            new TableCell({ children: [normalP(project.kelas)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [boldP('Level Kognitif:')] }),
            new TableCell({ children: [normalP(item.levelKognitif)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [boldP('Materi:')] }),
            new TableCell({ children: [normalP(item.materi)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [boldP('Indikator Soal:')] }),
            new TableCell({ children: [normalP(item.indikatorSoal)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [boldP('Deskripsi Soal & Stimulus:')] }),
            new TableCell({
              children: [
                item.stimulus ? italicP(item.stimulus) : normalP(''),
                boldP(item.pertanyaan),
                ...(item.pilihanJawaban || []).map(
                  (opt) => normalP(`${opt.key}. ${opt.text}`)
                ),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [boldP('Kunci & Skor Max:')] }),
            new TableCell({ children: [normalP(`Kunci: ${item.kunciJawaban} | Skor Maksimal: ${item.skorMaksimal}`)] }),
          ],
        }),
      ];

      sectionsChildren.push(
        new Table({
          rows: cardRows,
          width: { size: 100, type: WidthType.PERCENTAGE },
        })
      );
      sectionsChildren.push(new Paragraph({ text: '', spacing: { after: 200 } }));
    });
  }

  // 3. NASKAH SOAL
  if (mode === 'all' || mode === 'naskah') {
    sectionsChildren.push(...addHeader('Naskah Soal Ujian'));
    sectionsChildren.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'PETUNJUK PENGERJAAN SOAL:', bold: true }),
          new TextRun({ text: '\n1. Berdoalah sebelum mulai mengerjakan soal.' }),
          new TextRun({ text: '\n2. Periksa kelengkapan naskah soal dan nomor urut sebelum menjawab.' }),
          new TextRun({ text: '\n3. Pilihlah satu jawaban yang paling tepat atau jawablah pertanyaan uraian secara sistematis.' }),
        ],
        spacing: { after: 200 },
      })
    );

    (project.soalItems || []).forEach((item) => {
      const pElements = [];
      if (item.stimulus) {
        pElements.push(
          new Paragraph({
            children: [
              new TextRun({ text: `[Stimulus Soal No. ${item.noSoal}]: `, bold: true }),
              new TextRun({ text: item.stimulus, italics: true }),
            ],
            spacing: { before: 150 },
          })
        );
      }

      pElements.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${item.noSoal}. `, bold: true }),
            new TextRun({ text: item.pertanyaan }),
          ],
          spacing: { before: 50, after: 50 },
        })
      );

      if (item.pilihanJawaban && item.pilihanJawaban.length > 0) {
        item.pilihanJawaban.forEach((opt) => {
          pElements.push(
            new Paragraph({
              text: `    ${opt.key}.  ${opt.text}`,
              spacing: { after: 30 },
            })
          );
        });
      }

      if (item.bentukSoal === 'Uraian') {
        pElements.push(
          italicP('    Ruang Jawaban: ............................................................................................................')
        );
      }

      sectionsChildren.push(...pElements);
    });
  }

  // 4. KUNCI JAWABAN & PEMBAHASAN
  if (mode === 'all' || mode === 'kunci') {
    sectionsChildren.push(...addHeader('Kunci Jawaban & Pembahasan'));
    const kunciRows = [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({ children: [boldP('No')], width: { size: 10, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [boldP('Bentuk')], width: { size: 15, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [boldP('Kunci Jawaban')], width: { size: 35, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [boldP('Skor Max')], width: { size: 15, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [boldP('Pembahasan Singkat')], width: { size: 25, type: WidthType.PERCENTAGE } }),
        ],
      }),
      ...(project.soalItems || []).map(
        (s) =>
          new TableRow({
            children: [
              new TableCell({ children: [normalP(String(s.noSoal))] }),
              new TableCell({ children: [normalP(s.bentukSoal)] }),
              new TableCell({ children: [normalP(s.kunciJawaban)] }),
              new TableCell({ children: [normalP(String(s.skorMaksimal))] }),
              new TableCell({ children: [normalP(s.pembahasan || '-')] }),
            ],
          })
      ),
    ];

    sectionsChildren.push(
      new Table({
        rows: kunciRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
      })
    );
  }

  // 5. PEDOMAN PENSKORAN & RUBRIK
  if (mode === 'all' || mode === 'rubrik') {
    sectionsChildren.push(...addHeader('Pedoman Penskoran & Rubrik Penilaian'));
    sectionsChildren.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Rumus Perhitungan Nilai: ${project.rumusNilai || 'Nilai = (Skor Perolehan / Skor Maksimal) x 100'}`, bold: true }),
          new TextRun({ text: `\nKriteria Ketercapaian Tujuan Pembelajaran (KKTP): ${project.kktp} (Nilai >= ${project.kktp} = Tuntas)` }),
        ],
        spacing: { after: 200 },
      })
    );

    (project.rubrikList || []).forEach((r) => {
      sectionsChildren.push(
        boldP(`Rubrik Soal Nomor ${r.noSoal}: ${r.aspek}`, 22)
      );

      const rubrikRows = [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({ children: [boldP('Skor')], width: { size: 15, type: WidthType.PERCENTAGE } }),
            new TableCell({ children: [boldP('Kriteria Capaian Jawaban')], width: { size: 85, type: WidthType.PERCENTAGE } }),
          ],
        }),
        ...(r.kriteriaSkor || []).map(
          (k) =>
            new TableRow({
              children: [
                new TableCell({ children: [normalP(String(k.skor))] }),
                new TableCell({ children: [normalP(k.deskripsi)] }),
              ],
            })
        ),
      ];

      sectionsChildren.push(
        new Table({
          rows: rubrikRows,
          width: { size: 100, type: WidthType.PERCENTAGE },
        })
      );
    });

    // Tanda Tangan
    sectionsChildren.push(
      new Paragraph({
        text: '',
        spacing: { before: 300 },
      }),
      new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [
                  normalP('Mengetahui,\nKepala Sekolah'),
                  boldP(`\n\n\n${project.namaKepalaSekolah}`),
                  normalP(`NIP. ${project.nipKepalaSekolah}`),
                ],
                width: { size: 50, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [
                  normalP('Denpasar / Kota, ..................... 2026\nGuru Mata Pelajaran'),
                  boldP(`\n\n\n${project.namaGuru}`),
                  normalP(`NIP. ${project.nipGuru}`),
                ],
                width: { size: 50, type: WidthType.PERCENTAGE },
              }),
            ],
          }),
        ],
        width: { size: 100, type: WidthType.PERCENTAGE },
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: sectionsChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const suffix = mode === 'all' ? 'Lengkap_5_Perangkat' : mode;
  saveAs(blob, `Asesmen_${suffix}_${sanitizeFilename(project.title)}.docx`);
}

// -------------------------------------------------------------
// 3. EKSPOR PDF CEPAT (JSPDF)
// -------------------------------------------------------------
export function exportToPdf(project: AssessmentProject) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(project.satuanPendidikan.toUpperCase(), 105, 15, { align: 'center' });
  doc.setFontSize(11);
  doc.text(`KISI-KISI & PERANGKAT ASESMEN: ${project.title.toUpperCase()}`, 105, 21, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(
    `Mata Pelajaran: ${project.mataPelajaran} | Kelas: ${project.kelas} | Semester: ${project.semester} | Guru: ${project.namaGuru}`,
    105,
    27,
    { align: 'center' }
  );

  doc.line(14, 30, 196, 30);

  // Table Kisi-Kisi
  const tableData = (project.kisiKisi || []).map((k) => [
    String(k.noSoal),
    k.materiAjar,
    k.indikatorSoal,
    k.levelKognitif,
    k.bentukSoal,
  ]);

  autoTable(doc, {
    startY: 33,
    head: [['No', 'Materi Ajar', 'Indikator Soal', 'Level', 'Bentuk']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [6, 78, 59] }, // Deep forest green
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 35 },
      2: { cellWidth: 100 },
      3: { cellWidth: 15 },
      4: { cellWidth: 20 },
    },
  });

  // Add summary footer
  const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : 150;
  doc.setFontSize(9);
  doc.text(`Total Butir Soal: ${project.soalItems?.length || 0} | Skor Maksimal: ${project.skorMaksimal} | KKTP: ${project.kktp}`, 14, finalY);
  doc.text(`Penyusun: ${project.namaGuru} (Zona Asesmen Bersama Bella Asiah)`, 14, finalY + 5);

  doc.save(`Ringkasan_Asesmen_${sanitizeFilename(project.title)}.pdf`);
}
