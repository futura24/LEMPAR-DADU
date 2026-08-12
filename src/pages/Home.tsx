import { useState } from 'react';
import { BookOpen, Info, Play, Settings, Wrench } from 'lucide-react';
import type { HighScoreEntry, Settings as GameSettings } from '@/types/game';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SCORE_RULES } from '@/game/boardData';

interface HomeProps {
  settings: GameSettings;
  onChangeSettings: (next: GameSettings) => void;
  highScores: HighScoreEntry[];
  onStart: () => void;
  onOpenEditor: () => void;
}

type Sheet = 'cara' | 'pengaturan' | 'tentang' | null;

/** Ilustrasi pembuka: bukit, matahari, dan tangga menuju bintang. */
function Panorama() {
  return (
    <svg
      viewBox="0 0 320 220"
      className="w-full max-w-sm drop-shadow-[0_10px_0_rgba(47,42,37,0.12)]"
      role="img"
      aria-label="Ilustrasi seorang anak menaiki tangga menuju bintang di atas bukit"
    >
      <circle cx="52" cy="46" r="26" fill="#FBBF24" />
      <g stroke="#FBBF24" strokeWidth="5" strokeLinecap="round">
        <path d="M52 6v-6M52 92v6M6 46H0M104 46h6M20 14l-4-4M84 78l4 4M84 14l4-4M20 78l-4 4" />
      </g>

      <g fill="#FFFFFF" opacity="0.95">
        <ellipse cx="240" cy="44" rx="34" ry="18" />
        <ellipse cx="264" cy="38" rx="22" ry="15" />
        <ellipse cx="216" cy="38" rx="20" ry="13" />
      </g>

      <path d="M0 168c48-34 92-18 136 4 44 22 100 26 184-14v62H0z" fill="#4ADE80" />
      <path d="M0 190c60-24 118-10 172 8 40 13 88 12 148-8v30H0z" fill="#16A34A" opacity="0.55" />

      <g stroke="#8A4B14" strokeWidth="7" strokeLinecap="round">
        <path d="M138 190 L172 66" />
        <path d="M166 196 L200 72" />
      </g>
      <g stroke="#E7B77A" strokeWidth="6" strokeLinecap="round">
        <path d="M146 162 L174 168" />
        <path d="M154 130 L182 136" />
        <path d="M162 98 L190 104" />
      </g>

      <g>
        <circle cx="188" cy="60" r="13" fill="#FDE68A" stroke="#2F2A25" strokeWidth="3" />
        <circle cx="184" cy="58" r="1.8" fill="#2F2A25" />
        <circle cx="192" cy="58" r="1.8" fill="#2F2A25" />
        <path d="M184 65q4 4 8 0" stroke="#2F2A25" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <rect x="180" y="74" width="17" height="22" rx="8" fill="#38BDF8" stroke="#2F2A25" strokeWidth="3" />
      </g>

      <g fill="#FBBF24" stroke="#D97706" strokeWidth="2.5">
        <path d="M226 96l5 11 12 2-9 8 2 12-10-6-10 6 2-12-9-8 12-2z" />
        <path d="M282 132l3.5 7.5 8 1.4-6 5.4 1.4 8-6.9-4-6.9 4 1.4-8-6-5.4 8-1.4z" />
      </g>

      <g transform="translate(56 158)">
        <rect x="0" y="10" width="34" height="26" rx="5" fill="#FB7185" stroke="#BE123C" strokeWidth="3" />
        <rect x="0" y="10" width="34" height="9" rx="4" fill="#A78BFA" stroke="#6D28D9" strokeWidth="3" />
        <path d="M17 10V4M17 4q-8-8-11 0 5 4 11 0zM17 4q8-8 11 0-5 4-11 0z" fill="#A78BFA" stroke="#6D28D9" strokeWidth="2.5" />
      </g>
    </svg>
  );
}

const MENU_ITEM =
  'flex w-full items-center gap-3 rounded-2xl border-2 border-tinta/20 bg-white px-5 py-4 text-left font-display text-lg font-semibold text-tinta shadow-pop transition motion-safe:hover:-translate-y-0.5 hover:bg-kertas focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-anggur/60';

export function Home({ settings, onChangeSettings, highScores, onStart, onOpenEditor }: HomeProps) {
  const [sheet, setSheet] = useState<Sheet>(null);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-4 py-8 lg:flex-row lg:items-center lg:justify-between lg:py-16">
      <div className="order-2 w-full max-w-md lg:order-1">
        <p className="font-body text-sm font-bold uppercase tracking-[0.28em] text-langit-deep">
          Permainan papan edukatif
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold leading-[1.05] text-tinta sm:text-5xl">
          PETUALANGAN
          <br />
          ANAK TANGGA
        </h1>
        <p className="mt-3 font-display text-xl text-kayu-deep sm:text-2xl">Naik Tangga, Raih Bintang!</p>

        <nav aria-label="Menu utama" className="mt-7 space-y-3">
          <Button size="lg" block onClick={onStart} icon={<Play aria-hidden="true" className="h-6 w-6" />}>
            Mulai bermain
          </Button>

          <button type="button" className={MENU_ITEM} onClick={() => setSheet('cara')}>
            <BookOpen aria-hidden="true" className="h-5 w-5 text-langit-deep" />
            Cara bermain
          </button>
          <button type="button" className={MENU_ITEM} onClick={() => setSheet('pengaturan')}>
            <Settings aria-hidden="true" className="h-5 w-5 text-anggur-deep" />
            Pengaturan
          </button>
          <button type="button" className={MENU_ITEM} onClick={() => setSheet('tentang')}>
            <Info aria-hidden="true" className="h-5 w-5 text-rumput-deep" />
            Tentang game
          </button>
          <button type="button" className={MENU_ITEM} onClick={onOpenEditor}>
            <Wrench aria-hidden="true" className="h-5 w-5 text-kayu-deep" />
            Editor papan &amp; soal
          </button>
        </nav>

        {highScores.length > 0 && (
          <div className="mt-6 rounded-2xl border-2 border-tinta/15 bg-white/70 p-4">
            <h2 className="font-display text-base font-bold text-tinta">Skor tertinggi</h2>
            <ol className="mt-1 font-body text-sm text-tinta-soft">
              {highScores.slice(0, 3).map((entry, index) => (
                <li key={`${entry.name}-${entry.date}`}>
                  {index + 1}. {entry.name} — {entry.score} poin
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <div className="order-1 flex w-full justify-center lg:order-2 lg:w-1/2">
        <div className="motion-safe:animate-mengambang">
          <Panorama />
        </div>
      </div>

      <Modal open={sheet === 'cara'} title="Cara bermain" onClose={() => setSheet(null)}>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Semua bidak mulai dari kotak 1.</li>
          <li>Setiap pemain bergiliran menekan tombol <strong>Lempar dadu</strong>.</li>
          <li>Bidak berjalan satu kotak demi satu kotak sesuai mata dadu.</li>
          <li>Berhenti di kaki tangga 🪜 berarti naik ke kotak yang lebih tinggi.</li>
          <li>Berhenti di kepala cacing 🐛 berarti turun ke kotak yang lebih rendah.</li>
          <li>Beberapa kotak berisi pertanyaan. Jawaban benar menambah poin.</li>
          <li>
            Langkah yang melewati kotak terakhir dibatalkan. Contoh: di kotak 97 dan mendapat 4, bidak tetap
            di 97. Pemain pertama yang tepat mencapai kotak terakhir menjadi juara.
          </li>
        </ol>

        <h3 className="mt-5 font-display text-lg font-bold">Perolehan poin</h3>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li>Menginjak kotak baru: +{SCORE_RULES.newCell}</li>
          <li>Naik tangga: +{SCORE_RULES.ladder}</li>
          <li>Terkena rintangan: {SCORE_RULES.snake}</li>
          <li>Menjawab benar: +{SCORE_RULES.correctAnswer}</li>
          <li>Memenangkan permainan: +{SCORE_RULES.win}</li>
        </ul>
      </Modal>

      <Modal open={sheet === 'pengaturan'} title="Pengaturan" onClose={() => setSheet(null)}>
        <div className="space-y-3">
          <label className="flex items-center justify-between gap-4 rounded-2xl border-2 border-tinta/20 bg-white px-4 py-3">
            <span>
              <span className="block font-display font-semibold">Efek suara</span>
              <span className="block font-body text-sm text-tinta-soft">
                Suara hanya berbunyi setelah kamu menekan tombol.
              </span>
            </span>
            <input
              type="checkbox"
              className="h-6 w-6 accent-rumput-deep"
              checked={settings.soundEnabled}
              onChange={(event) => onChangeSettings({ ...settings, soundEnabled: event.target.checked })}
            />
          </label>

          <label className="flex items-center justify-between gap-4 rounded-2xl border-2 border-tinta/20 bg-white px-4 py-3">
            <span>
              <span className="block font-display font-semibold">Mode edukatif</span>
              <span className="block font-body text-sm text-tinta-soft">
                Menampilkan pertanyaan pada kotak tertentu.
              </span>
            </span>
            <input
              type="checkbox"
              className="h-6 w-6 accent-rumput-deep"
              checked={settings.questionsEnabled}
              onChange={(event) => onChangeSettings({ ...settings, questionsEnabled: event.target.checked })}
            />
          </label>
        </div>
      </Modal>

      <Modal open={sheet === 'tentang'} title="Tentang game" onClose={() => setSheet(null)}>
        <p>
          Petualangan Anak Tangga adalah permainan papan digital bertema ular tangga yang dirancang sebagai
          media pembelajaran. Bank soal, posisi tangga, dan posisi rintangan dapat diganti lewat halaman
          Editor, sehingga guru dapat menyesuaikan permainan dengan materi yang sedang diajarkan.
        </p>
        <p className="mt-3">
          Dibangun dengan React, TypeScript, Vite, dan Tailwind CSS. Seluruh data permainan tersimpan di
          perangkat pemain melalui LocalStorage; tidak ada data pribadi yang dikirim ke mana pun.
        </p>
      </Modal>
    </div>
  );
}
