import type { CompletedNpc } from './novelProgress';
import { novelLocations } from './visualNovelData';

export type FinalChoiceReview = {
  npcName: string;
  storyTitle: string;
  choiceText: string;
  points: number;
  correct: boolean;
  relationshipScore: number;
  note: string;
};

export type FinalVerdict = {
  completedCount: number;
  totalCount: number;
  correctCount: number;
  riskyCount: number;
  totalPoints: number;
  bestTrust: FinalChoiceReview[];
  weakTrust: FinalChoiceReview[];
  goodChoices: FinalChoiceReview[];
  riskyChoices: FinalChoiceReview[];
  verdict: string;
  memeLine: string;
};

export function buildFinalVerdict(
  completed: CompletedNpc[],
  relationshipScores: Record<string, number>,
): FinalVerdict {
  const reviews = completed
    .map((item) => buildChoiceReview(item, relationshipScores[item.npcId] ?? 0))
    .filter((item): item is FinalChoiceReview => Boolean(item));
  const correctCount = reviews.filter((item) => item.correct).length;
  const riskyCount = reviews.length - correctCount;
  const totalPoints = reviews.reduce((sum, item) => sum + item.points, 0);
  const sortedTrust = [...reviews].sort((a, b) => b.relationshipScore - a.relationshipScore);

  return {
    completedCount: reviews.length,
    totalCount: novelLocations.reduce((sum, location) => sum + location.npcs.length, 0),
    correctCount,
    riskyCount,
    totalPoints,
    bestTrust: sortedTrust.filter((item) => item.relationshipScore > 0).slice(0, 3),
    weakTrust: sortedTrust.filter((item) => item.relationshipScore < 0).reverse().slice(0, 3),
    goodChoices: reviews.filter((item) => item.correct).slice(0, 4),
    riskyChoices: reviews.filter((item) => !item.correct).slice(0, 4),
    verdict: getVerdict(correctCount, reviews.length),
    memeLine: getMemeLine(correctCount, reviews.length, riskyCount),
  };
}

function buildChoiceReview(item: CompletedNpc, relationshipScore: number) {
  const npc = novelLocations.flatMap((location) => location.npcs).find((candidate) => candidate.id === item.npcId);
  if (!npc) return null;

  const choice = npc.dialogue.flatMap((line) => line.choices ?? []).find((candidate) => candidate.id === item.choiceId);

  return {
    npcName: npc.name,
    storyTitle: npc.storyTitle,
    choiceText: choice?.text ?? 'Выбор сохранён в прогрессе, но текста варианта уже нет в сценарии.',
    points: item.points,
    correct: item.correct,
    relationshipScore,
    note: choice?.explanation ?? 'Подробное объяснение для этого выбора недоступно.',
  } satisfies FinalChoiceReview;
}

function getVerdict(correctCount: number, totalCount: number) {
  const percent = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  if (percent >= 90) return 'Вердикт: ходячая Конституция с режимом турбо.';
  if (percent >= 70) return 'Вердикт: юрист на минималках, но уже опасный для нарушителей.';
  if (percent >= 45) return 'Вердикт: здравый смысл есть, просто иногда уходит на перемену.';
  return 'Вердикт: правовой хаос, зато уверенный и с драмой.';
}

function getMemeLine(correctCount: number, totalCount: number, riskyCount: number) {
  if (totalCount === 0) return 'Статистика молчит. Видимо, игрок ещё не оставил следов.';
  if (riskyCount === 0) return 'NPC доверяют тебе настолько, что уже готовы дать печать и кабинет.';
  if (correctCount > riskyCount) return 'Ошибки были, но общий вайб: “я всё контролирую, почти”.';
  return 'Игра посмотрела на решения, вздохнула и выдала мемную награду.';
}
