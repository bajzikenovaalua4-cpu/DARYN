import { SpritePlayer } from './SpritePlayer';
import type { CharacterId } from '../lib/characters';
import type { NovelLocation, NovelNpc } from '../lib/visualNovelData';

type LocationSceneProps = {
  location: NovelLocation;
  characterId: CharacterId;
  playerName: string;
  completedNpcIds: string[];
  onNpcClick: (npc: NovelNpc) => void;
  onBack: () => void;
};

export function LocationScene({ location, characterId, playerName, completedNpcIds, onNpcClick, onBack }: LocationSceneProps) {
  const completed = location.npcs.filter((npc) => completedNpcIds.includes(npc.id)).length;

  return (
    <section className={`vn-scene ${location.backgroundClass}`}>
      <header className="vn-scene-top">
        <button className="vn-secondary" onClick={onBack}>К локациям</button>
        <div>
          <span>{location.title}</span>
          <strong>{completed} / 3 NPC</strong>
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
              <span className="vn-npc-avatar" style={{ background: npc.color }}>{npc.name.slice(0, 1)}</span>
              <b>{npc.name}</b>
              {done && <em>✓</em>}
              <span className="vn-dossier">
                <strong>Досье персонажа</strong>
                Имя: {npc.name}<br />
                Возраст: {npc.age}<br />
                Пол: {npc.gender}<br />
                Статус: {npc.role}<br />
                Связь с героем: {npc.relationship}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
