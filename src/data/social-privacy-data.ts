import { ChallengeMeta } from '@/types/challenge';

export interface SocialPrivacyCase {
  id: string;
  title: string;
  category: 'AUDIT PRIVASI PROFIL' | 'PENGESAN KLON SUARA AI' | 'PROFILE PRIVACY AUDIT' | 'AI VOICE CLONE DETECTOR';
  profileOwner: string;
  postContent: {
    text: string;
    imageCaption: string;
    privacySetting: string;
    aiVoiceIllustrationUrl?: string;
    exampleImages?: {
      id: string;
      title: string;
      tag: string;
      imageUrl?: string;
      details: string[];
      warningNote: string;
    }[];
  };
  leakItems: {
    id: string;
    label: string;
    dangerLevel: 'TINGGI' | 'KRITIKAL' | 'SEDERHANA' | 'HIGH' | 'CRITICAL' | 'MODERATE';
    isVulnerability: boolean;
    explanation: string;
  }[];
  actions: {
    id: string;
    title: string;
    description: string;
    isSafe: boolean;
    consequence: string;
  }[];
}

export const socialPrivacyCases: SocialPrivacyCase[] = [
  {
    id: 'soc-01',
    title: 'Audit Hantaran Facebook Awam "Percutian Kami Sekeluarga"',
    category: 'AUDIT PRIVASI PROFIL',
    profileOwner: 'Kak Salmah (Akaun Facebook Awam)',
    postContent: {
      text: `"Alhamdulillah akhirnya impian sekeluarga tercapai! Kami bertolak ke London hari ini selama 2 minggu. Rumah kami di Taman Melati akan kosong sampai hujung bulan. Doakan keselamatan kami ya kawan-kawan semua! ❤️✈️"`,
      imageCaption: 'Foto menunjukkan: Pas Masuk Penerbangan (Boarding Pass) dengan Kod Bar PNR yang jelas, Kunci Rumah dengan tag alamat, dan Gambar Anak memakai lencana sekolah rendah.',
      privacySetting: 'AWAM (PUBLIC)',
      exampleImages: [
        {
          id: 'img-boarding-pass',
          title: 'Pas Masuk Penerbangan (Boarding Pass)',
          tag: 'KOD BAR SENSITIF',
          imageUrl: '/images/social-privacy/boarding-pass.png',
          details: [
            'Nama Penumpang: SALMAH / AHMAD MRS',
            'Penerbangan: MH 002 (KUL ➔ LHR London)',
            'No Tempat Duduk: 14A | Pintu: C12',
            'Kod PNR Booking: K7X9LQ'
          ],
          warningNote: 'Kod bar mengandungi Nombor Pasport, No. Telefon, dan PNR yang boleh dicuri orang asing!'
        },
        {
          id: 'img-keys',
          title: 'Foto Kunci Rumah & Tag Alamat',
          tag: 'LOKASI RUMAH KOSONG',
          imageUrl: '/images/social-privacy/house-keys.png',
          details: [
            'Tag Kunci: "No 12, Jalan Melati 4"',
            'Status: Rumah kosong 2 minggu',
            'Kawasan: Taman Melati, Selangor'
          ],
          warningNote: 'Mengumumkan rumah tidak berpenghuni membuka peluang keemasan kepada perompak pecah rumah!'
        },
        {
          id: 'img-badge',
          title: 'Foto Anak Memakai Pakaian Seragam',
          tag: 'IDENTITI KANAK-KANAK',
          imageUrl: '/images/social-privacy/school-badge.png',
          details: [
            'Nama Anak: Farhan (Tahun 4)',
            'Lencana: SK Taman Melati',
            'Sesi Persekolahan: Sesi Pagi'
          ],
          warningNote: 'Mendedahkan nama anak dan sekolah harian memudahkan penjenayah melakukan penipuan penculikan palsu!'
        }
      ]
    },
    leakItems: [
      {
        id: 'leak-empty-house',
        label: 'Makluman rumah kosong selama 2 minggu kepada umum di Facebook',
        dangerLevel: 'KRITIKAL',
        isVulnerability: true,
        explanation: 'Memberitahu orang asing bahawa rumah anda tidak berpenghuni membuka peluang keemasan kepada sindiket pecah rumah.'
      },
      {
        id: 'leak-barcode',
        label: 'Kod bar pada pas masuk penerbangan (Boarding Pass)',
        dangerLevel: 'KRITIKAL',
        isVulnerability: true,
        explanation: 'Sesiapa sahaja boleh mengimbas kod bar tersebut untuk mencuri nombor pasport, nombor telefon, nombor tiket, dan menukar tempat duduk atau membatalkan penerbangan anda!'
      },
      {
        id: 'leak-child-badge',
        label: 'Lencana sekolah dan nama anak pada pakaian seragam',
        dangerLevel: 'TINGGI',
        isVulnerability: true,
        explanation: 'Mendedahkan lokasi sekolah harian anak memudahkan penjenayah melakukan penipuan penculikan atau penjejakan fizikal.'
      },
      {
        id: 'leak-congrats',
        label: 'Ucapan "Alhamdulillah akhirnya impian sekeluarga tercapai"',
        dangerLevel: 'SEDERHANA',
        isVulnerability: false,
        explanation: 'Ungkapan rasa syukur dan kegembiraan peribadi yang tidak mengandungi data sensitif fizikal mahupun digital.'
      }
    ],
    actions: [
      {
        id: 'act-leave-public',
        title: 'Biarkan hantaran tersebut berstatus Awam supaya ramai yang dapat tonton',
        description: 'Mendapat banyak tanda suka (likes) daripada pengguna Facebook lain.',
        isSafe: false,
        consequence: 'BAHAYA! Data peribadi dan jadual pergerakan anda kini boleh dibaca oleh mana-mana orang asing di internet.'
      },
      {
        id: 'act-safe',
        title: 'Padam hantaran tersebut, tutup maklumat sensitif (kaburkan kod bar), dan tukar tetapan ke "Rakan Sahaja"',
        description: 'Kongsi foto percutian selepas pulang ke tanah air demi keselamatan harta benda.',
        isSafe: true,
        consequence: 'CEMERLANG! Anda melindungi keselamatan rumah dan privasi data pasport keluarga daripada dieksploitasi penjenayah siber.'
      }
    ]
  },
  {
    id: 'soc-02',
    title: 'Panggilan Nota Suara Klon AI Anak Meminta Wang Cemas',
    category: 'PENGESAN KLON SUARA AI',
    profileOwner: 'Nota Suara WhatsApp Daripada Nombor Tidak Dikenali',
    postContent: {
      text: `[Audio Nota Suara]: "Ibu! Ini Farhan bu... Tolong Farhan bu! Telefon Farhan hilang kena ragut kat stesen bas. Farhan guna telefon kawan ni. Farhan perlukan RM1,500 sekarang bu untuk bayar duit hospital kawan Farhan! Tolong transfer ke akaun kawan Farhan ni segera bu, jangan telefon nombor lama Farhan!"`,
      imageCaption: 'Suara dalam audio 95% sangat menyerupai suara anak lelaki anda (Farhan) kerana teknologi klon suara AI (Voice Cloning) yang menggunakan sampel video TikTok anak anda.',
      privacySetting: 'AWAM (PUBLIC)',
      aiVoiceIllustrationUrl: '/images/social-privacy/ai-voice-clone.png'
    },
    leakItems: [
      {
        id: 'leak-voice-clone',
        label: 'Suara anak dijana menggunakan sampel video awam di media sosial (TikTok)',
        dangerLevel: 'KRITIKAL',
        isVulnerability: true,
        explanation: 'Kecerdasan buatan (AI) hari ini hanya memerlukan rakaman suara 3 saat daripada video TikTok untuk menghasilkan klon suara yang sangat realistik.'
      },
      {
        id: 'leak-dont-call',
        label: 'Arahan tegas "Jangan telefon nombor telefon lama saya"',
        dangerLevel: 'KRITIKAL',
        isVulnerability: true,
        explanation: 'Penjenayah sengaja melarang anda menelefon nombor asal anak kerana nombor telefon sebenar anak anda sebenarnya aktif dan tidak hilang!'
      },
      {
        id: 'leak-friend-account',
        label: 'Mendesak pindahan wang kecemasan ke akaun pihak ketiga (kawan)',
        dangerLevel: 'TINGGI',
        isVulnerability: true,
        explanation: 'Akaun pihak ketiga tersebut sebenarnya adalah akaun keldai milik sindiket penipuan AI.'
      }
    ],
    actions: [
      {
        id: 'act-panic-send',
        title: 'Pindahkan RM1,500 serta-merta kerana suara tersebut sebiji seperti anak anda',
        description: 'Bimbang anak berada dalam kesusahan di hospital.',
        isSafe: false,
        consequence: 'DIPERDAYA! Suara tersebut adalah klon AI. Anak anda sebenarnya sedang lena tidur di bilik asramanya.'
      },
      {
        id: 'act-safe',
        title: 'Gunakan "Kata Laluan Rahsia Keluarga" atau hubungi nombor telefon sebenar anak anda',
        description: 'Tanya soalan peribadi yang hanya anak anda sahaja tahu jawapannya sebelum membuat sebarang transaksi.',
        isSafe: true,
        consequence: 'PANDAI & SELAMAT! Apabila anda meminta "Kata Laluan Rahsia Keluarga", penjenayah AI terus mematikan perbualan kerana tidak mampu menjawabnya!'
      }
    ]
  }
];

export const socialPrivacyCasesEn: SocialPrivacyCase[] = [
  {
    id: 'soc-01',
    title: 'Public Facebook Post Audit "Our Family Vacation Abroad"',
    category: 'PROFILE PRIVACY AUDIT',
    profileOwner: 'Kak Salmah (Public Facebook Account)',
    postContent: {
      text: `"Praise God our lifelong family dream has come true! We are flying off to London today for 2 weeks. Our home in Taman Melati will be vacant until end of the month. Pray for our safe journey dear friends! ❤️✈️"`,
      imageCaption: 'Photo shows: Airline Boarding Pass with high-res PNR Barcode, House Key set with address tag, and Child in primary school uniform badge.',
      privacySetting: 'PUBLIC',
      exampleImages: [
        {
          id: 'img-boarding-pass',
          title: 'Airline Boarding Pass',
          tag: 'SENSITIVE BARCODE',
          imageUrl: '/images/social-privacy/boarding-pass.png',
          details: [
            'Passenger: SALMAH / AHMAD MRS',
            'Flight: MH 002 (KUL ➔ LHR London)',
            'Seat: 14A | Gate: C12',
            'PNR Booking Code: K7X9LQ'
          ],
          warningNote: 'Barcodes embed Passport Number, Mobile Phone, and PNR details that can be extracted to hijack flights!'
        },
        {
          id: 'img-keys',
          title: 'House Keys & Address Tag',
          tag: 'UNOCCUPIED HOUSE LOCATION',
          imageUrl: '/images/social-privacy/house-keys.png',
          details: [
            'Key Tag: "No 12, Jalan Melati 4"',
            'Status: House vacant for 2 weeks',
            'Area: Taman Melati, Selangor'
          ],
          warningNote: 'Broadcasting an empty home provides a golden invitation for burglary rings!'
        },
        {
          id: 'img-badge',
          title: 'Child in School Uniform Photo',
          tag: 'MINOR IDENTIFIER',
          imageUrl: '/images/social-privacy/school-badge.png',
          details: [
            'Child Name: Farhan (Grade 4)',
            'School Badge: SK Taman Melati',
            'Daily Session: Morning Class'
          ],
          warningNote: 'Exposing children\'s names and school locations enables kidnapper extortion schemes!'
        }
      ]
    },
    leakItems: [
      {
        id: 'leak-empty-house',
        label: 'Broadcasting to the public that your house is vacant for 2 weeks',
        dangerLevel: 'CRITICAL',
        isVulnerability: true,
        explanation: 'Alerting strangers that your residence is empty invites residential break-ins and burglaries.'
      },
      {
        id: 'leak-barcode',
        label: 'Scannable barcode and PNR on the airline boarding pass',
        dangerLevel: 'CRITICAL',
        isVulnerability: true,
        explanation: 'Anyone can decode that barcode to steal passport numbers, ticket numbers, phone details, and alter or cancel flight itineraries.'
      },
      {
        id: 'leak-child-badge',
        label: 'Child\'s daily school uniform badge and name tag',
        dangerLevel: 'HIGH',
        isVulnerability: true,
        explanation: 'Exposing school locations enables impostors to engineer synthetic kidnapping and accident scams against parents.'
      },
      {
        id: 'leak-congrats',
        label: 'Phrase: "Praise God our lifelong family dream has come true!"',
        dangerLevel: 'MODERATE',
        isVulnerability: false,
        explanation: 'Personal sentiment and polite celebration that contains neither physical nor digital security vulnerabilities.'
      }
    ],
    actions: [
      {
        id: 'act-leave-public',
        title: 'Leave the post set to Public so more Facebook acquaintances can see it',
        description: 'Gain more likes and engagement from other Facebook users.',
        isSafe: false,
        consequence: 'DANGEROUS! Your personal itinerary and home location are exposed to anyone on the open internet.'
      },
      {
        id: 'act-safe',
        title: 'Delete post, redact sensitive data (blur barcodes), and restrict privacy to "Friends Only"',
        description: 'Post vacation photos after returning home to safeguard physical property.',
        isSafe: true,
        consequence: 'EXCELLENT! You protected your home from burglary and your family\'s passport credentials from identity theft.'
      }
    ]
  },
  {
    id: 'soc-02',
    title: 'AI Cloned Voice Note Call from Child Demanding Emergency Funds',
    category: 'AI VOICE CLONE DETECTOR',
    profileOwner: 'WhatsApp Voice Note from Unknown Number',
    postContent: {
      text: `[Audio Voice Note]: "Mum! It's Farhan... Please help me mum! My phone was snatched at the bus terminal. I am using my friend's phone. I urgently need RM1,500 now to settle my friend's emergency hospital bill! Please transfer to my friend's account immediately mum, do not call my old number!"`,
      imageCaption: 'The audio voice note matches your son\'s (Farhan) voice with 95% acoustic similarity generated via AI Voice Cloning using short clips from his public TikTok videos.',
      privacySetting: 'PUBLIC',
      aiVoiceIllustrationUrl: '/images/social-privacy/ai-voice-clone.png'
    },
    leakItems: [
      {
        id: 'leak-voice-clone',
        label: 'Child\'s voice synthesized using public short-form video clips (TikTok)',
        dangerLevel: 'CRITICAL',
        isVulnerability: true,
        explanation: 'Modern AI voice synthesizers require only 3 seconds of clean audio from public social media videos to clone realistic speech.'
      },
      {
        id: 'leak-dont-call',
        label: 'Strict instruction: "Do not call my old phone number"',
        dangerLevel: 'CRITICAL',
        isVulnerability: true,
        explanation: 'Scammers forbid calling the real number because your child\'s genuine phone is active and undamaged!'
      },
      {
        id: 'leak-friend-account',
        label: 'Demanding immediate wire transfer to a third-party (friend\'s) account',
        dangerLevel: 'HIGH',
        isVulnerability: true,
        explanation: 'The third-party bank account is a syndicate money mule designed to siphon funds beyond recall.'
      }
    ],
    actions: [
      {
        id: 'act-panic-send',
        title: 'Transfer RM1,500 immediately because the voice sounds exactly like your child',
        description: 'Terrified your child is suffering at the hospital.',
        isSafe: false,
        consequence: 'DECEIVED! The voice was an AI synthesis. Your child was safe and sound in their dormitory bedroom.'
      },
      {
        id: 'act-safe',
        title: 'Use the "Family Secret Safe Word" or call your child\'s real phone number directly',
        description: 'Ask a private question that only your authentic child could know before making any transfer.',
        isSafe: true,
        consequence: 'BRILLIANT & SECURE! When prompted for the Family Secret Safe Word, the AI syndicate immediately hung up because they had no answer!'
      }
    ]
  }
];

export const getSocialPrivacyCases = (language: 'bm' | 'en' = 'bm'): SocialPrivacyCase[] => {
  return language === 'en' ? socialPrivacyCasesEn : socialPrivacyCases;
};

export const socialPrivacyMeta: ChallengeMeta = {
  id: 'social-privacy',
  title: 'Misi 06: Privasi Media Sosial & Pengesan Klon AI',
  shortDescription: 'Audit hantaran Facebook yang mendedahkan kod bar tiket penerbangan dan rumah kosong. Tangkis panggilan klon suara AI menggunakan protokol Kata Laluan Rahsia Keluarga.',
  learningObjective: 'Mengesan kebocoran data peribadi di media sosial (*oversharing*), memahami ancaman penipuan klon suara AI (*deepfake voice*), dan mengamalkan perkataan rahsia keluarga.',
  difficulty: 'Pertengahan',
  estimatedTime: '5-7 Minit',
  iconName: 'UserCheck',
  accentColor: '#D9FA62',
  badgeText: 'PENGESAN DEEPFAKE',
  instructions: [
    'Periksa hantaran media sosial dan nota suara cemas di sebelah kiri.',
    'Tandakan bahagian yang membocorkan keselamatan fizikal dan identiti digital.',
    'Pelajari protokol "Kata Laluan Rahsia Keluarga" di sebelah kanan.',
    'Kukuhkan tetapan privasi akaun anda daripada intipan orang asing.'
  ],
  keyTakeaways: [
    'Jangan memuat naik gambar pas masuk penerbangan (*boarding pass*) kerana kod bar mengandungi maklumat pasport peribadi anda.',
    'Elakkan berkongsi jadual percutian yang mengesahkan rumah anda tidak berpenghuni.',
    'Tetapkan satu perkataan rahsia keluarga bagi mengesahkan sebarang panggilan kecemasan yang mendakwa anak atau pasangan meminta wang.'
  ],
  totalQuestions: 2,
  maxScore: 50
};

