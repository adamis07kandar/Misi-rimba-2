import React from 'react';
import { BookOpen, X, FileText, Download, ExternalLink, ShieldAlert } from 'lucide-react';

interface StoryBriefingModalProps {
  onClose: () => void;
}

export const StoryBriefingModal: React.FC<StoryBriefingModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-slate-100 max-h-[88vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase">
                FAIL KES UTAMA (SUMBER PDF)
              </span>
              <h2 className="text-base font-bold text-slate-100">
                Fabel: Sang Buaya, Kancil dan Kerbau
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/assets/aistudio/SANG_BUAYA_KANCIL_DAN_KERBAU_accbab70.pdf"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 border border-slate-700 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Fail PDF Asal</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Story Transcript Content */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-xs md:text-sm leading-relaxed text-slate-300">
          {/* Babak 1 */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="text-amber-400 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>BABAK 1: RINTIHAN DI TEPI SUNGAI & PERTOLONGAN KERBAU</span>
            </div>
            <p>
              <strong>Pencerita:</strong> Pada suatu hari, di sebuah hutan yang indah dan dekat dengan sebatang sungai, hidup seekor kerbau yang baik hati. Tiba-tiba, Sang Kerbau mendengar suara rintihan meminta tolong.
            </p>
            <p>
              <strong>Sang Buaya:</strong> (merayu dalam kesakitan) <em>"Tolong aku, Sang Kerbau! Tolong!"</em>
            </p>
            <p>
              <strong>Sang Kerbau:</strong> (terkejut sambil mencari arah suara) <em>"Di mana engkau? Oh, Sang Buaya! Apa yang telah berlaku kepada engkau?"</em>
            </p>
            <p>
              <strong>Sang Buaya:</strong> <em>"Engkau tidak nampakkah? Aku dihempap oleh batang pokok yang besar ini. Aku tidak dapat bergerak. Tolonglah alihkan batang pokok ini dari badanku!"</em>
            </p>
            <p>
              <strong>Sang Kerbau:</strong> <em>"Kasihan melihat keadaan engkau. Baiklah, aku akan cuba tolong."</em>
            </p>
            <p className="text-slate-400 italic">
              (Sang Kerbau menggunakan tanduknya untuk mengangkat dan mengalihkan batang pokok yang menimpa Sang Buaya).
            </p>
            <p>
              <strong>Sang Buaya:</strong> (setelah bebas, tiba-tiba menerkam dan menggigit kaki Sang Kerbau) <em>"Ha! Terima kasih kerana menolong aku, Sang Kerbau. Sekarang aku sangat lapar, aku mahu makan engkau!"</em>
            </p>
            <p>
              <strong>Sang Kerbau:</strong> (meronta-ronta ketakutan) <em>"Mengapa engkau berbuat begini? Bukankah aku telah menyelamatkan engkau?"</em>
            </p>
            <p>
              <strong>Sang Buaya:</strong> <em>"Peduli apa aku! Aku sudah lama tidak makan!"</em>
            </p>
            <p>
              <strong>Sang Kerbau:</strong> (menjerit kuat) <em>"Tolong! Tolong selamatkan aku!"</em>
            </p>
            <p className="text-amber-300 font-medium">
              (Tiba-tiba, Sang Kancil pun muncul dan melihat keadaan tersebut).
            </p>
          </div>

          {/* Babak 2 */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="text-amber-400 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>BABAK 2: KEDATANGAN SANG KANCIL & LAKONAN SEMULA</span>
            </div>
            <p>
              <strong>Sang Kancil:</strong> <em>"Ada apa ini? Mengapa Sang Buaya menangkap kaki Sang Kerbau?"</em>
            </p>
            <p>
              <strong>Sang Kerbau:</strong> <em>"Wahai Sang Kancil, tolonglah aku! Aku telah menyelamatkan Sang Buaya ini dari dihempap batang kayu, tetapi sekarang dia mahu makan aku pula."</em>
            </p>
            <p>
              <strong>Sang Kancil:</strong> (berlagak bijak dan tidak percaya) <em>"Betulkah begitu? Aku tidak percaya Sang Kerbau yang bongkok ini mampu mengangkat batang kayu yang besar itu. Mana mungkin!"</em>
            </p>
            <p>
              <strong>Sang Buaya:</strong> <em>"Betul, Sang Kancil! Kerbau inilah yang mengangkat batang kayu ini tadi!"</em>
            </p>
            <p>
              <strong>Sang Kancil:</strong> <em>"Aku tetap tidak percaya. Sebelum aku buat keputusan siapa yang betul, mari kita buat semula lakonan itu. Letakkan semula batang kayu itu ke atas badan Sang Buaya, baharu aku percaya."</em>
            </p>
            <p>
              <strong>Sang Buaya:</strong> <em>"Baiklah! Kerbau, cepat letakkan semula kayu ini di atas badanku supaya Sang Kancil nampak."</em>
            </p>
            <p className="text-slate-400 italic">
              (Sang Kerbau dan Sang Buaya akur. Sang Kerbau meletakkan semula batang kayu besar itu ke atas badan Sang Buaya).
            </p>
            <p>
              <strong>Sang Kancil:</strong> <em>"Ha! Sekarang, cuba kamu berdua lepaskan diri atau angkat kayu itu semula!"</em>
            </p>
            <p className="text-slate-400 italic">
              (Sang Buaya bertungkus-lumus meronta untuk mengangkat kayu tersebut, tetapi tidak berjaya kerana kayu itu terlalu berat).
            </p>
            <p>
              <strong>Sang Buaya:</strong> (menjerit cemas) <em>"Tolong! Beratnya! Tolong aku alihkan kayu ini!"</em>
            </p>
          </div>

          {/* Babak 3 */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="text-amber-400 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>BABAK 3: KEPUTUSAN KES & MORAL PENYIASATAN</span>
            </div>
            <p>
              <strong>Sang Kancil:</strong> <em>"Jangan, Sang Kerbau! Jangan percaya kepada buaya yang tidak mengenang budi ini. Jom kita tinggalkan dia!"</em>
            </p>
            <p>
              <strong>Sang Kerbau:</strong> <em>"Terima kasih, Sang Kancil. Kepintaran engkau telah menyelamatkan nyawa aku."</em>
            </p>
          </div>
        </div>

        {/* Modal footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
          >
            Faham & Teruskan Siasatan
          </button>
        </div>
      </div>
    </div>
  );
};
