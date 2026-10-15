export type ChallengeId =
  | 'phishing'
  | 'passwords'
  | 'call-scam'
  | 'apk-malware'
  | 'public-wifi'
  | 'investment-scam'
  | 'social-privacy';

export type QuestionType = 'multiple-choice' | 'spot-clues' | 'password-compare';

export interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface ClueItem {
  id: string;
  label: string;
  explanation: string;
  isSuspicious: boolean;
}

export interface PasswordSample {
  id: string;
  label: string;
  passwordText: string;
  entropy: 'very-weak' | 'weak' | 'strong';
  crackTimeEstimate: string;
  characteristics: string[];
  isSafest: boolean;
}

export interface BaseQuestion {
  id: number;
  type: QuestionType;
  title: string;
  scenarioContext?: string;
  questionText: string;
  explanation: string;
  points: number; // typically 10
  options: AnswerOption[];
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  messageFormat?: 'sms' | 'email';
  sender?: string;
  subject?: string;
  messageBody?: string;
  attachmentName?: string;
  urgencyBadge?: string;
}

export interface SpotCluesQuestion extends BaseQuestion {
  type: 'spot-clues';
  sender: string;
  senderEmail: string;
  subject: string;
  receivedTime: string;
  clues: ClueItem[];
  instructions: string;
}

export interface PasswordCompareQuestion extends BaseQuestion {
  type: 'password-compare';
  passwords: PasswordSample[];
  questionPrompt: string;
}

export type ChallengeQuestion = MultipleChoiceQuestion | SpotCluesQuestion | PasswordCompareQuestion;

export interface ChallengeMeta {
  id: ChallengeId;
  title: string;
  shortDescription: string;
  learningObjective: string;
  difficulty: 'Asas' | 'Pertengahan' | 'Beginner' | 'Intermediate';
  estimatedTime: string;
  iconName: 'ShieldAlert' | 'KeyRound' | 'PhoneCall' | 'Download' | 'Wifi' | 'TrendingUp' | 'UserCheck' | 'Shield';
  accentColor: string;
  badgeText: string;
  instructions: string[];
  keyTakeaways: string[];
  totalQuestions: number;
  maxScore: number;
}
