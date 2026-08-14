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
    secretUnlocked: false,
  };
}

function normalizeProgress(progress: NovelProgress) {
  return {
    ...progress,
    shopPurchases: Array.isArray(progress.shopPurchases) ? progress.shopPurchases : [],
    shopSpent: typeof progress.shopSpent === 'number' ? progress.shopSpent : 0,
  };
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

export async function loadSupabaseProgress(userId: string) {
  if (!isSupabaseConfigured) return null;

  const { data: profileData, error: profileError } = await supabase
    .from('vn_profiles')
    .select('player_name, character_id, gender, legal_literacy, shop_purchases, shop_spent, secret_unlocked')
    .eq('user_id', userId)
    .maybeSingle();

  if (profileError || !profileData) return null;

  const { data: npcData, error: npcError } = await supabase
    .from('vn_npc_progress')
    .select('location_id, npc_id, answers, score_delta, completed_at')
    .eq('user_id', userId);

  if (npcError) return null;

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

  return {
    profile: {
      name: profile.player_name,
      characterId: profile.character_id,
      gender: profile.gender,
    },
    completed,
    legalLiteracy: profile.legal_literacy,
    shopPurchases: Array.isArray(profile.shop_purchases) ? profile.shop_purchases : [],
    shopSpent: typeof profile.shop_spent === 'number' ? profile.shop_spent : 0,
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
    secret_unlocked: secretUnlocked,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });

  return error?.message ?? null;
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

  return error?.message ?? null;
}
