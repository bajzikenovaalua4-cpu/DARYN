import type { LegalEvent } from '../lib/lawGameData';

type LawCaseDialogProps = {
  event: LegalEvent;
  selected: number | null;
  onChoose: (index: number) => void;
  onClose: () => void;
};

export function LawCaseDialog({ event, selected, onChoose, onClose }: LawCaseDialogProps) {
  const choice = selected === null ? null : event.choices[selected];

  return (
    <div className="game-modal" role="dialog" aria-modal="true">
      <div className="game-dialog">
        <div className="dialog-heading">
          <span>{event.location} · {event.category}</span>
          <h2>{event.title}</h2>
          <p><b>{event.speaker}:</b> {event.description}</p>
        </div>

        <div className="choice-list">
          {event.choices.map((item, index) => (
            <button
              key={item.text}
              className={selected === index ? 'choice-button choice-button--picked' : 'choice-button'}
              onClick={() => onChoose(index)}
              disabled={selected !== null}
            >
              {item.text}
            </button>
          ))}
        </div>

        {choice && (
          <section className={choice.correct ? 'lesson lesson--good' : 'lesson lesson--bad'}>
            <h3>{choice.correct ? 'Правильно' : 'Неправильно'}</h3>
            <p>{choice.result}</p>
            <div className="know-box">
              <strong>Что нужно знать</strong>
              <p><b>Нарушение:</b> {event.lesson.violation}</p>
              <p><b>Последствие:</b> {event.lesson.consequence}</p>
              <p><b>Норма:</b> {event.lesson.norm}</p>
              <p><b>Почему:</b> {event.lesson.why}</p>
              <p><b>Источник:</b> {event.lesson.source}</p>
            </div>
            <button className="primary-action dialog-action" onClick={onClose}>Продолжить</button>
          </section>
        )}
      </div>
    </div>
  );
}
