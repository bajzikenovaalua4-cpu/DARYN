import type { Landmark, LegalEvent } from '../lib/lawGameData';
import { GameCharacter, type CharacterAction, type CharacterDirection, type CharacterVariant } from './GameCharacter';
import { SpritePlayer } from './SpritePlayer';
import type { CharacterId } from '../lib/characters';

type Point = { x: number; y: number };

type LawGameMapProps = {
  player: Point;
  car: string;
  landmarks: Landmark[];
  events: LegalEvent[];
  solvedIds: string[];
  nearbyId: string | null;
  direction: CharacterDirection;
  action: CharacterAction;
  characterId: CharacterId;
};

const icons: Record<Landmark['kind'], string> = {
  school: 'ШК',
  faculty: 'ЮФ',
  work: 'РБ',
  home: 'ДМ',
  road: 'ПДД',
  parking: 'P',
  shop: 'МГ',
  police: '102',
  court: 'СУД',
};

const npcVariants: CharacterVariant[] = ['seller', 'boss', 'student', 'student', 'police', 'driver', 'driver', 'seller', 'police', 'teacher'];

export function LawGameMap({ player, car, landmarks, events, solvedIds, nearbyId, direction, action, characterId }: LawGameMapProps) {
  return (
    <div className="game-map" aria-label="Карта города">
      <div className="road road--horizontal" />
      <div className="road road--vertical" />
      {landmarks.map((place) => (
        <div key={place.id} className={`landmark landmark--${place.kind}`} style={{ left: place.x, top: place.y }}>
          <b>{icons[place.kind]}</b>
          <span>{place.name}</span>
        </div>
      ))}
      {events.map((event, index) => (
        <div
          key={event.id}
          className={[
            'npc',
            solvedIds.includes(event.id) ? 'npc--solved' : '',
            nearbyId === event.id ? 'npc--nearby' : '',
          ].join(' ')}
          style={{ left: event.x, top: event.y }}
          title={event.title}
        >
          <GameCharacter variant={npcVariants[index] ?? 'citizen'} compact action={nearbyId === event.id ? 'interact' : 'idle'} />
          <span className="npc__mark">!</span>
        </div>
      ))}
      <div className="player" style={{ transform: `translate(${player.x}px, ${player.y}px)` }}>
        <SpritePlayer characterId={characterId} direction={direction} action={action} label={car} />
      </div>
    </div>
  );
}
