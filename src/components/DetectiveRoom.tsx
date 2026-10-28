import React, { useState, useEffect } from 'react';
import {
  Shield,
  Radio,
  Trees,
  ShieldAlert,
  Brain,
  Lock,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  Volume2,
  VolumeX,
  FileSearch,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { AgentProfile, DetectiveQuestion, QuestionResult } from '../types/game';
import { DETECTIVE_QUESTIONS } from '../utils/detectiveRules';
import { soundManager } from '../utils/audio';

interface DetectiveRoomProps {
  agent: AgentProfile;
  answers: Record<string, QuestionResult>;
  onSelectClue: (question: DetectiveQuestion) => void;
  onFinishCase: () => void;
  onOpenStoryBriefing: () => void;
}

export const DetectiveRoom: React.FC<DetectiveRoomProps> = ({
  agent,
  answers,
  onSelectClue,
  onFinishCase,
  onOpenStoryBriefing
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);

  useEffect(() => {
    // Start procedural mystery forest ambiance on room entry
    soundManager.startForestAmbient();

    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const totalAnswered = Object.keys(answers).length;
  const allCompleted = totalAnswered === DETECTIVE_QUESTIONS.length;
  const currentPoints = Object.values(answers).reduce((acc, r) => acc + r.pointsEarned, 0);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getDifficultyBadge = (level: string) => {
    switch (level) {
      case 'mudah':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-500/40">
            🟢 MUDAH (15M)
          </span>
        );
      case 'sederhana':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-950 text-amber-400 border border-amber-500/40">
            🟡 SEDERHANA (25M)
          </span>
        );
      case 'susah':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-950 text-rose-400 border border-rose-500/40 animate-pulse">
            🔴 SUSAH (30M)
          </span>
        );
      default:
        return null;
    }
  };

  const getClueIcon = (iconName: string) => {
    switch (iconName) {
      case 'Radio':
        return <Radio className="w-6 h-6 text-amber-400" />;
      case 'Trees':
        return <Trees className="w-6 h-6 text-emerald-400" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-6 h-6 text-cyan-400" />;
      case 'Brain':
        return <Brain className="w-6 h-6 text-purple-400" />;
      case 'Lock':
        return <Lock className="w-6 h-6 text-rose-400" />;
      default:
        return <FileSearch className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden select-none">
      {/* Visual background layers simulating enclosed noir room with wood, brick & crime lamps */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(180,83,9,0.2),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.85),rgba(2,6,23,0.98))] pointer-events-none" />

      {/* Top Detective HUD */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md">
        {/* Agent Badge Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-100">{agent.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {agent.agentId}
              </span>
            </div>
            <div className="text-xs text-slate-400">
              {agent.classroom} · {agent.school}
            </div>
          </div>
        </div>

        {/* Status Metrics */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-slate-300">{formatTime(secondsElapsed)}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Markah:</span>
            <span className="font-bold text-amber-400 font-mono">{currentPoints} / 100</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Kemajuan:</span>
            <span className="font-bold text-emerald-400 font-mono">
              {totalAnswered} / {DETECTIVE_QUESTIONS.length}
            </span>
          </div>

          <button
            onClick={onOpenStoryBriefing}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs hover:bg-amber-500/20 transition"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fail Cerita (PDF)</span>
          </button>

          <button
            onClick={() => {
              const m = soundManager.toggleMute();
              setIsMuted(m);
            }}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-amber-400"
            title="Audio"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* Main Enclosed Room Layout */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 flex flex-col justify-between">
        {/* Room Atmosphere Title & Instructions Banner */}
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/40 border border-amber-500/20 rounded-xl p-3 backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs uppercase tracking-wider font-mono font-bold text-amber-400">
              BILIK SIASATAN TERKURUNG · KES SANG BUAYA, KERBAU & KANCIL
            </span>
          </div>
          <p className="text-xs text-slate-300 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              Halakan jari telunjuk atau tetikus ke atas <strong>5 Stesen Bukti</strong> di bawah dan klik untuk merungkai soalan siasatan!
            </span>
          </p>
        </div>

        {/* Clue Stations Grid (Visual representations of room fixtures) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
          {DETECTIVE_QUESTIONS.map((question, index) => {
            const result = answers[question.id];
            const isSolved = !!result;
            const isHovered = activeHoverId === question.id;

            return (
              <div
                key={question.id}
                onMouseEnter={() => {
                  setActiveHoverId(question.id);
                  soundManager.playHover();
                }}
                onMouseLeave={() => setActiveHoverId(null)}
                className={`group relative rounded-2xl p-5 border transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-md flex flex-col justify-between ${
                  isSolved
                    ? result.isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-950/50'
                      : 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-950/50'
                    : isHovered
                    ? 'bg-slate-900/90 border-amber-400 shadow-xl shadow-amber-500/10 -translate-y-1'
                    : 'bg-slate-900/60 border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/80'
                }`}
                onClick={() => {
                  soundManager.playClueClick();
                  onSelectClue(question);
                }}
              >
                {/* Station Card Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner ${
                        isSolved
                          ? result.isCorrect
                            ? 'bg-emerald-500/20 border-emerald-400/50'
                            : 'bg-rose-500/20 border-rose-400/50'
                          : 'bg-slate-950 border-amber-500/30'
                      }`}
                    >
                      {getClueIcon(question.clueIcon)}
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        STESEN BUKTI #{index + 1}
                      </div>
                      <h3 className="font-bold text-sm md:text-base text-slate-100 group-hover:text-amber-300 transition-colors">
                        {question.clueLocationName}
                      </h3>
                    </div>
                  </div>

                  {/* Difficulty Tag */}
                  {getDifficultyBadge(question.level)}
                </div>

                {/* Evidence Title & Narrative Teaser */}
                <div className="space-y-2 mb-4">
                  <h4 className="text-xs font-semibold text-amber-200">
                    {question.clueTitle}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {question.narrativeContext}
                  </p>
                </div>

                {/* Card Footer Status */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  {isSolved ? (
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      {result.isCorrect ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Telah Diselesaikan (+{result.pointsEarned}m)</span>
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Percubaan Gagal (0m)</span>
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-amber-400/80 flex items-center gap-1 font-mono">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Klik untuk Mula Siasat &rarr;</span>
                    </span>
                  )}

                  <span className="text-[11px] font-mono text-slate-400">
                    {question.points} Mata
                  </span>
                </div>
              </div>
            );
          })}

          {/* Enclosed Room Mission Lock & Finalization Box */}
          <div
            className={`rounded-2xl p-5 border flex flex-col justify-between transition-all backdrop-blur-md ${
              allCompleted
                ? 'bg-amber-500/10 border-amber-400 shadow-2xl shadow-amber-500/20'
                : 'bg-slate-900/40 border-slate-800/60 opacity-80'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                  <Award className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  DOKUMEN SIJIL RASMI
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-100 mb-1">
                Pentauliahan & Pengesahan Sijil
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {allCompleted
                  ? 'Semua 5 bukti misteri telah diselesaikan! Tekan butang di bawah untuk melihat analisis prestasi grafik dan menjana Sijil Ejen anda.'
                  : `Sila lengkapkan baki ${
                      DETECTIVE_QUESTIONS.length - totalAnswered
                    } soalan untuk membuka pintu bilik siasatan dan menjana Sijil Ejen Detektif.`}
              </p>
            </div>

            <button
              onClick={() => {
                if (allCompleted) {
                  soundManager.playVictory();
                  onFinishCase();
                }
              }}
              disabled={!allCompleted}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
                allCompleted
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/20 hover:brightness-105 active:scale-95 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>{allCompleted ? 'SELESAIKAN KES & JANA SIJIL' : 'TERKUNCI (SELESAIKAN SEMUA SOALAN)'}</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Status Ticker */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-900 bg-slate-950/70">
        <div>
          Kod Sijil Ditugaskan: <span className="font-mono text-amber-400">{agent.certificateCode}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono">
          <span>KERAJAAN RIMBA · JABATAN DETEKTIF FORENSIK</span>
        </div>
      </footer>
    </div>
  );
};
