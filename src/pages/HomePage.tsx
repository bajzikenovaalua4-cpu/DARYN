import { Link } from 'wouter';
import { demoExamples } from '../lib/legalCases';

export function HomePage() {
  return (
    <main className="page home-page">
      <nav className="topbar">
        <Link href="/home" className="brand">LegalAI</Link>
        <div className="nav-group">
          <Link href="/auth" className="nav-link">Войти</Link>
          <Link href="/register" className="nav-link">Регистрация</Link>
          <Link href="/register" className="nav-link">Игра</Link>
          <Link href="/history" className="nav-link">История</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero__content">
          <p className="eyebrow">Юридический помощник для учебного проекта</p>
          <h1>LegalAI</h1>
          <p className="hero__text">
            Опиши ситуацию простыми словами, а приложение подскажет тему,
            возможные права и следующие шаги.
          </p>
          <div className="hero-actions">
            <Link href="/analyze" className="primary-action">Разобрать ситуацию</Link>
            <Link href="/register" className="secondary-action">Играть в Юрфак</Link>
          </div>
        </div>
        <div className="hero__panel">
          <span>AI-анализ</span>
          <strong>Понятно, спокойно, по шагам</strong>
          <p>Не заменяет юриста, но помогает подготовиться к разговору и не потеряться в проблеме.</p>
        </div>
      </section>

      <section className="examples-section">
        <div className="section-heading">
          <h2>Примеры вопросов</h2>
          <p>Можно начать с похожей ситуации и изменить текст под себя.</p>
        </div>
        <div className="example-grid">
          {demoExamples.map((example) => (
            <Link key={example.title} href={`/analyze?example=${encodeURIComponent(example.text)}`} className="example-card">
              <strong>{example.title}</strong>
              <span>{example.text}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
