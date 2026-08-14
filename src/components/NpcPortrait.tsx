import type { NovelNpc } from '../lib/visualNovelData';

type NpcPortraitProps = {
  npc: NovelNpc;
};

const availablePortraits = new Set([
  '/assets/characters/artem.png',
  '/assets/characters/dana.webp',
  '/assets/characters/marat.png',
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
