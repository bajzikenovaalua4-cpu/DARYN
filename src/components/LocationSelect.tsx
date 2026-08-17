import { getLocationText, t, type Language } from '../lib/i18n';
import type { LocationId, NovelLocation } from '../lib/visualNovelData';

type LocationSelectProps = {
  language: Language;
  locations: NovelLocation[];
  completedNpcIds: string[];
  secretUnlocked: boolean;
  onSelect: (locationId: LocationId) => void;
  onSecret: () => void;
  onShop: () => void;
  onBack: () => void;
};

export function LocationSelect({
  language,
  locations,
  completedNpcIds,
  secretUnlocked,
  onSelect,
  onSecret,
  onShop,
  onBack,
}: LocationSelectProps) {
  const completedLocations = locations.filter((location) => (
    location.npcs.every((npc) => completedNpcIds.includes(npc.id))
  )).length;

  return (
    <section className="vn-panel vn-location-select">
      <button className="vn-secondary" onClick={onBack}>{t(language, 'back')}</button>
      <span className="vn-kicker">{completedLocations} / {locations.length} {t(language, 'locations')}</span>
      <h1>{t(language, 'chooseLocation')}</h1>
      <div className="vn-location-grid">
        {locations.map((location) => {
          const completed = location.npcs.filter((npc) => completedNpcIds.includes(npc.id)).length;
          const text = getLocationText(language, location);

          return (
            <button key={location.id} className="vn-location-card" onClick={() => onSelect(location.id)}>
              <span className="vn-location-art" style={{ backgroundColor: location.theme }}>{text.imageLabel}</span>
              <b>{text.title}</b>
              <p>{text.description}</p>
              <strong>{completed} / {location.npcs.length} {t(language, 'charactersDone')}</strong>
            </button>
          );
        })}
      </div>
      <button className={secretUnlocked ? 'vn-secret is-open' : 'vn-secret'} onClick={onSecret} disabled={!secretUnlocked}>
        {secretUnlocked ? t(language, 'secretOpen') : t(language, 'secretClosed')}
      </button>
      <button className="vn-secret is-open" onClick={onShop}>
        {t(language, 'shopOpen')}
      </button>
    </section>
  );
}
