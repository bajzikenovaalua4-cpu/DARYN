import { useState } from 'react';
import { LegalCasePanel } from './LegalCasePanel';
import { NpcPortrait } from './NpcPortrait';
import { SpritePlayer } from './SpritePlayer';
import type { CharacterId } from '../lib/characters';
import { t, type Language } from '../lib/i18n';
import type { NovelChoice, NovelLocation, NovelNpc } from '../lib/visualNovelData';

type DialoguePanelProps = {
  language: Language;
  location: NovelLocation;
  npc: NovelNpc;
  characterId: CharacterId;
  playerName: string;
  hintAvailable?: boolean;
  onUseHint?: () => void;
  onComplete: (choice: NovelChoice) => void;
  onCancel: () => void;
};

export function DialoguePanel({
  language,
  location,
  npc,
  characterId,
  playerName,
  hintAvailable,
  onUseHint,
  onComplete,
  onCancel,
}: DialoguePanelProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [choice, setChoice] = useState<NovelChoice | null>(null);
  const line = npc.dialogue[lineIndex];

  if (choice) {
    return (
      <section className={`vn-dialogue-scene ${location.backgroundClass}`}>
        <CharacterShowcase characterId={characterId} npc={npc} playerName={playerName} />
        <div className="vn-dialogue-box">
          <span className={choice.correct ? 'vn-result good' : 'vn-result bad'}>
            {choice.correct ? t(language, 'goodActions') : t(language, 'riskyActions')}
          </span>
          <h2>+{choice.correct ? choice.points : 0} {t(language, 'legalLiteracy')}</h2>
          <p>{choice.explanation}</p>
          <strong>{t(language, 'lawKz')}</strong>
          <p>{choice.law}</p>
          <button className="vn-primary" onClick={() => onComplete(choice)}>{t(language, 'finishCase')}</button>
        </div>
      </section>
    );
  }

  if (line.choices && npc.legalCase) {
    return (
      <section className={`vn-dialogue-scene ${location.backgroundClass}`}>
        <CharacterShowcase characterId={characterId} npc={npc} playerName={playerName} />
        <div className="vn-dialogue-box">
          <LegalCasePanel
            language={language}
            npc={npc}
            hintAvailable={hintAvailable}
            onUseHint={onUseHint}
            onComplete={onComplete}
          />
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
            <button className="vn-secondary" onClick={onCancel}>{t(language, 'back')}</button>
            <button className="vn-primary" onClick={() => setLineIndex((value) => value + 1)}>{t(language, 'continue')}</button>
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
          <NpcPortrait npc={npc} />
        </span>
        <b>{npc.name}</b>
        <small>{npc.storyTitle}</small>
      </div>
    </div>
  );
}
