import { t, type Language } from '../lib/i18n';

type SecretSceneProps = {
  language: Language;
  legalLiteracy: number;
  onBack: () => void;
};

export function SecretScene({ language, legalLiteracy, onBack }: SecretSceneProps) {
  return (
    <section className="vn-secret-scene">
      <div className="vn-panel">
        <span className="vn-kicker">{t(language, 'secretLabel')}</span>
        <h1>{t(language, 'secretTitle')}</h1>
        <p>{t(language, 'secretText')} {legalLiteracy} XP.</p>
        <button className="vn-primary" onClick={onBack}>{t(language, 'toLocations')}</button>
      </div>
    </section>
  );
}
