import { ChallengeId, ChallengeMeta, ChallengeQuestion } from '@/types/challenge';
import { phishingMeta, phishingQuestions } from './phishing-challenge';
import { passwordMeta, passwordQuestions } from './password-challenge';

export interface ChallengePackage {
  meta: ChallengeMeta;
  questions: ChallengeQuestion[];
}

export const challengesRegistry: Record<ChallengeId, ChallengePackage> = {
  phishing: {
    meta: phishingMeta,
    questions: phishingQuestions
  },
  passwords: {
    meta: passwordMeta,
    questions: passwordQuestions
  }
};

export const allChallengesMeta: ChallengeMeta[] = [
  phishingMeta,
  passwordMeta
];

export function getChallenge(id: string): ChallengePackage | null {
  if (id === 'phishing' || id === 'passwords') {
    return challengesRegistry[id as ChallengeId];
  }
  return null;
}
