import { ChallengeMeta } from '@/types/challenge';
import { RealWorldScamStory } from './call-scam-data';

export type RealWorldInvestmentStory = RealWorldScamStory;

export interface InvestmentScamCase {
  id: string;
  title: string;
  platform: string;
  schemeName: string;
  promisedRoi: string;
  depositRequired: string;
  realCaseExample?: RealWorldScamStory;
  chatTranscript: {
    sender: string;
    text: string;
    isBot: boolean;
  }[];
  scAlertListRecord: {
    entityName: string;
    isAlerted: boolean;
    reason: string;
  };
  redFlags: {
    id: string;
    flagText: string;
    isRedFlag: boolean;
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

export const realWorldInvestmentStories: RealWorldScamStory[] = [
  {
    id: 'inv-story-01',
    headline: 'Skim Emas & Saham Syariah Telegram: Ribuan Mangsa Rugi RM12.4 Juta',
    location: 'Seluruh Malaysia (Sindiket Telegram Ditumpaskan)',
    lossAmount: 'RM12,400,000 (Melibatkan 1,800 Mangsa)',
    storySnippet: 'Sindiket mencipta berpuluh grup Telegram bernama "Pelaburan Syariah Berkat VIP" dan memasukkan nombor orang ramai secara automatik. Admin kumpulan menggunakan gelaran "Ustaz" dan memuat naik gambar resit bank palsu serta cek bernilai puluhan ribu ringgit.',
    howScamWorked: 'Mangsa yang memindahkan RM500 diberitahu wang mereka kononnya telah menjadi RM15,000 dalam beberapa jam. Namun, apabila mangsa mahu mengeluarkan duit, admin mendakwa mangsa perlu membayar "Duti Setem & Cukai LHDN" RM3,500 dahulu. Mangsa terus membayar sehingga duit simpanan habis.',
    preventionTip: 'Tiada pelaburan sah di dunia yang memberi untung ribuan peratus dalam masa singkat. Sentiasa semak nama syarikat di portal Suruhanjaya Sekuriti Malaysia (sc.com.my) sebelum melabur.'
  },
  {
    id: 'inv-story-02',
    headline: 'Video AI Klon Tokoh Niaga Promosi Bot Kripto: Pesara Rugi RM110,000',
    location: 'Kuala Lumpur (Laporan Polis Sebenar)',
    lossAmount: 'RM110,000',
    storySnippet: 'Mangsa menonton iklan di Facebook memaparkan video seorang tokoh usahawan terkemuka Malaysia yang kononnya melancarkan platform dagangan AI automatik (Quantum AI) yang menjana 10% untung setiap hari.',
    howScamWorked: 'Video tokoh tersebut sebenarnya dihasilkan menggunakan teknologi kecerdasan buatan (Deepfake). Laman web yang mangsa lawati memaparkan graf dan angka keuntungan palsu. Apabila mangsa ingin membuat pengeluaran, akaunnya terus disekat.',
    preventionTip: 'Jangan percaya video promosi pelaburan di media sosial walaupun menampilkan wajah tokoh terkenal. Semak kesahihan di portal rasmi syarikat berdaftar sahaja.'
  }
];

export const realWorldInvestmentStoriesEn: RealWorldScamStory[] = [
  {
    id: 'inv-story-01',
    headline: 'Telegram Gold & Shariah Stock Scam: Thousands of Victims Lose RM12.4 Million',
    location: 'Nationwide Malaysia (Telegram Syndicate Busted)',
    lossAmount: 'RM12,400,000 (Over 1,800 Victims)',
    storySnippet: 'Syndicates generated dozens of Telegram groups named "VIP Shariah Blessed Investments" and auto-added public phone numbers. The group admin assumed religious titles and posted forged bank receipts and cheques.',
    howScamWorked: 'Victims who deposited RM500 were shown fabricated screenshots claiming their investment grew to RM15,000 in hours. When attempting to withdraw, admins demanded RM3,500 in "Stamp Duty & Tax Clearance" fees. Victims paid repeatedly until their savings were gone.',
    preventionTip: 'No legitimate investment yields thousands of percent returns in hours. Always search company names on the Securities Commission Malaysia portal (sc.com.my).'
  },
  {
    id: 'inv-story-02',
    headline: 'AI Deepfake Video of Corporate Tycoon Promotes Crypto Bot: Retiree Loses RM110,000',
    location: 'Kuala Lumpur (Actual Police Report)',
    lossAmount: 'RM110,000',
    storySnippet: 'The victim saw a Facebook ad showing an AI deepfake of a prominent Malaysian tycoon promoting an automated Quantum AI crypto bot guaranteeing 10% daily gains.',
    howScamWorked: 'The celebrity footage was synthesized with deepfake technology. When the victim attempted to withdraw simulated earnings, their account was frozen and they were asked for upfront clearance deposits.',
    preventionTip: 'Never trust investment endorsements on social media regardless of celebrity endorsements. Verify registrations through the Securities Commission portal.'
  }
];

export const investmentScamCases: InvestmentScamCase[] = [
  {
    id: 'inv-01',
    title: 'Grup Telegram "Pelaburan Emas Patuh Syariah VIP"',
    platform: 'Kumpulan Telegram (Dimasukkan Secara Automatik Tanpa Izin)',
    schemeName: 'Dana Amanah Emas Global Syariah',
    promisedRoi: 'Modal RM500 -> Pulangan RM12,500 Dalam Masa 6 Jam',
    depositRequired: 'RM500 (Pindahan ke Akaun Individu)',
    realCaseExample: realWorldInvestmentStories[0],
    chatTranscript: [
      {
        sender: 'Ustaz Hafiz (Admin Grup)',
        text: 'Alhamdulillah pakej slot pelaburan syariah slot terhad dibuka! Modal serendah RM500 sahaja, diuruskan oleh pakar broker emas berlesen. Pulangan dijamin 100% halal dan bebas risiko kerugian.',
        isBot: false
      },
      {
        sender: 'Kak Noraini (Ahli Grup)',
        text: 'Syukur Ya Allah baru dapat RM14,200 petang ni! Terima kasih Ustaz, duit terus masuk Maybank saya!',
        isBot: true
      },
      {
        sender: 'Haji Rosli (Ahli Grup)',
        text: '[Gambar Resit Bank Maybank RM25,000] Terbukti amanah dan berkesan, malam ni nak tambah modal lagi.',
        isBot: true
      }
    ],
    scAlertListRecord: {
      entityName: 'Dana Amanah Emas Global Syariah',
      isAlerted: true,
      reason: 'Tersenarai dalam Senarai Peringatan Pelabur Suruhanjaya Sekuriti Malaysia (SC Alert List) kerana menjalankan aktiviti pelaburan haram tanpa lesen.'
    },
    redFlags: [
      {
        id: 'rf-1',
        flagText: 'Janji pulangan tidak masuk akal (RM500 jadi RM12,500 dalam 6 jam)',
        isRedFlag: true,
        explanation: 'Tiada pelaburan sah di dunia yang mampu menjana keuntungan ribuan peratus dalam beberapa jam.'
      },
      {
        id: 'rf-2',
        flagText: 'Jaminan "100% Bebas Risiko Kerugian"',
        isRedFlag: true,
        explanation: 'Semua pelaburan sebenar mempunyai risiko naik turun pasaran. Jaminan untung tetap tanpa risiko adalah ciri khas skim cepat kaya.'
      },
      {
        id: 'rf-3',
        flagText: 'Penggunaan label agama dan nama "Patuh Syariah" tanpa sijil majlis rasmi',
        isRedFlag: true,
        explanation: 'Sindiket sering menunggang istilah agama untuk membina keyakinan palsu dalam kalangan komuniti kampung.'
      },
      {
        id: 'rf-4',
        flagText: 'Grup sembang menggunakan aplikasi mesej Telegram',
        isRedFlag: false,
        explanation: 'Aplikasi Telegram itu sendiri sah, tetapi keterbukaan fungsi jemputan automatik disalahgunakan oleh scammer.'
      }
    ],
    actions: [
      {
        id: 'act-invest',
        title: 'Pindahkan RM500 untuk cuba nasib',
        description: 'Jika rugi cuma RM500, tetapi jika untung dapat RM12,500.',
        isSafe: false,
        consequence: 'DITIPU! Selepas memindahkan RM500, admin akan mendakwa wang anda telah berkembang menjadi RM30,000 tetapi anda mesti membayar "yuran pelepasan kastam/cukai" RM3,000 lagi sebelum boleh dikeluarkan!'
      },
      {
        id: 'act-pm-members',
        title: 'Hantar mesej peribadi kepada ahli lain bertanyakan kesahihan resit bank',
        description: 'Tanya Kak Noraini atau Haji Rosli sama ada mereka betul-betul dapat duit.',
        isSafe: false,
        consequence: 'PERANGKAP! "Ahli-ahli" tersebut sebenarnya adalah akaun palsu atau bot yang dikawal oleh sindiket penipu yang sama!'
      },
      {
        id: 'act-ask-ssm',
        title: 'Minta admin kemukakan sijil daftar syarikat SSM melalui mesej',
        description: 'Meminta bukti dokumen pendaftaran perniagaan.',
        isSafe: false,
        consequence: 'BERISIKO! Pendaftaran SSM hanyalah pendaftaran nama kedai/perniagaan, BUKAN lesen mengambil wang pelaburan daripada orang awam.'
      },
      {
        id: 'act-safe',
        title: 'Semak Senarai Peringatan SC Malaysia, sekat admin, dan keluar daripada kumpulan',
        description: 'Semak portal sc.com.my dan laporkan kumpulan penipuan tersebut.',
        isSafe: true,
        consequence: 'TEPAT & BIJAK! Entiti ini sah disenaraihitamkan oleh Suruhanjaya Sekuriti Malaysia. Anda berjaya mengelak daripada menjadi mangsa skim cepat kaya!'
      }
    ]
  },
  {
    id: 'inv-02',
    title: 'Aplikasi Robot Kripto "Quantum AI Trader 2025"',
    platform: 'Iklan Tajaan Facebook Menampilkan Video Palsu (Deepfake) Tokoh Perniagaan',
    schemeName: 'Quantum AI Auto-Trading Platform',
    promisedRoi: 'Keuntungan Automatik 8% - 15% Setiap Hari',
    depositRequired: 'USD 250 (~RM1,150) Dalam Mata Wang Kripto',
    realCaseExample: realWorldInvestmentStories[1],
    chatTranscript: [
      {
        sender: 'Sokongan Teknikal Quantum',
        text: 'Sistem kecerdasan buatan (AI) kami menganalisis pasaran mata wang kripto dengan algoritma kuantum. Deposit minimum USD 250 untuk mengaktifkan bot dagangan automatik.',
        isBot: false
      },
      {
        sender: 'Sistem Dashboard',
        text: 'Graf Akaun Anda Menunjukkan Keuntungan: +$3,420 (Untung 1,300%)! Tekan butang "Keluarkan Wang" untuk memproses pengeluaran tunai.',
        isBot: true
      },
      {
        sender: 'Pegawai Pengeluaran',
        text: 'Untuk mengeluarkan keuntungan $3,420 anda, pihak berkuasa kewangan antarabangsa memerlukan bayaran yuran pengesahan AML bernilai $500 terlebih dahulu.',
        isBot: false
      }
    ],
    scAlertListRecord: {
      entityName: 'Quantum AI Auto-Trading Platform',
      isAlerted: true,
      reason: 'Tidak berdaftar dengan SC Malaysia dan beroperasi dari pelayan luar negara tanpa perlindungan undang-undang tempatan.'
    },
    redFlags: [
      {
        id: 'rf-1',
        flagText: 'Pengeluaran wang disyaratkan dengan bayaran wang tambahan dahulu',
        isRedFlag: true,
        explanation: 'Platform pelaburan sah akan menolak yuran transaksi daripada baki keuntungan, tidak pernah meminta mangsa memasukkan wang baharu.'
      },
      {
        id: 'rf-2',
        flagText: 'Graf keuntungan dalam laman web menunjukkan kenaikan 1,000% dalam masa seminggu',
        isRedFlag: true,
        explanation: 'Graf dan angka keuntungan pada papan pemuka adalah animasi nombor rekaan (fake dashboard) yang dikawal oleh penjenayah.'
      },
      {
        id: 'rf-3',
        flagText: 'Iklan menggunakan video suntingan tokoh korporat atau selebriti terkenal',
        isRedFlag: true,
        explanation: 'Sindiket menggunakan teknologi Deepfake (klon wajah dan suara) tokoh terkenal tanpa kebenaran.'
      }
    ],
    actions: [
      {
        id: 'act-pay-withdrawal',
        title: 'Bayar yuran $500 untuk mengeluarkan wang keuntungan $3,420',
        description: 'Bayar yuran tersebut kerana untungnya jauh lebih besar.',
        isSafe: false,
        consequence: 'KERUGIAN BERGANDA! Selepas anda membayar $500, akaun anda disekat sepenuhnya dan wang tersebut hilang selama-lamanya.'
      },
      {
        id: 'act-wait-see',
        title: 'Biarkan wang di dalam akaun selama 6 bulan untuk lihat untung bertambah',
        description: 'Menunggu dengan harapan boleh keluarkan tanpa yuran kemudian hari.',
        isSafe: false,
        consequence: 'TIDAK BERGUNA: Nombor di papan pemuka hanyalah ilusi digital. Duit asal anda sebenarnya sudah dipindahkan ke akaun sindiket luar negara.'
      },
      {
        id: 'act-invite-family',
        title: 'Ajak ahli keluarga sertai bersama untuk dapat bonus rujukan (referral)',
        description: 'Kongsi pautan platform kepada saudara-mara.',
        isSafe: false,
        consequence: 'AMAT MEMBAHAYAKAN! Anda menjerumuskan ahli keluarga ke dalam perangkap skim ponzi penipu.'
      },
      {
        id: 'act-safe',
        title: 'Hentikan transaksi serta-merta, jangan bayar sebarang wang tambahan, dan buat laporan polis',
        description: 'Kenal pasti helah "sunk cost trap" dan selamatkan baki simpanan anda.',
        isSafe: true,
        consequence: 'TINDAKAN TEPAT! Membayar wang tambahan kepada scammer pengeluaran tidak akan memulangkan modal anda. Menghentikan bayaran menyelamatkan anda daripada kerugian lebih parah!'
      }
    ]
  }
];

export const investmentScamCasesEn: InvestmentScamCase[] = [
  {
    id: 'inv-01',
    title: 'Telegram Group "VIP Shariah Compliant Gold Investment"',
    platform: 'Telegram Group (Auto-Added Without User Permission)',
    schemeName: 'Global Shariah Gold Trust Fund',
    promisedRoi: 'Capital RM500 -> Returns RM12,500 within 6 Hours',
    depositRequired: 'RM500 (Wire Transfer to Personal Bank Account)',
    realCaseExample: realWorldInvestmentStoriesEn[0],
    chatTranscript: [
      {
        sender: 'Ustaz Hafiz (Group Admin)',
        text: 'Praise be to God! Exclusive limited Shariah investment slots are now open! Entry capital from only RM500, managed by licensed gold broker specialists. Guaranteed 100% halal with zero loss risk.',
        isBot: false
      },
      {
        sender: 'Sister Noraini (Group Member)',
        text: 'Alhamdulillah I just received RM14,200 this afternoon! Thank you Ustaz, money arrived directly in my Maybank account!',
        isBot: true
      },
      {
        sender: 'Haji Rosli (Group Member)',
        text: '[Maybank RM25,000 Receipt Image] Proven trustworthy and effective. I am adding more capital tonight.',
        isBot: true
      }
    ],
    scAlertListRecord: {
      entityName: 'Global Shariah Gold Trust Fund',
      isAlerted: true,
      reason: 'Listed on the Securities Commission Malaysia Investor Alert List for conducting illegal unauthorized capital market activities without a license.'
    },
    redFlags: [
      {
        id: 'rf-1',
        flagText: 'Unrealistic return promises (RM500 turns into RM12,500 in 6 hours)',
        isRedFlag: true,
        explanation: 'No authentic investment in the world yields thousands of percent profit in a matter of hours.'
      },
      {
        id: 'rf-2',
        flagText: 'Guaranteed "100% Risk-Free Returns"',
        isRedFlag: true,
        explanation: 'All genuine investments bear market fluctuations. Guaranteed fixed profits with zero downside are the hallmark of Ponzi schemes.'
      },
      {
        id: 'rf-3',
        flagText: 'Exploitation of religious and "Shariah-Compliant" branding without regulatory certification',
        isRedFlag: true,
        explanation: 'Syndicates frequently weaponize religious terms to foster unearned trust among community members.'
      },
      {
        id: 'rf-4',
        flagText: 'The chat group operates on the Telegram messaging app',
        isRedFlag: false,
        explanation: 'Telegram is a legitimate platform, though its open invitation features are abused by scammers.'
      }
    ],
    actions: [
      {
        id: 'act-invest',
        title: 'Transfer RM500 to try your luck',
        description: 'Only RM500 at risk, but with a potential return of RM12,500.',
        isSafe: false,
        consequence: 'SCAMMED! After transferring RM500, admins will claim your funds grew to RM30,000 but you must pay RM3,000 in "Customs/Tax Clearance Fees" to withdraw!'
      },
      {
        id: 'act-pm-members',
        title: 'Privately message other group members to verify their bank receipts',
        description: 'Ask Sister Noraini or Haji Rosli if they actually received payouts.',
        isSafe: false,
        consequence: 'TRAP! Those "members" are shill accounts and automated bots operated by the exact same fraud syndicate!'
      },
      {
        id: 'act-ask-ssm',
        title: 'Ask the admin to share their SSM business registration certificate',
        description: 'Requesting documentation of business registration.',
        isSafe: false,
        consequence: 'HIGH RISK! An SSM business certificate only registers a business name—it is NOT a Securities Commission license to solicit investment funds.'
      },
      {
        id: 'act-safe',
        title: 'Check the SC Malaysia Investor Alert List, block admin, and exit the group',
        description: 'Verify on sc.com.my and report the fraudulent group.',
        isSafe: true,
        consequence: 'EXCELLENT DECISION! This entity is blacklisted by the Securities Commission Malaysia. You successfully dodged a get-rich-quick Ponzi trap!'
      }
    ]
  },
  {
    id: 'inv-02',
    title: 'Crypto Bot App "Quantum AI Trader 2025"',
    platform: 'Sponsored Facebook Ad Featuring Deepfake Video of Corporate Tycoon',
    schemeName: 'Quantum AI Auto-Trading Platform',
    promisedRoi: 'Automated 8% - 15% Daily Gains',
    depositRequired: 'USD 250 (~RM1,150) in Cryptocurrency',
    realCaseExample: realWorldInvestmentStoriesEn[1],
    chatTranscript: [
      {
        sender: 'Quantum Technical Support',
        text: 'Our quantum neural AI algorithms analyze cryptocurrency markets 24/7. Deposit a minimum of USD 250 to activate automated algorithmic trading.',
        isBot: false
      },
      {
        sender: 'Dashboard System',
        text: 'Your Account Performance Shows Total Profit: +$3,420 (1,300% Gain)! Click the "Withdraw Funds" button to initiate cashout.',
        isBot: true
      },
      {
        sender: 'Withdrawal Clearance Officer',
        text: 'To release your $3,420 profits, international financial regulators mandate an AML compliance fee of $500 prior to payout dispatch.',
        isBot: false
      }
    ],
    scAlertListRecord: {
      entityName: 'Quantum AI Auto-Trading Platform',
      isAlerted: true,
      reason: 'Unregistered with the Securities Commission Malaysia and operating offshore without local investor legal protections.'
    },
    redFlags: [
      {
        id: 'rf-1',
        flagText: 'Fund withdrawals are conditioned upon paying upfront advance fees',
        isRedFlag: true,
        explanation: 'Legitimate platforms deduct transaction fees directly from accumulated balances; they never demand new deposits to unlock earnings.'
      },
      {
        id: 'rf-2',
        flagText: 'Web portal charts claim 1,000% exponential gains within a single week',
        isRedFlag: true,
        explanation: 'Dashboard numbers and charts are synthetic animations (fake dashboard) manipulated by scammers.'
      },
      {
        id: 'rf-3',
        flagText: 'Ad uses modified video endorsements of prominent corporate leaders or celebrities',
        isRedFlag: true,
        explanation: 'Syndicates harvest video clips and generate AI Deepfakes to spoof celebrity endorsements without authorization.'
      }
    ],
    actions: [
      {
        id: 'act-pay-withdrawal',
        title: 'Pay the $500 fee to unlock your $3,420 in profits',
        description: 'Pay the fee because the reported profit is much larger.',
        isSafe: false,
        consequence: 'COMPOUNDED LOSS! After remitting $500, your account is permanently locked and all money is lost forever.'
      },
      {
        id: 'act-wait-see',
        title: 'Leave funds in the account for 6 months to see profits compound further',
        description: 'Waiting in hopes of avoiding withdrawal fees down the road.',
        isSafe: false,
        consequence: 'FUTILE: Numbers on the screen are digital illusions. Your initial deposit was exfiltrated into offshore crypto wallets long ago.'
      },
      {
        id: 'act-invite-family',
        title: 'Invite family members to join for referral commission bonuses',
        description: 'Share the link with family and friends.',
        isSafe: false,
        consequence: 'HIGHLY HARMFUL! You drag loved ones into an active financial trap.'
      },
      {
        id: 'act-safe',
        title: 'Halt all transactions immediately, refuse further payments, and file a police report',
        description: 'Recognize the sunk cost trap and protect remaining savings.',
        isSafe: true,
        consequence: 'WISE & DECISIVE! Paying ransom fees to scammer withdrawal desks never recovers lost funds. Stopping immediately prevented deeper financial harm!'
      }
    ]
  }
];

export const getInvestmentScamCases = (language: 'bm' | 'en' = 'bm'): InvestmentScamCase[] => {
  return language === 'en' ? investmentScamCasesEn : investmentScamCases;
};

export const getRealWorldInvestmentStories = (language: 'bm' | 'en' = 'bm'): RealWorldScamStory[] => {
  return language === 'en' ? realWorldInvestmentStoriesEn : realWorldInvestmentStories;
};

export const investmentScamMeta: ChallengeMeta = {
  id: 'investment-scam',
  title: 'Misi 05: Skim Pelaburan Telegram & Kripto Palsu',
  shortDescription: 'Bongkar kumpulan Telegram yang menjanjikan pulangan 500% dalam 24 jam. Gunakan Senarai Peringatan Pelabur SC Malaysia untuk menyemak status syarikat.',
  learningObjective: 'Mengenal pasti ciri-ciri skim cepat kaya dan ponzi, menyemak syarikat di portal Suruhanjaya Sekuriti (SC), dan menangkis helah testimoni palsu.',
  difficulty: 'Pertengahan',
  estimatedTime: '5-7 Minit',
  iconName: 'TrendingUp',
  accentColor: '#D9FA62',
  badgeText: 'PENYIASAT SKIM',
  instructions: [
    'Baca perbualan kumpulan Telegram dan paparan untung di sebelah kiri.',
    'Gunakan Alat Semakan Senarai Amaran Suruhanjaya Sekuriti (SC) di sebelah kanan.',
    'Tandakan ciri-ciri bahaya seperti jaminan keuntungan tetap dan ketiadaan risiko.',
    'Pilih langkah keselamatan yang rasional untuk melindungi simpanan anda.'
  ],
  keyTakeaways: [
    'Tiada pelaburan sah yang menjanjikan keuntungan ratusan peratus dalam tempoh beberapa jam.',
    'Sentiasa semak nama entiti di portal Suruhanjaya Sekuriti Malaysia (sc.com.my) sebelum melabur.',
    'Jangan sekali-kali membayar "yuran pengeluaran" untuk mengambil balik wang keuntungan pelaburan.'
  ],
  totalQuestions: 2,
  maxScore: 50
};

