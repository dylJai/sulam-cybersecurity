export type ChallengeId = 'phishing' | 'passwords';

/* --- Message Investigation Types (Phishing Game) --- */

export interface InvestigationClue {
  id: string;
  targetText: string;
  label: string;
  explanation: string;
  isSuspicious: boolean;
}

export interface InvestigationAction {
  id: string;
  title: string;
  description: string;
  isSafe: boolean;
  consequence: string;
}

export interface InvestigationCase {
  id: number;
  title: string;
  scenarioContext: string;
  format: 'sms' | 'email';
  sender: string;
  senderAddress?: string;
  subject?: string;
  receivedTime?: string;
  body: string;
  attachmentName?: string;
  urgencyBadge?: string;
  clues: InvestigationClue[];
  actions: InvestigationAction[];
}

/* --- Account Security Workshop Types (Password Game) --- */

export interface FictionalAccount {
  id: string;
  name: string;
  serviceType: 'email' | 'social' | 'shopping';
  identifier: string;
  currentPassword: string;
  hasMFA: boolean;
  isBreached: boolean;
  statusNotes: string;
}

export interface LabPasswordOption {
  id: string;
  label: string;
  passwordText: string;
  entropy: 'very-weak' | 'weak' | 'strong';
  crackTimeEstimate: string;
  characteristics: string[];
  isSafest: boolean;
  explanation: string;
}

export interface SecurityChecklistItem {
  id: string;
  title: string;
  impactScore: number;
  shortDescription: string;
  howItProtects: string;
  isEssential: boolean;
}
