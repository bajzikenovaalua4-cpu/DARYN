import { useState } from 'react';
import { characters, type CharacterId } from '../lib/characters';
import { t, type Language } from '../lib/i18n';
import type { PlayerGender, PlayerProfile } from '../lib/visualNovelData';

type CharacterSetupProps = {
  language: Language;
  onComplete: (profile: PlayerProfile) => void;
  onBack: () => void;
};

type SetupStep = 'character' | 'name';

const cyrillicName = /^[А-Яа-яЁёІіӘәҒғҚқҢңҰұҮүҺһӨө -]{2,32}$/;

const genderByCharacter: Record<CharacterId, PlayerGender> = {
  character1: 'male',
  character2: 'female',
};

export function CharacterSetup({ language, onComplete, onBack }: CharacterSetupProps) {
  const [step, setStep] = useState<SetupStep>('character');
  const [characterId, setCharacterId] = useState<CharacterId>('character1');
  const [name, setName] = useState('');
  const [touched, setTouched] = useState(false);
  const validName = cyrillicName.test(name.trim());

  const submitName = () => {
    setTouched(true);
    if (!validName) return;

    onComplete({
      name: name.trim(),
      characterId,
      gender: genderByCharacter[characterId],
    });
  };

  if (step === 'name') {
    return (
      <section className="vn-panel vn-setup">
        <button className="vn-secondary" onClick={() => setStep('character')}>{t(language, 'back')}</button>
        <span className="vn-kicker">{t(language, 'step')} 3</span>
        <h1>{t(language, 'yourName')}</h1>
        <label className="vn-name-field">
          {t(language, 'nameHint')}
          <input
            value={name}
            onBlur={() => setTouched(true)}
            onChange={(event) => setName(event.target.value)}
            placeholder={t(language, 'namePlaceholder')}
          />
        </label>
        {touched && !validName && <p className="vn-error">{t(language, 'nameError')}</p>}
        <button className="vn-primary" onClick={submitName}>{t(language, 'continue')}</button>
      </section>
    );
  }

  return (
    <section className="vn-panel vn-setup">
      <button className="vn-secondary" onClick={onBack}>{t(language, 'back')}</button>
      <span className="vn-kicker">{t(language, 'step')} 2</span>
      <h1>{t(language, 'chooseCharacter')}</h1>
      <div className="vn-character-grid">
        {Object.values(characters).map((character) => (
          <button
            key={character.id}
            className={characterId === character.id ? 'vn-character-card is-active' : 'vn-character-card'}
            onClick={() => setCharacterId(character.id)}
          >
            <img className="vn-character-image" src={character.preview} alt={character.title} />
            <b>{character.id === 'character1' ? t(language, 'male') : t(language, 'female')}</b>
          </button>
        ))}
      </div>
      <button className="vn-primary" onClick={() => setStep('name')}>{t(language, 'continue')}</button>
    </section>
  );
}
