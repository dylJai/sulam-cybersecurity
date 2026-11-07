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
  },
  {
    id: 'inv-story-03',
    headline: 'Ribuan Pesara Rugi RM35 Juta Skim Pokok Durian Musang King & Kelulut',
    location: 'Pahang & Perak (Kes Sindiket Ditumpaskan)',
    lossAmount: 'RM35,000,000 (Lebih 1,200 Mangsa)',
    storySnippet: 'Syarikat pelaburan pertanian tidak berlesen memperdaya orang ramai melabur dalam skim ladang durian Musang King dengan janji dividen tetap 35% setiap 3 bulan.',
    howScamWorked: 'Sindiket menggunakan duit pelabur baharu untuk membayar dividen kepada pelabur lama (Skim Ponzi). Selepas setahun, syarikat ditutup dan pengarah melarikan diri ke luar negara.',
    preventionTip: 'Pelaburan pertanian sah mesti berdaftar di bawah Akta Skim Kepentingan SSM dan disahkan oleh Suruhanjaya Sekuriti Malaysia.'
  },
  {
    id: 'inv-story-04',
    headline: 'Graduan Ditipu RM18,000 Akibat Skim Tugasan e-Dagang Like & Subscribe',
    location: 'Johor Bahru, Johor',
    lossAmount: 'RM18,000 (Wang Simpanan & Pinjaman)',
    storySnippet: 'Mangsa ditawarkan kerja sambilan menekan butang like video YouTube. Mangsa diberi komisen RM15 pada mulanya, sebelum dipujuk memindahkan RM18,000 bagi tugasan pesanan VIP.',
    howScamWorked: 'Scammer memberikan umpan bayaran kecil untuk meraih kepercayaan, kemudian menahan wang modal besar mangsa dengan pelbagai alasan yuran pembatalan.',
    preventionTip: 'Tiada kerja sambilan sah yang mewajibkan pekerja memindahkan wang pendahuluan sendiri kepada majikan untuk menerima komisen.'
  },
  {
    id: 'inv-story-05',
    headline: 'Peniaga Tertipu Skim Sijil Simpanan Emas Hibah Bulanan RM90,000',
    location: 'Kota Bharu, Kelantan',
    lossAmount: 'RM90,000',
    storySnippet: 'Mangsa melabur dalam skim simpanan emas tanpa lesen yang menjanjikan hibah tunai 15% setiap bulan tanpa memegang sebarang jongkong emas fizikal.',
    howScamWorked: 'Syarikat tidak memiliki sebarang sandaran emas fizikal di bilik kebal. Operasi terbongkar apabila Bank Negara Malaysia membekukan akaun syarikat atas kesalahan aktiviti pengambilan deposit tanpa lesen.',
    preventionTip: 'Pastikan sebarang transaksi belian emas membolehkan anda memegang emas fizikal atau berurusan dengan institusi perbankan berlesen BNM.'
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
  },
  {
    id: 'inv-story-03',
    headline: 'Thousands of Retirees Defrauded of RM35 Million in Musang King Durian Scheme',
    location: 'Pahang & Perak (Syndicate Busted)',
    lossAmount: 'RM35,000,000 (Over 1,200 Victims)',
    storySnippet: 'An unlicensed agro-investment company promised fixed 35% quarterly dividends on sponsored Musang King trees.',
    howScamWorked: 'The syndicate operated a classic Ponzi scheme, paying early investors using newly recruited victim deposits until shutting down operations and fleeing.',
    preventionTip: 'Legitimate agricultural investment schemes must be registered under the Interest Schemes Act with SSM and cleared by the Securities Commission.'
  },
  {
    id: 'inv-story-04',
    headline: 'Fresh Graduate Loses RM18,000 to E-Commerce YouTube Like & Subscribe Job Scam',
    location: 'Johor Bahru, Johor',
    lossAmount: 'RM18,000 (Savings & Loans)',
    storySnippet: 'The victim was recruited to like YouTube videos for small fees. After receiving an initial RM15 rebate, they were enticed into paying RM18,000 for high-tier VIP tasks.',
    howScamWorked: 'Scammers deployed bait-and-switch tactics, rewarding small amounts initially before locking large deposits behind bogus penalty clauses.',
    preventionTip: 'Legitimate remote jobs never require candidates to transfer their own money into personal bank accounts to unlock commissions.'
  },
  {
    id: 'inv-story-05',
    headline: 'Small Business Owner Loses RM90,000 to Unlicensed Monthly Gold Hibah Scheme',
    location: 'Kota Bharu, Kelantan',
    lossAmount: 'RM90,000',
    storySnippet: 'The victim invested in an unlicensed gold depository scheme promising 15% monthly cash dividends with zero physical gold custody.',
    howScamWorked: 'The entity held no gold reserves in vaults. The operation collapsed when Bank Negara Malaysia seized company accounts for illegal deposit-taking.',
    preventionTip: 'Always verify gold and commodity investment providers against Bank Negara Malaysia’s Financial Consumer Alert list.'
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
  },
  {
    id: 'inv-03',
    title: 'Skim Ladang Durian Musang King & Kelulut "Agro Musang Syariah"',
    platform: 'Iklan WhatsApp & Brosur Seminar Pelaburan',
    schemeName: 'Agro Musang Harumanis Syariah Venture',
    promisedRoi: 'Dividen Tetap 35% Setiap 3 Bulan + Geran Lot Maya',
    depositRequired: 'RM3,000 Bagi Pakej 1 Lot Pokok Musang King',
    realCaseExample: realWorldInvestmentStories[2],
    chatTranscript: [
      {
        sender: 'Dato Pengarah Agro',
        text: 'Peluang emas pelaburan pertanian berimpak tinggi! Anda membiayai pokok Musang King klon premium. Dividen 35% dijamin dibayar setiap suku tahun tanpa risiko cuaca.',
        isBot: false
      },
      {
        sender: 'Pelabur Haji Ramli',
        text: 'Syukur dividen pusingan kedua RM1,050 masuk tepat waktu minggu lepas. Projek ladang memang kukuh!',
        isBot: true
      },
      {
        sender: 'Admin Pendaftaran',
        text: 'PERHATIAN: Kuota untuk fasa penanaman ini hanya berbaki 2 pokok sahaja lagi. Sila pindahkan deposit RM3,000 ke akaun peribadi setiausaha eksekutif kami untuk kunci lot.',
        isBot: false
      }
    ],
    scAlertListRecord: {
      entityName: 'Agro Musang Harumanis Syariah Venture',
      isAlerted: true,
      reason: 'Tersenarai dalam Senarai Peringatan Pelabur SC kerana mengendalikan skim kepentingan tanpa kelulusan sah Suruhanjaya Sekuriti Malaysia.'
    },
    redFlags: [
      {
        id: 'rf-1',
        flagText: 'Menjanjikan dividen tetap 35% tanpa mengambil kira risiko tanaman atau cuaca',
        isRedFlag: true,
        explanation: 'Sektor pertanian tertakluk kepada risiko kemarau dan pasaran. Janji pulangan tetap tanpa risiko adalah petanda nyata skim Ponzi.'
      },
      {
        id: 'rf-2',
        flagText: 'Bayaran modal pelaburan diarahkan ke nombor akaun peribadi individu',
        isRedFlag: true,
        explanation: 'Skim pelaburan berdaftar wajib menggunakan akaun amanah syarikat pemegang amanah berlesen, bukan akaun peribadi setiausaha.'
      },
      {
        id: 'rf-3',
        flagText: 'Mewujudkan tekanan tergesa-gesa dengan mendakwa kuota lot hanya tinggal 2 sahaja',
        isRedFlag: true,
        explanation: 'Teknik psikologi ini bertujuan mendesak mangsa memindahkan wang segera sebelum sempat memeriksa status pendaftaran syarikat.'
      }
    ],
    actions: [
      {
        id: 'act-safe',
        title: 'Tolak tawaran, semak status skim di portal SC & SSM, dan jangan pindahkan wang ke akaun peribadi',
        description: 'Pastikan syarikat mempunyai kelulusan rasmi Akta Skim Kepentingan sebelum melabur.',
        isSafe: true,
        consequence: 'BIJAKSANA! Semakan di portal SC membuktikan syarikat ini tidak berlesen dan tersenarai dalam senarai amaran scam.'
      },
      {
        id: 'act-buy-lot',
        title: 'Pindahkan RM3,000 segera ke akaun setiausaha kerana bimbang kuota pokok habis',
        description: 'Merebut peluang dividen 35% setiap 3 bulan.',
        isSafe: false,
        consequence: 'TERJERUMUS SKIM PONZI! Ladang tersebut tidak wujud atau tidak menghasilkan pulangan dijanjikan. Duit RM3,000 anda lebur.'
      }
    ]
  },
  {
    id: 'inv-04',
    title: 'Tugasan Sambilan e-Dagang / Like & Subscribe YouTube Berkomisen Tinggi',
    platform: 'Mesej WhatsApp Tidak Dikenali & Grup Telegram Tugasan VIP',
    schemeName: 'Global Merchant Task Booster VIP',
    promisedRoi: 'Komisen Segera 30% - 50% bagi Setiap Pesanan Selesai',
    depositRequired: 'Wang Pendahuluan Tugasan Bermula RM100 hingga RM3,000',
    realCaseExample: realWorldInvestmentStories[3],
    chatTranscript: [
      {
        sender: 'Pengurus Tugasan Lisa',
        text: 'Kerja santai dari rumah! Tekan like pada 3 video YouTube dan hantar tangkapan skrin. Kami bayar rebat RM15 terus ke akaun bank anda sekarang juga.',
        isBot: false
      },
      {
        sender: 'Sistem Rebat',
        text: 'Notifikasi Bank: RM15.00 berjaya dikreditkan ke akaun anda sebagai bayaran Tugasan Percubaan.',
        isBot: true
      },
      {
        sender: 'Pengurus Tugasan Lisa',
        text: 'Tahniah! Untuk melayakkan diri ke Tugasan Peringkat Emas berbayar RM900 komisen, anda perlu memasukkan modal pendahuluan pesanan barangan RM2,000 dahulu.',
        isBot: false
      }
    ],
    scAlertListRecord: {
      entityName: 'Global Merchant Task Booster VIP',
      isAlerted: true,
      reason: 'Entiti penipuan penyamaran platform e-dagang berdaftar yang memeras wang pendahuluan orang awam melalui skim kerja sambilan palsu.'
    },
    redFlags: [
      {
        id: 'rf-1',
        flagText: 'Memberi umpan bayaran kecil RM15 pada mulanya untuk membina kepercayaan palsu',
        isRedFlag: true,
        explanation: 'Scammer sanggup membayar sedikit wang pada peringkat awal supaya mangsa berasa yakin untuk memasukkan ribuan ringgit seterusnya.'
      },
      {
        id: 'rf-2',
        flagText: 'Mewajibkan pekerja memindahkan wang sendiri kepada majikan untuk menerima kerja',
        isRedFlag: true,
        explanation: 'Pekerjaan yang sah membayar gaji pekerja. Kerja yang meminta pekerja membayar wang pendahuluan 100% adalah penipuan (Job Scam).'
      },
      {
        id: 'rf-3',
        flagText: 'Mengugut modal pendahuluan akan hangus jika tidak menambah wang untuk tugasan seterusnya',
        isRedFlag: true,
        explanation: 'Sindiket menggunakan helah tugasan bertingkat yang tidak berkesudahan sehingga wang simpanan mangsa habis disedut.'
      }
    ],
    actions: [
      {
        id: 'act-safe',
        title: 'Hentikan penglibatan serta-merta, sekat nombor scammer, dan jangan bayar sebarang wang pendahuluan',
        description: 'Ambil pengajaran daripada modus operandi job scam dan simpan duit anda.',
        isSafe: true,
        consequence: 'TAHNIAH! Anda berjaya mengelak jerat Job Scam. Puluhan ribu rakyat Malaysia telah kerugian wang simpanan akibat taktik umpan awal ini.'
      },
      {
        id: 'act-transfer-task',
        title: 'Pindahkan RM2,000 untuk melengkapkan Tugasan Emas kerana telah menerima RM15 sebelum ini',
        description: 'Yakin platform membayar kerana tugasan pertama terbukti berjaya.',
        isSafe: false,
        consequence: 'DIPERDAYA TERUK! Selepas membayar RM2,000, sindiket akan meminta RM5,000 lagi atas alasan ralat sistem atau kod pengaktifan.'
      }
    ]
  },
  {
    id: 'inv-05',
    title: 'Skim Sijil Simpanan Jongkong Emas Digital "Royal Bullion Vault"',
    platform: 'Seminar Kewangan Hotel & Promosi Facebook',
    schemeName: 'Royal Gold Bullion Safe Vault Club',
    promisedRoi: 'Hibah Tunai 15% Setiap Bulan + Jaminan Pembelian Balik 100%',
    depositRequired: 'RM5,000 Seunit Sijil Emas Tanpa Pemilikan Fizikal',
    realCaseExample: realWorldInvestmentStories[4],
    chatTranscript: [
      {
        sender: 'Perunding Kanan Emas',
        text: 'Emas kalis inflasi! Melabur RM5,000 untuk 1 unit Sijil Emas 100g. Emas anda disimpan selamat di bilik kebal antarabangsa dan kami bayar hibah tunai RM750 setiap bulan terus ke akaun anda.',
        isBot: false
      },
      {
        sender: 'Ahli Kelab Emas',
        text: 'Setiap awal bulan duit hibah RM750 masuk macam jam loncat. Jauh lebih untung daripada simpanan tetap bank biasa!',
        isBot: true
      },
      {
        sender: 'Perunding Kanan Emas',
        text: 'Tawaran istimewa: Belian 3 unit (RM15,000) layak menerima pakej pelancongan umrah percuma. Beli hari ini sebelum harga kuota dinaikkan.',
        isBot: false
      }
    ],
    scAlertListRecord: {
      entityName: 'Royal Gold Bullion Safe Vault Club',
      isAlerted: true,
      reason: 'Tersenarai dalam Senarai Amaran SC dan Bank Negara Malaysia (BNM) atas aktiviti pengambilan deposit haram dan skim emas tanpa sandaran fizikal.'
    },
    redFlags: [
      {
        id: 'rf-1',
        flagText: 'Menjanjikan pulangan hibah tetap 15% sebulan (180% setahun) berasaskan komoditi emas',
        isRedFlag: true,
        explanation: 'Harga emas dunia turun naik secara harian. Tiada institusi kewangan sah yang mampu menjamin pulangan tunai tetap 180% setahun.'
      },
      {
        id: 'rf-2',
        flagText: 'Pelabur tidak dibenarkan melihat atau memegang jongkong emas fizikal sebenar',
        isRedFlag: true,
        explanation: 'Skim emas penipuan lazimnya hanya menjual kertas sijil kosong tanpa memiliki rizab jongkong emas fizikal di mana-mana peti kebal.'
      },
      {
        id: 'rf-3',
        flagText: 'Menawarkan hadiah mewah (pakej umrah / kereta) untuk menarik pelaburan modal besar',
        isRedFlag: true,
        explanation: 'Taktik klasik skim cepat kaya untuk memerangkap simpanan persaraan warga emas dalam jumlah yang besar.'
      }
    ],
    actions: [
      {
        id: 'act-safe',
        title: 'Tolak skim tersebut, semak senarai amaran Bank Negara (BNM) & SC, dan beli emas hanya di institusi berdaftar',
        description: 'Hanya melabur dalam emas fizikal tulen atau akaun emas pelaburan bank perdagangan berlesen.',
        isSafe: true,
        consequence: 'KEPUTUSAN CEMERLANG! Anda menyelamatkan simpanan daripada skim pengambilan deposit haram yang bakal ditutup pihak berkuasa.'
      },
      {
        id: 'act-invest-gold',
        title: 'Beli 3 unit sijil emas RM15,000 untuk menikmati hibah tunai bulanan RM2,250',
        description: 'Terpesona dengan pulangan bulanan tetap dan tawaran pakej umrah.',
        isSafe: false,
        consequence: 'KERUGIAN BESAR! Bilik kebal syarikat sebenarnya kosong. Syarikat diserbu BNM dan wang pelaburan anda hangus.'
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
  },
  {
    id: 'inv-03',
    title: 'Musang King Durian Agro Scheme "Agro Musang Syariah"',
    platform: 'WhatsApp Promo Broadcast & Hotel Investment Seminar',
    schemeName: 'Agro Musang Harumanis Syariah Venture',
    promisedRoi: 'Guaranteed 35% Quarterly Dividend + Virtual Land Lot Deed',
    depositRequired: 'RM3,000 per Single Musang King Tree Lot',
    realCaseExample: realWorldInvestmentStoriesEn[2],
    chatTranscript: [
      {
        sender: 'Dato Agro Director',
        text: 'High-impact agricultural goldmine! Fund a premium clone Musang King tree. 35% fixed dividend guaranteed every quarter regardless of weather.',
        isBot: false
      },
      {
        sender: 'Investor Haji Ramli',
        text: 'Alhamdulillah my 2nd quarterly dividend of RM1,050 arrived right on schedule last week. Solid plantation project!',
        isBot: true
      },
      {
        sender: 'Enrollment Admin',
        text: 'ATTENTION: Only 2 sponsor tree lots remain for this planting phase. Wire your RM3,000 deposit to our executive secretary\'s personal account to lock your lot.',
        isBot: false
      }
    ],
    scAlertListRecord: {
      entityName: 'Agro Musang Harumanis Syariah Venture',
      isAlerted: true,
      reason: 'Listed on the SC Investor Alert List for operating an unapproved interest scheme without Securities Commission Malaysia authorization.'
    },
    redFlags: [
      {
        id: 'rf-1',
        flagText: 'Promising fixed 35% dividends ignoring weather, pest, or agricultural yield risks',
        isRedFlag: true,
        explanation: 'Agriculture is inherently weather-dependent. Guaranteeing fixed high returns without risk is the defining feature of Ponzi schemes.'
      },
      {
        id: 'rf-2',
        flagText: 'Directing investment deposits into an individual\'s personal bank account',
        isRedFlag: true,
        explanation: 'Legitimate investment schemes legally require licensed corporate custodian trust accounts, never personal accounts.'
      },
      {
        id: 'rf-3',
        flagText: 'Fabricating artificial urgency by claiming only 2 lots remain',
        isRedFlag: true,
        explanation: 'High-pressure scarcity tactics force prospective investors to pay before conducting due diligence.'
      }
    ],
    actions: [
      {
        id: 'act-safe',
        title: 'Reject the offer, verify the scheme on the SC & SSM portals, and refuse personal account transfers',
        description: 'Ensure schemes are registered under the Interest Schemes Act before committing capital.',
        isSafe: true,
        consequence: 'WISE DECISION! Checking the SC portal reveals this company is an unlicensed clone listed on official fraud alerts.'
      },
      {
        id: 'act-buy-lot',
        title: 'Transfer RM3,000 immediately to the secretary\'s personal account to lock the tree quota',
        description: 'Rushing to capture the 35% quarterly dividend.',
        isSafe: false,
        consequence: 'TRAPPED IN A PONZI! The plantation is nonexistent or incapable of yielding promised returns. Your RM3,000 is lost.'
      }
    ]
  },
  {
    id: 'inv-04',
    title: 'E-Commerce Remote Task / YouTube Like & Subscribe Job Scam',
    platform: 'Unsolicited WhatsApp Recruiter & VIP Telegram Task Channel',
    schemeName: 'Global Merchant Task Booster VIP',
    promisedRoi: 'Instant 30% - 50% Task Rebate Commission per Order',
    depositRequired: 'Advance Task Security Deposit Starting from RM100 to RM3,000',
    realCaseExample: realWorldInvestmentStoriesEn[3],
    chatTranscript: [
      {
        sender: 'Task Dispatcher Lisa',
        text: 'Easy flexible home job! Like 3 YouTube videos and submit screenshots. We remit a RM15 task rebate directly to your bank account right now.',
        isBot: false
      },
      {
        sender: 'Rebate System',
        text: 'Bank Credit Notification: RM15.00 credited to your account as completed trial task reward.',
        isBot: true
      },
      {
        sender: 'Task Dispatcher Lisa',
        text: 'Congratulations! To qualify for Gold Tier merchant tasks paying RM900 commissions, you must advance a RM2,000 order clearing deposit first.',
        isBot: false
      }
    ],
    scAlertListRecord: {
      entityName: 'Global Merchant Task Booster VIP',
      isAlerted: true,
      reason: 'Fraudulent entity impersonating authorized e-commerce platforms to extort advance task deposits through fake work-from-home scams.'
    },
    redFlags: [
      {
        id: 'rf-1',
        flagText: 'Paying small upfront earnings of RM15 as bait to establish false trust',
        isRedFlag: true,
        explanation: 'Syndicates willingly sacrifice minor amounts early on so victims feel confident transferring larger sums later.'
      },
      {
        id: 'rf-2',
        flagText: 'Requiring workers to wire their personal funds to an employer to unlock jobs',
        isRedFlag: true,
        explanation: 'Legitimate employers pay staff salaries. Any "job" requiring candidates to remit advance deposits is an outright fraud.'
      },
      {
        id: 'rf-3',
        flagText: 'Threatening that past deposits are forfeited unless additional funds are sent',
        isRedFlag: true,
        explanation: 'Scammers invent unending progressive task tiers until all victim savings are completely depleted.'
      }
    ],
    actions: [
      {
        id: 'act-safe',
        title: 'Cease engagement immediately, block the scammer, and refuse all advance fee demands',
        description: 'Recognize the task scam pattern and safeguard your hard-earned money.',
        isSafe: true,
        consequence: 'CONGRATULATIONS! You avoided the classic Task Scam. Thousands have lost entire life savings to this bait-and-switch scheme.'
      },
      {
        id: 'act-transfer-task',
        title: 'Transfer RM2,000 to unlock Gold Tasks since the initial RM15 payout succeeded',
        description: 'Believing the platform is genuine based on the initial small trial test.',
        isSafe: false,
        consequence: 'DEVASTATING LOSS! Once RM2,000 is sent, fraudsters demand RM5,000 more claiming system sync glitches or tax penalties.'
      }
    ]
  },
  {
    id: 'inv-05',
    title: 'Digital Gold Bar Safe Depository "Royal Bullion Vault"',
    platform: 'Closed Hotel Seminar & Targeted Facebook Marketing',
    schemeName: 'Royal Gold Bullion Safe Vault Club',
    promisedRoi: 'Guaranteed 15% Monthly Cash Dividend + 100% Buy-Back Guarantee',
    depositRequired: 'RM5,000 per Gold Certificate Unit (Zero Physical Delivery)',
    realCaseExample: realWorldInvestmentStoriesEn[4],
    chatTranscript: [
      {
        sender: 'Senior Gold Consultant',
        text: 'Gold is inflation-proof! Invest RM5,000 for one 100g Vault Certificate unit. Your bullion is guarded in Zurich vaults while we credit RM750 cash dividends directly to your account on the 1st of every month.',
        isBot: false
      },
      {
        sender: 'Gold Club Member',
        text: 'Every month my RM750 dividend lands like clockwork. Far more profitable than traditional bank fixed deposits!',
        isBot: true
      },
      {
        sender: 'Senior Gold Consultant',
        text: 'Exclusive promotion: Purchase 3 units (RM15,000) to receive an all-expenses-paid Umrah holiday package. Buy today before unit quotas increase.',
        isBot: false
      }
    ],
    scAlertListRecord: {
      entityName: 'Royal Gold Bullion Safe Vault Club',
      isAlerted: true,
      reason: 'Flagged on both SC and Bank Negara Malaysia (BNM) alert lists for illegal deposit-taking without gold physical backing.'
    },
    redFlags: [
      {
        id: 'rf-1',
        flagText: 'Promising fixed 15% monthly cash dividends (180% annualized) on gold commodities',
        isRedFlag: true,
        explanation: 'Global gold prices fluctuate continuously. No genuine financial entity can guarantee a fixed 180% annual return on gold.'
      },
      {
        id: 'rf-2',
        flagText: 'Investors are prohibited from physically possessing or inspecting the gold bars',
        isRedFlag: true,
        explanation: 'Fraudulent gold schemes sell paper certificates while possessing zero bullion reserves in real vaults.'
      },
      {
        id: 'rf-3',
        flagText: 'Offering extravagant luxury gifts (free Umrah trips / cars) to lure large sums',
        isRedFlag: true,
        explanation: 'Classic Ponzi hallmark designed to extract substantial retirement nest eggs from elderly investors.'
      }
    ],
    actions: [
      {
        id: 'act-safe',
        title: 'Reject the scheme, check BNM & SC alert lists, and purchase gold only from licensed institutions',
        description: 'Only deal in physical gold you can hold or verified accounts at commercial banks.',
        isSafe: true,
        consequence: 'EXCELLENT DEFENSE! You avoided an illegal deposit-taking syndicate facing imminent regulatory enforcement action.'
      },
      {
        id: 'act-invest-gold',
        title: 'Purchase 3 gold certificate units for RM15,000 to collect RM2,250 in monthly payouts',
        description: 'Tempted by the high monthly passive income and travel perks.',
        isSafe: false,
        consequence: 'CATASTROPHIC LOSS! The company vault is entirely hollow. Bank accounts are frozen by BNM and your capital is gone.'
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
  totalQuestions: 5,
  maxScore: 50
};

