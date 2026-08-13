import { useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { useLocation } from 'wouter';
import { CharacterSetup } from '../components/CharacterSetup';
import { DialoguePanel } from '../components/DialoguePanel';
import { LocationReward } from '../components/LocationReward';
import { LocationScene } from '../components/LocationScene';
import { LocationSelect } from '../components/LocationSelect';
import { NovelAuthGate } from '../components/NovelAuthGate';
import { SecretScene } from '../components/SecretScene';
import { ThemeSettings } from '../components/ThemeSettings';
import { characters } from '../lib/characters';
import { defaultInterfaceTheme, type InterfaceThemeId } from '../lib/interfaceThemes';
import {
  emptyProgress,
  loadLocalProgress,
  saveLocalProgress,
  saveNpcToSupabase,
  saveProfileToSupabase,
  type CompletedNpc,
  type NovelProgress,
} from '../lib/novelProgress';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import {
  novelLocations,
  totalNpcCount,
  type LocationId,
  type NovelChoice,
  type NovelNpc,
  type PlayerProfile,
} from '../lib/visualNovelData';

type GameScreen = 'setup' | 'confirm' | 'locations' | 'scene' | 'dialogue' | 'reward' | 'secret';

const guestKey = 'law-quest-guest';
const guestUserId = 'guest';
const themeKey = 'law-quest-interface-theme';

export function GamePage() {
  const [, setLocation] = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [isGuest, setIsGuest] = useState(() => window.localStorage.getItem(guestKey) === 'true');
  const [interfaceTheme, setInterfaceTheme] = useState<InterfaceThemeId>(() => (
    (window.localStorage.getItem(themeKey) as InterfaceThemeId | null) ?? defaultInterfaceTheme
  ));
  const [progress, setProgress] = useState<NovelProgress>(emptyProgress);
  const [screen, setScreen] = useState<GameScreen>('setup');
  const [activeLocationId, setActiveLocationId] = useState<LocationId>('school');
  const [activeNpc, setActiveNpc] = useState<NovelNpc | null>(null);
  const userId = session?.user.id ?? guestUserId;
  const canPlay = Boolean(session) || isGuest;

  const activeLocation = useMemo(
    () => novelLocations.find((location) => location.id === activeLocationId) ?? novelLocations[0],
    [activeLocationId],
  );
  const shellClassName = `vn-shell theme-${interfaceTheme}`;

  const completedNpcIds = useMemo(
    () => progress.completed.map((item) => item.npcId),
    [progress.completed],
  );

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) {
        setIsGuest(false);
        window.localStorage.removeItem(guestKey);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!canPlay) return;
    const saved = loadLocalProgress(userId);
    setProgress(saved);
    setScreen('setup');
  }, [canPlay, userId]);

  const updateProgress = (nextProgress: NovelProgress) => {
    setProgress(nextProgress);
    saveLocalProgress(userId, nextProgress);
  };

  const changeInterfaceTheme = (themeId: InterfaceThemeId) => {
    setInterfaceTheme(themeId);
    window.localStorage.setItem(themeKey, themeId);
  };

  const themeSettings = (
    <ThemeSettings value={interfaceTheme} onChange={changeInterfaceTheme} />
  );

  const completeSetup = (profile: PlayerProfile) => {
    const nextProgress = { ...progress, profile };
    updateProgress(nextProgress);

    if (session) {
      void saveProfileToSupabase(userId, profile, nextProgress.legalLiteracy, nextProgress.secretUnlocked);
    }

    setScreen('confirm');
  };

  const resetPlayerSetup = () => {
    const nextProgress = { ...progress, profile: null };
    updateProgress(nextProgress);
    setScreen('setup');
  };

  const exitToRegister = () => {
    if (isGuest) window.localStorage.removeItem(guestKey);
    setLocation('/register');
  };

  const openLocation = (locationId: LocationId) => {
    setActiveLocationId(locationId);
    setScreen('scene');
  };

  const completeNpc = (choice: NovelChoice) => {
    if (!activeNpc) return;

    const result: CompletedNpc = {
      locationId: activeLocation.id,
      npcId: activeNpc.id,
      choiceId: choice.id,
      correct: choice.correct,
      points: choice.points,
      completedAt: new Date().toISOString(),
    };

    const completed = [...progress.completed.filter((item) => item.npcId !== activeNpc.id), result];
    const legalLiteracy = completed.reduce((sum, item) => sum + item.points, 0);
    const secretUnlocked = completed.length >= totalNpcCount;
    const nextProgress = { ...progress, completed, legalLiteracy, secretUnlocked };

    updateProgress(nextProgress);
    if (session) {
      void saveNpcToSupabase(userId, result);
      if (nextProgress.profile) {
        void saveProfileToSupabase(userId, nextProgress.profile, legalLiteracy, secretUnlocked);
      }
    }

    setActiveNpc(null);
    setScreen(activeLocation.npcs.every((npc) => completed.some((item) => item.npcId === npc.id)) ? 'reward' : 'scene');
  };

  if (!canPlay) {
    return (
      <main className={shellClassName}>
        {themeSettings}
        <NovelAuthGate session={session} />
      </main>
    );
  }

  if (!progress.profile || screen === 'setup') {
    return (
      <main className={shellClassName}>
        {themeSettings}
        <CharacterSetup onComplete={completeSetup} onBack={exitToRegister} />
      </main>
    );
  }

  if (screen === 'confirm') {
    const character = characters[progress.profile.characterId];

    return (
      <main className={shellClassName}>
        {themeSettings}
        <section className="vn-panel vn-confirm">
          <button className="vn-secondary" onClick={resetPlayerSetup}>Назад</button>
          <span className="vn-kicker">Шаг 4</span>
          <h1>Добро пожаловать, {progress.profile.name}.</h1>
          <img className="vn-confirm-image" src={character.preview} alt={character.title} />
          <p>Выбран персонаж: {character.title}.</p>
          {isGuest && <p className="guest-note">Гостевой режим: прогресс хранится только на этом устройстве.</p>}
          <div className="vn-actions">
            <button className="vn-primary" onClick={() => setScreen('locations')}>Начать игру</button>
            <button className="vn-secondary" onClick={resetPlayerSetup}>Сменить персонажа</button>
          </div>
        </section>
      </main>
    );
  }

  if (screen === 'dialogue' && activeNpc) {
    return (
      <main className={shellClassName}>
        {themeSettings}
        <DialoguePanel
          location={activeLocation}
          npc={activeNpc}
          characterId={progress.profile.characterId}
          playerName={progress.profile.name}
          onComplete={completeNpc}
          onCancel={() => setScreen('scene')}
        />
      </main>
    );
  }

  if (screen === 'reward') {
    return (
      <main className={shellClassName}>
        {themeSettings}
        <LocationReward location={activeLocation} onContinue={() => setScreen('locations')} />
      </main>
    );
  }

  if (screen === 'secret') {
    return (
      <main className={shellClassName}>
        {themeSettings}
        <SecretScene legalLiteracy={progress.legalLiteracy} onBack={() => setScreen('locations')} />
      </main>
    );
  }

  if (screen === 'scene') {
    return (
      <main className={shellClassName}>
        {themeSettings}
        <LocationScene
          location={activeLocation}
          characterId={progress.profile.characterId}
          playerName={progress.profile.name}
          completedNpcIds={completedNpcIds}
          onNpcClick={(npc) => {
            setActiveNpc(npc);
            setScreen('dialogue');
          }}
          onBack={() => setScreen('locations')}
        />
      </main>
    );
  }

  return (
    <main className={shellClassName}>
      {themeSettings}
      <LocationSelect
        locations={novelLocations}
        completedNpcIds={completedNpcIds}
        secretUnlocked={progress.secretUnlocked}
        onSelect={openLocation}
        onSecret={() => setScreen('secret')}
        onBack={() => setScreen('confirm')}
      />
    </main>
  );
}
