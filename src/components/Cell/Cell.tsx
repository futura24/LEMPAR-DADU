import { Flag, HelpCircle } from 'lucide-react';

export type CellKind = 'biasa' | 'tangga' | 'rintangan' | 'soal' | 'finish' | 'start';

interface CellProps {
  number: number;
  kind: CellKind;
  isTarget: boolean;
  /** Warna dasar berselang-seling agar baris papan mudah diikuti mata. */
  striped: boolean;
}

const KIND_STYLE: Record<CellKind, string> = {
  biasa: '',
  start: 'bg-rumput-light/90',
  tangga: 'bg-kayu-light/60',
  rintangan: 'bg-stroberi-light/60',
  soal: 'bg-anggur-light/60',
  finish: 'bg-matahari-light',
};

const KIND_LABEL: Record<CellKind, string> = {
  biasa: '',
  start: ' — kotak start',
  tangga: ' — kaki tangga',
  rintangan: ' — rintangan',
  soal: ' — ada pertanyaan',
  finish: ' — garis finish',
};

export function Cell({ number, kind, isTarget, striped }: CellProps) {
  return (
    <div
      className={[
        'relative flex items-start justify-start border border-tinta/10 p-[3px] transition-colors',
        striped ? 'bg-white/70' : 'bg-kertas/80',
        KIND_STYLE[kind],
        isTarget ? 'ring-2 ring-inset ring-matahari-deep motion-safe:animate-denyut' : '',
      ].join(' ')}
      role="gridcell"
      aria-label={`Kotak ${number}${KIND_LABEL[kind]}`}
    >
      <span className="select-none font-body text-[clamp(0.5rem,1.5vw,0.8rem)] font-bold leading-none text-tinta-soft">
        {number}
      </span>

      {kind === 'soal' && (
        <HelpCircle
          aria-hidden="true"
          className="absolute bottom-[6%] right-[6%] h-[34%] w-[34%] text-anggur-deep"
        />
      )}
      {kind === 'finish' && (
        <Flag
          aria-hidden="true"
          className="absolute bottom-[6%] right-[6%] h-[38%] w-[38%] text-matahari-deep"
        />
      )}
    </div>
  );
}
