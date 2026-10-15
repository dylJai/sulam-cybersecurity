import { ChallengeMeta } from '@/types/challenge';

export interface InvestmentScamCase {
  id: string;
  title: string;
  platform: string;
  schemeName: string;
  promisedRoi: string;
  depositRequired: string;
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

export const investmentScamCases: InvestmentScamCase[] = [
  {
    id: 'inv-01',
    title: 'Grup Telegram "Pelaburan Emas Patuh Syariah VIP"',
    platform: 'Telegram Group (Dimasukkan Secara Automatik Tanpa Izin)',
    schemeName: 'Dana Amanah Emas Global Syariah',
    promisedRoi: 'Modal RM500 -> Pulangan RM12,500 Dalam Masa 6 Jam',
    depositRequired: 'RM500 (Pindahan ke Akaun Individu)',
    chatTranscript: [
      {
        sender: 'Ustaz Hafiz (Admin)',
        text: 'Alhamdulillah pakej slot pelaburan syariah slot terhad dibuka! Modal serendah RM500 sahaja, diuruskan oleh pakar broker berlesen. Pulangan dijamin 100% halal dan bebas risiko kerugian.',
        isBot: false
      },
      {
        sender: 'Kak Noraini (Ahli Grup)',
        text: 'Syukur Ya Allah baru dapat RM14,200 petang ni! Terima kasih Ustaz, duit terus masuk Maybank saya!',
        isBot: true
      },
      {
        sender: 'Haji Rosli (Ahli Grup)',
        text: '[Gambar Resit Bank RM25,000] Terbukti amanah dan berkesan, malam ni nak tambah modal lagi.',
        isBot: true
      }
    ],
    scAlertListRecord: {
      entityName: 'Dana Amanah Emas Global Syariah',
      isAlerted: true,
      reason: 'Tersenarai dalam Senarai Peringatan Pelabur Suruhanjaya Sekuriti Malaysia (SC Alert List) kerana menjalankan aktiviti pasaran modal tanpa lesen yang sah.'
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
        explanation: 'Semua pelaburan sebenar mempunyai risiko pasaran. Jaminan pulangan tetap tanpa risiko adalah ciri khas skim penipuan.'
      },
      {
        id: 'rf-3',
        flagText: 'Penggunaan label agama dan istilah "Patuh Syariah" tanpa sijil majlis rasmi',
        isRedFlag: true,
        explanation: 'Sindiket sering menunggang istilah agama untuk membina keyakinan palsu mangsa komuniti.'
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
        id: 'act-safe',
        title: 'Semak Senarai Peringatan SC Malaysia, sekat admin, dan keluar daripada kumpulan',
        description: 'Semak portal sc.com.my dan laporkan kumpulan penipuan tersebut.',
        isSafe: true,
        consequence: 'TEPAT & BIJAK! Entiti ini sah disenaraihitamkan oleh Suruhanjaya Sekuriti Malaysia. Anda berjaya mengelak daripada menjadi mangsa skim cepat kaya!'
      },
      {
        id: 'act-pm-members',
        title: 'Hantar mesej peribadi kepada ahli lain bertanyakan kesahihan',
        description: 'Tanya Kak Noraini atau Haji Rosli sama ada mereka betul-betul dapat duit.',
        isSafe: false,
        consequence: 'PERANGKAP! "Ahli-ahli" tersebut sebenarnya adalah akaun palsu atau bot yang dikawal oleh scammer yang sama.'
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
      reason: 'Tidak berdaftar dengan SC Malaysia dan beroperasi dari pelayan luar pesisir tanpa perlindungan undang-undang tempatan.'
    },
    redFlags: [
      {
        id: 'rf-1',
        flagText: 'Pengeluaran wang disyaratkan dengan bayaran wang tambahan',
        isRedFlag: true,
        explanation: 'Platform pelaburan sah akan menolak yuran transaksi daripada baki keuntungan, tidak pernah meminta mangsa memasukkan wang baharu.'
      },
      {
        id: 'rf-2',
        flagText: 'Graf keuntungan dalam laman web menunjukkan kenaikan 1,000% dalam masa seminggu',
        isRedFlag: true,
        explanation: 'Graf dan angka keuntungan pada papan pemuka adalah animasi rekaan (*fake dashboard numbers*) yang dikawal oleh penjenayah.'
      },
      {
        id: 'rf-3',
        flagText: 'Iklan menggunakan nama tokoh korporat atau selebriti terkenal',
        isRedFlag: true,
        explanation: 'Sindiket menggunakan video suntingan atau klon suara AI (Deepfake) tokoh terkenal tanpa kebenaran.'
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
        id: 'act-safe',
        title: 'Hentikan transaksi serta-merta, jangan bayar sebarang wang tambahan, dan buat laporan polis',
        description: 'Kenal pasti helah "sunk cost trap" dan selamatkan baki simpanan anda.',
        isSafe: true,
        consequence: 'TINDAKAN TEPAT! Membayar wang tambahan kepada scammer pengeluaran tidak akan memulangkan modal anda. Menghentikan bayaran menyelamatkan anda daripada kerugian lebih parah!'
      }
    ]
  }
];

export const investmentScamMeta: ChallengeMeta = {
  id: 'investment-scam',
  title: 'Misi 06: Skim Pelaburan Telegram & Kripto Palsu',
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
