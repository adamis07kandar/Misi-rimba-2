import React, { useEffect } from 'react';
import { Award, CheckCircle2, Clock, Sparkles, Target, Zap, Shield, BookOpen, ArrowRight, BarChart3 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AgentProfile, PerformanceAnalysis } from '../types/game';
import { soundManager } from '../utils/audio';

interface PerformanceReportProps {
  agent: AgentProfile;
  performance: PerformanceAnalysis;
  onViewCertificate: () => void;
  onRetest: () => void;
}

export const PerformanceReport: React.FC<PerformanceReportProps> = ({
  agent,
  performance,
  onViewCertificate,
  onRetest
}) => {
  useEffect(() => {
    if (performance.totalScore >= 60) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [performance.totalScore]);

  // Radar chart calculation for 4 skill dimensions: Observation, Deduction, Agility, Comprehension
  const radarPoints = [
    { label: 'Ketelitian Bukti', value: performance.metrics.observation, angle: 0 },
    { label: 'Logik Deduktif', value: performance.metrics.deduction, angle: 90 },
    { label: 'Ketangkasan Jari', value: performance.metrics.agility, angle: 180 },
    { label: 'Kefahaman Teks', value: performance.metrics.comprehension, angle: 270 }
  ];

  const centerX = 120;
  const centerY = 120;
  const radius = 80;

  const polygonPoints = radarPoints
    .map(p => {
      const rad = (p.angle * Math.PI) / 180;
      const r = (p.value / 100) * radius;
      const x = centerX + r * Math.sin(rad);
      const y = centerY - r * Math.cos(rad);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-8 overflow-y-auto">
      {/* Background noir glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(217,119,6,0.15),transparent_60%)] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 max-w-5xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase">
              LAPORAN KEPUTUSAN FORENSIK
            </span>
            <h1 className="text-lg md:text-xl font-bold text-slate-100">
              Analisis Prestasi Ejen Detektif
            </h1>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-semibold text-slate-200">{agent.name}</div>
          <div className="text-[11px] text-slate-400 font-mono">
            {agent.classroom} · {agent.school}
          </div>
        </div>
      </header>

      {/* Main Graphics Grid */}
      <main className="relative z-10 max-w-5xl mx-auto w-full my-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Big Score Card & Rank (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Score & Grade Hero Box */}
          <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-md text-center relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MARKAH KESELURUHAN</span>
            </div>

            {/* Circular Gauge Graphic */}
            <div className="relative w-44 h-44 mx-auto flex items-center justify-center my-2">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="88"
                  cy="88"
                  r="72"
                  stroke="#1e293b"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="88"
                  cy="88"
                  r="72"
                  stroke="#f59e0b"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 72}
                  strokeDashoffset={2 * Math.PI * 72 * (1 - performance.percentage / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold font-mono text-slate-100">
                  {performance.totalScore}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  / {performance.maxScore} MATA
                </span>
                <span className="mt-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  GRED {performance.rankGrade}
                </span>
              </div>
            </div>

            {/* Rank Title & Description */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                PANGKAT PENTAULIAHAN:
              </div>
              <h2 className="text-base md:text-lg font-bold text-amber-300 font-serif">
                {performance.rankTitle}
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {performance.rankDescription}
              </p>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-400">KETEPATAN</div>
                <div className="text-base font-bold text-slate-100 font-mono">
                  {performance.correctCount} / {performance.totalQuestions}
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-400">MASA KES</div>
                <div className="text-base font-bold text-slate-100 font-mono">
                  {performance.timeTakenFormatted}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Charts & Difficulty Breakdown (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Radar & Dimension Graph Box */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-amber-400" />
              <span>Grafik Profil Kemahiran Detektif</span>
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* SVG Spider Radar */}
              <div className="relative w-60 h-60 shrink-0">
                <svg viewBox="0 0 240 240" className="w-full h-full">
                  {/* Background grid rings */}
                  {[0.25, 0.5, 0.75, 1.0].map((level, i) => (
                    <polygon
                      key={i}
                      points={`
                        ${centerX},${centerY - radius * level}
                        ${centerX + radius * level},${centerY}
                        ${centerX},${centerY + radius * level}
                        ${centerX - radius * level},${centerY}
                      `}
                      fill="none"
                      stroke="#334155"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />
                  ))}

                  {/* Axis lines */}
                  <line x1={centerX} y1={centerY - radius} x2={centerX} y2={centerY + radius} stroke="#334155" strokeWidth="1" />
                  <line x1={centerX - radius} y1={centerY} x2={centerX + radius} y2={centerY} stroke="#334155" strokeWidth="1" />

                  {/* Filled Performance Polygon */}
                  <polygon
                    points={polygonPoints}
                    fill="rgba(245, 158, 11, 0.35)"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                  />

                  {/* Data Points */}
                  {radarPoints.map((p, idx) => {
                    const rad = (p.angle * Math.PI) / 180;
                    const r = (p.value / 100) * radius;
                    const x = centerX + r * Math.sin(rad);
                    const y = centerY - r * Math.cos(rad);
                    return (
                      <circle
                        key={idx}
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#fbbf24"
                        stroke="#0f172a"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                </svg>

                {/* Labels around the radar */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[9px] font-mono text-amber-300 font-bold">
                  Ketelitian ({performance.metrics.observation}%)
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[9px] font-mono text-cyan-300 font-bold">
                  Logik ({performance.metrics.deduction}%)
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[9px] font-mono text-purple-300 font-bold">
                  Ketangkasan ({performance.metrics.agility}%)
                </div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[9px] font-mono text-emerald-300 font-bold">
                  Kefahaman ({performance.metrics.comprehension}%)
                </div>
              </div>

              {/* Progress Bar Breakdown */}
              <div className="flex-1 w-full space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Ketelitian Bukti Fizikal</span>
                    <span className="text-amber-400 font-mono font-bold">{performance.metrics.observation}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-1000"
                      style={{ width: `${performance.metrics.observation}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Logik Deduktif & Motif</span>
                    <span className="text-cyan-400 font-mono font-bold">{performance.metrics.deduction}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full transition-all duration-1000"
                      style={{ width: `${performance.metrics.deduction}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Ketangkasan Jari / Masa</span>
                    <span className="text-purple-400 font-mono font-bold">{performance.metrics.agility}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full transition-all duration-1000"
                      style={{ width: `${performance.metrics.agility}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Kefahaman Kes Fabel Rimba</span>
                    <span className="text-emerald-400 font-mono font-bold">{performance.metrics.comprehension}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
                      style={{ width: `${performance.metrics.comprehension}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Difficulty Level Breakdown list */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2.5">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2">
              PRESTASI MENGIKUT ARAS KESUKARAN SOALAN
            </h4>

            {performance.answersBreakdown.map((item, idx) => (
              <div
                key={item.questionId}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center font-mono font-bold text-[10px] text-slate-300">
                    #{idx + 1}
                  </span>
                  <div>
                    <span className="text-slate-200 font-medium">{item.clueTitle}</span>
                    <span className="ml-2 text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {item.level}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono font-bold ${
                      item.isCorrect ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {item.points} / {item.maxPoints}m
                  </span>
                  {item.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className="text-rose-400 text-xs font-mono">0m</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Action Footer Navigation */}
      <footer className="relative z-10 max-w-5xl mx-auto w-full pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
        <button
          onClick={onRetest}
          className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium transition"
        >
          Siasat Semula Bilik
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            onViewCertificate();
          }}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 hover:brightness-105 active:scale-95 transition flex items-center justify-center gap-2"
        >
          <Award className="w-4 h-4" />
          <span>LIHAT & JANA SIJIL PENTAULIAHAN EJEN</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};
