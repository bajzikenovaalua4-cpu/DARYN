import { Link } from 'wouter';
import { Auth } from '../components/Auth';

export function AuthPage() {
  return (
    <main className="page narrow-page">
      <nav className="topbar">
        <Link href="/home" className="brand">LegalAI</Link>
        <Link href="/home" className="nav-link">На главную</Link>
      </nav>
      <Auth allowModeSwitch={false} />
    </main>
  );
}
