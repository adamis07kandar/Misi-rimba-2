import React, { useState } from 'react';
import { Shield, Sparkles, User, School, GraduationCap, Camera, ArrowRight, BookOpen, Volume2, VolumeX, Eye, Award } from 'lucide-react';
import { AgentProfile } from '../types/game';
import { generateCertificateCode } from '../utils/detectiveRules';
import { soundManager } from '../utils/audio';

interface TitleScreenProps {
  onStartMission: (profile: AgentProfile) => void;
  isCameraActive: boolean;
  onToggleCamera: () => void;
  isCameraLoading: boolean;
  onOpenStoryBriefing: () => void;
  onOpenSavedCertificates: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartMission,
  isCameraActive,
  onToggleCamera,
  isCameraLoading,
  onOpenStoryBriefing,
  onOpenSavedCertificates
}) => {
  const [name, setName] = useState('');
  const [classroom, setClassroom] = useState('');
  const [school, setSchool] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Sila masukkan Nama Penuh Ejen untuk rekod sijil rasmi.');
      return;
    }
    if (!classroom.trim()) {
      setErrorMsg('Sila nyatakan Kelas Ejen.');
      return;
    }
    if (!school.trim()) {
      setErrorMsg('Sila masukkan Nama Sekolah Ejen.');
      return;
    }

    soundManager.playClick();
    const certificateCode = generateCertificateCode(name);
    const agentId = `AGT-${Math.floor(1000 + Math.random() * 9000)}`;

    onStartMission({
      name: name.trim(),
      classroom: classroom.trim(),
      school: school.trim(),
      agentId,
      certificateCode,
      startedAt: Date.now()
    });
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden">
      {/* Background noir atmospheric overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(217,119,6,0.15),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase font-semibold">
              BAHAGIAN SIASATAN KHAS RIMBA
            </span>
            <h2 className="text-sm font-bold tracking-wide text-slate-200">
              KOD KES #2026-KNC-01
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSavedCertificates}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs hover:bg-slate-800 transition"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Sijil Tersimpan</span>
          </button>

          <button
            onClick={onOpenStoryBriefing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-amber-500/30 text-amber-300 text-xs hover:bg-slate-800 transition"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Baca Fail Kes (PDF)</span>
          </button>

          <button
            onClick={handleToggleSound}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition"
            title={isMuted ? 'Bunyikan Audio' : 'Senyapkan Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Content Hero */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-6 py-4 flex flex-col lg:flex-row items-center gap-10">
        {/* Left: Atmospheric Title & Synopsis */}
        <div className="flex-1 space-y-5 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIASATAN BILIK TERTUTUP & KAWALAN JARI KAMERA</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-serif text-amber-50 leading-[1.15]">
            Misteri Bilik Terkurung: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-500">
              Kes Sang Buaya, Kerbau & Sang Kancil
            </span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl">
            Satu pengkhianatan menggemparkan rimba telah berlaku di pinggir sungai! Masuk ke dalam bilik siasatan terkurung, gunakan <strong className="text-amber-300">pergerakan jari melalui kamera</strong> untuk menyiasat bahan bukti forensik, selesaikan 5 aras soalan misteri, dan peroleh <strong className="text-amber-300">Sijil Pentauliahan Ejen Rasmi</strong> dengan kod pengesahan unik anda!
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
              <div className="text-amber-400 font-mono text-xs font-bold">3 SOALAN</div>
              <div className="text-slate-200 text-sm font-semibold">Aras Mudah</div>
              <div className="text-slate-500 text-[11px]">Fakta & Bahan Bukti</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
              <div className="text-amber-400 font-mono text-xs font-bold">1 SOALAN</div>
              <div className="text-slate-200 text-sm font-semibold">Aras Sederhana</div>
              <div className="text-slate-500 text-[11px]">Motif & Psikologi</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
              <div className="text-amber-400 font-mono text-xs font-bold">1 SOALAN</div>
              <div className="text-slate-200 text-sm font-semibold">Aras Susah</div>
              <div className="text-slate-500 text-[11px]">Taktik Genius Kancil</div>
            </div>
          </div>
        </div>

        {/* Right: Registration & Mission Launch Card */}
        <div className="w-full lg:w-[420px] bg-slate-900/80 border border-amber-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-xl relative">
          <div className="absolute -top-3 left-6 px-3 py-0.5 bg-amber-500 text-slate-950 text-[11px] font-bold font-mono uppercase tracking-wider rounded-md shadow">
            DOKUMEN PENDAFTARAN EJEN
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Nama Penuh Ejen</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Danial Harith bin Roslan"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kelas</span>
                </label>
                <input
                  type="text"
                  value={classroom}
                  onChange={(e) => setClassroom(e.target.value)}
                  placeholder="Contoh: 5 Wawasan"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-amber-400" />
                  <span>Nama Sekolah</span>
                </label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="Contoh: SK Seri Bintang"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 text-sm"
                />
              </div>
            </div>

            {/* Camera Setup Selector Banner */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${isCameraActive ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    Kamera Pergerakan Jari
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {isCameraActive ? 'Kamera sedia menjejaki jari anda' : 'Pilihan: Aktifkan kamera web anda'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onToggleCamera}
                disabled={isCameraLoading}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition ${
                  isCameraActive
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {isCameraLoading ? 'Menyambung...' : isCameraActive ? 'Aktif' : 'Aktifkan'}
              </button>
            </div>

            {/* Launch CTA Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:brightness-105 active:scale-[0.99] transition flex items-center justify-center gap-2"
            >
              <span>MASUK BILIK SIASATAN</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      {/* Bottom Hint Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 border-t border-slate-900">
        <div className="flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span>Kawalan: Halakan jari telunjuk atau guna tetikus · Rapatkan ibu jari atau tahan 1s untuk klik</span>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          SUMBER KES: FABEL SANG BUAYA, KANCIL DAN KERBAU
        </div>
      </footer>
    </div>
  );
};
