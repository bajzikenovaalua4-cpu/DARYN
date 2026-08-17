import type { NovelNpc } from '../lib/visualNovelData';

type NpcPortraitProps = {
  npc: NovelNpc;
};

const availablePortraits = new Set([
  '/assets/characters/artem.webp',
  '/assets/characters/dana.webp',
  '/assets/characters/marat.webp',
  '/assets/characters/aigerim.webp',
  '/assets/characters/serik.webp',
  '/assets/characters/bolat.webp',
  '/assets/characters/madina.webp',
  '/assets/characters/ruslan.webp',
  '/assets/characters/oleg.webp',
]);

export function NpcPortrait({ npc }: NpcPortraitProps) {
  const hasPortrait = availablePortraits.has(npc.portrait);

  return (
    <>
      {hasPortrait && <img src={npc.portrait} alt="" />}
      <span>{npc.name.slice(0, 1)}</span>
    </>
  );
}
