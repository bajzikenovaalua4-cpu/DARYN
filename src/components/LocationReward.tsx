import { getLocationText, t, type Language } from '../lib/i18n';
import type { NovelLocation } from '../lib/visualNovelData';

type LocationRewardProps = {
  language: Language;
  location: NovelLocation;
  earnedPoints: number;
  onContinue: () => void;
};

export function LocationReward({ language, location, earnedPoints, onContinue }: LocationRewardProps) {
  const locationText = getLocationText(language, location);

  return (
    <section className={`vn-reward ${location.backgroundClass}`}>
      <div className="vn-panel vn-reward-card">
        <span className="vn-kicker">{t(language, 'locationDone')}</span>
        <h1>{locationText.shortTitle}</h1>
        <p>{t(language, 'locationDoneText')}</p>
        <div className="vn-reward-stats">
          <span>+{earnedPoints} XP</span>
          <span>{location.npcs.length}/{location.npcs.length} {t(language, 'storiesDone')}</span>
        </div>
        <button className="vn-primary" onClick={onContinue}>{t(language, 'toLocations')}</button>
      </div>
    </section>
  );
}
