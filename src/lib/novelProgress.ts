import { isSupabaseConfigured, supabase } from './supabase';
import type { LocationId, PlayerProfile } from './visualNovelData';

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
  secretUnlocked: boolean;
};

const baseKey = 'law-quest-visual-novel';

export function emptyProgress(): NovelProgress {
  return {
    profile: null,
    completed: [],
    legalLiteracy: 0,
    secretUnlocked: false,
  };
}

export function loadLocalProgress(userId: string) {
  const raw = window.localStorage.getItem(`${baseKey}:${userId}`);
  if (!raw) return emptyProgress();

  try {
    return JSON.parse(raw) as NovelProgress;
  } catch {
    return emptyProgress();
  }
}

export function saveLocalProgress(userId: string, progress: NovelProgress) {
  window.localStorage.setItem(`${baseKey}:${userId}`, JSON.stringify(progress));
}

export async function saveProfileToSupabase(userId: string, profile: PlayerProfile, legalLiteracy: number, secretUnlocked: boolean) {
  if (!isSupabaseConfigured) return null;

  const { error } = await supabase.from('vn_profiles').upsert({
    user_id: userId,
    player_name: profile.name,
    character_id: profile.characterId,
    gender: profile.gender,
    legal_literacy: legalLiteracy,
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
