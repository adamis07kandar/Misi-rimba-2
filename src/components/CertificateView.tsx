import React, { useState, useEffect, useRef } from 'react';
import {
  Award,
  Download,
  Printer,
  Copy,
  Check,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  BookmarkCheck,
  CheckCircle2,
  FileImage,
  AlertCircle
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { AgentProfile, PerformanceAnalysis } from '../types/game';
import { soundManager } from '../utils/audio';
import { generateCertificatePNG } from '../utils/certificateCanvas';

interface CertificateViewProps {
  agent: AgentProfile;
  performance: PerformanceAnalysis;
  onBackToReport: () => void;
  onNewMission: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  agent,
  performance,
  onBackToReport,
  onNewMission
}) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const certRef = useRef<HTMLDivElement | null>(null);

  const formattedDate = new Intl.DateTimeFormat('ms-MY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(agent.startedAt));

  // Automatically save certificate to local storage so student records are never lost
  useEffect(() => {
    try {
      const savedKey = 'saved_agent_certificates';
      const existing = JSON.parse(localStorage.getItem(savedKey) || '[]');
      const alreadySaved = existing.some((c: any) => c.certificateCode === agent.certificateCode);

      if (!alreadySaved) {
        existing.push({
          agent,
          score: performance.totalScore,
          maxScore: performance.maxScore,
          grade: performance.rankGrade,
          rankTitle: performance.rankTitle,
          savedAt: new Date().toISOString()
        });
        localStorage.setItem(savedKey, JSON.stringify(existing));
      }
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [agent, performance]);

  /**
   * High-resolution PNG image download using direct canvas renderer.
   * Completely immune to CSS oklch color parsing bugs and browser iframe restrictions.
   */
  const handleDownloadPNG = async () => {
    soundManager.playClick();
    setIsDownloading(true);
    setDownloadSuccessMsg(null);
    setDownloadError(null);

    try {
      const dataUrl = await generateCertificatePNG(agent, performance);

      // Create download link
      const link = document.createElement('a');
      const safeAgentName = agent.name.replace(/[^a-zA-Z0-9]/g, '_');
      link.download = `Sijil_Ejen_${safeAgentName}_${agent.certificateCode}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      soundManager.playCorrect();
      setDownloadSuccessMsg(`✅ Sijil berjaya disimpan ke peranti anda sebagai fail imej PNG (${link.download})!`);

      // Hide toast after 5s
      setTimeout(() => {
        setDownloadSuccessMsg(null);
      }, 5000);
    } catch (err: any) {
      console.error('Failed to download certificate:', err);
      setDownloadError('Gagal menjana imej. Sila gunakan butang "Cetak / PDF".');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    soundManager.playClick();
    try {
      window.print();
    } catch (err) {
      handleDownloadPNG();
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(agent.certificateCode);
    setCopied(true);
    soundManager.playClick();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-8 overflow-y-auto">
      {/* Toast Notification Banner */}
      {downloadSuccessMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-lg w-full px-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500/70 text-emerald-200 text-xs sm:text-sm font-semibold shadow-2xl backdrop-blur-md flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="flex-1">{downloadSuccessMsg}</div>
          </div>
        </div>
      )}

      {downloadError && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-lg w-full px-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-3.5 rounded-xl bg-rose-950/90 border border-rose-500/70 text-rose-200 text-xs sm:text-sm font-semibold shadow-2xl backdrop-blur-md flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="flex-1">{downloadError}</div>
          </div>
        </div>
      )}

      {/* Action Navigation Bar (Hidden when printing) */}
      <div className="print:hidden max-w-4xl mx-auto w-full flex flex-wrap items-center justify-between gap-3 mb-6 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl backdrop-blur-md shadow-xl">
        <button
          onClick={onBackToReport}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Laporan</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Primary Save Button: Direct PNG Image Download */}
          <button
            onClick={handleDownloadPNG}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 hover:brightness-105 active:scale-95 transition cursor-pointer"
            title="Muat turun fail imej PNG sijil terus ke peranti anda"
          >
            {isDownloading ? (
              <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isDownloading ? 'Menjana Imej...' : 'Simpan / Muat Turun Sijil (PNG)'}</span>
          </button>

          {/* Secondary Print / PDF Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 hover:brightness-105 active:scale-95 transition cursor-pointer"
            title="Cetak fizikal atau simpan sebagai PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / PDF</span>
          </button>

          {/* Copy Code */}
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/30 text-amber-300 text-xs font-semibold transition cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Kod Disalin!' : 'Salin Kod'}</span>
          </button>

          {/* New Mission */}
          <button
            onClick={onNewMission}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            Ejen Baharu
          </button>
        </div>
      </div>

      {/* Official Certificate Parchment Canvas */}
      <div className="max-w-4xl mx-auto w-full my-auto">
        <div
          ref={certRef}
          id="certificate-print-area"
          className="relative bg-[#fffbeb] text-slate-900 p-8 sm:p-12 md:p-14 rounded-3xl shadow-2xl border-8 border-double border-amber-800/80 overflow-hidden select-text"
          style={{ minHeight: '620px' }}
        >
          {/* Ornate Vintage Corners */}
          <div className="absolute top-3 left-3 w-12 h-12 border-t-4 border-l-4 border-amber-800 pointer-events-none" />
          <div className="absolute top-3 right-3 w-12 h-12 border-t-4 border-r-4 border-amber-800 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-12 h-12 border-b-4 border-l-4 border-amber-800 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-12 h-12 border-b-4 border-r-4 border-amber-800 pointer-events-none" />

          {/* Delicate inner frame border */}
          <div className="absolute inset-5 border border-amber-700/40 pointer-events-none rounded-xl" />

          {/* Watermark Crest */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
            <ShieldCheck className="w-96 h-96 text-amber-950" />
          </div>

          {/* Certificate Content */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            {/* Crest & National Detective Emblem */}
            <div className="flex items-center gap-2 mb-1">
              <div className="w-12 h-12 rounded-full bg-amber-800 text-amber-100 flex items-center justify-center shadow-md border-2 border-amber-600">
                <Award className="w-7 h-7" />
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] font-mono tracking-widest text-amber-900 uppercase font-bold">
                BADAN PENYIASATAN KHAS & FORENSIK RIMBA
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-serif tracking-wide text-amber-950 uppercase border-b-2 border-amber-800/40 pb-2">
                Sijil Pentauliahan Detektif
              </h1>
              <p className="text-xs sm:text-sm font-serif italic text-amber-900 pt-1">
                Dengan penuh pengiktirafan dan kepujian rasmi diperakui bahawa:
              </p>
            </div>

            {/* Recipient Agent Name */}
            <div className="py-2 w-full max-w-xl border-b-2 border-amber-900/60 my-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-950 font-serif tracking-normal">
                {agent.name}
              </h2>
            </div>

            {/* School & Class Metadata */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs sm:text-sm text-amber-900 font-medium">
              <div>
                <span className="text-amber-800/80">Kelas:</span>{' '}
                <strong className="text-amber-950 font-bold">{agent.classroom}</strong>
              </div>
              <div>•</div>
              <div>
                <span className="text-amber-800/80">Sekolah:</span>{' '}
                <strong className="text-amber-950 font-bold">{agent.school}</strong>
              </div>
              <div>•</div>
              <div>
                <span className="text-amber-800/80">No. Ejen:</span>{' '}
                <strong className="text-amber-950 font-mono font-bold">{agent.agentId}</strong>
              </div>
            </div>

            {/* Citation Text */}
            <p className="max-w-2xl text-xs sm:text-sm text-amber-900/90 leading-relaxed font-serif pt-1">
              Telah menunjukkan kecemerlangan pemikiran kritis, analisis bukti forensik dan ketangkasan kawalan jari kamera dalam menyelesaikan{' '}
              <strong className="text-amber-950">
                Siasatan Bilik Terkurung: Kes Sang Buaya, Kerbau dan Sang Kancil
              </strong>
              , berjaya merungkai kebenaran di sebalik pengkhianatan dan tipu helah pemangsa rimba.
            </p>

            {/* Performance Metric Pill */}
            <div className="flex flex-wrap items-center justify-center gap-3 py-2">
              <div className="px-3.5 py-1.5 rounded-xl bg-amber-200/90 border border-amber-400 text-amber-950 text-xs sm:text-sm font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>Markah Akhir: {performance.totalScore} / {performance.maxScore} ({performance.percentage}%)</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-amber-200/90 border border-amber-400 text-amber-950 text-xs sm:text-sm font-bold">
                <span>Gred: {performance.rankGrade}</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-amber-900 text-amber-50 text-xs sm:text-sm font-bold font-serif shadow-sm">
                <span>{performance.rankTitle}</span>
              </div>
            </div>

            {/* Footer with Signatures, Date and Verification Code */}
            <div className="w-full pt-6 mt-4 border-t border-amber-800/30 grid grid-cols-3 items-end gap-4 text-center">
              {/* Left Signee */}
              <div className="space-y-1">
                <div className="h-10 flex items-center justify-center">
                  <span className="font-serif italic text-base sm:text-lg text-amber-950 font-bold -rotate-6">
                    Sang Kancil
                  </span>
                </div>
                <div className="w-32 mx-auto border-t border-amber-900/60 pt-1">
                  <div className="text-[11px] font-bold text-amber-950 leading-tight">
                    Sang Kancil, S.P.R.
                  </div>
                  <div className="text-[9px] text-amber-800 font-serif leading-tight">
                    Ketua Hakim & Siasatan Rimba
                  </div>
                </div>
              </div>

              {/* Center Official Gold Seal Stamp */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full border-4 border-amber-700 bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-600 flex flex-col items-center justify-center text-amber-950 shadow-lg p-1">
                  <Award className="w-6 h-6 text-amber-950" />
                  <span className="text-[7px] font-extrabold uppercase tracking-tight text-center leading-none mt-0.5">
                    MOHOR RASMI<br />PENTAULIAHAN
                  </span>
                  <span className="text-[6px] font-mono text-amber-950 font-bold mt-0.5">
                    2026-SAH
                  </span>
                </div>
                <div className="text-[10px] text-amber-900 font-mono mt-2 font-medium">
                  {formattedDate}
                </div>
              </div>

              {/* Right Verification Code & Barcode */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-amber-800 uppercase font-semibold">
                  KOD VERIFIKASI RASMI:
                </div>
                <div className="px-2 py-1 rounded bg-amber-200/90 border border-amber-500 text-amber-950 font-mono font-extrabold text-xs tracking-wider inline-block">
                  {agent.certificateCode}
                </div>
                <div className="pt-1">
                  {/* Simulated barcode */}
                  <div className="h-5 w-32 mx-auto flex items-stretch justify-center gap-0.5 opacity-80">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div
                        key={i}
                        className={`bg-amber-950 ${
                          i % 3 === 0 ? 'w-1' : i % 5 === 0 ? 'w-1.5' : 'w-0.5'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-[8px] font-mono text-amber-800 mt-0.5">
                    KES-BUAYA-KERBAU-KANCIL
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Specific CSS style */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          #certificate-print-area {
            box-shadow: none !important;
            border-width: 4px !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      {/* Footer Info */}
      <footer className="print:hidden relative z-10 max-w-4xl mx-auto w-full pt-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
        <BookmarkCheck className="w-4 h-4 text-emerald-400" />
        <span>Sijil ini disimpan secara automatik dalam simpanan peranti anda untuk rekod rujukan.</span>
      </footer>
    </div>
  );
};
