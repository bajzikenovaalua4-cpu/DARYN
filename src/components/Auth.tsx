import type { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { SupabaseSetupMessage } from './SupabaseSetupMessage';

type AuthMode = 'signin' | 'signup';

type AuthProps = {
  initialMode?: AuthMode;
  allowModeSwitch?: boolean;
  redirectTo?: string;
};

export function Auth({ initialMode = 'signin', allowModeSwitch = true, redirectTo = '/game' }: AuthProps) {
  const [, setLocation] = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;

    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured) return <SupabaseSetupMessage />;

  async function signInWithGoogle() {
    setBusy(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}${redirectTo}` },
    });
    if (error) {
      setMessage(error.message);
      setBusy(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage('');

    const result = mode === 'signup'
      ? await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}${redirectTo}` },
        })
      : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setMessage(result.error.message);
      setBusy(false);
      return;
    }

    if (mode === 'signup' && !result.data.session) {
      setMessage('Готово! Проверь почту, если Supabase попросит подтвердить email.');
      setBusy(false);
      return;
    }

    setBusy(false);
    setLocation(redirectTo);
  }

  async function signOut() {
    setBusy(true);
    await supabase.auth.signOut();
    setBusy(false);
  }

  if (session) {
    const name = session.user.user_metadata.full_name as string | undefined;
    const avatar = session.user.user_metadata.avatar_url as string | undefined;

    return (
      <section className="auth-card">
        <div className="auth-profile">
          {avatar ? <img src={avatar} alt="" /> : <span>{(name ?? session.user.email ?? 'U').slice(0, 1)}</span>}
          <div>
            <p>Вы вошли</p>
            <h2>{name ?? session.user.email}</h2>
          </div>
        </div>
        <button className="primary-action auth-full-button" onClick={() => setLocation(redirectTo)}>
          Продолжить
        </button>
        <button className="secondary-action auth-full-button" onClick={signOut} disabled={busy}>
          Выйти
        </button>
      </section>
    );
  }

  return (
    <section className="auth-card">
      <div className="auth-heading">
        <span>Аккаунт</span>
        <h1>{mode === 'signin' ? 'Войти в проект' : 'Создать аккаунт'}</h1>
        <p>Войди через Google или используй email и пароль.</p>
      </div>

      <button className="google-button" onClick={signInWithGoogle} disabled={busy}>
        <span>G</span>
        Войти через Google
      </button>

      <div className="auth-divider">или</div>

      <form onSubmit={handleSubmit} className="auth-form">
        <input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <input
          type="password"
          placeholder="Пароль, минимум 6 символов"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={6}
          required
        />
        <button type="submit" disabled={busy}>
          {busy ? 'Подожди...' : mode === 'signin' ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </form>

      {message && <p className="message">{message}</p>}

      {allowModeSwitch && (
        <button className="auth-switch" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
          {mode === 'signin' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
        </button>
      )}
    </section>
  );
}
