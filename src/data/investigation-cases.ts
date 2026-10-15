import { InvestigationCase } from '@/types/game';

export const investigationCases: InvestigationCase[] = [
  {
    id: 1,
    title: 'Case 01 — Parcel Delivery Redirection SMS',
    scenarioContext: 'You are waiting for an online shopping delivery when you receive this SMS on your smartphone:',
    format: 'sms',
    sender: 'Parcel Notice (+6011-8291-0394)',
    receivedTime: 'Today at 10:42 AM',
    urgencyBadge: '15-Minute Countdown',
    body: 'Pemberitahuan: Penghantaran bungkusan anda gagal kerana alamat tidak lengkap. Sila bayar caj RM2.50 untuk penjadualan semula segera dalam 15 minit bagi mengelakkan pembatalan: http://pos-redeliver-pay.cc/track992',
    clues: [
      {
        id: 'c1-sender',
        targetText: '+6011-8291-0394',
        label: 'Unverified Personal Mobile Number',
        explanation: 'Official courier dispatch systems use registered shortcodes or verified business IDs, not random prepaid personal mobile numbers.',
        isSuspicious: true
      },
      {
        id: 'c1-fee',
        targetText: 'bayar caj RM2.50',
        label: 'Unexpected Small Payment Request',
        explanation: 'Scammers deliberately request tiny fees (like RM2.50) so victims lower their guard. The real trap is harvesting your credit card or banking login details on the fake payment page.',
        isSuspicious: true
      },
      {
        id: 'c1-urgency',
        targetText: 'dalam 15 minit',
        label: 'Manufactured Artificial Urgency',
        explanation: 'Imposing a 15-minute deadline is designed to panic you into acting impulsively before you have time to consult others or think clearly.',
        isSuspicious: true
      },
      {
        id: 'c1-url',
        targetText: 'http://pos-redeliver-pay.cc/track992',
        label: 'Unsecured Misleading URL (.cc domain)',
        explanation: 'The link uses HTTP (not HTTPS) and an unofficial .cc domain rather than the legitimate courier portal (such as pos.com.my).',
        isSuspicious: true
      }
    ],
    actions: [
      {
        id: 'a1-safe',
        title: 'Check the delivery status on the official courier app or tracking site',
        description: 'Do not click the SMS link. Open the courier service app directly or enter the tracking number on their official website.',
        isSafe: true,
        consequence: 'Safe Decision! By checking the official portal independently, you verify whether a real package exists without exposing your financial information.'
      },
      {
        id: 'a1-pay',
        title: 'Click the link and pay RM2.50 immediately to avoid cancellation',
        description: 'Follow the link provided in the SMS and key in your debit card details on the form.',
        isSafe: false,
        consequence: 'Risky Action! The link leads to a counterfeit payment portal designed to steal your debit card number, CVV code, and banking credentials.'
      },
      {
        id: 'a1-reply',
        title: 'Reply to the SMS with your home address and IC number',
        description: 'Text back the sender to provide your personal identity details.',
        isSafe: false,
        consequence: 'Risky Action! Replying confirms that your phone number is active and hands your personal identification data directly to scammers for identity theft.'
      }
    ]
  },
  {
    id: 2,
    title: 'Case 02 — Urgent Bank Account Suspension Alert',
    scenarioContext: 'An urgent SMS arrives claiming your bank account has been locked due to suspicious activity:',
    format: 'sms',
    sender: 'MY-BANK-ALERT',
    receivedTime: 'Today at 02:15 PM',
    urgencyBadge: 'Urgent: Account Suspended',
    body: 'PERINGATAN KESELAMATAN: Akaun perbankan internet anda telah digantung akibat percubaan akses tanpa kebenaran. Sila sahkan maklumat dan nombor TAC anda di: https://mybank-online-security.com/verify dalam tempoh 1 jam.',
    clues: [
      {
        id: 'c2-threat',
        targetText: 'telah digantung',
        label: 'Threat of Immediate Account Suspension',
        explanation: 'Claiming your account is suspended or blocked is a textbook psychological tactic used to trigger fear and bypass critical thinking.',
        isSuspicious: true
      },
      {
        id: 'c2-url',
        targetText: 'https://mybank-online-security.com/verify',
        label: 'Unofficial Phishing Domain',
        explanation: 'Bank Negara Malaysia has prohibited banks from sending hyperlinks via SMS. Legitimate commercial banks never use generic domains like mybank-online-security.com.',
        isSuspicious: true
      },
      {
        id: 'c2-tac',
        targetText: 'nombor TAC anda',
        label: 'Demand for One-Time Authorization Code (TAC)',
        explanation: 'Banks will NEVER ask you to click a link to submit your TAC or OTP. Giving away your TAC allows attackers to authorize fraudulent transfers.',
        isSuspicious: true
      }
    ],
    actions: [
      {
        id: 'a2-safe',
        title: 'Call the official bank hotline printed on the back of your bank card',
        description: 'Ignore the link. Dial the trusted customer service number from your physical card or open your official banking app directly.',
        isSafe: true,
        consequence: 'Safe Decision! Calling the official hotline ensures you speak with legitimate bank officers who can confirm that your account is completely safe.'
      },
      {
        id: 'a2-login',
        title: 'Open the link and enter your username, password, and TAC to unblock it',
        description: 'Type in your banking credentials to complete the verification form.',
        isSafe: false,
        consequence: 'Risky Action! The fake form captures your credentials in real-time. Attackers immediately use your password and TAC to drain your savings.'
      },
      {
        id: 'a2-wait',
        title: 'Ignore it and forward the SMS to your contacts to ask if their bank did the same',
        description: 'Send the suspicious link to family and friends on WhatsApp.',
        isSafe: false,
        consequence: 'Risky Action! Forwarding scam links spreads the danger to elderly relatives or friends who might accidentally click and fall victim.'
      }
    ]
  },
  {
    id: 3,
    title: 'Case 03 — Festive Season Cash Prize Notification',
    scenarioContext: 'You receive an unexpected email congratulating you on winning a government cash assistance lucky draw:',
    format: 'email',
    sender: 'Bantuan Khas Kerajaan',
    senderAddress: 'hadiah-bonus@ewallet-claim-2025.com',
    subject: 'Tahniah! Anda telah terpilih untuk menerima Bantuan Khas RM1,000',
    receivedTime: 'Yesterday at 04:30 PM',
    urgencyBadge: 'Claim within 24 Hours',
    body: 'Pelanggan yang dihormati,\n\nNombor telefon anda telah dicabut sebagai pemenang Bantuan Musim Perayaan sebanyak RM1,000.\n\nUntuk menyalurkan wang tunai terus ke akaun Touch \'n Go eWallet anda, sila muat turun borang pendaftaran di bawah dan masukkan nombor PIN keselamatan 6-digit eWallet anda.',
    attachmentName: 'Borang_Penebusan_Bantuan_Tunai.apk',
    clues: [
      {
        id: 'c3-sender',
        targetText: 'hadiah-bonus@ewallet-claim-2025.com',
        label: 'Suspicious Free-Domain Address',
        explanation: 'Government agencies and legitimate financial services operate from official domains (.gov.my or .com.my), not disposable domains like ewallet-claim-2025.com.',
        isSuspicious: true
      },
      {
        id: 'c3-apk',
        targetText: 'Borang_Penebusan_Bantuan_Tunai.apk',
        label: 'Dangerous Android Package (.apk) Attachment',
        explanation: 'Forms should be PDF or web pages. An APK file is an executable Android application that installs malware or keyloggers to spy on your phone.',
        isSuspicious: true
      },
      {
        id: 'c3-pin',
        targetText: 'nombor PIN keselamatan 6-digit',
        label: 'Request for Confidential eWallet PIN',
        explanation: 'Your 6-digit wallet PIN is your personal digital signature. No legitimate aid program will ever require your PIN to transfer funds to you.',
        isSuspicious: true
      }
    ],
    actions: [
      {
        id: 'a3-safe',
        title: 'Delete the email and do not open the APK attachment',
        description: 'Recognize that unrequested prize claims are fraudulent. Check official government channels (such as STR / e-Kasih portals) if unsure.',
        isSafe: true,
        consequence: 'Safe Decision! You prevented malicious software from being installed on your device and protected your secret eWallet credentials.'
      },
      {
        id: 'a3-download',
        title: 'Download and install the APK to claim the RM1,000 grant',
        description: 'Allow unknown app installations on your phone and open the file.',
        isSafe: false,
        consequence: 'Risky Action! The APK installs spyware that intercepts your incoming SMS messages (including bank OTPs) and compromises your device.'
      },
      {
        id: 'a3-reply',
        title: 'Reply to the email asking if they can bank in the money to your account instead',
        description: 'Send your bank account details to the sender.',
        isSafe: false,
        consequence: 'Risky Action! Engaging with the scammer exposes your contact details and invites targeted phishing attempts tailored to your bank.'
      }
    ]
  },
  {
    id: 4,
    title: 'Case 04 — Utility Electricity Shutoff Warning',
    scenarioContext: 'An email arrives with an alarming notice claiming your home electricity will be cut off today:',
    format: 'email',
    sender: 'Jabatan Pengebilan Elektrik',
    senderAddress: 'billing-support@tenaga-online-alert.xyz',
    subject: 'NOTIS AKHIR: Bekalan elektrik anda akan dipotong dalam 2 Jam!',
    receivedTime: 'Today at 07:15 AM',
    urgencyBadge: 'Cutoff in 2 Hours',
    body: 'Pelanggan yang dihormati, akaun anda mempunyai tunggakan bil tertunggak sebanyak RM84.20. Tindakan pemotongan bekalan elektrik serta-merta akan dilaksanakan dalam tempoh 2 Jam melainkan pembayaran disahkan sekarang di: http://tenaga-quickpay.xyz/bill\n\nSila masukkan kata laluan perbankan dan nombor TAC untuk pengesahan bayaran segera.',
    clues: [
      {
        id: 'c4-domain',
        targetText: 'billing-support@tenaga-online-alert.xyz',
        label: 'Unofficial Disposable Domain (.xyz)',
        explanation: 'Utility providers use official corporate domains (e.g. tnb.com.my). They never send billing warnings from cheap .xyz domains.',
        isSuspicious: true
      },
      {
        id: 'c4-time',
        targetText: 'dalam tempoh 2 Jam',
        label: 'Extreme 2-Hour Threat',
        explanation: 'Regulated utility companies have strict legal notice periods and never terminate power with an unannounced 2-hour email deadline.',
        isSuspicious: true
      },
      {
        id: 'c4-link',
        targetText: 'http://tenaga-quickpay.xyz/bill',
        label: 'Insecure External Payment Link',
        explanation: 'The link leads to an unencrypted (HTTP) scam portal disguised as a billing page to steal your banking login credentials.',
        isSuspicious: true
      },
      {
        id: 'c4-creds',
        targetText: 'kata laluan perbankan dan nombor TAC',
        label: 'Demand for Online Banking Password & TAC',
        explanation: 'Paying a utility bill only requires your bill account number. A utility company will never ask for your private banking password or TAC.',
        isSuspicious: true
      }
    ],
    actions: [
      {
        id: 'a4-safe',
        title: 'Check your bill through the official utility app or visit a physical kiosk/post office',
        description: 'Verify your account balance independently using trusted, official billing channels.',
        isSafe: true,
        consequence: 'Safe Decision! Independent verification reveals whether you actually owe anything, preventing you from falling into the fake bill scam.'
      },
      {
        id: 'a4-pay',
        title: 'Click the link and pay RM84.20 quickly so the power stays on',
        description: 'Follow the link and provide your banking details immediately.',
        isSafe: false,
        consequence: 'Risky Action! Your online banking username, password, and TAC are harvested, allowing the scammer to drain your bank balance.'
      },
      {
        id: 'a4-attach',
        title: 'Reply to the sender attaching your latest monthly bank statement',
        description: 'Provide proof of prior bill payments to the sender address.',
        isSafe: false,
        consequence: 'Risky Action! Sending bank statements gives identity thieves your full name, home address, account numbers, and transaction history.'
      }
    ]
  },
  {
    id: 5,
    title: 'Case 05 — Emergency Highway Distress Message from "Family"',
    scenarioContext: 'You receive an urgent WhatsApp message from an unknown number with a relative’s profile photo:',
    format: 'sms',
    sender: 'Unknown Number (+6019-338-9210)',
    receivedTime: 'Today at 05:45 PM',
    urgencyBadge: 'Family Emergency',
    body: 'Salam Makcik/Pakcik, telefon saya jatuh dalam air tadi jadi saya guna telefon kawan. Kereta saya rosak tepi jalan kat lebuhraya sekarang dan bateri kawan pun nak habis. Boleh tolong pindahkan RM350 ke akaun bengkel kawan saya: Maybank 1140-2938-1209 sekarang? Saya bayar balik malam nanti.',
    clues: [
      {
        id: 'c5-number',
        targetText: '+6019-338-9210',
        label: 'Unknown Phone Number Claiming Borrowed Phone',
        explanation: 'Scammers frequently claim "my phone broke / fell into water" to explain why they are contacting you from an unfamiliar number.',
        isSuspicious: true
      },
      {
        id: 'c5-account',
        targetText: 'akaun bengkel kawan saya: Maybank 1140-2938-1209',
        label: 'Request to Transfer to an Unrelated Third-Party Account',
        explanation: 'Scammers use "mule accounts" belonging to strangers to receive stolen funds before vanishing, making the money untraceable.',
        isSuspicious: true
      },
      {
        id: 'c5-panic',
        targetText: 'bateri kawan pun nak habis',
        label: 'Pressure to Act Before Calling',
        explanation: 'Claiming the phone battery is dying is a deliberate trick to discourage you from calling them to hear their real voice.',
        isSuspicious: true
      }
    ],
    actions: [
      {
        id: 'a5-safe',
        title: 'Call your relative directly on their known regular phone number or ask other family members',
        description: 'Pause and verify through trusted channels before sending any money.',
        isSafe: true,
        consequence: 'Safe Decision! Calling the relative on their known number or contacting their parents reveals they are safe at home and their profile photo was cloned.'
      },
      {
        id: 'a5-transfer',
        title: 'Transfer RM350 immediately to help family in an emergency',
        description: 'Send the funds to the third-party bank account right away.',
        isSafe: false,
        consequence: 'Risky Action! The money is instantly withdrawn by a scam syndicate through a mule account, and your relative never receives any help.'
      },
      {
        id: 'a5-partial',
        title: 'Transfer RM50 first just to check if the recipient name matches',
        description: 'Send a partial amount to test the account.',
        isSafe: false,
        consequence: 'Risky Action! Even small test transfers lose money to scammers and signal that your phone number is susceptible to manipulation.'
      }
    ]
  }
];
