import { FormEvent, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { demoExamples } from '../lib/legalCases';
import { analyzeSituation, saveAnalysis } from '../lib/legalAnalysis';

function readExampleFromUrl() {
  return new URLSearchParams(window.location.search).get('example') ?? '';
}

export function AnalyzePage() {
  const [, navigate] = useLocation();
  const [text, setText] = useState(readExampleFromUrl);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = text.trim();

    if (question.length < 20) {
      setError('Опиши ситуацию чуть подробнее: что произошло, кто участники и что тебе сказали.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await analyzeSituation(question);
      saveAnalysis(result);
      navigate(`/result/${result.id}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="page narrow-page">
      <nav className="topbar">
        <Link href="/" className="brand">LegalAI</Link>
        <Link href="/history" className="nav-link">История</Link>
      </nav>

      <section className="analysis-card">
        <p className="eyebrow">Разбор ситуации</p>
        <h1>Что случилось?</h1>
        <form className="analysis-form" onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Например: купил телефон, он перестал работать через неделю, а продавец отказывается возвращать деньги..."
          />
          {error && <p className="error-text">{error}</p>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Анализируем...' : 'Проанализировать'}
          </button>
        </form>
      </section>

      <section className="quick-examples">
        <h2>Готовые примеры</h2>
        <div className="chip-list">
          {demoExamples.map((example) => (
            <button key={example.title} type="button" onClick={() => setText(example.text)}>
              {example.title}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

