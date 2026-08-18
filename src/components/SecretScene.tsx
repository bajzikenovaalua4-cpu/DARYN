import { useMemo, useState } from 'react';
import { buildFinalVerdict } from '../lib/finalVerdict';
import { t, type Language } from '../lib/i18n';
import type { CompletedNpc } from '../lib/novelProgress';

type SecretSceneProps = {
  language: Language;
  legalLiteracy: number;
  completed: CompletedNpc[];
  relationshipScores: Record<string, number>;
  onBack: () => void;
};

export function SecretScene({ language, legalLiteracy, completed, relationshipScores, onBack }: SecretSceneProps) {
  const [rewardOpen, setRewardOpen] = useState(false);
  const verdict = useMemo(
    () => buildFinalVerdict(completed, relationshipScores),
    [completed, relationshipScores],
  );

  return (
    <section className="vn-secret-scene">
      <div className="vn-panel vn-final-trial">
        <span className="vn-kicker">{t(language, 'secretLabel')}</span>
        <h1>Финальное испытание: суд выборов</h1>
        <p>{t(language, 'secretText')} {legalLiteracy} XP.</p>

        <div className="vn-final-stats" aria-label="Итоговая статистика прохождения">
          <span><b>{verdict.completedCount}/{verdict.totalCount}</b> дел закрыто</span>
          <span><b>{verdict.correctCount}</b> сильных решений</span>
          <span><b>{verdict.riskyCount}</b> рискованных решений</span>
          <span><b>{verdict.totalPoints}</b> XP заработано до магазина</span>
        </div>

        <section className="vn-final-grid">
          <FinalList title="Что сработало" items={verdict.goodChoices} emptyText="Хороших решений в сохранённой статистике не найдено." />
          <FinalList title="Где были ошибки" items={verdict.riskyChoices} emptyText="Рискованных решений не найдено. Подозрительно идеально." />
          <FinalList title="Доверие выросло" items={verdict.bestTrust} emptyText="Ни у кого доверие заметно не выросло." showTrust />
          <FinalList title="Отношения просели" items={verdict.weakTrust} emptyText="Сильно испорченных отношений не найдено." showTrust />
        </section>

        <article className="vn-final-verdict">
          <strong>{verdict.verdict}</strong>
          <p>{verdict.memeLine}</p>
        </article>

        {rewardOpen ? (
          <figure className="vn-final-reward">
            <img src="/assets/rewards/final-iq-verdict.jpg" alt="Финальная мемная награда Total IQ 12" />
            <figcaption>Награда за прохождение всего секретного уровня</figcaption>
          </figure>
        ) : (
          <button className="vn-primary" onClick={() => setRewardOpen(true)}>Забрать мемную награду</button>
        )}

        <button className="vn-secondary" onClick={onBack}>{t(language, 'toLocations')}</button>
      </div>
    </section>
  );
}

type FinalListProps = {
  title: string;
  items: Array<{
    npcName: string;
    storyTitle: string;
    choiceText: string;
    relationshipScore: number;
    note: string;
  }>;
  emptyText: string;
  showTrust?: boolean;
};

function FinalList({ title, items, emptyText, showTrust = false }: FinalListProps) {
  return (
    <article className="vn-final-card">
      <h2>{title}</h2>
      {items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li key={`${title}-${item.npcName}-${item.choiceText}`}>
              <b>{item.npcName}</b>
              <span>{item.storyTitle}</span>
              <p>{showTrust ? `Доверие: ${item.relationshipScore}` : item.choiceText}</p>
              <small>{item.note}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>{emptyText}</p>
      )}
    </article>
  );
}
