import type { SpecialEvent } from '@/types/game';
import { Modal } from '@/components/ui/Modal';
import { SCORE_RULES } from '@/game/boardData';

/** Modal singkat saat bidak menemukan tangga atau rintangan. Menutup sendiri. */
export function EventModal({ event }: { event: SpecialEvent | null }) {
  if (!event) return null;

  const isLadder = event.type === 'ladder';

  return (
    <Modal
      open
      hideClose
      tone={isLadder ? 'gembira' : 'hati-hati'}
      title={isLadder ? 'Hebat! Kamu menemukan tangga! 🎉' : 'Ups! Kamu terkena rintangan! 😅'}
    >
      <div className="flex items-center gap-4">
        <span aria-hidden="true" className="text-5xl motion-safe:animate-goyang">
          {isLadder ? '🪜' : '🐛'}
        </span>
        <p className="font-body text-lg text-tinta">
          Bidak berpindah dari kotak <strong>{event.from}</strong> ke kotak <strong>{event.to}</strong>.{' '}
          {isLadder
            ? `Kamu mendapat ${SCORE_RULES.ladder} poin tambahan.`
            : `Skormu berkurang ${Math.abs(SCORE_RULES.snake)} poin.`}
        </p>
      </div>
    </Modal>
  );
}
