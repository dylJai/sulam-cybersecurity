import { ChallengeMeta } from '@/types/challenge';

export interface CallScamCase {
  id: string;
  title: string;
  callerIdentity: string;
  claimedAgency: string;
  phoneNumber: string;
  callDuration: string;
  audioSimulatedText: string;
  scenarioContext: string;
  urgencyLevel: 'TINGGI' | 'KRITIKAL' | 'SEDERHANA';
  tactics: {
    id: string;
    text: string;
    isTrap: boolean; // true = red flag tactic, false = normal/benign administrative detail
    explanation: string;
  }[];
  semakMuleData: {
    queryNumber: string;
    reportsCount: number;
    policeStatus: 'AMARAN MERAH (KERAJAAN / KELUDA)' | 'REKOD BERSIH' | 'AKAUN KELDAI DISAHKAN';
    lastReportedCategory: string;
  };
  actions: {
    id: string;
    title: string;
    description: string;
    isSafe: boolean;
    consequence: string;
  }[];
}

export const callScamCases: CallScamCase[] = [
  {
    id: 'call-01',
    title: 'Waran Tangkap Mahkamah & Pegawai Polis Bukit Aman',
    callerIdentity: 'Inspektor Azman (PDRM IPK Pahang)',
    claimedAgency: 'Ibu Pejabat Polis Kontinjen & Mahkamah Tinggi',
    phoneNumber: '+6011-8492 3810',
    callDuration: '03:42',
    scenarioContext: 'Anda menerima panggilan kecemasan menyatakan waran tangkap telah dikeluarkan atas nama anda kerana akaun anda didakwa terlibat dalam pengubahan wang haram RM2.4 juta bersama sindiket dadah.',
    urgencyLevel: 'KRITIKAL',
    audioSimulatedText: `"Helo! Ini panggilan daripada Mahkamah Tinggi Kuantan disambungkan ke IPK Pahang. Saya Inspektor Azman. Waran tangkap telah dikeluarkan atas kad pengenalan anda bagi kes pengubahan wang haram RM2.4 juta.

Untuk mengelakkan anda ditangkap dan digari di hadapan jiran dalam tempoh 2 jam, dengar arahan saya dengan teliti! Jangan beritahu sesiapa termasuk ahli keluarga kerana kes ini tertakluk di bawah Akta Rahsia Rasmi (OSA). Anda wajib memindahkan RM8,500 ke akaun audit sementara pegawai kami bagi tujuan verifikasi aset bersih."`,
    tactics: [
      {
        id: 't-1',
        text: 'Ugutan ditangkap dan digari dalam masa 2 jam',
        isTrap: true,
        explanation: 'PDRM dan Mahkamah tidak pernah mengugut tangkapan melalui panggilan telefon dengan had masa terdesak.'
      },
      {
        id: 't-2',
        text: 'Waran tangkap dikeluarkan atas nama kad pengenalan',
        isTrap: false,
        explanation: 'Menyebut nama atau nombor kad pengenalan adalah taktik biasa scammer yang membeli data bocor, bukan bukti mereka polis sebenar.'
      },
      {
        id: 't-3',
        text: 'Larangan bercakap dengan ahli keluarga atas Akta Rahsia Rasmi (OSA)',
        isTrap: true,
        explanation: 'Scammer sentiasa mengasingkan mangsa (*isolation*) agar mangsa tidak sempat meminta pandangan keluarga atau rakan.'
      },
      {
        id: 't-4',
        text: 'Arahan memindahkan RM8,500 ke akaun audit pegawai',
        isTrap: true,
        explanation: 'Agensi penguatkuasa di Malaysia TIDAK MEMILIKI "akaun audit peribadi" untuk verifikasi wang tunai.'
      }
    ],
    semakMuleData: {
      queryNumber: '011-84923810',
      reportsCount: 14,
      policeStatus: 'AMARAN MERAH (KERAJAAN / KELUDA)',
      lastReportedCategory: 'Penyamaran Pegawai Polis & Mahkamah (Macau Scam)'
    },
    actions: [
      {
        id: 'act-transfer',
        title: 'Pindahkan RM8,500 ke akaun tersebut untuk elak ditangkap polis',
        description: 'Ikuti arahan pemanggil agar nama anda dibersihkan dengan segera.',
        isSafe: false,
        consequence: 'BAHAYA! Anda telah kehilangan RM8,500 kepada akaun keldai sindiket. Polis tidak pernah meminta wang audit.'
      },
      {
        id: 'act-bargain',
        title: 'Minta diskaun atau bayar separuh jumlah dahulu',
        description: 'Berunding dengan Inspektor tersebut kerana anda tidak mempunyai simpanan cukup.',
        isSafe: false,
        consequence: 'BERISIKO! Berunding menunjukkan anda terpedaya dan mereka akan terus memeras ugut wang anda.'
      },
      {
        id: 'act-safe',
        title: 'Tamatkan panggilan segera & semak di Balai Polis / Dail NSRC 997',
        description: 'Jangan beri maklumat, letak telefon dan hadir terus ke balai polis berdekatan untuk kepastian.',
        isSafe: true,
        consequence: 'TEPAT & PANTAS! Anda berjaya menyekat cubaan penipuan Macau Scam. Polis sebenar menghantar surat saman fizikal, bukan memeras ugut wang melalui telefon.'
      }
    ]
  },
  {
    id: 'call-02',
    title: 'Tunggakan Cukai Syarikat LHDN Cawangan Cyberjaya',
    callerIdentity: 'Encik Faris (Unit Penguatkuasaan LHDN)',
    claimedAgency: 'Lembaga Hasil Dalam Negeri (LHDN)',
    phoneNumber: '+603-8313 8888',
    callDuration: '02:15',
    scenarioContext: 'Pemanggil mendakwa syarikat enterprise yang didaftarkan atas nama anda mempunyai tunggakan cukai tertunggak sebanyak RM38,400 dan nama anda akan disenaraihitamkan daripada imigresen hari ini.',
    urgencyLevel: 'TINGGI',
    audioSimulatedText: `"Selamat pagi, saya Faris dari LHDN Cawangan Cyberjaya. Rekod kami mendapati syarikat 'Maju Bersatu Enterprise' yang didaftarkan atas IC anda mempunyai tunggakan cukai pendapatan RM38,400.

Sekiranya baki ini tidak diselesaikan sebelum jam 1 tengah hari ini, nama anda akan disekat serta-merta oleh Jabatan Imigresen dan semua akaun bank akan dibekukan. Sila buat bayaran pendaftaran penyelesaian RM3,200 ke akaun pengarah perantara kami."`,
    tactics: [
      {
        id: 't-1',
        text: 'Ugutan sekatan perjalanan imigresen dan pembekuan bank hari ini',
        isTrap: true,
        explanation: 'Tindakan undang-undang LHDN mengambil masa berbulan-bulan melalui notis bertulis rasmi, bukan ugutan telefon mengejut.'
      },
      {
        id: 't-2',
        text: 'Menyebut nama syarikat yang tidak pernah anda buka',
        isTrap: true,
        explanation: 'Scammer sering menggunakan nama syarikat rekaan untuk mencetuskan kekeliruan dan panik.'
      },
      {
        id: 't-3',
        text: 'Pemanggil menggunakan nombor talian pejabat bermula 03',
        isTrap: false,
        explanation: 'Scammer menggunakan teknologi Caller ID Spoofing untuk memaparkan nombor telefon agensi kerajaan yang palsu.'
      },
      {
        id: 't-4',
        text: 'Bayaran dipinta ke akaun individu / pengarah perantara',
        isTrap: true,
        explanation: 'Bayaran cukai LHDN HANYA boleh dibuat ke akaun rasmi Lembaga Hasil Dalam Negeri atau portal MyTax rasmi.'
      }
    ],
    semakMuleData: {
      queryNumber: '03-83138888',
      reportsCount: 8,
      policeStatus: 'AMARAN MERAH (KERAJAAN / KELUDA)',
      lastReportedCategory: 'Caller ID Spoofing LHDN Malaysia'
    },
    actions: [
      {
        id: 'act-pay',
        title: 'Buat bayaran RM3,200 ke akaun yang diberikan pemanggil',
        description: 'Bayar segera untuk mengelakkan pasport disekat oleh pihak imigresen.',
        isSafe: false,
        consequence: 'RUGI BESAR! Wang anda masuk terus ke akaun sindiket keldai. LHDN tidak pernah menggunakan akaun individu.'
      },
      {
        id: 'act-safe',
        title: 'Putuskan panggilan & log masuk ke portal MyTax rasmi (mytax.hasil.gov.my)',
        description: 'Semak rekod percukaian sebenar anda melalui portal rasmi LHDN secara terus.',
        isSafe: true,
        consequence: 'BIJAKSANA! Di portal MyTax, anda dapati tiada sebarang rekod syarikat atau tunggakan cukai. Anda terselamat daripada jerat scammer!'
      },
      {
        id: 'act-share-ic',
        title: 'Berikan gambar IC dan slip gaji untuk membuktikan anda tidak buka syarikat',
        description: 'Hantar dokumen pengenalan diri anda melalui WhatsApp pemanggil.',
        isSafe: false,
        consequence: 'BERBAHAYA! Gambar IC anda kini digunakan scammer untuk membuka akaun keldai atau membuat pinjaman haram atas nama anda.'
      }
    ]
  },
  {
    id: 'call-03',
    title: 'Pegawai Pusat Kad Kredit & Permintaan Kod TAC Rahsia',
    callerIdentity: 'Puan Sheila (Pusat Kawalan Kad Kredit)',
    claimedAgency: 'Pusat Transaksi Perbankan Bersepadu',
    phoneNumber: '+6018-9271 004',
    callDuration: '01:50',
    scenarioContext: 'Anda menerima panggilan memaklumkan bahawa kad debit/kredit anda baru sahaja digunakan untuk membeli barangan mewah bernilai RM4,890 di sebuah pusat beli-belah di Johor Bahru.',
    urgencyLevel: 'KRITIKAL',
    audioSimulatedText: `"Encik/Puan, kami mengesan transaksi mencurigakan kad anda bernilai RM4,890 di Senai Airport jam 2.15 petang tadi. Adakah anda yang membuat pembelian ini?

Jika BUKAN, kami perlu batalkan transaksi ini dalam tempoh 60 saat sebelum wang ditolak! Saya telah hantarkan satu kod 6-digit TAC pengesahan pembatalan ke telefon anda sekarang. Tolong bacakan kod 6-digit tersebut kepada saya dengan segera untuk sekat wang anda!"`,
    tactics: [
      {
        id: 't-1',
        text: 'Desakan masa 60 saat untuk membatalkan pembelian',
        isTrap: true,
        explanation: 'Had masa pendek sengaja direka supaya mangsa tidak sempat membaca mesej SMS yang mengandungi kod TAC sebenar.'
      },
      {
        id: 't-2',
        text: 'Menghantar mesej teks kod TAC ke telefon mangsa',
        isTrap: false,
        explanation: 'Scammer sebenarnya sedang cuba memindahkan wang mangsa di portal online, dan bank menghantar TAC kelulusan perpindahan wang.'
      },
      {
        id: 't-3',
        text: 'Meminta mangsa membaca kod 6-digit TAC kepada pemanggil',
        isTrap: true,
        explanation: 'Pihak bank TIDAK PERNAH meminta kod TAC/OTP daripada pelanggan sama sekali.'
      }
    ],
    semakMuleData: {
      queryNumber: '018-9271004',
      reportsCount: 22,
      policeStatus: 'AKAUN KELDAI DISAHKAN',
      lastReportedCategory: 'Penipuan TAC & Kecurian Perbankan Internet'
    },
    actions: [
      {
        id: 'act-tell-tac',
        title: 'Bacakan kod 6-digit kepada pemanggil supaya transaksi dibatalkan',
        description: 'Beri kod yang baru sampai melalui SMS agar wang RM4,890 tidak ditolak.',
        isSafe: false,
        consequence: 'MALAPETAKA! Sebaik sahaja anda membaca kod tersebut, sindiket berjaya memindahkan baki simpanan anda ke akaun keldai mereka.'
      },
      {
        id: 'act-safe',
        title: 'Tolak permintaan, letak telefon dan hubungi nombor di belakang kad ATM anda',
        description: 'Jangan sekali-kali berkongsi kod OTP/TAC. Hubungi talian kecemasan bank rasmi.',
        isSafe: true,
        consequence: 'CEMERLANG! Kod TAC tersebut sebenarnya adalah kod kebenaran pemindahan wang keluar. Dengan menyimpannya, simpanan anda kekal selamat!'
      },
      {
        id: 'act-sms-back',
        title: 'Balas SMS tersebut dengan perkataan "BATAL"',
        description: 'Menghantar mesej balasan terus ke nombor SMS tersebut.',
        isSafe: false,
        consequence: 'TIDAK BERKESAN: SMS sistem tidak memproses arahan balasan manual. Anda perlu menghubungi pihak bank secara terus.'
      }
    ]
  },
  {
    id: 'call-04',
    title: 'Anak Kemalangan / Masuk ICU Hospital & Bayaran Segera',
    callerIdentity: 'Dr. Zulkifli / Pegawai Hospital Daerah',
    claimedAgency: 'Unit Rawatan Rapi Hospital Awam',
    phoneNumber: '+6019-3381 992',
    callDuration: '02:08',
    scenarioContext: 'Pemanggil cemas mendakwa anak atau ahli keluarga terdekat anda terlibat dalam kemalangan jalan raya yang teruk dan memerlukan deposit ubat RM2,500 sebelum pembedahan boleh dimulakan.',
    urgencyLevel: 'KRITIKAL',
    audioSimulatedText: `"Puan! Bertenang puan! Ini Hospital Bahagian Kecemasan. Anak puan Haikal kemalangan motosikal langgar lari. Keadaannya kritikal dan perlu pembedahan kepala segera!

Pihak hospital perlukan deposit segera RM2,500 untuk bekalan darah dan bilik bedah. Jangan buang masa datang ke sini sekarang, pindahkan wang ke akaun jururawat bertugas kami ini sekarang juga supaya kami boleh mula bedah anak puan!"`,
    tactics: [
      {
        id: 't-1',
        text: 'Menggunakan emosi kasih sayang dan cemas ibu bapa terhadap anak',
        isTrap: true,
        explanation: 'Scammer menyasarkan warga emas dan ibu bapa menggunakan berita palsu kemalangan anak untuk mematikan pertimbangan rasional.'
      },
      {
        id: 't-2',
        text: 'Arahan jangan datang hospital tetapi bayar ke akaun peribadi jururawat',
        isTrap: true,
        explanation: 'Hospital kerajaan di Malaysia TIDAK PERNAH menolak rawatan kecemasan menyelamatkan nyawa semata-mata kerana wang deposit.'
      },
      {
        id: 't-3',
        text: 'Menyebut nama anak mangsa yang dicuri daripada profil media sosial',
        isTrap: false,
        explanation: 'Scammer mendapatkan nama anak daripada hantaran awam di Facebook atau TikTok ibu bapa.'
      }
    ],
    semakMuleData: {
      queryNumber: '019-3381992',
      reportsCount: 9,
      policeStatus: 'AMARAN MERAH (KERAJAAN / KELUDA)',
      lastReportedCategory: 'Penipuan Panggilan Kemalangan Palsu'
    },
    actions: [
      {
        id: 'act-panic-pay',
        title: 'Pindahkan RM2,500 serta-merta kerana bimbang nyawa anak terancam',
        description: 'Bayar dahulu dan pergi ke hospital kemudian.',
        isSafe: false,
        consequence: 'PERANGKAP KEJAM! Anak anda sebenarnya sihat di tempat kerja/sekolah. Wang RM2,500 telah dicuri oleh penjenayah.'
      },
      {
        id: 'act-safe',
        title: 'Bertenang, hubungi telefon bimbit anak anda atau rakan sekerjanya secara terus',
        description: 'Buat pengesahan bebas sebelum membuat sebarang bayaran.',
        isSafe: true,
        consequence: 'TERBAIK! Anda menghubungi anak anda dan dia menjawab panggilan dalam keadaan selamat. Anda menyelamatkan wang dan tidak diperdaya sindiket!'
      },
      {
        id: 'act-cry',
        title: 'Tanya pemanggil "Anak saya yang mana satu kemalangan?"',
        description: 'Memberi maklumat keluarga anda secara sukarela kepada penjenayah.',
        isSafe: false,
        consequence: 'Scammer akan menggunakan maklumat nama anak-anak anda untuk mengukuhkan lagi lakonan penipuan mereka.'
      }
    ]
  }
];

export const callScamMeta: ChallengeMeta = {
  id: 'call-scam',
  title: 'Misi 03: Scam Panggilan & Talian NSRC 997',
  shortDescription: 'Siasat panggilan telefon mencurigakan daripada "Polis", "Mahkamah", dan "LHDN". Gunakan alat SemakMule dan ketahui peranan talian kecemasan NSRC 997.',
  learningObjective: 'Mengenal pasti manipulasi psikologi panggilan penipuan, menyemak nombor di portal CCID SemakMule, dan menghafal talian kecemasan 997.',
  difficulty: 'Pertengahan',
  estimatedTime: '5-7 Minit',
  iconName: 'PhoneCall',
  accentColor: '#D9FA62',
  badgeText: 'PINTAR SIASAT',
  instructions: [
    'Dengar dan baca transkrip panggilan kecemasan di sebelah kiri.',
    'Tandakan taktik ugutan dan helah psikologi yang digunakan pemanggil.',
    'Gunakan butang SemakMule untuk memeriksa pangkalan data polis.',
    'Pilih keputusan paling selamat dan pelajari peranan talian 997.'
  ],
  keyTakeaways: [
    'Polis, LHDN, dan Mahkamah tidak pernah mengugut tangkapan melalui panggilan telefon.',
    'Tiada agensi kerajaan yang mempunyai "Akaun Audit Sementara" peribadi.',
    'Jika terlanjur memindahkan wang ke akaun scammer, dail 997 (NSRC) dalam tempoh 1 jam untuk menyekat aliran keluar.'
  ],
  totalQuestions: 4,
  maxScore: 50
};
