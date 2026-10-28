import React from 'react';
import { Camera, CameraOff, MousePointer, Hand, Sparkles } from 'lucide-react';
import { HandTrackingState } from '../hooks/useHandTracking';

interface DetectiveCursorProps {
  tracking: HandTrackingState;
}

export const DetectiveCursor: React.FC<DetectiveCursorProps> = ({ tracking }) => {
  const {
    cursorPos,
    isCameraActive,
    isLoading,
    handDetected,
    isPinching,
    dwellProgress,
    videoRef,
    canvasRef,
    toggleCamera,
    useMouseFallback,
    setUseMouseFallback
  } = tracking;

  return (
    <>
      {/* Hidden processing video */}
      <video
        ref={videoRef}
        playsInline
        muted
        className="hidden"
      />

      {/* Detective Crosshair / Magnifying Cursor */}
      <div
        className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`
        }}
      >
        {/* Glow halo */}
        <div
          className={`relative flex items-center justify-center transition-all duration-150 ${
            isPinching ? 'scale-90' : dwellProgress > 0 ? 'scale-110' : 'scale-100'
          }`}
        >
          {/* Radial UV Light beam behind cursor */}
          <div className="absolute w-36 h-36 rounded-full bg-amber-400/10 blur-xl pointer-events-none animate-pulse" />

          {/* Dwell circular SVG progress ring */}
          {dwellProgress > 0 && (
            <svg className="absolute w-16 h-16 -rotate-90 pointer-events-none">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="rgba(245, 158, 11, 0.2)"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#fbbf24"
                strokeWidth="4"
                fill="none"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={2 * Math.PI * 26 * (1 - dwellProgress)}
                strokeLinecap="round"
                className="transition-all duration-75"
              />
            </svg>
          )}

          {/* Detective Magnifier Reticle */}
          <div
            className={`w-11 h-11 rounded-full border-2 flex items-center justify-center shadow-lg transition-colors ${
              isPinching
                ? 'border-emerald-400 bg-emerald-500/30 ring-4 ring-emerald-500/50'
                : dwellProgress > 0.5
                ? 'border-amber-300 bg-amber-500/30'
                : 'border-amber-400/80 bg-slate-900/40 backdrop-blur-xs'
            }`}
          >
            {/* Center target dot */}
            <div
              className={`w-2.5 h-2.5 rounded-full transition-transform ${
                isPinching ? 'bg-emerald-300 scale-125' : 'bg-amber-400'
              }`}
            />

            {/* Crosshair ticks */}
            <div className="absolute w-full h-[1px] bg-amber-400/40" />
            <div className="absolute h-full w-[1px] bg-amber-400/40" />
          </div>

          {/* Label tooltip under cursor */}
          <div className="absolute top-12 whitespace-nowrap px-2 py-0.5 rounded bg-slate-950/80 border border-amber-500/40 text-[10px] font-mono text-amber-300 shadow-md">
            {isCameraActive && handDetected
              ? isPinching
                ? 'KLIK JARI'
                : dwellProgress > 0
                ? 'MEMERIKSA...'
                : 'HUJUNG JARI DETEKTIF'
              : 'PENUNJUK DETEKTIF'}
          </div>
        </div>
      </div>

      {/* Bottom Floating Camera Control HUD */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 pointer-events-auto">
        {/* Camera Preview PIP Card */}
        {isCameraActive && (
          <div className="bg-slate-900/90 border border-amber-500/40 rounded-xl p-2.5 shadow-2xl backdrop-blur-md w-56 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-400 border-b border-slate-800 pb-1.5">
              <span className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    handDetected ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'
                  }`}
                />
                {handDetected ? 'Jari Dikesan' : 'Mencari Tangan...'}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                KAMERA JARI
              </span>
            </div>

            {/* Video Canvas Skeleton */}
            <div className="relative w-full h-32 bg-black rounded-lg overflow-hidden border border-slate-700">
              <canvas
                ref={canvasRef}
                width={200}
                height={150}
                className="w-full h-full object-cover"
              />
              {!handDetected && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center bg-black/60 text-slate-300 text-xs">
                  <Hand className="w-6 h-6 text-amber-400 mb-1 animate-bounce" />
                  <span>Halakan jari telunjuk anda ke hadapan kamera</span>
                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-300 leading-tight bg-slate-950/60 p-1.5 rounded border border-slate-800">
              💡 <b className="text-amber-300">Cara Kawal:</b> Gerakkan jari telunjuk untuk arahkan penunjuk. Rapatkan ibu jari & jari telunjuk ATAU pegang setempat 1 saat untuk klik!
            </div>
          </div>
        )}

        {/* Action Toggle Pills */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 p-1.5 rounded-full shadow-xl backdrop-blur-md">
          <button
            onClick={() => {
              toggleCamera();
            }}
            disabled={isLoading}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isCameraActive
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 font-semibold shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
            title="Aktifkan pergerakan jari kamera"
          >
            {isLoading ? (
              <span className="inline-block w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            ) : isCameraActive ? (
              <Camera className="w-3.5 h-3.5" />
            ) : (
              <CameraOff className="w-3.5 h-3.5" />
            )}
            <span>{isCameraActive ? 'Kamera Jari Aktif' : 'Guna Kamera Jari'}</span>
          </button>

          <button
            onClick={() => setUseMouseFallback(!useMouseFallback)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              useMouseFallback || !isCameraActive
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Tukar mod kawalan ke tetikus"
          >
            <MousePointer className="w-3.5 h-3.5" />
            <span>Mod Tetikus/Sentuh</span>
          </button>
        </div>
      </div>
    </>
  );
};
