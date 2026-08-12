import { useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import type { CharacterAction, CharacterDirection } from '../components/GameCharacter';
import { LawCaseDialog } from '../components/LawCaseDialog';
import { LawGameHud } from '../components/LawGameHud';
import { LawGameMap } from '../components/LawGameMap';
import { SpritePlayer } from '../components/SpritePlayer';
import { characters, defaultCharacterId, type CharacterId } from '../lib/characters';
import { cars, landmarks, legalEvents, type LegalEvent } from '../lib/lawGameData';

type Screen = 'menu' | 'how' | 'about' | 'character' | 'garage' | 'play' | 'pause';
type Point = { x: number; y: number };

const mapSize = { width: 720, height: 660 };

function clamp(value: number, max: number) {
  return Math.max(18, Math.min(max - 38, value));
}

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function GamePage() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [car, setCar] = useState(cars[0]);
  const [player, setPlayer] = useState<Point>({ x: 90, y: 90 });
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [literacy, setLiteracy] = useState(35);
  const [reputation, setReputation] = useState(50);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [activeEvent, setActiveEvent] = useState<LegalEvent | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [direction, setDirection] = useState<CharacterDirection>('down');
  const [action, setAction] = useState<CharacterAction>('idle');
  const [characterId, setCharacterId] = useState<CharacterId>(() => {
    const saved = window.localStorage.getItem('law-game-character');
    return saved === 'character2' ? saved : defaultCharacterId;
  });

  const availableEvents = useMemo(
    () => legalEvents.filter((event) => event.location !== 'Суд' || solvedIds.length >= 7),
    [solvedIds.length],
  );

  const nearbyEvent = availableEvents.find((event) => !solvedIds.includes(event.id) && distance(player, event) < 55);
  const currentPlace = landmarks.reduce((nearest, place) => (
    distance(player, place) < distance(player, nearest) ? place : nearest
  ), landmarks[0]);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setScreen((value) => (value === 'play' ? 'pause' : value === 'pause' ? 'play' : value));
      if (event.key.toLowerCase() === 'e' && nearbyEvent && screen === 'play') {
        setAction('interact');
        setActiveEvent(nearbyEvent);
      }
      setKeys((value) => new Set(value).add(event.key.toLowerCase()));
    };
    const up = (event: KeyboardEvent) => {
      setKeys((value) => {
        const next = new Set(value);
        next.delete(event.key.toLowerCase());
        return next;
      });
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [nearbyEvent, screen]);

  useEffect(() => {
    if (screen !== 'play' || activeEvent) return undefined;
    const timer = window.setInterval(() => {
      setPlayer((position) => {
        const speed = keys.has('shift') ? 8 : 5;
        const dx = (keys.has('d') ? speed : 0) - (keys.has('a') ? speed : 0);
        const dy = (keys.has('s') ? speed : 0) - (keys.has('w') ? speed : 0);
        if (dx > 0) setDirection('right');
        if (dx < 0) setDirection('left');
        if (dy > 0) setDirection('down');
        if (dy < 0) setDirection('up');
        setAction(dx || dy ? 'walk' : 'idle');
        return { x: clamp(position.x + dx, mapSize.width), y: clamp(position.y + dy, mapSize.height) };
      });
    }, 16);
    return () => window.clearInterval(timer);
  }, [activeEvent, keys, screen]);

  const chooseAnswer = (index: number) => {
    if (!activeEvent || selectedChoice !== null) return;
    const choice = activeEvent.choices[index];
    setSelectedChoice(index);
    setLiteracy((value) => clampScore(value + choice.literacy));
    setReputation((value) => clampScore(value + choice.reputation));
    setSolvedIds((value) => (value.includes(activeEvent.id) ? value : [...value, activeEvent.id]));
  };

  const closeDialog = () => {
    setActiveEvent(null);
    setSelectedChoice(null);
    setAction('idle');
  };

  const enterCity = () => {
    setAction('enter-car');
    window.setTimeout(() => {
      setScreen('play');
      setAction('exit-car');
      window.setTimeout(() => setAction('idle'), 520);
    }, 520);
  };

  if (screen !== 'play' && screen !== 'pause') {
    return (
      <main className="game-shell">
        <Link href="/" className="game-back">← LegalAI</Link>
        <section className="game-menu">
          <span>Образовательная 2D-игра</span>
          <h1>ЮРФАК: ЗАКОНЫ РК</h1>
          {screen === 'menu' && (
            <div className="menu-actions">
              <button onClick={() => setScreen('character')}>Начать игру</button>
              <button onClick={() => setScreen('how')}>Как играть</button>
              <button onClick={() => setScreen('about')}>О игре</button>
            </div>
          )}
          {screen === 'how' && <Info text="WASD - ходить по карте. E - говорить с NPC и разбирать ситуацию. ESC - пауза. Суд откроется после 7 решенных кейсов." onBack={() => setScreen('menu')} />}
          {screen === 'about' && <Info text="Ты студент юрфака. Исследуй школу, работу, дорогу, магазин, участок и суд, помогай людям и учись выбирать законное решение." onBack={() => setScreen('menu')} />}
          {screen === 'character' && (
            <CharacterSelect
              selectedId={characterId}
              onSelect={(id) => {
                setCharacterId(id);
                window.localStorage.setItem('law-game-character', id);
                setScreen('garage');
              }}
            />
          )}
          {screen === 'garage' && (
            <div className="garage-grid">
              {cars.map((name) => (
                <button key={name} className={car === name ? 'car-card car-card--active' : 'car-card'} onClick={() => setCar(name)}>
                  <i />
                  <b>{name}</b>
                </button>
              ))}
              <button className="primary-action" onClick={enterCity}>В город</button>
            </div>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="game-shell">
      <LawGameHud literacy={literacy} reputation={reputation} location={currentPlace.name} solved={solvedIds.length} total={legalEvents.length} />
      <LawGameMap
        player={player}
        car={car}
        landmarks={landmarks}
        events={availableEvents}
        solvedIds={solvedIds}
        nearbyId={nearbyEvent?.id ?? null}
        direction={direction}
        action={activeEvent ? 'interact' : action}
        characterId={characterId}
      />
      {nearbyEvent && <div className="interact-tip">E - {nearbyEvent.title}</div>}
      {screen === 'pause' && <PauseMenu onResume={() => setScreen('play')} onMenu={() => setScreen('menu')} />}
      {activeEvent && <LawCaseDialog event={activeEvent} selected={selectedChoice} onChoose={chooseAnswer} onClose={closeDialog} />}
    </main>
  );
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, value));
}

function CharacterSelect({ selectedId, onSelect }: { selectedId: CharacterId; onSelect: (id: CharacterId) => void }) {
  return (
    <section className="character-select">
      <h2>ВЫБЕРИ ПЕРСОНАЖА</h2>
      <div className="character-select__grid">
        {Object.values(characters).map((character) => (
          <article key={character.id} className={selectedId === character.id ? 'character-card character-card--active' : 'character-card'}>
            <span>{character.name}</span>
            <p>{character.title}</p>
            <div className="character-card__preview">
              <SpritePlayer characterId={character.id} direction="down" action="walk" preview />
            </div>
            <small>{character.description}</small>
            <button onClick={() => onSelect(character.id)}>ВЫБРАТЬ</button>
          </article>
        ))}
      </div>
    </section>
  );
}

function Info({ text, onBack }: { text: string; onBack: () => void }) {
  return <div className="info-panel"><p>{text}</p><button onClick={onBack}>Назад</button></div>;
}

function PauseMenu({ onResume, onMenu }: { onResume: () => void; onMenu: () => void }) {
  return (
    <div className="game-modal">
      <div className="pause-panel">
        <h2>Пауза</h2>
        <button onClick={onResume}>Продолжить</button>
        <button onClick={onMenu}>Главное меню</button>
      </div>
    </div>
  );
}
