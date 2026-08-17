import type { CharacterId } from './characters';
import { npcLegalCases } from './legalCaseData';

export type PlayerGender = 'male' | 'female';
export type LocationId = 'school' | 'work' | 'city';

export type PlayerProfile = {
  name: string;
  characterId: CharacterId;
  gender: PlayerGender;
};

export type NovelChoice = {
  id: string;
  text: string;
  correct: boolean;
  points: number;
  explanation: string;
  law: string;
};

export type DialogueLine = {
  id: string;
  speaker: string;
  text: string;
  emotion: 'neutral' | 'worried' | 'happy' | 'strict';
  choices?: NovelChoice[];
};

export type CaseAction = {
  id: string;
  text: string;
  correct: boolean;
  explanation: string;
  consequence: string;
};

export type CaseEvidence = {
  id: string;
  title: string;
  description: string;
  required: boolean;
};

export type CaseSequenceStep = {
  id: string;
  title: string;
  explanation: string;
};

export type LegalCase = {
  question: string;
  actionPoints: number;
  evidencePoints: number;
  allowMultipleActions?: boolean;
  actions: CaseAction[];
  evidence: CaseEvidence[];
  sequence?: CaseSequenceStep[];
  evidenceResult: string;
  law: string;
};

export type NovelNpc = {
  id: string;
  name: string;
  age: number;
  gender: string;
  role: string;
  relationship: string;
  portrait: string;
  color: string;
  position: { left: number; top: number };
  storyTitle: string;
  dialogue: DialogueLine[];
  legalCase?: LegalCase;
};

export type NovelLocation = {
  id: LocationId;
  title: string;
  shortTitle: string;
  description: string;
  theme: string;
  backgroundClass: string;
  imageLabel: string;
  npcs: NovelNpc[];
};

const commonLawNote = 'Проверяй актуальную редакцию норм РК на adilet.zan.kz перед реальным действием.';

export const novelLocations: NovelLocation[] = [
  {
    id: 'school',
    title: 'Школа / университет',
    shortTitle: 'Школа',
    description: 'Буллинг, личные вещи, академическая честность и права ученика.',
    theme: '#16a34a',
    backgroundClass: 'vn-bg-school',
    imageLabel: 'Кампус',
    npcs: [
      {
        id: 'artem',
        name: 'Артём',
        age: 14,
        gender: 'Мужской',
        role: 'Школьник',
        relationship: 'Одноклассник',
        portrait: '/assets/characters/artem.webp',
        color: '#22c55e',
        position: { left: 24, top: 45 },
        storyTitle: 'Задержанная оплата',
        legalCase: {
          question: 'Артёму 14 лет. Он две недели помогал в кафе после уроков, договор письменно не подписывал, смены были в чате, оплату обещали 10-го числа, но задерживают уже 12 дней. Что нужно сделать сейчас?',
          actionPoints: 5,
          evidencePoints: 5,
          allowMultipleActions: true,
          actions: [
            {
              id: 'ask-written',
              text: 'Попросить работодателя письменно объяснить причину задержки и срок выплаты.',
              correct: true,
              explanation: 'Это правильный первый шаг: сначала нужно спокойно зафиксировать нарушение и получить позицию работодателя в письменном виде.',
              consequence: 'Так у Артёма появится понятная основа для дальнейшего обращения, если зарплату всё равно не выплатят.',
            },
            {
              id: 'save-work-terms',
              text: 'Сохранить переписку о сменах, ставке оплаты, датах работы и обещанном сроке выплаты.',
              correct: true,
              explanation: 'Это важно, потому что договора нет: условия работы и сам факт смен придётся подтверждать перепиской и другими материалами.',
              consequence: 'Если работодатель удалит сообщения или начнёт отрицать смены, у Артёма останется зафиксированная версия событий.',
            },
            {
              id: 'ask-adult-help',
              text: 'Попросить родителя или другого законного представителя помочь с письменным обращением.',
              correct: true,
              explanation: 'Возраст важен: Артём несовершеннолетний, поэтому участие взрослого делает обращение спокойнее и юридически сильнее.',
              consequence: 'Взрослый сможет помочь оформить обращение без угроз и ошибок, особенно если придётся идти дальше.',
            },
            {
              id: 'post-online',
              text: 'Написать публичный пост с названием компании и суммой долга.',
              correct: false,
              explanation: 'Публичная жалоба может быть полезной позже, но как первый шаг она рискованна: легко перейти к обвинениям без оформленных доказательств.',
              consequence: 'Работодатель может начать спорить не о зарплате, а о репутации и формулировках поста.',
            },
            {
              id: 'quit-now',
              text: 'Перестать выходить на смены, пока не выплатят деньги.',
              correct: false,
              explanation: 'Это выглядит справедливо, но без письменной фиксации можно получить новый конфликт из-за прогулов или невыполненной смены.',
              consequence: 'Артём рискует усложнить свою позицию и потерять часть доказательств.',
            },
            {
              id: 'ask-friends',
              text: 'Спросить у друзей, были ли у них похожие задержки оплаты.',
              correct: false,
              explanation: 'Свидетели могут пригодиться, но сначала важнее зафиксировать именно свою работу, сумму и задержку.',
              consequence: 'Если начать только с разговоров, работодатель может быстро удалить переписку или изменить объяснения.',
            },
            {
              id: 'take-cash-no-paper',
              text: 'Согласиться на частичную выплату наличными без расписки, чтобы быстрее получить хоть что-то.',
              correct: false,
              explanation: 'Это звучит практично, но без фиксации суммы и остатка долга потом сложнее доказать, что выплата была неполной.',
              consequence: 'Работодатель может заявить, что полностью рассчитался, а Артёму будет труднее подтвердить оставшуюся задолженность.',
            },
          ],
          evidence: [
            {
              id: 'work-chat',
              title: 'Переписка о сменах',
              description: 'Сообщения, где Артёма ставили в график и подтверждали часы работы.',
              required: true,
            },
            {
              id: 'payment-promise',
              title: 'Сообщение о сумме оплаты',
              description: 'Переписка с обещанной ставкой и датой выплаты.',
              required: true,
            },
            {
              id: 'bank-statement',
              title: 'Банковская выписка',
              description: 'Полезна позже, но сначала важнее подтвердить работу и обещанные условия.',
              required: false,
            },
            {
              id: 'selfie',
              title: 'Фото в форме',
              description: 'Подтверждает, что Артём был на месте, но само по себе не доказывает часы и долг.',
              required: true,
            },
            {
              id: 'old-ad',
              title: 'Старое объявление о вакансии',
              description: 'Подтверждает обещанную ставку и условия, если договора ещё нет.',
              required: true,
            },
          ],
          sequence: [
            {
              id: 'collect-proof',
              title: 'Собрать переписку, график и данные по сменам',
              explanation: 'Без доказательств трудно подтвердить сам факт работы и размер долга.',
            },
            {
              id: 'written-request',
              title: 'Письменно запросить срок и причину задержки',
              explanation: 'После сбора материалов нужно зафиксировать позицию работодателя.',
            },
            {
              id: 'labor-complaint',
              title: 'Обратиться в трудовую инспекцию или за помощью к взрослым',
              explanation: 'Если выплату не делают, следующий шаг - официальная защита права.',
            },
          ],
          evidenceResult: 'Для такого спора важны доказательства смен, обещанной оплаты и условий, по которым Артём соглашался работать. Выписка полезна позже, но не заменяет подтверждение самих смен и ставки.',
          law: `Трудовые права защищаются письменными обращениями и доказательствами: графиком, перепиской, договором, расчётом и выпиской. ${commonLawNote}`,
        },
        dialogue: [
          { id: 'a1', speaker: 'Артём', emotion: 'worried', text: 'Мне нужна помощь. Я подрабатывал после уроков, а оплату задерживают уже второй месяц.' },
          { id: 'a2', speaker: 'Артём', emotion: 'neutral', text: 'Что лучше сделать в первую очередь?', choices: [
            { id: 'ignore', text: 'Ничего не делать и ждать.', correct: false, points: 0, explanation: 'Пассивное ожидание не помогает зафиксировать нарушение и сроки.', law: `Трудовые права защищаются письменными обращениями и доказательствами. ${commonLawNote}` },
            { id: 'documents', text: 'Собрать договор, переписку и написать обращение работодателю.', correct: true, points: 10, explanation: 'Сначала нужно спокойно зафиксировать факт работы, сумму и срок оплаты.', law: `Трудовой кодекс РК защищает право работника на оплату труда. ${commonLawNote}` },
            { id: 'threat', text: 'Угрожать работодателю в соцсетях.', correct: false, points: 0, explanation: 'Угрозы могут навредить самому работнику и не являются законным способом защиты.', law: `Защита прав должна быть законной и подтверждённой доказательствами. ${commonLawNote}` },
          ] },
        ],
      },
      {
        id: 'school-dana',
        name: 'Дана',
        age: 15,
        gender: 'Женский',
        role: 'Староста',
        relationship: 'Подруга',
        portrait: '/assets/characters/dana.webp',
        color: '#ffffff',
        position: { left: 55, top: 36 },
        storyTitle: 'Телефон в рюкзаке',
        legalCase: npcLegalCases.dana,
        dialogue: [
          { id: 'd1', speaker: 'Дана', emotion: 'worried', text: 'Учитель хочет проверить все рюкзаки из-за пропавшего телефона. Все растерялись.' },
          { id: 'd2', speaker: 'Дана', emotion: 'neutral', text: 'Как поступить правильно?', choices: [
            { id: 'open-all', text: 'Сразу открыть чужие рюкзаки.', correct: false, points: 0, explanation: 'Нельзя самовольно трогать чужие вещи.', law: `Личная собственность и достоинство человека защищаются законом. ${commonLawNote}` },
            { id: 'ask-admin', text: 'Позвать администрацию и родителей, действовать официально.', correct: true, points: 10, explanation: 'Проверка должна быть уважительной, прозрачной и с участием ответственных взрослых.', law: `Права несовершеннолетних требуют бережного и законного порядка действий. ${commonLawNote}` },
            { id: 'blame', text: 'Обвинить того, кто сидел рядом.', correct: false, points: 0, explanation: 'Обвинение без доказательств нарушает права человека.', law: `Презумпция невиновности и защита чести важны даже в школьной ситуации. ${commonLawNote}` },
          ] },
        ],
      },
      {
        id: 'school-marat',
        name: 'Марат',
        age: 16,
        gender: 'Мужской',
        role: 'Студент',
        relationship: 'Сосед по парте',
        portrait: '/assets/characters/marat.webp',
        color: '#f59e0b',
        position: { left: 76, top: 52 },
        storyTitle: 'Буллинг в чате',
        legalCase: npcLegalCases.marat,
        dialogue: [
          { id: 'm1', speaker: 'Марат', emotion: 'worried', text: 'В общем чате выкладывают обидные мемы про одноклассника. Он перестал приходить на занятия.' },
          { id: 'm2', speaker: 'Марат', emotion: 'neutral', text: 'Что будет самым правильным?', choices: [
            { id: 'support', text: 'Сохранить доказательства и обратиться к куратору или администрации.', correct: true, points: 10, explanation: 'Нужно остановить травлю и сохранить доказательства, не разжигая конфликт.', law: `Закон защищает честь, достоинство и безопасность несовершеннолетних. ${commonLawNote}` },
            { id: 'laugh', text: 'Посмеяться вместе со всеми.', correct: false, points: 0, explanation: 'Это усиливает вред и делает участника частью травли.', law: `Оскорбления и распространение унижающих материалов могут иметь последствия. ${commonLawNote}` },
            { id: 'fight', text: 'Назначить драку после уроков.', correct: false, points: 0, explanation: 'Насилие не решает правовую проблему и создаёт новую.', law: `Конфликты нужно решать законным и безопасным способом. ${commonLawNote}` },
          ] },
        ],
      },
    ],
  },
  {
    id: 'work',
    title: 'Работа',
    shortTitle: 'Работа',
    description: 'Зарплата, испытательный срок, график и трудовые гарантии.',
    theme: '#0ea5e9',
    backgroundClass: 'vn-bg-work',
    imageLabel: 'Офис',
    npcs: [
      {
        id: 'work-aigerim',
        name: 'Айгерим',
        age: 22,
        gender: 'Женский',
        role: 'Продавец',
        relationship: 'Знакомая',
        portrait: '/assets/characters/aigerim.webp',
        color: '#ec4899',
        position: { left: 25, top: 48 },
        storyTitle: 'Испытательный срок',
        legalCase: npcLegalCases.aigerim,
        dialogue: [
          { id: 'w1', speaker: 'Айгерим', emotion: 'worried', text: 'Мне сказали, что на испытательном сроке можно не платить премию и задерживать расчёт.' },
          { id: 'w2', speaker: 'Айгерим', emotion: 'neutral', text: 'Что мне проверить?', choices: [
            { id: 'contract', text: 'Трудовой договор, условия оплаты и приказ о приёме.', correct: true, points: 10, explanation: 'Даже испытательный срок должен быть оформлен и оплачен по правилам.', law: `Трудовые отношения оформляются договором, а оплата труда должна быть понятной. ${commonLawNote}` },
            { id: 'quit', text: 'Просто уйти без объяснений.', correct: false, points: 0, explanation: 'Так можно потерять доказательства и усложнить защиту прав.', law: `Заявления и документы лучше оформлять письменно. ${commonLawNote}` },
            { id: 'cash', text: 'Согласиться на устную оплату наличными.', correct: false, points: 0, explanation: 'Устные договорённости сложно доказать.', law: `Письменное оформление помогает защитить работника. ${commonLawNote}` },
          ] },
        ],
      },
      {
        id: 'work-bolat',
        name: 'Болат',
        age: 35,
        gender: 'Мужской',
        role: 'Работодатель',
        relationship: 'Руководитель смены',
        portrait: '/assets/characters/bolat.webp',
        color: '#6366f1',
        position: { left: 54, top: 34 },
        storyTitle: 'Сверхурочные',
        legalCase: npcLegalCases.bolat,
        dialogue: [
          { id: 'b1', speaker: 'Болат', emotion: 'strict', text: 'Команда остаётся после смены. Я хочу понять, как оформить это правильно.' },
          { id: 'b2', speaker: 'Болат', emotion: 'neutral', text: 'Какой вариант законнее?', choices: [
            { id: 'order-pay', text: 'Оформить сверхурочные и оплатить их по правилам.', correct: true, points: 10, explanation: 'Сверхурочная работа не должна быть невидимой.', law: `Трудовое законодательство РК регулирует сверхурочную работу и оплату. ${commonLawNote}` },
            { id: 'force', text: 'Заставить всех остаться без документов.', correct: false, points: 0, explanation: 'Принуждение и отсутствие оформления нарушают права работников.', law: `Работник имеет право на понятные условия труда и отдыха. ${commonLawNote}` },
            { id: 'pizza', text: 'Заменить оплату пиццей.', correct: false, points: 0, explanation: 'Пицца может быть приятным бонусом, но не заменяет оплату труда.', law: `Оплата труда производится деньгами и по установленным условиям. ${commonLawNote}` },
          ] },
        ],
      },
      {
        id: 'work-serik',
        name: 'Серик',
        age: 28,
        gender: 'Мужской',
        role: 'Водитель',
        relationship: 'Коллега',
        portrait: '/assets/characters/serik.webp',
        color: '#14b8a6',
        position: { left: 75, top: 50 },
        storyTitle: 'Штраф из зарплаты',
        legalCase: npcLegalCases.serik,
        dialogue: [
          { id: 's1', speaker: 'Серик', emotion: 'worried', text: 'Мне хотят удержать из зарплаты стоимость повреждённого товара. Я не видел расчётов.' },
          { id: 's2', speaker: 'Серик', emotion: 'neutral', text: 'Какой первый шаг?', choices: [
            { id: 'written-proof', text: 'Попросить письменное основание и расчёт удержания.', correct: true, points: 10, explanation: 'Удержания должны быть обоснованы и понятны работнику.', law: `Материальная ответственность работника требует доказательств и порядка. ${commonLawNote}` },
            { id: 'accept', text: 'Согласиться устно, чтобы не спорить.', correct: false, points: 0, explanation: 'Без документов трудно понять законность удержания.', law: `Работник вправе знать основания удержаний. ${commonLawNote}` },
            { id: 'hide', text: 'Не выходить на работу.', correct: false, points: 0, explanation: 'Это создаёт дополнительные трудовые риски.', law: `Спор лучше решать письменно и через предусмотренные процедуры. ${commonLawNote}` },
          ] },
        ],
      },
    ],
  },
  {
    id: 'city',
    title: 'Город',
    shortTitle: 'Город',
    description: 'Полиция, покупки, транспорт и спокойная защита своих прав.',
    theme: '#f97316',
    backgroundClass: 'vn-bg-city',
    imageLabel: 'Улица',
    npcs: [
      {
        id: 'city-ruslan',
        name: 'Руслан',
        age: 31,
        gender: 'Мужской',
        role: 'Полицейский',
        relationship: 'Инспектор',
        portrait: '/assets/characters/ruslan.webp',
        color: '#2563eb',
        position: { left: 22, top: 46 },
        storyTitle: 'Проверка документов',
        legalCase: npcLegalCases.ruslan,
        dialogue: [
          { id: 'r1', speaker: 'Руслан', emotion: 'strict', text: 'Я остановил прохожего для проверки. Он нервничает и не знает, что спросить.' },
          { id: 'r2', speaker: 'Руслан', emotion: 'neutral', text: 'Как вести себя корректно?', choices: [
            { id: 'calm', text: 'Спокойно попросить представиться и объяснить причину проверки.', correct: true, points: 10, explanation: 'Вежливость и фиксация причины помогают защитить права без конфликта.', law: `Гражданин вправе знать, кто и почему проводит проверку. ${commonLawNote}` },
            { id: 'run', text: 'Убежать.', correct: false, points: 0, explanation: 'Бегство может ухудшить ситуацию.', law: `Правовая защита начинается со спокойного поведения. ${commonLawNote}` },
            { id: 'shout', text: 'Сразу кричать и оскорблять.', correct: false, points: 0, explanation: 'Оскорбления не помогают и могут привести к ответственности.', law: `Общение с представителем власти должно оставаться законным. ${commonLawNote}` },
          ] },
        ],
      },
      {
        id: 'city-madina',
        name: 'Мадина',
        age: 24,
        gender: 'Женский',
        role: 'Продавец',
        relationship: 'Сотрудник магазина',
        portrait: '/assets/characters/madina.webp',
        color: '#db2777',
        position: { left: 54, top: 38 },
        storyTitle: 'Возврат товара',
        legalCase: npcLegalCases.madina,
        dialogue: [
          { id: 'c1', speaker: 'Мадина', emotion: 'worried', text: 'Покупатель хочет вернуть товар с браком, но потерял коробку.' },
          { id: 'c2', speaker: 'Мадина', emotion: 'neutral', text: 'Что важно проверить?', choices: [
            { id: 'defect-proof', text: 'Проверить чек, дату покупки и наличие недостатка.', correct: true, points: 10, explanation: 'Брак товара важнее красивой коробки, если есть доказательства покупки.', law: `Права потребителей в РК защищают покупателя при недостатках товара. ${commonLawNote}` },
            { id: 'box-only', text: 'Отказать только из-за коробки.', correct: false, points: 0, explanation: 'Одна коробка не всегда решает вопрос о браке.', law: `При споре учитываются доказательства покупки и недостатка. ${commonLawNote}` },
            { id: 'argue', text: 'Спорить до закрытия магазина.', correct: false, points: 0, explanation: 'Лучше оформить обращение и акт осмотра.', law: `Письменное обращение помогает решить потребительский спор. ${commonLawNote}` },
          ] },
        ],
      },
      {
        id: 'city-oleg',
        name: 'Олег',
        age: 40,
        gender: 'Мужской',
        role: 'Прохожий',
        relationship: 'Свидетель',
        portrait: '/assets/characters/oleg.webp',
        color: '#84cc16',
        position: { left: 78, top: 50 },
        storyTitle: 'ДТП во дворе',
        legalCase: npcLegalCases.oleg,
        dialogue: [
          { id: 'o1', speaker: 'Олег', emotion: 'worried', text: 'Во дворе слегка задели припаркованную машину. Водитель хочет уехать, потому что спешит.' },
          { id: 'o2', speaker: 'Олег', emotion: 'neutral', text: 'Что безопаснее юридически?', choices: [
            { id: 'fix', text: 'Остановиться, зафиксировать ситуацию и связаться с владельцем или полицией.', correct: true, points: 10, explanation: 'Даже небольшое ДТП лучше оформить, чтобы не получить более серьёзные последствия.', law: `Правила дорожного движения требуют фиксировать происшествие по установленному порядку. ${commonLawNote}` },
            { id: 'leave', text: 'Уехать, если никто не видел.', correct: false, points: 0, explanation: 'Оставление места происшествия может повлечь ответственность.', law: `Участник ДТП не должен скрываться с места события. ${commonLawNote}` },
            { id: 'note', text: 'Оставить записку без контактов.', correct: false, points: 0, explanation: 'Без контактов и фиксации спор может стать сложнее.', law: `Нужны доказательства, контакты и правильное оформление. ${commonLawNote}` },
          ] },
        ],
      },
    ],
  },
];

export const totalNpcCount = novelLocations.reduce((sum, location) => sum + location.npcs.length, 0);
