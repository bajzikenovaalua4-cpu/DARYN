import type { Session } from '@supabase/supabase-js';
import { Link } from 'wouter';
import { SupabaseSetupMessage } from './SupabaseSetupMessage';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

type NovelAuthGateProps = {
  session: Session | null;
};

export function NovelAuthGate({ session }: NovelAuthGateProps) {
  if (!isSupabaseConfigured) return <SupabaseSetupMessage />;
  if (session) return null;

  const signInWithGoogle = () => {
    void supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/game` },
    });
  };

  return (
    <section className="vn-panel vn-auth">
      <span className="vn-kicker">Law Quest KZ</span>
      <h1>Войди, чтобы начать дело</h1>
      <p>Прогресс визуальной новеллы сохраняется в твоём профиле Supabase.</p>
      <div className="vn-actions">
        <button className="vn-primary" onClick={signInWithGoogle}>Войти через Google</button>
        <Link className="vn-secondary" href="/auth">Войти по email</Link>
      </div>
    </section>
  );
}
