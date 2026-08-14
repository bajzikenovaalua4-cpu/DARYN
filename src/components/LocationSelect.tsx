import type { LocationId, NovelLocation } from '../lib/visualNovelData';

type LocationSelectProps = {
  locations: NovelLocation[];
  completedNpcIds: string[];
  secretUnlocked: boolean;
  onSelect: (locationId: LocationId) => void;
  onSecret: () => void;
  onShop: () => void;
  onBack: () => void;
};

export function LocationSelect({ locations, completedNpcIds, secretUnlocked, onSelect, onSecret, onShop, onBack }: LocationSelectProps) {
  const completedLocations = locations.filter((location) => (
    location.npcs.every((npc) => completedNpcIds.includes(npc.id))
  )).length;

  return (
    <section className="vn-panel vn-location-select">
      <button className="vn-secondary" onClick={onBack}>Назад</button>
      <span className="vn-kicker">{completedLocations} / 3 локации</span>
      <h1>Выбери локацию</h1>
      <div className="vn-location-grid">
        {locations.map((location) => {
          const completed = location.npcs.filter((npc) => completedNpcIds.includes(npc.id)).length;
          return (
            <button key={location.id} className="vn-location-card" onClick={() => onSelect(location.id)}>
              <span className="vn-location-art" style={{ backgroundColor: location.theme }}>{location.imageLabel}</span>
              <b>{location.title}</b>
              <p>{location.description}</p>
              <strong>{completed} / {location.npcs.length} персонажей пройдено</strong>
            </button>
          );
        })}
      </div>
      <button className={secretUnlocked ? 'vn-secret is-open' : 'vn-secret'} onClick={onSecret} disabled={!secretUnlocked}>
        {secretUnlocked ? 'Открыть секретную сцену' : 'Секретная сцена закрыта'}
      </button>
      <button className="vn-secret is-open" onClick={onShop}>
        Магазин юридической грамотности
      </button>
    </section>
  );
}
