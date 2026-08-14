import { useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { useLocation } from 'wouter';
import { CharacterSetup } from '../components/CharacterSetup';
import { ConstitutionBook } from '../components/ConstitutionBook';
import { DialoguePanel } from '../components/DialoguePanel';
import { LegalScoreBadge } from '../components/LegalScoreBadge';
import { LocationReward } from '../components/LocationReward';
import { LocationScene } from '../components/LocationScene';
import { LocationSelect } from '../components/LocationSelect';
import { NovelAuthGate } from '../components/NovelAuthGate';
import { SecretScene } from '../components/SecretScene';
import { ShopPanel } from '../components/ShopPanel';
import { ThemeSettings } from '../components/ThemeSettings';
import { characters } from '../lib/characters';
import { defaultInterfaceTheme, type InterfaceThemeId } from '../lib/interfaceThemes';
import {
  emptyProgress,
  loadLocalProgress,
  loadSupabaseProgress,
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

type GameScreen = 'setup' | 'confirm' | 'locations' | 'scene' | 'dialogue' | 'reward' | 'secret' | 'shop';

const guestKey = 'law-quest-guest';
const guestUserId = 'guest';
const themeKey = 'law-quest-interface-theme';
const darkModeKey = 'law-quest-dark-mode';
const shopThemeMap = {
  'theme-aurora': 'aurora',
  'theme-gold': 'gold',
} satisfies Record<string, InterfaceThemeId>;

export function GamePage() {
  const [, setLocation] = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [isGuest, setIsGuest] = useState(() => window.localStorage.getItem(guestKey) === 'true');
  const [interfaceTheme, setInterfaceTheme] = useState<InterfaceThemeId>(() => (
    (window.localStorage.getItem(themeKey) as InterfaceThemeId | null) ?? defaultInterfaceTheme
  ));
  const [darkMode, setDarkMode] = useState(() => window.localStorage.getItem(darkModeKey) === 'true');
  const [progress, setProgress] = useState<NovelProgress>(emptyProgress);
  const [scoreBurstKey, setScoreBurstKey] = useState(0);
  const [screen, setScreen] = useState<GameScreen>('setup');
  const [activeLocationId, setActiveLocationId] = useState<LocationId>('school');
  const [activeNpc, setActiveNpc] = useState<NovelNpc | null>(null);
  const userId = session?.user.id ?? guestUserId;
  const canPlay = Boolean(session) || isGuest;

  const activeLocation = useMemo(
    () => novelLocations.find((location) => location.id === activeLocationId) ?? novelLocations[0],
    [activeLocationId],
  );
  const shellClassName = `vn-shell theme-${interfaceTheme}${darkMode ? ' mode-dark' : ''}`;

  const completedNpcIds = useMemo(
    () => progress.completed.map((item) => item.npcId),
    [progress.completed],
  );

  const unlockedThemeIds = useMemo(
    () => progress.shopPurchases.map(getShopThemeId).filter((themeId): themeId is InterfaceThemeId => Boolean(themeId)),
    [progress.shopPurchases],
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

    if (!session) return;

    let cancelled = false;
    void loadSupabaseProgress(userId).then((cloudProgress) => {
      if (cancelled || !cloudProgress) return;
      setProgress(cloudProgress);
      saveLocalProgress(userId, cloudProgress);
    });

    return () => {
      cancelled = true;
    };
  }, [canPlay, session, userId]);

  const updateProgress = (nextProgress: NovelProgress) => {
    setProgress(nextProgress);
    saveLocalProgress(userId, nextProgress);
  };

  const changeInterfaceTheme = (themeId: InterfaceThemeId) => {
    setInterfaceTheme(themeId);
    window.localStorage.setItem(themeKey, themeId);
  };

  const changeDarkMode = (enabled: boolean) => {
    setDarkMode(enabled);
    window.localStorage.setItem(darkModeKey, String(enabled));
  };

  const themeSettings = (
    <ThemeSettings
      value={interfaceTheme}
      onChange={changeInterfaceTheme}
      unlockedThemeIds={unlockedThemeIds}
      onLockedThemeClick={() => setScreen('shop')}
      darkMode={darkMode}
      onDarkModeChange={changeDarkMode}
    />
  );

  const gameTools = (
    <>
      {themeSettings}
      {canPlay && <LegalScoreBadge score={progress.legalLiteracy} burstKey={scoreBurstKey} />}
      <ConstitutionBook />
    </>
  );

  const completeSetup = (profile: PlayerProfile) => {
    const nextProgress = { ...progress, profile };
    updateProgress(nextProgress);

    if (session) {
      void saveProfileToSupabase(
        userId,
        profile,
        nextProgress.legalLiteracy,
        nextProgress.secretUnlocked,
        nextProgress.shopPurchases,
        nextProgress.shopSpent,
      );
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

  const buyShopItem = (itemId: string, price: number) => {
    if (!progress.profile || progress.shopPurchases.includes(itemId) || progress.legalLiteracy < price) return;

    const shopPurchases = [...progress.shopPurchases, itemId];
    const shopSpent = progress.shopSpent + price;
    const legalLiteracy = progress.legalLiteracy - price;
    const nextProgress = { ...progress, shopPurchases, shopSpent, legalLiteracy };
    updateProgress(nextProgress);

    if (session) {
      void saveProfileToSupabase(userId, progress.profile, legalLiteracy, progress.secretUnlocked, shopPurchases, shopSpent);
    }
  };

  const applyShopItem = (itemId: string) => {
    const themeId = getShopThemeId(itemId);
    if (!themeId || !progress.shopPurchases.includes(itemId)) return;
    changeInterfaceTheme(themeId);
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
    const earnedXp = completed.reduce((sum, item) => sum + item.points, 0);
    const legalLiteracy = Math.max(0, earnedXp - progress.shopSpent);
    const secretUnlocked = completed.length >= totalNpcCount;
    const nextProgress = { ...progress, completed, legalLiteracy, secretUnlocked };

    updateProgress(nextProgress);
    if (result.points > 0) {
      setScoreBurstKey((value) => value + 1);
    }

    if (session) {
      void saveNpcToSupabase(userId, result);
      if (nextProgress.profile) {
        void saveProfileToSupabase(
          userId,
          nextProgress.profile,
          legalLiteracy,
          secretUnlocked,
          nextProgress.shopPurchases,
          nextProgress.shopSpent,
        );
      }
    }

    setActiveNpc(null);
    setScreen(activeLocation.npcs.every((npc) => completed.some((item) => item.npcId === npc.id)) ? 'reward' : 'scene');
  };

  if (!canPlay) {
    return (
      <main className={shellClassName}>
        {gameTools}
        <NovelAuthGate session={session} />
      </main>
    );
  }

  if (!progress.profile || screen === 'setup') {
    return (
      <main className={shellClassName}>
        {gameTools}
        <CharacterSetup onComplete={completeSetup} onBack={exitToRegister} />
      </main>
    );
  }

  if (screen === 'confirm') {
    const character = characters[progress.profile.characterId];

    return (
      <main className={shellClassName}>
        {gameTools}
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
        {gameTools}
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
        {gameTools}
        <LocationReward location={activeLocation} onContinue={() => setScreen('locations')} />
      </main>
    );
  }

  if (screen === 'secret') {
    return (
      <main className={shellClassName}>
        {gameTools}
        <SecretScene legalLiteracy={progress.legalLiteracy} onBack={() => setScreen('locations')} />
      </main>
    );
  }

  if (screen === 'shop') {
    return (
      <main className={shellClassName}>
        {gameTools}
        <ShopPanel
          xp={progress.legalLiteracy}
          purchasedIds={progress.shopPurchases}
          activeThemeItemId={getActiveThemeItemId(interfaceTheme)}
          onBuy={buyShopItem}
          onApply={applyShopItem}
          onBack={() => setScreen('locations')}
        />
      </main>
    );
  }

  if (screen === 'scene') {
    return (
      <main className={shellClassName}>
        {gameTools}
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
      {gameTools}
      <LocationSelect
        locations={novelLocations}
        completedNpcIds={completedNpcIds}
        secretUnlocked={progress.secretUnlocked}
        onSelect={openLocation}
        onSecret={() => setScreen('secret')}
        onShop={() => setScreen('shop')}
        onBack={() => setScreen('confirm')}
      />
    </main>
  );
}

function getActiveThemeItemId(themeId: InterfaceThemeId) {
  return Object.entries(shopThemeMap).find(([, value]) => value === themeId)?.[0] ?? null;
}

function getShopThemeId(itemId: string): InterfaceThemeId | null {
  return itemId in shopThemeMap ? shopThemeMap[itemId as keyof typeof shopThemeMap] : null;
}
