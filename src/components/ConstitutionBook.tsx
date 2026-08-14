import { useState } from 'react';
import { constitutionChapters } from '../lib/constitutionGuide';

export function ConstitutionBook() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState(constitutionChapters[0]?.id ?? '');
  const activeChapter = constitutionChapters.find((chapter) => chapter.id === activeId) ?? constitutionChapters[0];

  return (
    <aside className={isOpen ? 'constitution-book is-open' : 'constitution-book'} aria-label="Конституция Республики Казахстан">
      <button
        className="constitution-toggle"
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
      >
        <span>КРК</span>
      </button>

      <div className="constitution-panel" aria-hidden={!isOpen}>
        <header>
          <span>Интерактивная книга</span>
          <button type="button" onClick={() => setIsOpen(false)}>Закрыть</button>
          <h2>Конституция РК</h2>
          <p>Коротко о правах, свободах и обязанностях граждан простым языком.</p>
        </header>

        <div className="constitution-layout">
          <nav aria-label="Содержание Конституции">
            {constitutionChapters.map((chapter) => (
              <button
                key={chapter.id}
                className={chapter.id === activeChapter.id ? 'is-active' : ''}
                type="button"
                onClick={() => setActiveId(chapter.id)}
              >
                <b>{chapter.title}</b>
                <small>{chapter.articles}</small>
              </button>
            ))}
          </nav>

          <section>
            <span>{activeChapter.articles}</span>
            <h3>{activeChapter.title}</h3>
            <p>{activeChapter.summary}</p>
            <ul>
              {activeChapter.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <small>
              Учебное объяснение по Конституции РК. Для точной формулировки смотри официальный текст на adilet.zan.kz.
            </small>
          </section>
        </div>
      </div>
    </aside>
  );
}
