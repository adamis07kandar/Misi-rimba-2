import React, { useState } from 'react';
import { DetectiveQuestion, QuestionResult } from '../types/game';
import { soundManager } from '../utils/audio';
import { CheckCircle2, XCircle, AlertCircle, Sparkles, ArrowRight, X } from 'lucide-react';

interface QuestionModalProps {
  question: DetectiveQuestion;
  existingResult?: QuestionResult;
  onAnswer: (result: QuestionResult) => void;
  onClose: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  existingResult,
  onAnswer,
  onClose
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    existingResult ? existingResult.selectedIndex : null
  );
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(!!existingResult);
  const [startTime] = useState<number>(Date.now());

  const handleSelect = (index: number) => {
    if (hasSubmitted) return;
    setSelectedIndex(index);
    soundManager.playOptionSelect();
  };

  const handleSubmit = () => {
    if (selectedIndex === null || hasSubmitted) return;

    const isCorrect = selectedIndex === question.correctAnswerIndex;
    const timeSpentSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    const pointsEarned = isCorrect ? question.points : 0;

    if (isCorrect) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }

    setHasSubmitted(true);
    onAnswer({
      questionId: question.id,
      selectedIndex,
      isCorrect,
      pointsEarned,
      timeSpentSeconds
    });
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'mudah':
        return 'text-emerald-400 bg-emerald-950/80 border-emerald-500/50';
      case 'sederhana':
        return 'text-amber-400 bg-amber-950/80 border-amber-500/50';
      case 'susah':
        return 'text-rose-400 bg-rose-950/80 border-rose-500/50';
      default:
        return 'text-slate-400 bg-slate-900 border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider border ${getDifficultyColor(
                question.level
              )}`}
            >
              ARAS {question.level.toUpperCase()} · {question.points} MATA
            </span>
            <span className="text-xs font-mono text-slate-400">
              {question.clueLocationName}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clue Context Dossier */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KETERANGAN BUKTI SIASATAN</span>
          </div>
          <h3 className="font-bold text-amber-100 text-sm md:text-base">
            {question.clueTitle}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed italic">
            "{question.narrativeContext}"
          </p>
        </div>

        {/* Question Heading */}
        <div className="space-y-2">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            SOALAN SIASATAN DETEKTIF:
          </div>
          <h2 className="text-base md:text-lg font-bold text-slate-100 leading-snug">
            {question.question}
          </h2>
        </div>

        {/* Options list */}
        <div className="space-y-2.5">
          {question.options.map((option, idx) => {
            const isChosen = selectedIndex === idx;
            const isCorrectAnswer = idx === question.correctAnswerIndex;

            let optionStyle =
              'bg-slate-950/60 border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/50 text-slate-200';

            if (hasSubmitted) {
              if (isCorrectAnswer) {
                optionStyle =
                  'bg-emerald-950/70 border-emerald-400 text-emerald-100 shadow-lg shadow-emerald-950/60 ring-1 ring-emerald-400';
              } else if (isChosen && !isCorrectAnswer) {
                optionStyle =
                  'bg-rose-950/70 border-rose-500 text-rose-200 ring-1 ring-rose-500';
              } else {
                optionStyle = 'bg-slate-950/30 border-slate-900 text-slate-500 opacity-60';
              }
            } else if (isChosen) {
              optionStyle =
                'bg-amber-500/20 border-amber-400 text-amber-100 ring-2 ring-amber-400/50';
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(idx)}
                disabled={hasSubmitted}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${optionStyle}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    hasSubmitted && isCorrectAnswer
                      ? 'bg-emerald-500 text-slate-950 font-extrabold'
                      : hasSubmitted && isChosen && !isCorrectAnswer
                      ? 'bg-rose-500 text-white'
                      : isChosen
                      ? 'bg-amber-400 text-slate-950 font-extrabold'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </div>

                <div className="flex-1 text-sm leading-relaxed">{option}</div>

                {hasSubmitted && (
                  <div className="shrink-0 mt-0.5">
                    {isCorrectAnswer ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : isChosen ? (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Answer Explanation Box if submitted */}
        {hasSubmitted && (
          <div
            className={`p-4 rounded-xl border space-y-2 animate-in fade-in duration-300 ${
              selectedIndex === question.correctAnswerIndex
                ? 'bg-emerald-950/50 border-emerald-500/40'
                : 'bg-amber-950/40 border-amber-500/40'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold font-mono">
              {selectedIndex === question.correctAnswerIndex ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 uppercase">
                    DEDUKSI TEPAT! (+{question.points} MATA)
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-300 uppercase">
                    ANALISIS PENJELASAN BUKTI KES
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          {!hasSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedIndex === null}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition ${
                selectedIndex !== null
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/20 hover:brightness-105 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>HANTAR DEDUKSI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center gap-2 transition"
            >
              <span>SIMPAN CATATAN & KEMBALI</span>
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
