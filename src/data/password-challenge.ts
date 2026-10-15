import { ChallengeMeta, ChallengeQuestion } from '@/types/challenge';

export const passwordMeta: ChallengeMeta = {
  id: 'passwords',
  title: 'Password Protector',
  shortDescription: 'Master the art of creating unbreakable passphrases, stopping account takeover, and using 2FA & password managers.',
  learningObjective: 'Understand how hackers crack weak credentials, why password length beats complexity, and how multi-factor authentication (MFA) keeps your personal accounts secure.',
  difficulty: 'Beginner',
  estimatedTime: '5-7 Minutes',
  iconName: 'KeyRound',
  accentColor: 'from-emerald-500 to-cyan-500',
  badgeText: 'Challenge 2',
  instructions: [
    'Analyze realistic password habits, security prompts, and common mistakes.',
    'Test and compare different password strengths with your team.',
    'Learn how modern security tools like 2FA and password managers work.',
    'Earn 10 points for every correct security practice (50 points max)!'
  ],
  keyTakeaways: [
    'Length is king: A passphrase of 4-5 random words is easy for you to remember and virtually impossible for computers to brute-force.',
    'Never reuse the same password across multiple websites—a single breach can expose all your accounts.',
    'Two-Factor Authentication (2FA) adds a vital second layer of defense even if someone learns your password.',
    'Use a reputable Password Manager to safely generate and remember unique credentials.',
    'Never share One-Time Passwords (OTP) or verification codes with anyone over the phone or text.'
  ],
  totalQuestions: 5,
  maxScore: 50
};

export const passwordQuestions: ChallengeQuestion[] = [
  {
    id: 1,
    type: 'multiple-choice',
    title: 'One Password for Everything',
    scenarioContext: 'Pak Ali uses the exact same password ("KampungDamai2024!") for his personal Gmail, online shopping app, social media, and electricity payment portal.',
    questionText: 'Why is using the same password across multiple accounts extremely dangerous?',
    options: [
      {
        id: 'A',
        text: 'It slows down your computer’s processor and reduces internet speed.',
        isCorrect: false
      },
      {
        id: 'B',
        text: 'If even one small shopping website suffers a data breach, hackers will use that stolen password to unlock your email, bank, and all other accounts.',
        isCorrect: true
      },
      {
        id: 'C',
        text: 'The Malaysian Communications and Multimedia Commission (MCMC) will automatically delete your accounts.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'It causes your Wi-Fi router to disconnect automatically every evening.',
        isCorrect: false
      }
    ],
    explanation: 'This attack is called "Credential Stuffing". Hackers automate testing leaked username-and-password combinations across hundreds of other services. If you reuse your password, a breach on one minor website compromises your most sensitive accounts.',
    points: 10
  },
  {
    id: 2,
    type: 'password-compare',
    title: 'Interactive Feature: Choose the Safer Password',
    scenarioContext: 'Compare the three fictional password choices below created for an email account. Inspect their characteristics and security estimates:',
    questionPrompt: 'Based on security principles, which password provides the strongest protection and why?',
    passwords: [
      {
        id: 'pw-1',
        label: 'Option A: Short & Predictable',
        passwordText: 'password123',
        entropy: 'very-weak',
        crackTimeEstimate: 'Less than 1 millisecond',
        characteristics: [
          'Extremely common dictionary word',
          'Sequential numbers (123)',
          'Top 10 most hacked passwords in history'
        ],
        isSafest: false
      },
      {
        id: 'pw-2',
        label: 'Option B: Personal Info + Symbol',
        passwordText: 'Kamal1985!',
        entropy: 'weak',
        crackTimeEstimate: 'Under 5 seconds on modern GPU',
        characteristics: [
          'Uses first name and birth year',
          'Easily discovered from IC, Facebook, or WhatsApp profile',
          'Replacing letters with symbols or adding "!" does not stop automated tools'
        ],
        isSafest: false
      },
      {
        id: 'pw-3',
        label: 'Option C: Memorable Passphrase',
        passwordText: 'kucing-suka-makan-ikan-kembung',
        entropy: 'strong',
        crackTimeEstimate: 'Thousands of years',
        characteristics: [
          '31 characters long (Length is King!)',
          '5 random memorable Malay words chained together',
          'Easy for a human to picture, nearly impossible for bots to guess'
        ],
        isSafest: true
      }
    ],
    options: [
      {
        id: 'A',
        text: 'Option A, because it is short and easy to type without making typos.',
        isCorrect: false
      },
      {
        id: 'B',
        text: 'Option B, because having a capital letter, number, and exclamation mark guarantees it cannot be cracked.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'Option C, because length and unpredictable combinations of words are exponentially harder for brute-force cracking tools to compute.',
        isCorrect: true
      },
      {
        id: 'D',
        text: 'All three options are equally safe as long as no one looks over your shoulder.',
        isCorrect: false
      }
    ],
    questionText: 'Which option represents the safest password practice?',
    explanation: 'Password length is far more important than arbitrary symbol replacements! A passphrase made of 4 to 5 words (like "kucing-suka-makan-ikan-kembung") creates mathematical exponential difficulty for computers while remaining effortless for humans to remember.',
    points: 10
  },
  {
    id: 3,
    type: 'multiple-choice',
    title: 'Two-Factor Authentication (2FA) Shield',
    scenarioContext: 'While setting up a new banking or social media app, the screen displays a prompt: "Enable Two-Factor Authentication (2FA) / Two-Step Verification".',
    questionText: 'How does Two-Factor Authentication (2FA) protect your account?',
    options: [
      {
        id: 'A',
        text: 'It requires you to type two different passwords one after another every time you open the app.',
        isCorrect: false
      },
      {
        id: 'B',
        text: 'Even if a cybercriminal guesses or steals your password, they cannot log in without the second proof of identity (such as a prompt or code on your physical phone).',
        isCorrect: true
      },
      {
        id: 'C',
        text: 'It permanently disables notifications and junk mail on your phone.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'It prevents your device from ever running out of battery during transactions.',
        isCorrect: false
      }
    ],
    explanation: '2FA acts like requiring both a key and a fingerprint to open your front door. Even if a criminal acquires your password in a database leak, they do not possess your physical phone or authenticator app, stopping the unauthorized login dead in its tracks.',
    points: 10
  },
  {
    id: 4,
    type: 'multiple-choice',
    title: 'Managing 30 Different Passwords',
    scenarioContext: 'A workshop participant asks: "If every single account needs a unique, 20-character passphrase, how on earth can anyone remember 30 different passwords without writing them on a paper note?"',
    questionText: 'What is the recommended tool to solve this problem safely and easily?',
    options: [
      {
        id: 'A',
        text: 'Write all passwords on a sticky note and attach it to your laptop screen or monitor bezel.',
        isCorrect: false
      },
      {
        id: 'B',
        text: 'Save your passwords in an open WhatsApp message or unencrypted note on your smartphone.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'Use a reputable Password Manager (such as Bitwarden, Apple Keychain, or Google Password Manager) that encrypts and auto-fills unique passwords using one master passphrase.',
        isCorrect: true
      },
      {
        id: 'D',
        text: 'Use the "Forgot Password" button every single time you need to log in to an account.',
        isCorrect: false
      }
    ],
    explanation: 'Reputable Password Managers are designed specifically for this purpose! They encrypt and store all your complex passwords inside a secure digital vault. You only have to remember one single, strong master passphrase to unlock your vault.',
    points: 10
  },
  {
    id: 5,
    type: 'multiple-choice',
    title: 'The "Accidental" Verification Code Call',
    scenarioContext: 'You receive an unexpected SMS from Google with a 6-digit verification code: "492019 is your Google verification code. Do not share it with anyone." A minute later, a friendly caller phones you saying: "Hi encik/puan! I accidentally typed your phone number for my account recovery. Could you please read that 6-digit number to me?"',
    questionText: 'What must you do in this situation?',
    options: [
      {
        id: 'A',
        text: 'Read the code to the caller because they made a polite and honest mistake.',
        isCorrect: false
      },
      {
        id: 'B',
        text: 'NEVER share the code! Hang up immediately. The caller is attempting to hijack your account, and giving the code gives them full access.',
        isCorrect: true
      },
      {
        id: 'C',
        text: 'Read only the first 3 digits of the code to be helpful.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Forward the SMS to the caller’s WhatsApp number.',
        isCorrect: false
      }
    ],
    explanation: 'Never share a verification code or OTP with anyone—not even someone claiming to be technical support or an innocent stranger! That 6-digit code is the only barrier stopping a scammer from taking over your Google, WhatsApp, or banking account.',
    points: 10
  }
];
