import { shopCategoryTitles, shopItems, type ShopCategory } from '../lib/shopData';

type ShopPanelProps = {
  xp: number;
  purchasedIds: string[];
  activeThemeItemId: string | null;
  onBuy: (itemId: string, price: number) => void;
  onApply: (itemId: string) => void;
  onBack: () => void;
};

const categories: ShopCategory[] = ['theme', 'constitution', 'profile', 'hint', 'fact'];

export function ShopPanel({ xp, purchasedIds, activeThemeItemId, onBuy, onApply, onBack }: ShopPanelProps) {
  return (
    <section className="vn-panel vn-shop">
      <button className="vn-secondary" onClick={onBack}>Назад</button>
      <span className="vn-kicker">Магазин</span>
      <h1>Юридический магазин</h1>
      <p>Баланс: <b>{xp} XP</b>. Купленные предметы сохраняются в профиле.</p>

      {categories.map((category) => (
        <section key={category} className="shop-section">
          <h2>{shopCategoryTitles[category]}</h2>
          <div className="shop-grid">
            {shopItems.filter((item) => item.category === category).map((item) => {
              const purchased = purchasedIds.includes(item.id);
              const affordable = xp >= item.price;
              const isTheme = item.category === 'theme';
              const active = isTheme && activeThemeItemId === item.id;

              return (
                <article key={item.id} className={purchased ? 'shop-card is-owned' : 'shop-card'}>
                  <span>{item.price} XP</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  {item.source && <small>Источник: {item.source}</small>}
                  <button
                    className={purchased ? 'vn-secondary' : 'vn-primary'}
                    type="button"
                    disabled={(purchased && !isTheme) || active || (!purchased && !affordable)}
                    onClick={() => {
                      if (purchased && isTheme) {
                        onApply(item.id);
                        return;
                      }
                      onBuy(item.id, item.price);
                    }}
                  >
                    {getButtonText(purchased, affordable, isTheme, active)}
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </section>
  );
}

function getButtonText(purchased: boolean, affordable: boolean, isTheme: boolean, active: boolean) {
  if (active) return 'Применено';
  if (purchased && isTheme) return 'Применить';
  if (purchased) return 'Куплено';
  return affordable ? 'Купить' : 'Не хватает XP';
}
