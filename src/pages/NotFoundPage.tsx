import { Link } from 'wouter';

export function NotFoundPage() {
  return (
    <main className="page narrow-page centered-page">
      <h1>Страница не найдена</h1>
      <p>Такого раздела в LegalAI пока нет.</p>
      <Link href="/" className="primary-action">На главную</Link>
    </main>
  );
}

