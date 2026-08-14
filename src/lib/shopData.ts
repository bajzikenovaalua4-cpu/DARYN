export type ShopCategory = 'theme' | 'constitution' | 'profile' | 'hint' | 'fact';

export type ShopItem = {
  id: string;
  category: ShopCategory;
  title: string;
  description: string;
  price: number;
  source?: string;
};

export const shopItems: ShopItem[] = [
  { id: 'theme-aurora', category: 'theme', title: 'Тема Aurora', description: 'Холодные бирюзовые акценты для интерфейса.', price: 10 },
  { id: 'theme-gold', category: 'theme', title: 'Тема Gold Court', description: 'Золотой акцент в стиле зала суда.', price: 10 },
  { id: 'constitution-archive', category: 'constitution', title: 'Архивная Конституция', description: 'Оформление книги как архивного документа.', price: 8 },
  { id: 'constitution-night', category: 'constitution', title: 'Ночная Конституция', description: 'Тёмная обложка для чтения во время кейса.', price: 8 },
  { id: 'profile-badge-lawyer', category: 'profile', title: 'Значок "Юный юрист"', description: 'Косметический бейдж для профиля игрока.', price: 7 },
  { id: 'profile-frame-court', category: 'profile', title: 'Рамка профиля', description: 'Аккуратная рамка с юридическим мотивом.', price: 7 },
  { id: 'hint-evidence', category: 'hint', title: 'Подсказка: доказательства', description: 'Напоминание: ищи факт, дату, автора и связь с делом.', price: 5 },
  { id: 'hint-first-step', category: 'hint', title: 'Подсказка: первый шаг', description: 'Помогает отличить спокойную фиксацию от рискованной реакции.', price: 5 },
  {
    id: 'fact-1993',
    category: 'fact',
    title: 'Первая Конституция независимого Казахстана',
    description: '28 января 1993 года Верховный Совет принял первую Конституцию независимого Казахстана; она действовала до принятия Конституции 1995 года.',
    price: 3,
    source: 'Adilet: Конституция 1993 года; gov.kz: Конституция - основа Независимости Казахстана.',
  },
  {
    id: 'fact-original',
    category: 'fact',
    title: 'Оригинал текста хранится у Президента',
    description: 'Указ от 6 сентября 1995 года установил, что оригинал текста Конституции 1995 года хранится у Президента РК.',
    price: 3,
    source: 'Adilet: Указ Президента РК от 6 сентября 1995 года N 2454.',
  },
  {
    id: 'fact-archive',
    category: 'fact',
    title: 'Текст 1993 года отправили в архив',
    description: 'Тем же указом оригинал Конституции 1993 года передали на вечное хранение в Центральный государственный архив.',
    price: 3,
    source: 'Adilet: Указ Президента РК от 6 сентября 1995 года N 2454.',
  },
  {
    id: 'fact-1995-publication',
    category: 'fact',
    title: 'Конституция 1995 года вступила в силу не 30 августа',
    description: 'Референдум прошёл 30 августа 1995 года, а указ об опубликовании и вступлении Конституции в силу связан с 5 сентября 1995 года.',
    price: 3,
    source: 'Adilet: Указ Президента РК от 6 сентября 1995 года N 2454.',
  },
  {
    id: 'fact-amendments-log',
    category: 'fact',
    title: 'У Конституции 1995 года длинная история редакций',
    description: 'В истории Adilet видны крупные обновления 1998, 2007, 2011, 2017, 2019, 2022 и 2023 годов.',
    price: 3,
    source: 'Adilet: история изменений Конституции 1995 года.',
  },
  {
    id: 'fact-constitutional-control',
    category: 'fact',
    title: 'Конституционный контроль менял форму',
    description: 'До Конституционного Совета 1995 года в Казахстане работал Конституционный Суд, избранный в 1992 году и действовавший до октября 1995 года.',
    price: 3,
    source: 'gov.kz: History of constitutional control in Kazakhstan.',
  },
  {
    id: 'fact-council-1996',
    category: 'fact',
    title: 'Конституционный Совет появился после Конституции',
    description: 'На основе Конституции 1995 года Конституционный Совет был сформирован в феврале 1996 года.',
    price: 3,
    source: 'gov.kz: History of constitutional control in Kazakhstan.',
  },
  {
    id: 'fact-article-93',
    category: 'fact',
    title: 'Переходная статья про государственный язык',
    description: 'В Конституции 1995 года была переходная статья 93: государство должно было создать условия для свободного и бесплатного изучения государственного языка.',
    price: 3,
    source: 'Adilet: Конституция 1995 года, статья 93.',
  },
  {
    id: 'fact-2022-court',
    category: 'fact',
    title: 'В 2022 году вернулся Конституционный Суд',
    description: 'После реформы 2022 года в тексте Конституции снова появился Конституционный Суд, а часть изменений вступила в действие с 2023 года.',
    price: 3,
    source: 'Adilet: история изменений Конституции 1995 года; gov.kz материалы Конституционного Суда.',
  },
  {
    id: 'fact-2026-transition',
    category: 'fact',
    title: 'Новая Конституция 2026 года содержит переходный мост',
    description: 'Текст 2026 года на Adilet предусматривает вступление в силу с 1 июля 2026 года и прекращение действия прежней Конституции.',
    price: 3,
    source: 'Adilet: Конституция Республики Казахстан 2026 года, статья 94.',
  },
];

export const shopCategoryTitles: Record<ShopCategory, string> = {
  theme: 'Темы',
  constitution: 'Конституция',
  profile: 'Профиль',
  hint: 'Подсказки',
  fact: 'Факты',
};
