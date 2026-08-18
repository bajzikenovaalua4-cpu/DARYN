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
import { languageKey, t, type Language } from '../lib/i18n';
import { defaultInterfaceTheme, type InterfaceThemeId } from '../lib/interfaceThemes';
import { getUsedItemId, hintItemId } from '../lib/shopData';
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

type GameScreen = 'setup' | 'welcome' | 'confirm' | 'locations' | 'scene' | 'dialogue' | 'reward' | 'secret' | 'shop';

const guestKey = 'law-quest-guest';
const guestUserId = 'guest';
const themeKey = 'law-quest-interface-theme';
const darkModeKey = 'law-quest-dark-mode';
const onboardingKey = 'law-quest-onboarding-seen';
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
  const [language, setLanguage] = useState<Language>(() => (
    (window.localStorage.getItem(languageKey) as Language | null) ?? 'ru'
  ));
  const [progress, setProgress] = useState<NovelProgress>(emptyProgress);
  const [isAuthReady, setIsAuthReady] = useState(!isSupabaseConfigured);
  const [isProgressLoading, setIsProgressLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [onboardingSeen, setOnboardingSeen] = useState(() => window.localStorage.getItem(onboardingKey) === 'true');
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
  const hintAvailable = progress.shopPurchases.includes(hintItemId) && !progress.shopPurchases.includes(getUsedItemId(hintItemId));

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;

    supabase.auth.getSession()
      .then(({ data }) => {
        setSession(data.session);
      })
      .catch(() => {
        setNotice('Не удалось проверить вход. Можно продолжить в гостевом режиме или обновить страницу.');
      })
      .finally(() => {
        setIsAuthReady(true);
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
    setIsProgressLoading(true);
    setNotice('');
    void loadSupabaseProgress(userId)
      .then((cloudProgress) => {
        if (cancelled || !cloudProgress) return;
        setProgress(cloudProgress);
        saveLocalProgress(userId, cloudProgress);
      })
      .catch(() => {
        if (!cancelled) {
          setNotice('Облачный прогресс сейчас не загрузился. Открыли локальную сохранённую версию.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsProgressLoading(false);
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

  const changeLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    window.localStorage.setItem(languageKey, nextLanguage);
  };

  const themeSettings = (
    <ThemeSettings
      value={interfaceTheme}
      onChange={changeInterfaceTheme}
      unlockedThemeIds={unlockedThemeIds}
      onLockedThemeClick={() => setScreen('shop')}
      darkMode={darkMode}
      onDarkModeChange={changeDarkMode}
      language={language}
      onLanguageChange={changeLanguage}
    />
  );

  const gameTools = (
    <>
      {themeSettings}
      {canPlay && <LegalScoreBadge score={progress.legalLiteracy} burstKey={scoreBurstKey} />}
      <ConstitutionBook />
    </>
  );

  const showCloudSaveNotice = (error: string | null) => {
    if (error) {
      setNotice('Сохранено на устройстве. Облачная синхронизация сейчас недоступна, попробуй позже.');
    }
  };

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
        nextProgress.relationshipScores,
      ).then(showCloudSaveNotice);
    }

    setScreen(onboardingSeen ? 'confirm' : 'welcome');
  };

  const resetPlayerSetup = () => {
    const nextProgress = { ...progress, profile: null };
    updateProgress(nextProgress);
    setScreen('setup');
  };

  const finishOnboarding = () => {
    window.localStorage.setItem(onboardingKey, 'true');
    setOnboardingSeen(true);
    setScreen('confirm');
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
      void saveProfileToSupabase(
        userId,
        progress.profile,
        legalLiteracy,
        progress.secretUnlocked,
        shopPurchases,
        shopSpent,
        progress.relationshipScores,
      )
        .then(showCloudSaveNotice);
    }
  };

  const applyShopItem = (itemId: string) => {
    const themeId = getShopThemeId(itemId);
    if (!themeId || !progress.shopPurchases.includes(itemId)) return;
    changeInterfaceTheme(themeId);
  };

  const useHintItem = () => {
    if (!progress.profile || !hintAvailable) return;
    const shopPurchases = [...progress.shopPurchases, getUsedItemId(hintItemId)];
    const nextProgress = { ...progress, shopPurchases };
    updateProgress(nextProgress);

    if (session) {
      void saveProfileToSupabase(
        userId,
        progress.profile,
        progress.legalLiteracy,
        progress.secretUnlocked,
        shopPurchases,
        progress.shopSpent,
        progress.relationshipScores,
      ).then(showCloudSaveNotice);
    }
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
    const relationshipScores = {
      ...progress.relationshipScores,
      [activeNpc.id]: Math.max(-4, Math.min(10, (progress.relationshipScores[activeNpc.id] ?? 0) + getRelationshipDelta(choice))),
    };
    const nextProgress = { ...progress, completed, legalLiteracy, relationshipScores, secretUnlocked };

    updateProgress(nextProgress);
    if (result.points > 0) setScoreBurstKey((value) => value + 1);

    if (session) {
      void saveNpcToSupabase(userId, result).then(showCloudSaveNotice);
      if (nextProgress.profile) {
        void saveProfileToSupabase(
          userId,
          nextProgress.profile,
          legalLiteracy,
          secretUnlocked,
          nextProgress.shopPurchases,
          nextProgress.shopSpent,
          relationshipScores,
        ).then(showCloudSaveNotice);
      }
    }

    setActiveNpc(null);
    setScreen(activeLocation.npcs.every((npc) => completed.some((item) => item.npcId === npc.id)) ? 'reward' : 'scene');
  };

  if (!isAuthReady) {
    return (
      <main className={shellClassName}>
        <section className="vn-panel vn-loading">
          <span className="vn-kicker">Law Quest KZ</span>
          <h1>Загружаем игру</h1>
          <p>Проверяем вход и подготавливаем сохранения.</p>
        </section>
      </main>
    );
  }

  const noticeBanner = (notice || isProgressLoading) && (
    <p className="vn-notice">{isProgressLoading ? 'Синхронизируем сохранение...' : notice}</p>
  );

  if (!canPlay) {
    return (
      <main className={shellClassName}>
        {gameTools}
        {noticeBanner}
        <NovelAuthGate session={session} />
      </main>
    );
  }

  if (!progress.profile || screen === 'setup') {
    return (
      <main className={shellClassName}>
        {gameTools}
        {noticeBanner}
        <CharacterSetup language={language} onComplete={completeSetup} onBack={exitToRegister} />
      </main>
    );
  }

  if (screen === 'welcome') {
    return (
      <main className={shellClassName}>
        {gameTools}
        {noticeBanner}
        <section className="vn-panel vn-onboarding">
          <span className="vn-kicker">{t(language, 'welcomeLabel')}</span>
          <h1>{t(language, 'welcomeTitle')}</h1>
          <p>{t(language, 'welcomeText')}</p>
          <button className="vn-primary" onClick={finishOnboarding}>{t(language, 'gotIt')}</button>
        </section>
      </main>
    );
  }

  if (screen === 'confirm') {
    const character = characters[progress.profile.characterId];

    return (
      <main className={shellClassName}>
        {gameTools}
        {noticeBanner}
        <section className="vn-panel vn-confirm">
          <button className="vn-secondary" onClick={resetPlayerSetup}>{t(language, 'back')}</button>
          <span className="vn-kicker">{t(language, 'step')} 4</span>
          <h1>{t(language, 'welcomePlayer')}, {progress.profile.name}.</h1>
          <img className="vn-confirm-image" src={character.preview} alt={character.title} />
          <p>{t(language, 'selectedCharacter')}: {character.title}.</p>
          {isGuest && <p className="guest-note">{t(language, 'guestNote')}</p>}
          <div className="vn-actions">
            <button className="vn-primary" onClick={() => setScreen('locations')}>{t(language, 'startGame')}</button>
            <button className="vn-secondary" onClick={resetPlayerSetup}>{t(language, 'changeCharacter')}</button>
          </div>
          <p className="vn-button-hint">{t(language, 'startHint')}</p>
        </section>
      </main>
    );
  }

  if (screen === 'dialogue' && activeNpc) {
    return (
      <main className={shellClassName}>
        {gameTools}
        {noticeBanner}
        <DialoguePanel
          language={language}
          location={activeLocation}
          npc={activeNpc}
          characterId={progress.profile.characterId}
          playerName={progress.profile.name}
          hintAvailable={hintAvailable}
          onUseHint={useHintItem}
          relationshipScore={progress.relationshipScores[activeNpc.id] ?? 0}
          completedBefore={completedNpcIds.includes(activeNpc.id)}
          onComplete={completeNpc}
          onCancel={() => setScreen('scene')}
        />
      </main>
    );
  }

  if (screen === 'reward') {
    const locationNpcIds = activeLocation.npcs.map((npc) => npc.id);
    const locationPoints = progress.completed
      .filter((item) => locationNpcIds.includes(item.npcId))
      .reduce((sum, item) => sum + item.points, 0);

    return (
      <main className={shellClassName}>
        {gameTools}
        {noticeBanner}
        <LocationReward
          language={language}
          location={activeLocation}
          earnedPoints={locationPoints}
          onContinue={() => setScreen('locations')}
        />
      </main>
    );
  }

  if (screen === 'secret') {
    return (
      <main className={shellClassName}>
        {gameTools}
        {noticeBanner}
        <SecretScene
          language={language}
          legalLiteracy={progress.legalLiteracy}
          completed={progress.completed}
          relationshipScores={progress.relationshipScores}
          onBack={() => setScreen('locations')}
        />
      </main>
    );
  }

  if (screen === 'shop') {
    return (
      <main className={shellClassName}>
        {gameTools}
        {noticeBanner}
        <ShopPanel
          language={language}
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
        {noticeBanner}
        <LocationScene
          language={language}
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
      {noticeBanner}
      <LocationSelect
        language={language}
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

function getRelationshipDelta(choice: NovelChoice) {
  if (choice.correct && choice.points >= 8) return 2;
  if (choice.correct) return 1;
  if (choice.points > 0) return 0;
  return -1;
}
