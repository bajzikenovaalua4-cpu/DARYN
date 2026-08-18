import { isSupabaseConfigured, supabase } from './supabase';
import type { CharacterId } from './characters';
import type { LocationId, PlayerGender, PlayerProfile } from './visualNovelData';

export type CompletedNpc = {
  locationId: LocationId;
  npcId: string;
  choiceId: string;
  correct: boolean;
  points: number;
  completedAt: string;
};

export type NovelProgress = {
  profile: PlayerProfile | null;
  completed: CompletedNpc[];
  legalLiteracy: number;
  shopPurchases: string[];
  shopSpent: number;
  relationshipScores: Record<string, number>;
  secretUnlocked: boolean;
};

const baseKey = 'law-quest-visual-novel';

type ProfileRow = {
  player_name: string;
  character_id: CharacterId;
  gender: PlayerGender;
  legal_literacy: number;
  shop_purchases?: string[];
  shop_spent?: number;
  relationship_scores?: Record<string, number>;
  secret_unlocked: boolean;
};

type NpcProgressRow = {
  location_id: LocationId;
  npc_id: string;
  answers: Array<{
    choiceId?: string;
    correct?: boolean;
    points?: number;
    completedAt?: string;
  }>;
  score_delta: number;
  completed_at: string;
};

export function emptyProgress(): NovelProgress {
  return {
    profile: null,
    completed: [],
    legalLiteracy: 0,
    shopPurchases: [],
    shopSpent: 0,
    relationshipScores: {},
    secretUnlocked: false,
  };
}

function normalizeProgress(progress: NovelProgress) {
  return {
    ...progress,
    shopPurchases: Array.isArray(progress.shopPurchases) ? progress.shopPurchases : [],
    shopSpent: typeof progress.shopSpent === 'number' ? progress.shopSpent : 0,
    relationshipScores: isNumberRecord(progress.relationshipScores) ? progress.relationshipScores : {},
  };
}

function isNumberRecord(value: unknown): value is Record<string, number> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;

  return Object.values(value).every((item) => typeof item === 'number');
}

export function loadLocalProgress(userId: string) {
  const raw = window.localStorage.getItem(`${baseKey}:${userId}`);
  if (!raw) return emptyProgress();

  try {
    return normalizeProgress(JSON.parse(raw) as NovelProgress);
  } catch {
    return emptyProgress();
  }
}

export function saveLocalProgress(userId: string, progress: NovelProgress) {
  window.localStorage.setItem(`${baseKey}:${userId}`, JSON.stringify(progress));
}

function getProgressErrorMessage(action: string, message: string) {
  return `${action}: ${message}`;
}

export async function loadSupabaseProgress(userId: string) {
  if (!isSupabaseConfigured) return null;

  const { data: profileData, error: profileError } = await supabase
    .from('vn_profiles')
    .select('player_name, character_id, gender, legal_literacy, shop_purchases, shop_spent, relationship_scores, secret_unlocked')
    .eq('user_id', userId)
    .maybeSingle();

  if (profileError) {
    throw new Error(getProgressErrorMessage('Не удалось загрузить профиль', profileError.message));
  }

  if (!profileData) return null;

  const { data: npcData, error: npcError } = await supabase
    .from('vn_npc_progress')
    .select('location_id, npc_id, answers, score_delta, completed_at')
    .eq('user_id', userId);

  if (npcError) {
    throw new Error(getProgressErrorMessage('Не удалось загрузить прогресс историй', npcError.message));
  }

  const profile = profileData as ProfileRow;
  const rows = (npcData ?? []) as NpcProgressRow[];
  const completed: CompletedNpc[] = rows.map((row) => {
    const answer = row.answers[0];
    return {
      locationId: row.location_id,
      npcId: row.npc_id,
      choiceId: answer?.choiceId ?? '',
      correct: Boolean(answer?.correct),
      points: typeof answer?.points === 'number' ? answer.points : row.score_delta,
      completedAt: answer?.completedAt ?? row.completed_at,
    };
  });
  const shopSpent = typeof profile.shop_spent === 'number' ? profile.shop_spent : 0;
  const earnedXp = completed.reduce((sum, item) => sum + item.points, 0);

  return {
    profile: {
      name: profile.player_name,
      characterId: profile.character_id,
      gender: profile.gender,
    },
    completed,
    legalLiteracy: Math.max(profile.legal_literacy, Math.max(0, earnedXp - shopSpent)),
    shopPurchases: Array.isArray(profile.shop_purchases) ? profile.shop_purchases : [],
    shopSpent,
    relationshipScores: isNumberRecord(profile.relationship_scores) ? profile.relationship_scores : {},
    secretUnlocked: profile.secret_unlocked,
  } satisfies NovelProgress;
}

export async function saveProfileToSupabase(
  userId: string,
  profile: PlayerProfile,
  legalLiteracy: number,
  secretUnlocked: boolean,
  shopPurchases: string[] = [],
  shopSpent = 0,
  relationshipScores: Record<string, number> = {},
) {
  if (!isSupabaseConfigured) return null;

  const { error } = await supabase.from('vn_profiles').upsert({
    user_id: userId,
    player_name: profile.name,
    character_id: profile.characterId,
    gender: profile.gender,
    legal_literacy: legalLiteracy,
    shop_purchases: shopPurchases,
    shop_spent: shopSpent,
    relationship_scores: relationshipScores,
    secret_unlocked: secretUnlocked,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });

  return error ? getProgressErrorMessage('Не удалось сохранить профиль', error.message) : null;
}

export async function saveNpcToSupabase(userId: string, result: CompletedNpc) {
  if (!isSupabaseConfigured) return null;

  const { error } = await supabase.from('vn_npc_progress').upsert({
    user_id: userId,
    location_id: result.locationId,
    npc_id: result.npcId,
    completed: true,
    correct_answers: result.correct ? 1 : 0,
    score_delta: result.points,
    answers: [{
      choiceId: result.choiceId,
      correct: result.correct,
      points: result.points,
      completedAt: result.completedAt,
    }],
    completed_at: result.completedAt,
  }, { onConflict: 'user_id,npc_id' });

  return error ? getProgressErrorMessage('Не удалось сохранить историю', error.message) : null;
}
