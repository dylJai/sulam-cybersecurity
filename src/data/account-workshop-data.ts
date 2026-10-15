import { FictionalAccount, LabPasswordOption, SecurityChecklistItem } from '@/types/game';

export const initialAccounts: FictionalAccount[] = [
  {
    id: 'acc-email',
    name: 'Primary Personal Email',
    serviceType: 'email',
    identifier: 'ali.kampung@email.com',
    currentPassword: 'Kampung123!',
    hasMFA: false,
    isBreached: false,
    statusNotes: 'Used for password resets, banking notices, and confidential correspondence.'
  },
  {
    id: 'acc-social',
    name: 'Social Media Account',
    serviceType: 'social',
    identifier: '@pak_ali_desa',
    currentPassword: 'Kampung123!',
    hasMFA: false,
    isBreached: false,
    statusNotes: 'Contains contacts, personal photos, family details, and private chats.'
  },
  {
    id: 'acc-shopping',
    name: 'Online Shopping Portal',
    serviceType: 'shopping',
    identifier: 'PasarOnline.my',
    currentPassword: 'Kampung123!',
    hasMFA: false,
    isBreached: false,
    statusNotes: 'Stores shipping address and linked debit/credit card details.'
  }
];

export const passwordLabOptions: LabPasswordOption[] = [
  {
    id: 'pw-short',
    label: 'Option A: Short & Predictable',
    passwordText: 'password123',
    entropy: 'very-weak',
    crackTimeEstimate: 'Less than 1 millisecond',
    characteristics: [
      'Extremely common dictionary word',
      'Sequential predictable numbers (123)',
      'Top 10 most breached passwords globally'
    ],
    isSafest: false,
    explanation: 'Short, common words are cracked in milliseconds using precomputed rainbow tables and automated wordlists.'
  },
  {
    id: 'pw-personal',
    label: 'Option B: Personal Info + Symbol',
    passwordText: 'Kamal1985!',
    entropy: 'weak',
    crackTimeEstimate: 'Under 5 seconds on a modern graphics card',
    characteristics: [
      'Uses a first name and birth year',
      'Easily found on social media profiles or IC records',
      'Adding exclamation marks (!) does not defeat automated cracking dictionaries'
    ],
    isSafest: false,
    explanation: 'Scammers build custom dictionaries based on names, pet names, and birth years harvested from public social media accounts.'
  },
  {
    id: 'pw-passphrase',
    label: 'Option C: Memorable Multi-Word Passphrase',
    passwordText: 'kucing-suka-makan-ikan-kembung',
    entropy: 'strong',
    crackTimeEstimate: 'Thousands of years',
    characteristics: [
      '31 characters long (Length is King!)',
      '5 random, memorable words chained together',
      'Effortless for human memory, mathematically impossible for bots to guess'
    ],
    isSafest: true,
    explanation: 'Password length creates exponential mathematical difficulty for cracking software while remaining easy for you to remember as a mental picture.'
  }
];

export const upgradedPassphrases: Record<string, string> = {
  'acc-email': 'kebun-pisang-hujan-lebat',
  'acc-social': 'kopi-o-panas-sedap',
  'acc-shopping': 'basikal-tua-warna-biru'
};

export const securityChecklist: SecurityChecklistItem[] = [
  {
    id: 'sec-unique',
    title: 'Assign a Unique Password to Every Account',
    impactScore: 20,
    shortDescription: 'Ensure a breach on one shopping website never exposes your email or banking.',
    howItProtects: 'Stops credential stuffing attacks. If one service is compromised, all your other accounts remain secure.',
    isEssential: true
  },
  {
    id: 'sec-2fa',
    title: 'Enable Two-Factor Authentication (2FA / MFA)',
    impactScore: 25,
    shortDescription: 'Require a second proof of identity on your phone before sign-in.',
    howItProtects: 'Acts like a second physical lock. Even if an attacker steals your password, they cannot log in without your phone verification.',
    isEssential: true
  },
  {
    id: 'sec-manager',
    title: 'Use a Reputable Password Manager',
    impactScore: 20,
    shortDescription: 'Let an encrypted digital vault generate and remember 30+ complex passwords for you.',
    howItProtects: 'Eliminates the temptation to reuse simple passwords. You only need to memorize one master passphrase.',
    isEssential: true
  },
  {
    id: 'sec-recovery',
    title: 'Keep Account Recovery Contact Details Updated',
    impactScore: 15,
    shortDescription: 'Maintain accurate backup email and phone numbers for emergency account recovery.',
    howItProtects: 'Ensures you can regain access quickly if suspicious login activity is detected on your accounts.',
    isEssential: true
  },
  {
    id: 'sec-otp-rule',
    title: 'Never Share Verification Codes (OTP / TAC)',
    impactScore: 20,
    shortDescription: 'Treat 6-digit codes as private digital keys never to be read over the phone.',
    howItProtects: 'Prevents account takeover scams where fraudsters pretend to have "accidentally sent their code to your number".',
    isEssential: true
  }
];
