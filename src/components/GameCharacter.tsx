export type CharacterDirection = 'up' | 'down' | 'left' | 'right';
export type CharacterAction = 'idle' | 'walk' | 'interact' | 'enter-car' | 'exit-car';
export type CharacterVariant = 'student' | 'teacher' | 'police' | 'seller' | 'driver' | 'boss' | 'citizen';

type GameCharacterProps = {
  variant: CharacterVariant;
  action?: CharacterAction;
  compact?: boolean;
};

export function GameCharacter({ variant, action = 'idle', compact = false }: GameCharacterProps) {
  const classes = ['character', `character--${variant}`, `character--${action}`];
  if (compact) classes.push('character--compact');

  return (
    <div className={classes.join(' ')}>
      <span className="character__shadow" />
      <span className="character__backpack" />
      <span className="character__neck" />
      <span className="character__head">
        <i className="character__ear character__ear--left" />
        <i className="character__ear character__ear--right" />
        <i className="character__hair character__hair--base" />
        <i className="character__hair character__hair--bang-a" />
        <i className="character__hair character__hair--bang-b" />
        <i className="character__brow character__brow--left" />
        <i className="character__brow character__brow--right" />
        <i className="character__eye character__eye--left" />
        <i className="character__eye character__eye--right" />
        <i className="character__nose" />
        <i className="character__mouth" />
      </span>
      <span className="character__torso">
        <i className="character__shirt" />
        <i className="character__zip" />
        <i className="character__pocket character__pocket--left" />
        <i className="character__pocket character__pocket--right" />
      </span>
      <span className="character__arm character__arm--left"><i /></span>
      <span className="character__arm character__arm--right"><i /></span>
      <span className="character__leg character__leg--left"><i /></span>
      <span className="character__leg character__leg--right"><i /></span>
    </div>
  );
}
