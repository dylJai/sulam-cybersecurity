import { FictionalAccount, LabPasswordOption, SecurityChecklistItem } from '@/types/game';

export const initialAccountsBm: FictionalAccount[] = [
  {
    id: 'acc-email',
    name: 'Emel Utama Peribadi',
    serviceType: 'email',
    identifier: 'ali.kampung@email.com',
    currentPassword: 'Kampung123!',
    hasMFA: false,
    isBreached: false,
    statusNotes: 'Digunakan untuk set semula kata laluan, notis bank, dan urusan peribadi penting.'
  },
  {
    id: 'acc-social',
    name: 'Akaun Media Sosial',
    serviceType: 'social',
    identifier: '@pak_ali_desa',
    currentPassword: 'Kampung123!',
    hasMFA: false,
    isBreached: false,
    statusNotes: 'Mengandungi senarai kenalan, gambar keluarga, dan mesej peribadi.'
  },
  {
    id: 'acc-shopping',
    name: 'Portal Beli-Belah Dalam Talian',
    serviceType: 'shopping',
    identifier: 'PasarOnline.my',
    currentPassword: 'Kampung123!',
    hasMFA: false,
    isBreached: false,
    statusNotes: 'Menyimpan alamat rumah dan maklumat kad debit/kredit yang dipautkan.'
  }
];

export const initialAccountsEn: FictionalAccount[] = [
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

export const passwordLabOptionsBm: LabPasswordOption[] = [
  {
    id: 'pw-short',
    label: 'Pilihan A: Pendek & Mudah Diteka',
    passwordText: 'password123',
    entropy: 'very-weak',
    crackTimeEstimate: 'Kurang 1 milisaat',
    characteristics: [
      'Perkataan kamus yang sangat biasa',
      'Nombor berturutan yang mudah diteka (123)',
      'Antara 10 kata laluan paling kerap bocor di dunia'
    ],
    isSafest: false,
    explanation: 'Kata laluan pendek dan biasa ditebak dalam sekelip mata oleh komputer penggodam menggunakan senarai kamus automatik.'
  },
  {
    id: 'pw-personal',
    label: 'Pilihan B: Maklumat Peribadi + Simbol',
    passwordText: 'Kamal1985!',
    entropy: 'weak',
    crackTimeEstimate: 'Kurang 5 saat',
    characteristics: [
      'Menggunakan nama dan tahun kelahiran',
      'Mudah dicari daripada profil Facebook atau kad pengenalan',
      'Menambah tanda seru (!) tidak mencukupi untuk menghalang bot penggodam'
    ],
    isSafest: false,
    explanation: 'Penjenayah siber menggunakan maklumat yang anda kongsikan di media sosial (nama anak, tarikh lahir) untuk menjana kata laluan tekaan.'
  },
  {
    id: 'pw-passphrase',
    label: 'Pilihan C: Frasa Laluan Panjang 4 Perkataan',
    passwordText: 'kucing-suka-makan-ikan-kembung',
    entropy: 'strong',
    crackTimeEstimate: 'Ribuan Tahun',
    characteristics: [
      'Sepanjang 31 aksara (Panjang adalah Kunci Utama!)',
      '5 perkataan biasa yang digabungkan bersama',
      'Sangat mudah diingati manusia, tetapi mustahil diteka oleh komputer penjenayah'
    ],
    isSafest: true,
    explanation: 'Panjang kata laluan menggandakan kesukaran matematik tekaan komputer secara eksponen, manakala fikiran anda mudah membayangkan ceritanya.'
  }
];

export const passwordLabOptionsEn: LabPasswordOption[] = [
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
    passwordText: 'bicycle-yellow-morning-mountain',
    entropy: 'strong',
    crackTimeEstimate: 'Thousands of years',
    characteristics: [
      '31 characters long (Length is King!)',
      '4 random, memorable words chained together',
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

export const securityChecklistBm: SecurityChecklistItem[] = [
  {
    id: 'sec-unique',
    title: 'Gunakan Kata Laluan Berbeza Bagi Setiap Akaun',
    impactScore: 20,
    shortDescription: 'Pastikan kebocoran pada satu laman beli-belah tidak menjejaskan emel atau akaun bank anda.',
    howItProtects: 'Menghalang helah "Pencuri Cuba Password Sama" (Credential Stuffing). Jika satu laman bocor, akaun lain tetap selamat.',
    isEssential: true
  },
  {
    id: 'sec-2fa',
    title: 'Aktifkan Pengesahan Dua Faktor (2FA / MFA)',
    impactScore: 25,
    shortDescription: 'Wajibkan pengesahan kedua pada telefon pintar anda sebelum boleh log masuk.',
    howItProtects: 'Bertindak seperti kunci mangga kedua. Walaupun penjenayah tahu kata laluan anda, mereka tetap disekat tanpa telefon fizikal anda.',
    isEssential: true
  },
  {
    id: 'sec-manager',
    title: 'Gunakan Pengurus Kata Laluan (Password Manager)',
    impactScore: 20,
    shortDescription: 'Biar peti besi digital menjana dan mengingati 30+ kata laluan sukar untuk anda.',
    howItProtects: 'Menghilangkan tabiat mengulang kata laluan yang sama. Anda hanya perlu mengingati satu frasa laluan utama.',
    isEssential: true
  },
  {
    id: 'sec-recovery',
    title: 'Kemaskini Maklumat Pemulihan Akaun',
    impactScore: 15,
    shortDescription: 'Pastikan nombor telefon dan emel sandaran adalah yang terkini sekiranya berlaku kecemasan.',
    howItProtects: 'Membolehkan anda mengambil semula kawalan akaun dengan pantas jika terdapat cubaan pencerobohan.',
    isEssential: true
  },
  {
    id: 'sec-otp-rule',
    title: 'Jangan Sesekali Kongsi Kod SMS 6-Digit (OTP / TAC)',
    impactScore: 20,
    shortDescription: 'Anggap kod 6-digit seperti kunci rumah peribadi yang tidak boleh dibaca kepada orang lain.',
    howItProtects: 'Menyekat sindiket yang mendakwa mereka "tersalah hantar kod 6-digit ke nombor anda".',
    isEssential: true
  }
];

export const securityChecklistEn: SecurityChecklistItem[] = [
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

// Default exports for backward compatibility
export const initialAccounts = initialAccountsBm;
export const passwordLabOptions = passwordLabOptionsBm;
export const securityChecklist = securityChecklistBm;

export const getAccountWorkshopData = (language: 'bm' | 'en' = 'bm') => {
  return {
    initialAccounts: language === 'en' ? initialAccountsEn : initialAccountsBm,
    passwordLabOptions: language === 'en' ? passwordLabOptionsEn : passwordLabOptionsBm,
    securityChecklist: language === 'en' ? securityChecklistEn : securityChecklistBm,
    upgradedPassphrases
  };
};
