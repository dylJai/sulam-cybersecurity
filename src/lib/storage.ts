import { ChallengeId } from '@/types/challenge';

export interface ChallengeRecord {
  score: number;
  maxScore: number;
  completedAt: string;
}

export type StationRecords = Partial<Record<ChallengeId, ChallengeRecord>>;

const STORAGE_KEY = 'cybersafe_workshop_station_records';

export function getStationRecords(): StationRecords {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Failed to parse station records', err);
    return {};
  }
}

export function saveChallengeResult(
  challengeId: ChallengeId,
  score: number,
  maxScore: number
): StationRecords {
  if (typeof window === 'undefined') return {};
  try {
    const current = getStationRecords();
    const updated: StationRecords = {
      ...current,
      [challengeId]: {
        score,
        maxScore,
        completedAt: new Date().toISOString()
      }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Trigger custom event so header / home can reactively update
    window.dispatchEvent(new Event('cybersafe-storage-updated'));
    return updated;
  } catch (err) {
    console.error('Failed to save challenge result', err);
    return {};
  }
}

export function resetStationRecords(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('cybersafe-storage-updated'));
  } catch (err) {
    console.error('Failed to reset station records', err);
  }
}

export function getOverallStats(records: StationRecords): {
  totalScore: number;
  maxPossibleScore: number;
  completedCount: number;
} {
  const values = Object.values(records) as ChallengeRecord[];
  const totalScore = values.reduce((sum, r) => sum + (r?.score || 0), 0);
  const maxPossibleScore = 300; // 6 cabaran x 50 mata
  const completedCount = values.filter(Boolean).length;
  return { totalScore, maxPossibleScore, completedCount };
}
