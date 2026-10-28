import React, { useState, useEffect } from 'react';
import { Award, X, Trash2, Calendar, School, User, Download, ExternalLink, BookmarkCheck } from 'lucide-react';
import { AgentProfile } from '../types/game';
import { soundManager } from '../utils/audio';

interface SavedCertItem {
  agent: AgentProfile;
  score: number;
  maxScore: number;
  grade: string;
  rankTitle: string;
  savedAt: string;
}

interface SavedCertificatesModalProps {
  onClose: () => void;
  onSelectCertificate?: (item: SavedCertItem) => void;
}

export const SavedCertificatesModal: React.FC<SavedCertificatesModalProps> = ({
  onClose,
  onSelectCertificate
}) => {
  const [savedList, setSavedList] = useState<SavedCertItem[]>([]);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('saved_agent_certificates') || '[]');
      setSavedList(data);
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const handleClear = () => {
    if (window.confirm('Adakah anda pasti mahu memadamkan semua rekod sijil tersimpan?')) {
      localStorage.removeItem('saved_agent_certificates');
      setSavedList([]);
      soundManager.playClick();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-slate-100 max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">
                REKOD SIJIL DETEKTIF TERSIMPAN
              </span>
              <h2 className="text-base font-bold text-slate-100">
                Koleksi Sijil Ejen Rimba
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {savedList.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Award className="w-12 h-12 text-slate-600 mx-auto opacity-50" />
              <p className="text-sm font-medium">Belum ada rekod sijil yang tersimpan.</p>
              <p className="text-xs text-slate-400">
                Selesaikan siasatan bilik terkurung untuk menjana dan menyimpan sijil rasmi anda.
              </p>
            </div>
          ) : (
            savedList.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-amber-500/40 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm">{item.agent.name}</span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Gred {item.grade} ({item.score}/{item.maxScore}m)
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>{item.agent.classroom}</span>
                    <span>•</span>
                    <span>{item.agent.school}</span>
                    <span>•</span>
                    <span className="font-mono text-amber-400/90">{item.agent.certificateCode}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-serif">
                    {item.rankTitle}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(item.savedAt).toLocaleDateString('ms-MY')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          {savedList.length > 0 && (
            <button
              onClick={handleClear}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Padam Semua Rekod</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="ml-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
