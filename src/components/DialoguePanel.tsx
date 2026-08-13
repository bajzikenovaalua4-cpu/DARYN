import { useState } from 'react';
import { SpritePlayer } from './SpritePlayer';
import type { CharacterId } from '../lib/characters';
import type { NovelChoice, NovelLocation, NovelNpc } from '../lib/visualNovelData';

type DialoguePanelProps = {
  location: NovelLocation;
  npc: NovelNpc;
  characterId: CharacterId;
  playerName: string;
  onComplete: (choice: NovelChoice) => void;
  onCancel: () => void;
};

export function DialoguePanel({ location, npc, characterId, playerName, onComplete, onCancel }: DialoguePanelProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [choice, setChoice] = useState<NovelChoice | null>(null);
  const line = npc.dialogue[lineIndex];

  if (choice) {
    return (
      <section className={`vn-dialogue-scene ${location.backgroundClass}`}>
        <CharacterShowcase characterId={characterId} npc={npc} playerName={playerName} />
        <div className="vn-dialogue-box">
          <span className={choice.correct ? 'vn-result good' : 'vn-result bad'}>
            {choice.correct ? '✓ Правильный ответ' : 'Ответ требует доработки'}
          </span>
          <h2>{choice.correct ? `+${choice.points} юридической грамотности` : '+0 юридической грамотности'}</h2>
          <p>{choice.explanation}</p>
          <strong>Законодательство РК</strong>
          <p>{choice.law}</p>
          <button className="vn-primary" onClick={() => onComplete(choice)}>Завершить дело</button>
        </div>
      </section>
    );
  }

  return (
    <section className={`vn-dialogue-scene ${location.backgroundClass}`}>
      <CharacterShowcase characterId={characterId} npc={npc} playerName={playerName} />
      <div className="vn-dialogue-box">
        <span className="vn-speaker">{line.speaker}</span>
        <p>{line.text}</p>
        {line.choices ? (
          <div className="vn-choice-list">
            {line.choices.map((item) => (
              <button key={item.id} onClick={() => setChoice(item)}>{item.text}</button>
            ))}
          </div>
        ) : (
          <div className="vn-actions">
            <button className="vn-secondary" onClick={onCancel}>Назад</button>
            <button className="vn-primary" onClick={() => setLineIndex((value) => value + 1)}>Продолжить</button>
          </div>
        )}
      </div>
    </section>
  );
}

function CharacterShowcase({ characterId, npc, playerName }: { characterId: CharacterId; npc: NovelNpc; playerName: string }) {
  return (
    <div className="vn-showcase">
      <div className="vn-dialogue-player">
        <SpritePlayer characterId={characterId} direction="right" action="idle" preview />
        <span>{playerName}</span>
      </div>
      <div className="vn-dialogue-npc" style={{ borderColor: npc.color }}>
        <span style={{ background: npc.color }}>
          <img src={npc.portrait} alt="" onError={(event) => { event.currentTarget.hidden = true; }} />
          <span>{npc.name.slice(0, 1)}</span>
        </span>
        <b>{npc.name}</b>
        <small>{npc.storyTitle}</small>
      </div>
    </div>
  );
}
