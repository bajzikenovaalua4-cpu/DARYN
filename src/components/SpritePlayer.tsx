import { useEffect, useMemo, useState } from 'react';
import type { CharacterAction, CharacterDirection } from './GameCharacter';
import { characters, type CharacterId, type SpriteState } from '../lib/characters';

type SpritePlayerProps = {
  characterId: CharacterId;
  direction: CharacterDirection;
  action: CharacterAction;
  label?: string;
  preview?: boolean;
};

export function SpritePlayer({ characterId, direction, action, label, preview = false }: SpritePlayerProps) {
  const [frame, setFrame] = useState(0);
  const character = characters[characterId];
  const state: SpriteState = action === 'walk' ? 'walk' : 'idle';
  const sheet = character.sheets[`${state}_${direction}`];
  const scale = preview ? character.scale * 1.45 : character.scale;

  useEffect(() => {
    setFrame(0);
  }, [sheet.src]);

  useEffect(() => {
    const delay = Math.max(80, 1000 / sheet.fps);
    const timer = window.setInterval(() => {
      setFrame((value) => (value + 1) % sheet.frames);
    }, delay);
    return () => window.clearInterval(timer);
  }, [sheet.fps, sheet.frames, sheet.src]);

  const style = useMemo(() => ({
    width: sheet.frameWidth,
    height: sheet.frameHeight,
    transform: `scale(${scale})`,
  }), [scale, sheet.frameHeight, sheet.frameWidth]);

  const frameStyle = {
    width: sheet.frameWidth,
    height: sheet.frameHeight,
    backgroundImage: `url(${sheet.src})`,
    backgroundSize: `${sheet.frameWidth * sheet.frames}px ${sheet.frameHeight}px`,
    backgroundPosition: `-${frame * sheet.frameWidth}px 0`,
  };

  const className = [
    'sprite-player',
    `sprite-player--${action}`,
    preview ? 'sprite-player--preview' : '',
  ].join(' ');

  return (
    <div className={className} style={style}>
      <span className="sprite-player__shadow" />
      <span className="sprite-player__frame" style={frameStyle} />
      {label && <small>{label}</small>}
    </div>
  );
}
