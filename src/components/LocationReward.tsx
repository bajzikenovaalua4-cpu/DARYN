import type { NovelLocation } from '../lib/visualNovelData';

type LocationRewardProps = {
  location: NovelLocation;
  onContinue: () => void;
};

export function LocationReward({ location, onContinue }: LocationRewardProps) {
  return (
    <section className={`vn-reward ${location.backgroundClass}`}>
      <div className="vn-panel">
        <span className="vn-kicker">Локация пройдена</span>
        <h1>{location.shortTitle}</h1>
        <p>Все три истории завершены. Ты разобрал ситуации, сделал правовые выборы и получил опыт.</p>
        <button className="vn-primary" onClick={onContinue}>Вернуться к локациям</button>
      </div>
    </section>
  );
}
