import { Link } from 'wouter';
import { loadHistory } from '../lib/legalAnalysis';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function HistoryPage() {
  const history = loadHistory();

  return (
    <main className="page narrow-page">
      <nav className="topbar">
        <Link href="/" className="brand">LegalAI</Link>
        <Link href="/analyze" className="nav-link">Новый разбор</Link>
      </nav>

      <section className="section-heading history-heading">
        <h1>История анализов</h1>
        <p>Здесь хранятся последние разборы на этом устройстве.</p>
      </section>

      {history.length === 0 ? (
        <section className="empty-state">
          <h2>Пока пусто</h2>
          <p>Создай первый разбор, и он появится здесь.</p>
          <Link href="/analyze" className="primary-action">Разобрать ситуацию</Link>
        </section>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <Link key={item.id} href={`/result/${item.id}`} className="history-item">
              <span>{item.category}</span>
              <strong>{item.title}</strong>
              <p>{item.question}</p>
              <time>{formatDate(item.createdAt)}</time>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

