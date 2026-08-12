import type { CharacterDirection } from '../components/GameCharacter';

export type CharacterId = 'character1' | 'character2';
export type SpriteState = 'idle' | 'walk';
export type SpriteKey = `${SpriteState}_${CharacterDirection}`;

export type SpriteSheet = {
  src: string;
  frameWidth: number;
  frameHeight: number;
  frames: number;
  fps: number;
};

export type CharacterConfig = {
  id: CharacterId;
  name: string;
  title: string;
  description: string;
  preview: string;
  scale: number;
  sheets: Record<SpriteKey, SpriteSheet>;
};

export const PLAYER_SCALE = 1.35;

const makeSheets = (basePath: string): Record<SpriteKey, SpriteSheet> => ({
  idle_down: sheet(`${basePath}/idle_down.svg`, 2, 3),
  idle_up: sheet(`${basePath}/idle_up.svg`, 2, 3),
  idle_left: sheet(`${basePath}/idle_left.svg`, 2, 3),
  idle_right: sheet(`${basePath}/idle_right.svg`, 2, 3),
  walk_down: sheet(`${basePath}/walk_down.svg`, 4, 9),
  walk_up: sheet(`${basePath}/walk_up.svg`, 4, 9),
  walk_left: sheet(`${basePath}/walk_left.svg`, 4, 9),
  walk_right: sheet(`${basePath}/walk_right.svg`, 4, 9),
});

function sheet(src: string, frames: number, fps: number): SpriteSheet {
  return { src, frameWidth: 96, frameHeight: 128, frames, fps };
}

export const characters: Record<CharacterId, CharacterConfig> = {
  character1: {
    id: 'character1',
    name: 'УЧЕНИК',
    title: 'Школьник-юрист',
    description: 'Герой-ученик с рюкзаком, который изучает законы и помогает людям разбирать ситуации.',
    preview: '/assets/characters/character1/source.png',
    scale: PLAYER_SCALE,
    sheets: makeSheets('/assets/characters/character1'),
  },
  character2: {
    id: 'character2',
    name: 'УЧЕНИЦА',
    title: 'Школьница-юрист',
    description: 'Героиня-ученица с ярким стилем, которая исследует город и учится защищать права.',
    preview: '/assets/characters/character2/source.png',
    scale: PLAYER_SCALE,
    sheets: makeSheets('/assets/characters/character2'),
  },
};

export const defaultCharacterId: CharacterId = 'character1';
