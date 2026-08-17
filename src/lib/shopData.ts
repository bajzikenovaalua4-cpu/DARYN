export type ShopCategory = 'theme' | 'constitution' | 'tool';

export type ShopItem = {
  id: string;
  category: ShopCategory;
  title: string;
  description: string;
  price: number;
  consumable?: boolean;
};

export const hintItemId = 'tool-remove-wrong';
export const usedItemPrefix = 'used:';

export const shopItems: ShopItem[] = [
  { id: 'theme-aurora', category: 'theme', title: 'Тема Aurora', description: 'Холодные бирюзовые акценты для интерфейса.', price: 10 },
  { id: 'theme-gold', category: 'theme', title: 'Тема Gold Court', description: 'Золотой акцент в стиле зала суда.', price: 10 },
  { id: 'constitution-archive', category: 'constitution', title: 'Архивная Конституция', description: 'Оформление книги как архивного документа.', price: 8 },
  { id: 'constitution-night', category: 'constitution', title: 'Ночная Конституция', description: 'Тёмная обложка для чтения во время кейса.', price: 8 },
  {
    id: hintItemId,
    category: 'tool',
    title: 'Подсказка',
    description: 'Один раз убирает 2 заведомо неправильных варианта в вопросе кейса.',
    price: 15,
    consumable: true,
  },
];

export const shopCategoryTitles: Record<ShopCategory, string> = {
  theme: 'Темы',
  constitution: 'Конституция',
  tool: 'Инструменты прохождения',
};

export function getUsedItemId(itemId: string) {
  return `${usedItemPrefix}${itemId}`;
}
