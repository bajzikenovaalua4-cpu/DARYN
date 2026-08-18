import { useMemo, useState } from 'react';
import { t, type Language } from '../lib/i18n';
import { getNpcCaseReactionLines } from '../lib/npcRelationshipData';
import type { CaseAction, CaseEvidence, CaseSequenceStep, NovelChoice, NovelNpc } from '../lib/visualNovelData';

type LegalCasePanelProps = {
  language: Language;
  npc: NovelNpc;
  playerName: string;
  hintAvailable?: boolean;
  onUseHint?: () => void;
  relationshipScore?: number;
  onComplete: (choice: NovelChoice) => void;
};

type Step = 'action' | 'action-result' | 'evidence' | 'evidence-result' | 'sequence' | 'sequence-result' | 'final';

export function LegalCasePanel({ language, npc, playerName, hintAvailable = false, onUseHint, onComplete }: LegalCasePanelProps) {
  const legalCase = npc.legalCase;
  const [step, setStep] = useState<Step>('action');
  const [actionIds, setActionIds] = useState<string[]>([]);
  const [evidenceIds, setEvidenceIds] = useState<string[]>([]);
  const [sequenceIds, setSequenceIds] = useState<string[]>([]);
  const [hiddenActionIds, setHiddenActionIds] = useState<string[]>([]);
  const [hintUsedHere, setHintUsedHere] = useState(false);
  const actionOptions = useMemo(() => shuffle(legalCase?.actions ?? []), [legalCase]);
  const evidenceOptions = useMemo(() => shuffle(legalCase?.evidence ?? []), [legalCase]);
  const sequenceSteps = legalCase?.sequence ?? [];
  const sequenceOptions = useMemo(() => shuffle(sequenceSteps), [sequenceSteps]);

  if (!legalCase) return null;

  const multiAction = Boolean(legalCase.allowMultipleActions);
  const selectedActions = legalCase.actions.filter((item) => actionIds.includes(item.id));
  const actionCorrect = isActionSelectionCorrect(selectedActions, legalCase.actions, multiAction);
  const actionPoints = getActionPoints(selectedActions, legalCase.actions, legalCase.actionPoints, multiAction);
  const requiredIds = legalCase.evidence.filter((item) => item.required).map((item) => item.id);
  const evidenceCorrect = sameIds(evidenceIds, requiredIds);
  const hasSequence = sequenceSteps.length > 0;
  const sequenceCorrect = !hasSequence || sameIdsInOrder(sequenceIds, sequenceSteps.map((item) => item.id));
  const points = actionPoints + (evidenceCorrect ? legalCase.evidencePoints : 0);
  const caseSummary = buildCaseSummary(language, selectedActions, legalCase.actions, legalCase.evidence, evidenceIds, sequenceSteps, sequenceIds);
  const reactionLines = getNpcCaseReactionLines(npc.id, npc.name, caseSummary.percent, playerName);

  const completeCase = () => {
    onComplete({
      id: `${actionIds.join('+') || 'no-action'}:${evidenceIds.sort().join('-')}:${sequenceIds.join('-')}`,
      text: selectedActions.map((item) => item.text).join(' + ') || legalCase.question,
      correct: actionCorrect && evidenceCorrect && sequenceCorrect,
      points,
      explanation: buildExplanation(language, actionCorrect, evidenceCorrect, sequenceCorrect, legalCase.evidenceResult),
      law: legalCase.law,
    });
  };

  if (step === 'action') {
    return (
      <>
        <span className="vn-speaker">{npc.name}</span>
        <h2>{legalCase.question}</h2>
        {multiAction && <p>{t(language, 'actionsPrompt')}</p>}
        <div className="vn-choice-list">
          {actionOptions.filter((item) => !hiddenActionIds.includes(item.id)).map((item) => {
            if (multiAction) {
              const checked = actionIds.includes(item.id);

              return (
                <label key={item.id} className={checked ? 'vn-evidence is-selected' : 'vn-evidence'}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => setActionIds((ids) => toggleId(ids, item.id))}
                  />
                  <span>{item.text}</span>
                </label>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActionIds([item.id]);
                  setStep('action-result');
                }}
              >
                {item.text}
              </button>
            );
          })}
        </div>
        {multiAction && (
          <div className="vn-actions">
            {hintAvailable && !hintUsedHere && (
              <button className="vn-secondary" type="button" onClick={() => {
                setHiddenActionIds(getWrongActionIdsToHide(actionOptions));
                setHintUsedHere(true);
                onUseHint?.();
              }}>
                {t(language, 'useHint')}
              </button>
            )}
            <button
              className="vn-primary"
              type="button"
              disabled={actionIds.length === 0}
              onClick={() => setStep('action-result')}
            >
              {t(language, 'checkActions')}
            </button>
          </div>
        )}
      </>
    );
  }

  if (step === 'action-result' && selectedActions.length > 0) {
    return (
      <>
        <span className={actionCorrect ? 'vn-result good' : 'vn-result bad'}>
          {actionCorrect ? t(language, 'goodActions') : t(language, 'riskyActions')}
        </span>
        <h2>+{actionPoints} {t(language, 'legalLiteracy')}</h2>
        <div className="vn-evidence-review">
          {selectedActions.map((item) => (
            <article key={item.id} className={item.correct ? 'is-correct' : 'is-wrong'}>
              <b>{item.text}</b>
              <small>{item.explanation}</small>
            </article>
          ))}
        </div>
        <strong>{t(language, 'effects')}</strong>
        {selectedActions.map((item) => <p key={item.id}>{item.consequence}</p>)}
        <button className="vn-primary" type="button" onClick={() => setStep('evidence')}>
          {t(language, 'evidenceQuestion')}
        </button>
      </>
    );
  }

  if (step === 'evidence') {
    return (
      <>
        <span className="vn-speaker">{t(language, 'caseMaterials')}</span>
        <h2>{t(language, 'evidenceQuestion')}</h2>
        <div className="vn-evidence-list">
          {evidenceOptions.map((item) => {
            const checked = evidenceIds.includes(item.id);

            return (
              <label key={item.id} className={checked ? 'vn-evidence is-selected' : 'vn-evidence'}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => setEvidenceIds((ids) => toggleId(ids, item.id))}
                />
                <span>
                  <b>{item.title}</b>
                  <small>{item.description}</small>
                </span>
              </label>
            );
          })}
        </div>
        <div className="vn-actions">
          <button className="vn-secondary" type="button" onClick={() => setStep('action-result')}>
            {t(language, 'back')}
          </button>
          <button className="vn-primary" type="button" onClick={() => setStep('evidence-result')}>
            {t(language, 'checkEvidence')}
          </button>
        </div>
      </>
    );
  }

  if (step === 'evidence-result') {
    return (
      <>
        <span className={evidenceCorrect ? 'vn-result good' : 'vn-result bad'}>
          {evidenceCorrect ? t(language, 'evidenceGood') : t(language, 'evidenceBad')}
        </span>
        <h2>+{evidenceCorrect ? legalCase.evidencePoints : 0} {t(language, 'legalLiteracy')}</h2>
        <div className="vn-evidence-review">
          {legalCase.evidence.map((item) => (
            <article key={item.id} className={getEvidenceReviewClass(item, evidenceIds)}>
              <b>{item.title}</b>
              <small>{getEvidenceReviewText(language, item, evidenceIds.includes(item.id))}</small>
            </article>
          ))}
        </div>
        <p>{legalCase.evidenceResult}</p>
        <button className="vn-primary" type="button" onClick={() => setStep(hasSequence ? 'sequence' : 'final')}>
          {hasSequence ? t(language, 'order') : t(language, 'caseResult')}
        </button>
      </>
    );
  }

  if (step === 'sequence') {
    return (
      <>
        <span className="vn-speaker">{t(language, 'order')}</span>
        <h2>{language === 'ru' ? 'Расположите действия по порядку' : 'Әрекеттерді ретімен орналастыр'}</h2>
        <p>{language === 'ru' ? 'Нажимайте на шаги в том порядке, в котором их нужно выполнить.' : 'Қадамдарды орындау керек ретпен басыңыз.'}</p>
        <div className="vn-sequence-picked">
          {sequenceIds.length === 0 ? (
            <small>{language === 'ru' ? 'Порядок пока не выбран' : 'Рет әлі таңдалмады'}</small>
          ) : (
            sequenceIds.map((id, index) => <span key={id}>{index + 1}. {getSequenceStep(sequenceSteps, id)?.title}</span>)
          )}
        </div>
        <div className="vn-choice-list">
          {sequenceOptions.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={sequenceIds.includes(item.id)}
              onClick={() => setSequenceIds((ids) => [...ids, item.id])}
            >
              {item.title}
            </button>
          ))}
        </div>
        <div className="vn-actions">
          <button className="vn-secondary" type="button" onClick={() => setSequenceIds([])}>
            {language === 'ru' ? 'Сбросить' : 'Тазалау'}
          </button>
          <button
            className="vn-primary"
            type="button"
            disabled={sequenceIds.length !== sequenceSteps.length}
            onClick={() => setStep('sequence-result')}
          >
            {language === 'ru' ? 'Проверить порядок' : 'Ретті тексеру'}
          </button>
        </div>
      </>
    );
  }

  if (step === 'sequence-result') {
    return (
      <>
        <span className={sequenceCorrect ? 'vn-result good' : 'vn-result bad'}>
          {language === 'ru' ? (sequenceCorrect ? 'Порядок верный' : 'Порядок требует правки') : (sequenceCorrect ? 'Рет дұрыс' : 'Ретті түзету керек')}
        </span>
        <h2>{language === 'ru' ? 'Проверка последовательности' : 'Ретті тексеру'}</h2>
        <div className="vn-sequence-review">
          {sequenceSteps.map((correctStep, index) => {
            const selectedStep = getSequenceStep(sequenceSteps, sequenceIds[index]);
            const correct = selectedStep?.id === correctStep.id;

            return (
              <article key={correctStep.id} className={correct ? 'is-correct' : 'is-wrong'}>
                <b>{index + 1}. {selectedStep?.title ?? (language === 'ru' ? 'Шаг не выбран' : 'Қадам таңдалмады')}</b>
                <small>{correct ? correctStep.explanation : `${language === 'ru' ? 'На этом месте нужно' : 'Бұл жерде қажет'}: ${correctStep.title}. ${correctStep.explanation}`}</small>
              </article>
            );
          })}
        </div>
        <button className="vn-primary" type="button" onClick={() => setStep('final')}>
          {t(language, 'caseResult')}
        </button>
      </>
    );
  }

  return (
    <>
      <span className={caseSummary.percent >= 80 ? 'vn-result good' : 'vn-result bad'}>
        {t(language, 'caseDone')}
      </span>
      <h2>{t(language, 'result')}: {caseSummary.percent}%</h2>
      <div className="vn-case-summary">
        <span>{t(language, 'decision')}: {caseSummary.actionCorrect}/{caseSummary.actionTotal}</span>
        <span>{t(language, 'evidence')}: {caseSummary.evidenceCorrect}/{legalCase.evidence.length}</span>
        {hasSequence && <span>{t(language, 'order')}: {caseSummary.sequenceCorrect}/{sequenceSteps.length}</span>}
        <span>{t(language, 'errors')}: {caseSummary.errors}</span>
        <span>{t(language, 'earned')}: +{points} XP</span>
        <span>{t(language, 'result')}: {caseSummary.percent}%</span>
      </div>
      <div className="vn-case-details">
        <section>
          <strong>{t(language, 'selectedDecision')}</strong>
          <p>{selectedActions.map((item) => item.text).join(' / ') || legalCase.question}</p>
        </section>
        <section>
          <strong>{t(language, 'correctActions')}</strong>
          <ul className="vn-case-list">
            {caseSummary.correctActions.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
        <section>
          <strong>{t(language, 'wrongActions')}</strong>
          <ul className="vn-case-list">
            {caseSummary.wrongActions.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
        <section>
          <strong>{t(language, 'correctEvidence')}</strong>
          <ul className="vn-case-list">
            {caseSummary.correctEvidence.map((item) => <li key={item.id}>{item.title}</li>)}
          </ul>
        </section>
        <section>
          <strong>{t(language, 'explanation')}</strong>
          <p>{buildExplanation(language, actionCorrect, evidenceCorrect, sequenceCorrect, legalCase.evidenceResult)}</p>
        </section>
        <section>
          <strong>{t(language, 'possibleConsequences')}</strong>
          <ul className="vn-case-list">
            {caseSummary.consequences.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      </div>
      <strong>{t(language, 'lawKz')}</strong>
      <p>{legalCase.law}</p>
      <article className="vn-npc-reaction">
        {reactionLines.map((item) => (
          <p key={item.id}>
            <strong>{item.speaker}:</strong> {item.text}
          </p>
        ))}
      </article>
      <button className="vn-primary" type="button" onClick={completeCase}>
        {t(language, 'finishCase')}
      </button>
    </>
  );
}

function toggleId(ids: string[], id: string) {
  return ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
}

function sameIds(first: string[], second: string[]) {
  return first.length === second.length && first.every((id) => second.includes(id));
}

function sameIdsInOrder(first: string[], second: string[]) {
  return first.length === second.length && first.every((id, index) => id === second[index]);
}

function getSequenceStep(steps: CaseSequenceStep[], id: string | undefined) {
  return steps.find((item) => item.id === id);
}

function getEvidenceReviewClass(item: CaseEvidence, selectedIds: string[]) {
  const selected = selectedIds.includes(item.id);
  if (selected && item.required) return 'is-correct';
  if (!selected && !item.required) return 'is-correct';
  return 'is-wrong';
}

function getEvidenceReviewText(language: Language, item: CaseEvidence, selected: boolean) {
  if (selected && item.required) return `${language === 'ru' ? 'Выбрано верно' : 'Дұрыс таңдалды'}: ${item.description}`;
  if (selected && !item.required) return `${language === 'ru' ? 'Лишнее доказательство' : 'Артық дәлел'}: ${item.description}`;
  if (!selected && item.required) return `${language === 'ru' ? 'Пропущено важное доказательство' : 'Маңызды дәлел жіберілді'}: ${item.description}`;
  return `${language === 'ru' ? 'Верно не выбрано' : 'Дұрыс таңдалмады'}: ${item.description}`;
}

function getWrongActionIdsToHide(actions: CaseAction[]) {
  return actions.filter((item) => !item.correct).slice(0, 2).map((item) => item.id);
}

function isActionSelectionCorrect(selected: CaseAction[], allActions: CaseAction[], multiAction: boolean) {
  if (!multiAction) return selected.length === 1 && selected[0].correct;
  const requiredIds = allActions.filter((item) => item.correct).map((item) => item.id);
  return sameIds(selected.map((item) => item.id), requiredIds);
}

function getActionPoints(selected: CaseAction[], allActions: CaseAction[], maxPoints: number, multiAction: boolean) {
  if (!multiAction) return selected[0]?.correct ? maxPoints : 0;
  const correctCount = allActions.filter((item) => item.correct).length;
  const selectedCorrect = selected.filter((item) => item.correct).length;
  const selectedWrong = selected.filter((item) => !item.correct).length;
  const rawScore = selectedCorrect - selectedWrong;

  return Math.max(0, Math.round((rawScore / correctCount) * maxPoints));
}

function buildCaseSummary(
  language: Language,
  selectedActions: CaseAction[],
  allActions: CaseAction[],
  evidence: CaseEvidence[],
  selectedEvidenceIds: string[],
  sequence: CaseSequenceStep[],
  selectedSequenceIds: string[],
) {
  const actionTotal = allActions.filter((item) => item.correct).length;
  const actionCorrect = selectedActions.filter((item) => item.correct).length;
  const actionErrors = selectedActions.filter((item) => !item.correct).length + allActions.filter((item) => item.correct && !selectedActions.includes(item)).length;
  const evidenceCorrect = evidence.filter((item) => selectedEvidenceIds.includes(item.id) === item.required).length;
  const sequenceCorrect = sequence.filter((item, index) => selectedSequenceIds[index] === item.id).length;
  const totalChecks = actionTotal + evidence.length + sequence.length;
  const correctChecks = actionCorrect + evidenceCorrect + sequenceCorrect;
  const wrongSequence = sequence
    .map((item, index) => ({ item, index }))
    .filter(({ item, index }) => selectedSequenceIds[index] !== item.id);
  const correctEvidence = evidence.filter((item) => item.required && selectedEvidenceIds.includes(item.id));
  const missedEvidence = evidence.filter((item) => item.required && !selectedEvidenceIds.includes(item.id));
  const extraEvidence = evidence.filter((item) => !item.required && selectedEvidenceIds.includes(item.id));
  const correctActions = [
    ...selectedActions.filter((item) => item.correct).map((item) => item.text),
    ...sequence
      .map((item, index) => ({ item, index }))
      .filter(({ item, index }) => selectedSequenceIds[index] === item.id)
      .map(({ item, index }) => `${index + 1}. ${item.title}`),
  ];
  const wrongActions = [
    ...selectedActions.filter((item) => !item.correct).map((item) => item.text),
    ...allActions.filter((item) => item.correct && !selectedActions.includes(item)).map((item) => `${language === 'ru' ? 'Не выбрано' : 'Таңдалмады'}: ${item.text}`),
    ...wrongSequence.map(({ item, index }) => {
      const selected = getSequenceStep(sequence, selectedSequenceIds[index]);
      return `${index + 1}. ${language === 'ru' ? 'Выбрано' : 'Таңдалды'}: ${selected?.title ?? (language === 'ru' ? 'шаг не выбран' : 'қадам таңдалмады')}. ${language === 'ru' ? 'Нужно' : 'Қажет'}: ${item.title}`;
    }),
  ];
  const consequences = [
    ...selectedActions.map((item) => item.consequence),
    ...missedEvidence.map((item) => `${language === 'ru' ? 'Без доказательства' : 'Дәлелсіз'} "${item.title}" ${language === 'ru' ? 'позицию по делу будет сложнее подтвердить.' : 'істі дәлелдеу қиындайды.'}`),
    ...extraEvidence.map((item) => `${language === 'ru' ? 'Лишний материал' : 'Артық материал'} "${item.title}" ${language === 'ru' ? 'может отвлечь от главных обстоятельств дела.' : 'істің негізгі мәнінен алаңдатуы мүмкін.'}`),
    ...wrongSequence.map(({ item }) => `${language === 'ru' ? 'Если шаг' : 'Егер қадам'} "${item.title}" ${language === 'ru' ? 'сделать не вовремя, защита прав может затянуться.' : 'уақытында жасалмаса, құқықты қорғау созылуы мүмкін.'}`),
  ];

  return {
    actionCorrect,
    actionTotal,
    evidenceCorrect,
    sequenceCorrect,
    errors: actionErrors + (evidence.length - evidenceCorrect) + (sequence.length - sequenceCorrect),
    percent: Math.round((correctChecks / totalChecks) * 100),
    correctActions: correctActions.length > 0 ? correctActions : [language === 'ru' ? 'Правильных действий в этом прохождении нет.' : 'Бұл өтуде дұрыс әрекет жоқ.'],
    wrongActions: wrongActions.length > 0 ? wrongActions : [language === 'ru' ? 'Ошибочных действий нет.' : 'Қате әрекет жоқ.'],
    correctEvidence: correctEvidence.length > 0 ? correctEvidence : [{ id: 'none', title: language === 'ru' ? 'Подходящие доказательства не были выбраны.' : 'Қажетті дәлелдер таңдалмады.' }],
    consequences: consequences.length > 0 ? consequences : [language === 'ru' ? 'Ошибок нет: выбранный путь помогает решить дело законно.' : 'Қате жоқ: таңдалған жол істі заңды шешуге көмектеседі.'],
  };
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function buildExplanation(language: Language, actionCorrect: boolean, evidenceCorrect: boolean, sequenceCorrect: boolean, evidenceResult: string) {
  const actionText = actionCorrect
    ? language === 'ru' ? 'Действия выбраны верно.' : 'Әрекеттер дұрыс таңдалды.'
    : language === 'ru' ? 'В выбранных действиях есть ошибка: лишний или пропущенный шаг может ослабить защиту прав.' : 'Таңдалған әрекеттерде қате бар: артық немесе жіберілген қадам құқықты қорғауды әлсіретуі мүмкін.';
  const evidenceText = evidenceCorrect
    ? language === 'ru' ? 'Доказательства выбраны точно.' : 'Дәлелдер дұрыс таңдалды.'
    : language === 'ru' ? 'В наборе доказательств есть ошибка: не хватает важного документа или выбран лишний материал.' : 'Дәлелдерде қате бар: маңызды құжат жетіспейді немесе артық материал таңдалған.';
  const sequenceText = sequenceCorrect
    ? language === 'ru' ? 'Последовательность действий выстроена правильно.' : 'Әрекеттер реті дұрыс.'
    : language === 'ru' ? 'Последовательность нарушена: в юридическом кейсе важен не только шаг, но и момент.' : 'Әрекеттер реті бұзылған: құқықтық кейсте қадам ғана емес, оның уақыты да маңызды.';

  return `${actionText} ${evidenceText} ${sequenceText} ${evidenceResult}`;
}
