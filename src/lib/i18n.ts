export type Language = 'ru' | 'kk';

export const languageKey = 'law-quest-language';

export type TranslationKey =
  | 'language'
  | 'theme'
  | 'darkTheme'
  | 'darkThemeHint'
  | 'back'
  | 'continue'
  | 'startGame'
  | 'changeCharacter'
  | 'guestNote'
  | 'startHint'
  | 'welcomeLabel'
  | 'welcomeTitle'
  | 'welcomeText'
  | 'gotIt'
  | 'step'
  | 'chooseCharacter'
  | 'male'
  | 'female'
  | 'yourName'
  | 'nameHint'
  | 'namePlaceholder'
  | 'nameError'
  | 'welcomePlayer'
  | 'selectedCharacter'
  | 'locations'
  | 'chooseLocation'
  | 'charactersDone'
  | 'secretOpen'
  | 'secretClosed'
  | 'shopOpen'
  | 'toLocations'
  | 'npcDossier'
  | 'name'
  | 'age'
  | 'gender'
  | 'status'
  | 'relationship'
  | 'shop'
  | 'shopTitle'
  | 'balance'
  | 'savedItems'
  | 'available'
  | 'used'
  | 'applied'
  | 'apply'
  | 'bought'
  | 'buy'
  | 'notEnoughXp'
  | 'locationDone'
  | 'locationDoneText'
  | 'storiesDone'
  | 'secretLabel'
  | 'secretTitle'
  | 'secretText'
  | 'actionsPrompt'
  | 'checkActions'
  | 'useHint'
  | 'goodActions'
  | 'riskyActions'
  | 'legalLiteracy'
  | 'effects'
  | 'caseMaterials'
  | 'evidenceQuestion'
  | 'checkEvidence'
  | 'evidenceGood'
  | 'evidenceBad'
  | 'caseResult'
  | 'caseDone'
  | 'decision'
  | 'evidence'
  | 'order'
  | 'errors'
  | 'earned'
  | 'result'
  | 'selectedDecision'
  | 'correctActions'
  | 'wrongActions'
  | 'correctEvidence'
  | 'explanation'
  | 'possibleConsequences'
  | 'lawKz'
  | 'finishCase';

export type LocationText = {
  title: string;
  shortTitle: string;
  description: string;
  imageLabel: string;
};

export type ShopCategoryText = {
  title: string;
  description: string;
};

const translations: Record<Language, Record<TranslationKey, string>> = {
  ru: {
    language: 'Язык',
    theme: 'Тема',
    darkTheme: 'Темная тема',
    darkThemeHint: 'Цвет интерфейса не меняется',
    back: 'Назад',
    continue: 'Продолжить',
    startGame: 'Начать игру',
    changeCharacter: 'Сменить персонажа',
    guestNote: 'Гостевой режим: прогресс хранится только на этом устройстве.',
    startHint: 'Начни игру → выбери локацию и поговори с персонажами.',
    welcomeLabel: 'Добро пожаловать',
    welcomeTitle: 'Юрфак',
    welcomeText: 'Разбирай жизненные юридические ситуации, принимай решения и изучай свои права.',
    gotIt: 'Понятно',
    step: 'Шаг',
    chooseCharacter: 'Выбери персонажа',
    male: 'Мужской',
    female: 'Женский',
    yourName: 'Как тебя зовут?',
    nameHint: 'Введите имя на кириллице',
    namePlaceholder: 'Например: Алим',
    nameError: 'Имя должно быть непустым и содержать кириллические буквы.',
    welcomePlayer: 'Добро пожаловать',
    selectedCharacter: 'Выбран персонаж',
    locations: 'Локации',
    chooseLocation: 'Выбери локацию',
    charactersDone: 'персонажей пройдено',
    secretOpen: 'Открыть секретную сцену',
    secretClosed: 'Секретная сцена закрыта',
    shopOpen: 'Магазин юридической грамотности',
    toLocations: 'К локациям',
    npcDossier: 'Досье персонажа',
    name: 'Имя',
    age: 'Возраст',
    gender: 'Пол',
    status: 'Статус',
    relationship: 'Связь с героем',
    shop: 'Магазин',
    shopTitle: 'Юридический магазин',
    balance: 'Баланс',
    savedItems: 'Купленные предметы сохраняются в профиле.',
    available: 'Статус: доступно для использования в кейсе',
    used: 'Статус: использовано',
    applied: 'Применено',
    apply: 'Применить',
    bought: 'Куплено',
    buy: 'Купить',
    notEnoughXp: 'Не хватает XP',
    locationDone: 'ЛОКАЦИЯ ПРОЙДЕНА',
    locationDoneText: 'Ты разобрал все истории этой локации.',
    storiesDone: 'историй завершено',
    secretLabel: 'СЕКРЕТНАЯ СЦЕНА',
    secretTitle: 'Ты прошёл все основные дела',
    secretText: 'Но, кажется, осталось ещё кое-что. Итоговая юридическая грамотность:',
    actionsPrompt: 'Выберите действия, которые действительно нужны в этой ситуации.',
    checkActions: 'Проверить действия',
    useHint: 'Использовать подсказку',
    goodActions: 'Хороший набор действий',
    riskyActions: 'В действиях есть риск',
    legalLiteracy: 'юридической грамотности',
    effects: 'Возможные последствия',
    caseMaterials: 'Материалы дела',
    evidenceQuestion: 'Какие доказательства вам понадобятся?',
    checkEvidence: 'Проверить доказательства',
    evidenceGood: 'Доказательства выбраны верно',
    evidenceBad: 'Есть ошибки в доказательствах',
    caseResult: 'К итогу дела',
    caseDone: 'Дело завершено',
    decision: 'Решение',
    evidence: 'Доказательства',
    order: 'Порядок',
    errors: 'Ошибки',
    earned: 'Получено',
    result: 'Результат',
    selectedDecision: 'Выбранное решение',
    correctActions: 'Правильные действия',
    wrongActions: 'Ошибочные действия',
    correctEvidence: 'Верно выбранные доказательства',
    explanation: 'Объяснение',
    possibleConsequences: 'Возможные последствия',
    lawKz: 'Законодательство РК',
    finishCase: 'Продолжить',
  },
  kk: {
    language: 'Тіл',
    theme: 'Тақырып',
    darkTheme: 'Қараңғы тақырып',
    darkThemeHint: 'Интерфейс түсі өзгермейді',
    back: 'Артқа',
    continue: 'Жалғастыру',
    startGame: 'Ойынды бастау',
    changeCharacter: 'Кейіпкерді ауыстыру',
    guestNote: 'Қонақ режимі: прогресс тек осы құрылғыда сақталады.',
    startHint: 'Ойынды баста → локация таңда және кейіпкерлермен сөйлес.',
    welcomeLabel: 'Қош келдің',
    welcomeTitle: 'Заң факультеті',
    welcomeText: 'Өмірдегі құқықтық жағдайларды талда, шешім қабылда және өз құқықтарыңды үйрен.',
    gotIt: 'Түсінікті',
    step: 'Қадам',
    chooseCharacter: 'Кейіпкер таңда',
    male: 'Ер',
    female: 'Әйел',
    yourName: 'Атың кім?',
    nameHint: 'Атыңды кириллицамен енгіз',
    namePlaceholder: 'Мысалы: Әлім',
    nameError: 'Ат бос болмауы және кирилл әріптерімен жазылуы керек.',
    welcomePlayer: 'Қош келдің',
    selectedCharacter: 'Таңдалған кейіпкер',
    locations: 'Локациялар',
    chooseLocation: 'Локация таңда',
    charactersDone: 'кейіпкер аяқталды',
    secretOpen: 'Құпия сахнаны ашу',
    secretClosed: 'Құпия сахна жабық',
    shopOpen: 'Құқықтық сауаттылық дүкені',
    toLocations: 'Локацияларға',
    npcDossier: 'Кейіпкер деректері',
    name: 'Аты',
    age: 'Жасы',
    gender: 'Жынысы',
    status: 'Мәртебесі',
    relationship: 'Байланысы',
    shop: 'Дүкен',
    shopTitle: 'Құқықтық дүкен',
    balance: 'Баланс',
    savedItems: 'Сатып алынған заттар профильде сақталады.',
    available: 'Күйі: кейсте қолдануға дайын',
    used: 'Күйі: қолданылды',
    applied: 'Қолданылды',
    apply: 'Қолдану',
    bought: 'Сатып алынды',
    buy: 'Сатып алу',
    notEnoughXp: 'XP жетпейді',
    locationDone: 'ЛОКАЦИЯ АЯҚТАЛДЫ',
    locationDoneText: 'Сен осы локациядағы барлық оқиғаны аяқтадың.',
    storiesDone: 'оқиға аяқталды',
    secretLabel: 'ҚҰПИЯ САХНА',
    secretTitle: 'Сен барлық негізгі істі аяқтадың',
    secretText: 'Бірақ әлі бір нәрсе қалған сияқты. Қорытынды құқықтық сауаттылық:',
    actionsPrompt: 'Осы жағдайда шынымен қажет әрекеттерді таңда.',
    checkActions: 'Әрекеттерді тексеру',
    useHint: 'Көмекті қолдану',
    goodActions: 'Дұрыс әрекеттер жиынтығы',
    riskyActions: 'Әрекеттерде қауіп бар',
    legalLiteracy: 'құқықтық сауаттылық',
    effects: 'Мүмкін салдарлар',
    caseMaterials: 'Іс материалдары',
    evidenceQuestion: 'Қандай дәлелдер қажет?',
    checkEvidence: 'Дәлелдерді тексеру',
    evidenceGood: 'Дәлелдер дұрыс таңдалды',
    evidenceBad: 'Дәлелдерде қате бар',
    caseResult: 'Іс қорытындысына',
    caseDone: 'Іс аяқталды',
    decision: 'Шешім',
    evidence: 'Дәлелдер',
    order: 'Рет',
    errors: 'Қателер',
    earned: 'Алынды',
    result: 'Нәтиже',
    selectedDecision: 'Таңдалған шешім',
    correctActions: 'Дұрыс әрекеттер',
    wrongActions: 'Қате әрекеттер',
    correctEvidence: 'Дұрыс таңдалған дәлелдер',
    explanation: 'Түсіндірме',
    possibleConsequences: 'Мүмкін салдарлар',
    lawKz: 'ҚР заңнамасы',
    finishCase: 'Жалғастыру',
  },
};

const locationTexts: Record<Language, Record<string, LocationText>> = {
  ru: {
    school: {
      title: 'Школа / университет',
      shortTitle: 'Школа',
      description: 'Буллинг, личные вещи, академическая честность и права учащихся.',
      imageLabel: 'Кампус',
    },
    work: {
      title: 'Работа',
      shortTitle: 'Работа',
      description: 'Трудовой договор, задержка зарплаты и безопасность на рабочем месте.',
      imageLabel: 'Офис',
    },
    city: {
      title: 'Город',
      shortTitle: 'Город',
      description: 'Полиция, покупки, транспорт и бытовые правовые ситуации.',
      imageLabel: 'Город',
    },
  },
  kk: {
    school: {
      title: 'Мектеп / университет',
      shortTitle: 'Мектеп',
      description: 'Буллинг, жеке заттар, академиялық адалдық және оқушы құқықтары.',
      imageLabel: 'Кампус',
    },
    work: {
      title: 'Жұмыс',
      shortTitle: 'Жұмыс',
      description: 'Еңбек шарты, жалақының кешігуі және жұмыс орнындағы қауіпсіздік.',
      imageLabel: 'Кеңсе',
    },
    city: {
      title: 'Қала',
      shortTitle: 'Қала',
      description: 'Полиция, сатып алу, көлік және тұрмыстық құқықтық жағдайлар.',
      imageLabel: 'Қала',
    },
  },
};

const shopCategoryTexts: Record<Language, Record<string, ShopCategoryText>> = {
  ru: {
    theme: { title: 'Темы интерфейса', description: 'Меняют цвета игры.' },
    constitution: { title: 'Конституция', description: 'Оформления и дополнительные материалы.' },
    tool: { title: 'Инструменты для кейсов', description: 'Одноразовые предметы для сложных ситуаций.' },
  },
  kk: {
    theme: { title: 'Интерфейс тақырыптары', description: 'Ойын түстерін өзгертеді.' },
    constitution: { title: 'Конституция', description: 'Оформление және қосымша материалдар.' },
    tool: { title: 'Кейс құралдары', description: 'Күрделі жағдайларға арналған бір реттік заттар.' },
  },
};

const shopItemTexts: Record<Language, Record<string, { title: string; description: string }>> = {
  ru: {
    'theme-aurora': { title: 'Аврора', description: 'Сине-фиолетовая тема для интерфейса.' },
    'theme-gold': { title: 'Gold Court', description: 'Золотая тема в стиле суда.' },
    'constitution-archive': { title: 'Архивное оформление', description: 'Оформление Конституции в стиле документа.' },
    'constitution-night': { title: 'Ночная Конституция', description: 'Темное оформление книги Конституции.' },
    'tool-remove-wrong': { title: 'Подсказка', description: 'Один раз убирает 2 заведомо неправильных варианта в кейсе.' },
  },
  kk: {
    'theme-aurora': { title: 'Аврора', description: 'Интерфейске арналған көк-күлгін тақырып.' },
    'theme-gold': { title: 'Gold Court', description: 'Сот стиліндегі алтын түсті тақырып.' },
    'constitution-archive': { title: 'Архивтік оформление', description: 'Конституцияны құжат стилінде көрсету.' },
    'constitution-night': { title: 'Түнгі Конституция', description: 'Конституция кітабының қараңғы көрінісі.' },
    'tool-remove-wrong': { title: 'Көмек', description: 'Кейсте анық қате 2 нұсқаны бір рет алып тастайды.' },
  },
};

export function t(language: Language, key: TranslationKey) {
  return translations[language][key];
}

export function getLocationText(
  language: Language,
  location: { id: string; title: string; shortTitle: string; description: string; imageLabel: string },
) {
  return locationTexts[language][location.id] ?? location;
}

export function getShopCategoryText(language: Language, category: string) {
  return shopCategoryTexts[language][category] ?? { title: category, description: '' };
}

export function getShopItemText(language: Language, item: { id: string; title: string; description: string }) {
  return shopItemTexts[language][item.id] ?? item;
}
