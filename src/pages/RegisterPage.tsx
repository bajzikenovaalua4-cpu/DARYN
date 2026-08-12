import { Link, useLocation } from 'wouter';
import { Auth } from '../components/Auth';

const guestKey = 'law-quest-guest';

export function RegisterPage() {
  const [, setLocation] = useLocation();

  const enterAsGuest = () => {
    window.localStorage.setItem(guestKey, 'true');
    setLocation('/game');
  };

  return (
    <main className="page register-page">
      <nav className="topbar">
        <Link href="/home" className="brand">LegalAI</Link>
        <div className="nav-group">
          <Link href="/auth" className="nav-link">Войти</Link>
          <Link href="/home" className="nav-link">На главную</Link>
        </div>
      </nav>

      <section className="register-layout">
        <aside className="register-info">
          <span>Law Quest KZ</span>
          <h1>Создай профиль и начни своё дело</h1>
          <p>
            Платформа помогает изучать права через короткие игровые ситуации,
            визуальную новеллу и понятные объяснения законов.
          </p>
          <div className="register-benefits">
            <strong>Что сохранится в профиле</strong>
            <p>Выбор персонажа, имя игрока, прогресс и результаты прохождения.</p>
          </div>
        </aside>

        <div className="register-form-panel">
          <Auth initialMode="signup" />
          <button className="guest-button" onClick={enterAsGuest}>
            Войти как гость
          </button>
        </div>
      </section>
    </main>
  );
}
