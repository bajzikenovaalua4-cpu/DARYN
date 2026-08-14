import { useState } from 'react';
import type { CaseAction, NovelChoice, NovelNpc } from '../lib/visualNovelData';

type LegalCasePanelProps = {
  npc: NovelNpc;
  onComplete: (choice: NovelChoice) => void;
};

type Step = 'action' | 'action-result' | 'evidence' | 'final';

export function LegalCasePanel({ npc, onComplete }: LegalCasePanelProps) {
  const legalCase = npc.legalCase;
  const [step, setStep] = useState<Step>('action');
  const [action, setAction] = useState<CaseAction | null>(null);
  const [evidenceIds, setEvidenceIds] = useState<string[]>([]);

  if (!legalCase) return null;

  const requiredIds = legalCase.evidence.filter((item) => item.required).map((item) => item.id);
  const evidenceCorrect = sameIds(evidenceIds, requiredIds);
  const points = (action?.correct ? legalCase.actionPoints : 0) + (evidenceCorrect ? legalCase.evidencePoints : 0);
  const maxPoints = legalCase.actionPoints + legalCase.evidencePoints;

  const completeCase = () => {
    onComplete({
      id: `${action?.id ?? 'no-action'}:${evidenceIds.sort().join('-')}`,
      text: action?.text ?? legalCase.question,
      correct: points === maxPoints,
      points,
      explanation: buildExplanation(action, evidenceCorrect, legalCase.evidenceResult),
      law: legalCase.law,
    });
  };

  if (step === 'action') {
    return (
      <>
        <span className="vn-speaker">{npc.name}</span>
        <h2>{legalCase.question}</h2>
        <div className="vn-choice-list">
          {legalCase.actions.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setAction(item);
                setStep('action-result');
              }}
            >
              {item.text}
            </button>
          ))}
        </div>
      </>
    );
  }

  if (step === 'action-result' && action) {
    return (
      <>
        <span className={action.correct ? 'vn-result good' : 'vn-result bad'}>
          {action.correct ? 'Хороший первый шаг' : 'Рискованный первый шаг'}
        </span>
        <h2>{action.correct ? `+${legalCase.actionPoints} юридической грамотности` : '+0 юридической грамотности'}</h2>
        <p>{action.explanation}</p>
        <strong>Возможное последствие</strong>
        <p>{action.consequence}</p>
        <button className="vn-primary" type="button" onClick={() => setStep('evidence')}>
          Перейти к доказательствам
        </button>
      </>
    );
  }

  if (step === 'evidence') {
    return (
      <>
        <span className="vn-speaker">Материалы дела</span>
        <h2>Какие доказательства вам понадобятся?</h2>
        <div className="vn-evidence-list">
          {legalCase.evidence.map((item) => {
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
            Назад
          </button>
          <button className="vn-primary" type="button" onClick={() => setStep('final')}>
            Проверить доказательства
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <span className={points === maxPoints ? 'vn-result good' : 'vn-result bad'}>
        {points === maxPoints ? 'Кейс решён полностью' : 'Кейс решён не полностью'}
      </span>
      <h2>+{points} юридической грамотности</h2>
      <p>{buildExplanation(action, evidenceCorrect, legalCase.evidenceResult)}</p>
      <strong>Законодательство РК</strong>
      <p>{legalCase.law}</p>
      <button className="vn-primary" type="button" onClick={completeCase}>
        Завершить дело
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

function buildExplanation(action: CaseAction | null, evidenceCorrect: boolean, evidenceResult: string) {
  const actionText = action?.correct
    ? 'Первое действие выбрано верно: нужно зафиксировать проблему письменно.'
    : 'Первое действие выбрано неудачно: оно может осложнить защиту прав.';
  const evidenceText = evidenceCorrect
    ? 'Доказательства выбраны точно.'
    : 'В наборе доказательств есть ошибка: либо не хватает важного документа, либо выбран лишний материал.';

  return `${actionText} ${evidenceText} ${evidenceResult}`;
}
