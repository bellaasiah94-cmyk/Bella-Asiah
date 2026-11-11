import React, { useState } from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { validateAssessmentPackage } from '../../utils/validationUtils';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  RefreshCw,
  Stamp,
  ArrowRight,
  FileText,
  UserCheck,
} from 'lucide-react';

export const ValidasiMutuView: React.FC = () => {
  const { activeProject, updateActiveProject, setActiveView } = useAssessment();
  const [runningAiAudit, setRunningAiAudit] = useState(false);
  const [aiAuditResult, setAiAuditResult] = useState<any | null>(null);

  const localValidation = validateAssessmentPackage(activeProject);

  const handleRunAiAudit = async () => {
    setRunningAiAudit(true);
    try {
      const response = await fetch('/api/gemini/audit-quality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: activeProject }),
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.success) {
        throw new Error(resJson.error || 'Gagal memanggil AI Auditor.');
      }

      setAiAuditResult(resJson.data);
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan saat audit AI.');
    } finally {
      setRunningAiAudit(false);
    }
  };

  const handleSetStatus = (newStatus: 'draft' | 'needs_review' | 'validated' | 'final') => {
    updateActiveProject({
      status: newStatus,
      lastValidatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">
            Modul 8: Validasi Mutu & Quality Assurance Paket Asesmen
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pemeriksaan kepatuhan standar kurikulum sebelum dokumen dicetak dan disahkan oleh Kepala Sekolah.
          </p>
        </div>

        <button
          onClick={handleRunAiAudit}
          disabled={runningAiAudit}
          className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 disabled:opacity-50 text-white font-medium text-xs rounded-lg flex items-center gap-2 shadow-sm transition-colors"
        >
          {runningAiAudit ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
              <span>Memeriksa dengan AI Auditor...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Jalankan AI Quality Audit</span>
            </>
          )}
        </button>
      </div>

      {/* Summary Score Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              localValidation.overallStatus === 'valid'
                ? 'bg-emerald-100 text-emerald-800'
                : localValidation.overallStatus === 'warning'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {localValidation.overallStatus === 'valid' ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : localValidation.overallStatus === 'warning' ? (
              <AlertTriangle className="w-6 h-6" />
            ) : (
              <XCircle className="w-6 h-6" />
            )}
          </div>
          <div>
            <p className="text-xs text-slate-500">Status Validasi Sistem</p>
            <p className="text-base font-bold text-slate-800 capitalize">
              {localValidation.overallStatus === 'valid'
                ? 'Paket Memenuhi Syarat'
                : localValidation.overallStatus === 'warning'
                ? 'Catatan Peringatan'
                : 'Perlu Revisi'}
            </p>
          </div>
        </div>

        <div className="sm:border-l sm:border-slate-200 sm:pl-4">
          <p className="text-xs text-slate-500">Pemeriksaan Lolos</p>
          <p className="text-lg font-bold text-slate-900 font-mono-num">
            {localValidation.passedChecks} / {localValidation.totalChecks} Parameter
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Jumlah, nomor, indikator, HOTS, & rubrik</p>
        </div>

        <div className="sm:border-l sm:border-slate-200 sm:pl-4">
          <p className="text-xs text-slate-500">Status Dokumen Saat Ini</p>
          <div className="mt-1 flex items-center gap-1.5">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                activeProject.status === 'final'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : activeProject.status === 'validated'
                  ? 'bg-teal-100 text-teal-800 border border-teal-300'
                  : activeProject.status === 'needs_review'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-slate-100 text-slate-700 border border-slate-300'
              }`}
            >
              {activeProject.status}
            </span>
          </div>
        </div>
      </div>

      {/* AI Auditor Findings If Generated */}
      {aiAuditResult && (
        <div className="bg-gradient-to-br from-emerald-950 to-teal-950 rounded-xl p-5 text-white border border-emerald-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-800/80">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <h3 className="text-sm font-bold">Laporan Audit AI Instructional Designer</h3>
            </div>
            {aiAuditResult.scoreOutOf100 !== undefined && (
              <span className="text-xs font-mono-num font-bold px-2 py-0.5 bg-emerald-800/80 rounded border border-emerald-600 text-amber-300">
                Skor Mutu: {aiAuditResult.scoreOutOf100} / 100
              </span>
            )}
          </div>

          <p className="text-xs text-slate-200 leading-relaxed italic">
            "{aiAuditResult.summaryNotes || 'Semua instrumen telah diperiksa dengan seksama.'}"
          </p>

          {aiAuditResult.checks && (
            <div className="space-y-2 pt-2">
              {aiAuditResult.checks.map((c: any, idx: number) => (
                <div key={idx} className="p-2.5 rounded bg-emerald-900/40 border border-emerald-800/60 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span>{c.title}</span>
                    <span className="text-[11px] font-mono capitalize text-amber-300">[{c.status}]</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">{c.description}</p>
                  {c.recommendation && (
                    <p className="text-[11px] text-emerald-300 mt-1">
                      <strong>Rekomendasi:</strong> {c.recommendation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Checklist Parameter Standar Nasional */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-800">
            Daftar Uji Kelayakan Standar Asesmen Kurikulum Merdeka
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          {localValidation.items.map((check) => (
            <div key={check.id} className="p-4 flex items-start gap-3 hover:bg-slate-50/50 transition-colors">
              <div className="mt-0.5 shrink-0">
                {check.status === 'valid' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {check.status === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                {check.status === 'error' && <XCircle className="w-5 h-5 text-rose-600" />}
              </div>

              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800">{check.title}</h4>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      check.status === 'valid'
                        ? 'bg-emerald-50 text-emerald-700'
                        : check.status === 'warning'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {check.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{check.description}</p>
                {check.recommendation && (
                  <p className="text-[11px] text-amber-800 font-medium pt-1">
                    Saran: {check.recommendation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Teacher Final Approval Card (No False AI Claim) */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">
          <Stamp className="w-4 h-4 text-emerald-800" />
          <span>Persetujuan & Penetapan Status Akhir oleh Guru Penyusun</span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          AI hanyalah asisten pembuat draf; penjaminan mutu dan keputusan akhir kebenaran butir asesmen berada sepenuhnya pada wewenang guru profesional.
          Pilih status paket asesmen ini:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => handleSetStatus('draft')}
            className={`p-3 rounded-lg border text-xs font-medium text-center transition-all ${
              activeProject.status === 'draft'
                ? 'border-slate-800 bg-slate-900 text-white font-bold shadow-sm'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            1. Draf Awal
          </button>

          <button
            onClick={() => handleSetStatus('needs_review')}
            className={`p-3 rounded-lg border text-xs font-medium text-center transition-all ${
              activeProject.status === 'needs_review'
                ? 'border-amber-600 bg-amber-600 text-white font-bold shadow-sm'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            2. Perlu Ditinjau
          </button>

          <button
            onClick={() => handleSetStatus('validated')}
            className={`p-3 rounded-lg border text-xs font-medium text-center transition-all ${
              activeProject.status === 'validated'
                ? 'border-teal-700 bg-teal-800 text-white font-bold shadow-sm'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            3. Tervalidasi Guru
          </button>

          <button
            onClick={() => handleSetStatus('final')}
            className={`p-3 rounded-lg border text-xs font-medium text-center transition-all ${
              activeProject.status === 'final'
                ? 'border-emerald-800 bg-emerald-900 text-white font-bold shadow-sm'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            4. Siap Cetak (Final)
          </button>
        </div>

        {activeProject.lastValidatedAt && (
          <p className="text-[11px] text-slate-400">
            Terakhir divalidasi pada: {new Date(activeProject.lastValidatedAt).toLocaleString('id-ID')}
          </p>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setActiveView('pedoman-penilaian')}
          className="text-xs text-slate-600 hover:text-slate-900 font-medium px-3 py-2"
        >
          Kembali ke Pedoman Penskoran
        </button>
        <button
          onClick={() => setActiveView('ekspor')}
          className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white font-medium text-xs rounded-lg flex items-center gap-2 shadow-sm transition-colors"
        >
          <span>Lanjut ke Preview & Ekspor Paket</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
        </button>
      </div>
    </div>
  );
};
