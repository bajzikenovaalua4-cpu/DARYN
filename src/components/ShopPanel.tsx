import { getShopCategoryText, getShopItemText, t, type Language } from '../lib/i18n';
import { getUsedItemId, shopItems, type ShopCategory, type ShopItem } from '../lib/shopData';

type ShopPanelProps = {
  language: Language;
  xp: number;
  purchasedIds: string[];
  activeThemeItemId: string | null;
  onBuy: (itemId: string, price: number) => void;
  onApply: (itemId: string) => void;
  onBack: () => void;
};

const categories: ShopCategory[] = ['theme', 'constitution', 'tool'];

export function ShopPanel({ language, xp, purchasedIds, activeThemeItemId, onBuy, onApply, onBack }: ShopPanelProps) {
  return (
    <section className="vn-panel vn-shop">
      <button className="vn-secondary" onClick={onBack}>{t(language, 'back')}</button>
      <span className="vn-kicker">{t(language, 'shop')}</span>
      <h1>{t(language, 'shopTitle')}</h1>
      <p>{t(language, 'balance')}: <b>{xp} XP</b>. {t(language, 'savedItems')}</p>

      {categories.map((category) => {
        const categoryText = getShopCategoryText(language, category);

        return (
          <section key={category} className="shop-section">
            <h2>{categoryText.title}</h2>
            <p>{categoryText.description}</p>
            <div className="shop-grid">
              {shopItems.filter((item) => item.category === category).map((item) => {
                const purchased = purchasedIds.includes(item.id);
                const used = Boolean(item.consumable && purchasedIds.includes(getUsedItemId(item.id)));
                const affordable = xp >= item.price;
                const isTheme = item.category === 'theme';
                const active = isTheme && activeThemeItemId === item.id;
                const itemText = getShopItemText(language, item);

                return (
                  <article key={item.id} className={purchased ? 'shop-card is-owned' : 'shop-card'}>
                    <span>{item.price} XP</span>
                    <h3>{itemText.title}</h3>
                    <p>{itemText.description}</p>
                    {item.consumable && purchased && !used && <small>{t(language, 'available')}</small>}
                    {used && <small>{t(language, 'used')}</small>}
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
                      {getButtonText(language, item, purchased, affordable, isTheme, active, used)}
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </section>
  );
}

function getButtonText(
  language: Language,
  item: ShopItem,
  purchased: boolean,
  affordable: boolean,
  isTheme: boolean,
  active: boolean,
  used: boolean,
) {
  if (active) return t(language, 'applied');
  if (purchased && isTheme) return t(language, 'apply');
  if (used) return t(language, 'used');
  if (purchased && item.consumable) return t(language, 'available');
  if (purchased) return t(language, 'bought');
  return affordable ? t(language, 'buy') : t(language, 'notEnoughXp');
}
