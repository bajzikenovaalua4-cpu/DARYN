import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const authLandingPaths = new Set(['/', '/auth', '/register']);

export function AuthSessionRedirect() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;

    const shouldMoveToGame = () => (
      authLandingPaths.has(window.location.pathname)
      && (window.location.hash.includes('access_token') || window.location.search.includes('code='))
    );

    if (shouldMoveToGame()) {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) setLocation('/game');
      });
    }

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && authLandingPaths.has(window.location.pathname)) {
        setLocation('/game');
      }
    });

    return () => data.subscription.unsubscribe();
  }, [location, setLocation]);

  return null;
}
