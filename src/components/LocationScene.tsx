import { NpcPortrait } from './NpcPortrait';
import { SpritePlayer } from './SpritePlayer';
import type { CharacterId } from '../lib/characters';
import { getLocationText, t, type Language } from '../lib/i18n';
import type { NovelLocation, NovelNpc } from '../lib/visualNovelData';

type LocationSceneProps = {
  language: Language;
  location: NovelLocation;
  characterId: CharacterId;
  playerName: string;
  completedNpcIds: string[];
  onNpcClick: (npc: NovelNpc) => void;
  onBack: () => void;
};

export function LocationScene({
  language,
  location,
  characterId,
  playerName,
  completedNpcIds,
  onNpcClick,
  onBack,
}: LocationSceneProps) {
  const completed = location.npcs.filter((npc) => completedNpcIds.includes(npc.id)).length;
  const locationText = getLocationText(language, location);

  return (
    <section className={`vn-scene ${location.backgroundClass}`}>
      <header className="vn-scene-top">
        <button className="vn-secondary" onClick={onBack}>{t(language, 'toLocations')}</button>
        <div>
          <span>{locationText.title}</span>
          <strong>{completed} / {location.npcs.length} NPC</strong>
        </div>
      </header>
      <div className="vn-stage">
        <div className="vn-player-stand">
          <SpritePlayer characterId={characterId} direction="down" action="idle" />
          <span>{playerName}</span>
        </div>
        {location.npcs.map((npc) => {
          const done = completedNpcIds.includes(npc.id);

          return (
            <button
              key={npc.id}
              className={done ? 'vn-npc is-complete' : 'vn-npc'}
              style={{ left: `${npc.position.left}%`, top: `${npc.position.top}%`, borderColor: npc.color }}
              onClick={() => onNpcClick(npc)}
            >
              <span className="vn-npc-avatar" style={{ background: npc.color }}>
                <NpcPortrait npc={npc} />
              </span>
              <b>{npc.name}</b>
              {done && <em>✓</em>}
              <span className="vn-dossier">
                <strong>{t(language, 'npcDossier')}</strong>
                {t(language, 'name')}: {npc.name}<br />
                {t(language, 'age')}: {npc.age}<br />
                {t(language, 'gender')}: {npc.gender}<br />
                {t(language, 'status')}: {npc.role}<br />
                {t(language, 'relationship')}: {npc.relationship}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
