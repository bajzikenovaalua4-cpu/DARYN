import { Link, useRoute } from 'wouter';
import { findAnalysis } from '../lib/legalAnalysis';

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="result-block">
      <h2>{title}</h2>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}

export function ResultPage() {
  const [, params] = useRoute('/result/:id');
  const analysis = params?.id ? findAnalysis(params.id) : undefined;

  if (!analysis) {
    return (
      <main className="page narrow-page centered-page">
        <h1>Разбор не найден</h1>
        <p>Возможно, история была очищена в браузере.</p>
        <Link href="/analyze" className="primary-action">Создать новый разбор</Link>
      </main>
    );
  }

  return (
    <main className="page narrow-page">
      <nav className="topbar">
        <Link href="/" className="brand">LegalAI</Link>
        <Link href="/history" className="nav-link">История</Link>
      </nav>

      <section className="result-hero">
        <span>{analysis.category}</span>
        <h1>{analysis.title}</h1>
        <p>{analysis.summary}</p>
      </section>

      <section className="original-question">
        <h2>Ваша ситуация</h2>
        <p>{analysis.question}</p>
      </section>

      <section className="result-block">
        <h2>Что это значит</h2>
        <p>{analysis.meaning}</p>
      </section>

      <ListBlock title="Ваши возможные права" items={analysis.rights} />
      <ListBlock title="Что можно сделать" items={analysis.steps} />

      <aside className="warning-box">
        Это справочная информация для учебного MVP. Она не является юридической консультацией и не заменяет обращение к юристу.
      </aside>
    </main>
  );
}

