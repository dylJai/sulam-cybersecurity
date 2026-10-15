import { ChallengeMeta, ChallengeQuestion } from '@/types/challenge';

export const phishingMeta: ChallengeMeta = {
  id: 'phishing',
  title: 'Phishing Detection',
  shortDescription: 'Learn to spot suspicious SMS messages, fake banking alerts, and deceptive emails before falling for scams.',
  learningObjective: 'Identify red flags in digital messages—such as fake urgency, suspicious sender domains, and demands for sensitive codes—before clicking links or transferring money.',
  difficulty: 'Beginner',
  estimatedTime: '5-7 Minutes',
  iconName: 'ShieldAlert',
  accentColor: 'from-amber-500 to-rose-500',
  badgeText: 'Challenge 1',
  instructions: [
    'Read each scenario and inspect the sender, message text, and links carefully.',
    'Work with your workshop team to discuss what looks suspicious or safe.',
    'Choose the safest response or tap the warning signs when prompted.',
    'Earn 10 points for every correct identification (50 points max)!'
  ],
  keyTakeaways: [
    'Legitimate couriers and banks never give 15-minute ultimatums to demand small payments via strange links.',
    'Never share your TAC, OTP, or eWallet PIN with anyone, even if they claim to be a bank officer or friend.',
    'Always verify unexpected messages by contacting the official helpline or opening the official app directly.',
    'Check sender email addresses carefully—scammers often use fake domains like @tenaga-alert.xyz.',
    'Pause and call family members directly before sending emergency money requested over WhatsApp or SMS.'
  ],
  totalQuestions: 5,
  maxScore: 50
};

export const phishingQuestions: ChallengeQuestion[] = [
  {
    id: 1,
    type: 'multiple-choice',
    title: 'Suspicious Parcel Delivery SMS',
    scenarioContext: 'You are waiting for an online shopping delivery and receive this unexpected SMS on your phone:',
    messageFormat: 'sms',
    sender: 'Parcel Delivery Notice (+6011-8291-0394)',
    messageBody: 'Your parcel delivery has failed. Pay RM2.50 to reschedule your delivery. Complete payment within 15 minutes to avoid cancellation: http://pos-redeliver-pay.cc/track992',
    urgencyBadge: '15-minute countdown',
    questionText: 'What is the safest action for you and your team to take?',
    options: [
      {
        id: 'A',
        text: 'Click the link and pay RM2.50 immediately so your package is not cancelled.',
        isCorrect: false
      },
      {
        id: 'B',
        text: 'Reply to the SMS with your full name, home address, and IC number.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'Do not click the link. Open the courier company’s official app or tracking website to verify the package status.',
        isCorrect: true
      },
      {
        id: 'D',
        text: 'Forward the message to your family chat asking everyone to pay it quickly.',
        isCorrect: false
      }
    ],
    explanation: 'Scammers frequently send fake parcel SMS messages with tiny fees (like RM2.50) to steal credit card and online banking credentials. Legitimate couriers do not cancel deliveries within 15 minutes or direct you to strange .cc domain links. Always check tracking numbers on official portals.',
    points: 10
  },
  {
    id: 2,
    type: 'multiple-choice',
    title: 'Urgent Banking Security Warning',
    scenarioContext: 'You receive an urgent SMS that claims to be from a well-known Malaysian commercial bank:',
    messageFormat: 'sms',
    sender: 'MY-BANK-ALERT',
    messageBody: 'PERINGATAN KESELAMATAN: Akaun perbankan internet anda telah digantung akibat percubaan akses tanpa kebenaran. Sila sahkan maklumat dan nombor TAC anda di: https://mybank-online-security.com/verify dalam tempoh 1 jam.',
    urgencyBadge: 'Urgent Threat: Account Suspended',
    questionText: 'The message warns that your account is blocked unless you verify your TAC number immediately. What should you do?',
    options: [
      {
        id: 'A',
        text: 'Click the link right away and type in your username, password, and TAC to protect your money.',
        isCorrect: false
      },
      {
        id: 'B',
        text: 'Do not click the link. Log in directly through the official mobile banking app, or call the official bank hotline printed on the back of your bank card.',
        isCorrect: true
      },
      {
        id: 'C',
        text: 'Click the link to look around, but only enter your password if the page looks genuine.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Reply to the SMS asking for the bank officer’s employee ID number.',
        isCorrect: false
      }
    ],
    explanation: 'Banks in Malaysia and worldwide have banned sending links in SMS messages! Genuine banks will NEVER ask you to click a link to input your password or TAC. If you suspect an issue, always call the official customer care number on your physical card.',
    points: 10
  },
  {
    id: 3,
    type: 'multiple-choice',
    title: 'Unexpected Cash Aid & Festive Prize',
    scenarioContext: 'You open your inbox and see an email congratulating you on winning cash assistance:',
    messageFormat: 'email',
    sender: 'Bantuan Khas Kerajaan <hadiah-bonus@ewallet-claim-2025.com>',
    subject: 'Tahniah! Anda telah terpilih untuk menerima Bantuan Khas RM1,000',
    messageBody: 'Pelanggan yang dihormati,\n\nNombor telefon anda telah dicabut sebagai pemenang Bertuah Bantuan Tunai Musim Perayaan sebanyak RM1,000.\n\nUntuk menyalurkan wang terus ke akaun Touch \'n Go eWallet anda, sila muat turun borang pendaftaran di bawah dan masukkan nombor PIN keselamatan 6-digit eWallet anda.',
    attachmentName: 'Borang_Penebusan_Bantuan_Tunai.apk',
    urgencyBadge: 'Claim within 24 Hours',
    questionText: 'What is the main warning sign indicating this email is a scam?',
    options: [
      {
        id: 'A',
        text: 'The email mentions a festive holiday season.',
        isCorrect: false
      },
      {
        id: 'B',
        text: 'You never entered a lucky draw, the sender email address is unofficial (@ewallet-claim-2025.com), it attaches a risky APK file, and it demands your secret 6-digit PIN.',
        isCorrect: true
      },
      {
        id: 'C',
        text: 'The cash assistance amount is RM1,000 rather than RM2,000.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'The email was sent on a weekday instead of the weekend.',
        isCorrect: false
      }
    ],
    explanation: 'If you never entered a lucky draw, you cannot win! Real government agencies and reputable eWallets will never ask for your confidential PIN or password, nor will they distribute untrusted .APK files which can install spyware on your Android phone.',
    points: 10
  },
  {
    id: 4,
    type: 'spot-clues',
    title: 'Interactive Feature: Spot the Warning Signs',
    scenarioContext: 'Below is an urgent utility bill email that looks deceptive. Tap each of the 4 suspicious red flags highlighted in the email to understand why it is dangerous:',
    sender: 'Jabatan Pengebilan Elektrik',
    senderEmail: 'billing-support@tenaga-online-alert.xyz',
    receivedTime: 'Today at 07:15 AM',
    subject: 'NOTIS AKHIR: Bekalan elektrik anda akan dipotong dalam 2 Jam!',
    instructions: 'Click each of the marked warning zones below to inspect the scammer\'s tricks, then submit your evaluation.',
    clues: [
      {
        id: 'clue-sender',
        label: '1. Suspicious Sender Domain',
        explanation: 'Look at the domain "@tenaga-online-alert.xyz". Official utility companies use official corporate domains (like .com.my), never random .xyz domains created by scammers.',
        isSuspicious: true
      },
      {
        id: 'clue-urgency',
        label: '2. Extreme Threat & Artificial Urgency',
        explanation: 'Scammers use phrases like "Cut off in 2 hours!" to panic you into acting before you have time to think rationally or consult family members.',
        isSuspicious: true
      },
      {
        id: 'clue-link',
        label: '3. Unofficial Payment Link / Button',
        explanation: 'The payment button leads to an insecure external phishing portal that mimics the utility website to steal your banking login details.',
        isSuspicious: true
      },
      {
        id: 'clue-sensitive',
        label: '4. Asking for Banking Password & TAC',
        explanation: 'Utility bills only require account numbers and bill amounts. They NEVER require your online banking username, password, or security code.',
        isSuspicious: true
      }
    ],
    questionText: 'After reviewing the warning signs above, what is the best rule to remember for utility bills?',
    options: [
      {
        id: 'A',
        text: 'Pay through the email link quickly so the lights don’t turn off.',
        isCorrect: false
      },
      {
        id: 'B',
        text: 'Verify outstanding balances exclusively through the official provider app, physical kiosks, or authorized post office counters.',
        isCorrect: true
      },
      {
        id: 'C',
        text: 'Reply to the sender attaching your latest bank statement.',
        isCorrect: false
      }
    ],
    explanation: 'Spotting the combination of a bogus sender domain, manufactured panic, and requests for private financial details protects you from utility impersonation scams.',
    points: 10
  },
  {
    id: 5,
    type: 'multiple-choice',
    title: 'Emergency Distress Message from "Family"',
    scenarioContext: 'You receive a WhatsApp message from an unknown number showing a photo of your nephew or cousin:',
    messageFormat: 'sms',
    sender: 'Unknown Number (+6019-338-9210)',
    messageBody: 'Salam Makcik/Pakcik, telefon saya jatuh dalam air tadi jadi saya guna nombor kawan. Kereta saya rosak tepi jalan kat lebuhraya sekarang dan bateri kawan pun nak habis. Boleh tolong pindahkan RM350 ke akaun bengkel kawan saya: Maybank 1140-2938-1209 sekarang? Saya bayar balik malam nanti.',
    urgencyBadge: 'Family Emergency',
    questionText: 'An unknown number claims to be your family member stranded on the highway demanding emergency money. What should you do first?',
    options: [
      {
        id: 'A',
        text: 'Transfer RM350 right away because helping family during emergencies is an urgent priority.',
        isCorrect: false
      },
      {
        id: 'B',
        text: 'Call your family member’s usual existing phone number directly, or call another close relative to verify if the emergency is real.',
        isCorrect: true
      },
      {
        id: 'C',
        text: 'Transfer RM50 first just to see if the bank account name matches.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Ask the sender to take a selfie holding today’s newspaper.',
        isCorrect: false
      }
    ],
    explanation: 'Family impersonation scams are rampant in Malaysia. Criminals harvest profile pictures from social media and fabricate urgent distress stories. ALWAYS call the relative on their known contact number or check with immediate family before making any transfers.',
    points: 10
  }
];
