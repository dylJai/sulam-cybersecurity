import { ChallengeId, ChallengeMeta, ChallengeQuestion } from '@/types/challenge';
import { phishingMeta, phishingQuestions } from './phishing-challenge';
import { passwordMeta, passwordQuestions } from './password-challenge';
import { callScamMeta } from './call-scam-data';
import { apkMalwareMeta } from './apk-malware-data';
import { investmentScamMeta } from './investment-scam-data';
import { socialPrivacyMeta } from './social-privacy-data';

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
  },
  'call-scam': {
    meta: callScamMeta,
    questions: []
  },
  'apk-malware': {
    meta: apkMalwareMeta,
    questions: []
  },
  'investment-scam': {
    meta: investmentScamMeta,
    questions: []
  },
  'social-privacy': {
    meta: socialPrivacyMeta,
    questions: []
  }
};

export const allChallengesMeta: ChallengeMeta[] = [
  phishingMeta,
  passwordMeta,
  callScamMeta,
  apkMalwareMeta,
  investmentScamMeta,
  socialPrivacyMeta
];

export function getChallenge(id: string): ChallengePackage | null {
  if (id in challengesRegistry) {
    return challengesRegistry[id as ChallengeId];
  }
  return null;
}
