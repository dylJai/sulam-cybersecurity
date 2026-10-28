import { ChallengeMeta } from '@/types/challenge';

export interface RealWorldScamStory {
  id: string;
  headline: string;
  location: string;
  lossAmount: string;
  storySnippet: string;
  howScamWorked: string;
  preventionTip: string;
}

export interface CallScamCase {
  id: string;
  title: string;
  callerIdentity: string;
  claimedAgency: string;
  phoneNumber: string;
  callDuration: string;
  audioSimulatedText: string;
  scenarioContext: string;
  urgencyLevel: 'TINGGI' | 'KRITIKAL' | 'SEDERHANA' | 'HIGH' | 'CRITICAL' | 'MODERATE';
  realCaseExample?: RealWorldScamStory;
  tactics: {
    id: string;
    text: string;
    isTrap: boolean;
    explanation: string;
  }[];
  semakMuleData: {
    queryNumber: string;
    reportsCount: number;
    policeStatus: string;
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

export const realWorldCallScamStories: RealWorldScamStory[] = [
  {
    id: 'story-01',
    headline: 'Pesara Guru di Pahang Hilang RM320,000 Terpedaya Pegawai Polis Palsu',
    location: 'Kuantan, Pahang (Laporan Berita Sebenar)',
    lossAmount: 'RM320,000 (Semua Simpanan Pencen)',
    storySnippet: 'Seorang pesara guru berusia 64 tahun menerima panggilan telefon daripada individu mendakwa "Inspektor Polis" dari IPK Pahang. Pemanggil mendakwa akaun mangsa terlibat dengan sindiket penyeludupan dadah dan wang haram RM2.4 juta.',
    howScamWorked: 'Scammer melarang mangsa memberitahu suami dan anak-anak atas alasan kes tertakluk "Akta Rahsia Rasmi (OSA)". Mangsa yang ketakutan digari di hadapan jiran telah mengikut arahan memindahkan semua wang simpanan pencen ke 3 akaun individu yang kononnya adalah "akaun audit keselamatan Bank Negara".',
    preventionTip: 'PDRM tidak pernah menyelesaikan siasatan melalui telefon dan tidak memiliki "akaun peribadi" untuk audit. Sebarang panggilan ugutan tangkapan 100% adalah palsu.'
  },
  {
    id: 'story-02',
    headline: 'Peniaga Pasar Terpedaya Nombor Pejabat Palsu LHDN RM45,000',
    location: 'Shah Alam, Selangor (Kes Sebenar)',
    lossAmount: 'RM45,000 (Modal Perniagaan)',
    storySnippet: 'Mangsa menerima panggilan memaparkan nombor bermula "03-83138888" (sama seperti nombor pejabat rasmi LHDN Cyberjaya). Pemanggil mendakwa syarikat enterprise atas nama mangsa mempunyai tunggakan cukai puluhan ribu ringgit.',
    howScamWorked: 'Scammer menggunakan teknologi Caller ID Spoofing untuk meniru nombor pejabat rasmi agensi kerajaan. Mangsa diugut bahawa akaun bank akan dibekukan dalam masa 2 jam sekiranya tidak membuat bayaran penyelesaian ke akaun perantara.',
    preventionTip: 'Jangan percaya paparan nombor pemanggil pada skrin telefon. Jika ragu-ragu, letak telefon dan hubungi talian hotline rasmi agensi tersebut secara manual atau semak di portal MyTax.'
  },
  {
    id: 'story-03',
    headline: 'Ibu Panik Memindahkan RM5,000 Selepas Mendengar "Suara Menangis Anak"',
    location: 'Kajang, Selangor (Kes Sebenar)',
    lossAmount: 'RM5,000',
    storySnippet: 'Seorang suri rumah menerima panggilan cemas di mana seorang individu menangis teresak-esak menjerit "Ibu tolong saya!". Kemudian seorang "doktor" mengambil alih telefon mendakwa anaknya kemalangan motosikal parah dan perlukan deposit pembedahan segera.',
    howScamWorked: 'Sindiket mengeksploitasi naluri kasih sayang dan perasaan panik ibu bapa. Scammer sengaja membuatkan mangsa terburu-buru supaya tidak sempat memeriksa keadaan sebenar anak.',
    preventionTip: 'Hospital kerajaan di Malaysia tidak pernah menolak pesakit kecemasan kerana wang deposit. Sentiasa bertenang dan telefon nombor anak atau rakan sekerjanya untuk kepastian.'
  }
];

export const realWorldCallScamStoriesEn: RealWorldScamStory[] = [
  {
    id: 'story-01',
    headline: 'Retired Teacher in Pahang Loses RM320,000 to Fake Police Officer',
    location: 'Kuantan, Pahang (Authentic Police Report)',
    lossAmount: 'RM320,000 (Entire Life Pension)',
    storySnippet: 'A 64-year-old retired teacher received a call from an individual claiming to be "Inspector Azman" from State Police HQ. The caller alleged the victim was wanted for RM2.4 million drug trafficking and money laundering.',
    howScamWorked: 'The scammer forbade the victim from telling her spouse or children, citing the "Official Secrets Act (OSA)". Terrified of being arrested in handcuffs in front of neighbors, she transferred her retirement savings into 3 personal mule accounts claimed to be "Bank Negara audit accounts".',
    preventionTip: 'Malaysian police never conduct investigations or demand asset transfers over the phone. Any call threatening arrest is 100% fraudulent.'
  },
  {
    id: 'story-02',
    headline: 'Market Trader Tricked by Spoofed LHDN Office Number for RM45,000',
    location: 'Shah Alam, Selangor (Actual Case)',
    lossAmount: 'RM45,000 (Business Working Capital)',
    storySnippet: 'The victim received a phone call showing "03-83138888" (the official office line of LHDN Cyberjaya). The caller claimed an enterprise registered in the victim\'s name had tens of thousands in unpaid taxes.',
    howScamWorked: 'Scammers utilized VoIP Caller ID Spoofing to mimic authentic government phone numbers. The victim was threatened with an immigration travel ban and bank freeze within 2 hours unless an immediate clearance fee was deposited.',
    preventionTip: 'Never trust incoming Caller ID displays. Hang up and independently call the agency hotline or check via the official MyTax portal.'
  },
  {
    id: 'story-03',
    headline: 'Mother Panics and Transfers RM5,000 Hearing "Crying Child\'s Voice"',
    location: 'Kajang, Selangor (Actual Case)',
    lossAmount: 'RM5,000',
    storySnippet: 'A homemaker received a distress call with someone weeping, crying "Mum, help me!". A supposed "doctor" took over the phone claiming her son was severely injured in a hit-and-run and needed an urgent surgical deposit.',
    howScamWorked: 'Syndicates exploit parental affection and panic. Scammers rush the victim so they do not have time to independently verify their child\'s safety.',
    preventionTip: 'Public hospitals in Malaysia never turn away life-saving emergency care over upfront cash deposits. Stay calm and call your child directly.'
  }
];

export const callScamCases: CallScamCase[] = [
  {
    id: 'call-01',
    title: 'Waran Tangkap Mahkamah & Pegawai Polis Bukit Aman',
    callerIdentity: 'Inspektor Azman (Menyamar Pegawai Polis IPK Pahang)',
    claimedAgency: 'Ibu Pejabat Polis Kontinjen & Mahkamah Tinggi',
    phoneNumber: '+6011-8492 3810',
    callDuration: '03:42',
    scenarioContext: 'Anda menerima panggilan kecemasan menyatakan waran tangkap telah dikeluarkan atas nama anda kerana kad pengenalan anda didakwa terlibat dalam sindiket wang haram RM2.4 juta.',
    urgencyLevel: 'KRITIKAL',
    realCaseExample: realWorldCallScamStories[0],
    audioSimulatedText: `"Helo! Ini panggilan daripada Mahkamah Tinggi Kuantan disambungkan ke IPK Pahang. Saya Inspektor Azman. Waran tangkap telah dikeluarkan atas nombor kad pengenalan anda bagi kes pengubahan wang haram RM2.4 juta!
    
Untuk mengelakkan anda ditangkap dan digari di hadapan jiran dalam tempoh 2 jam, dengar arahan saya! Jangan beritahu sesiapa termasuk anak atau pasangan kerana kes ini tertakluk di bawah Akta Rahsia Rasmi (OSA). Anda wajib memindahkan RM8,500 ke akaun audit sementara pegawai kami bagi tujuan pembersihan aset."`,
    tactics: [
      {
        id: 't-1',
        text: 'Ugutan ditangkap dan digari di hadapan jiran dalam masa 2 jam',
        isTrap: true,
        explanation: 'Polis dan Mahkamah tidak pernah mengugut tangkapan melalui panggilan telefon dengan had masa terdesak.'
      },
      {
        id: 't-2',
        text: 'Menyebut nombor kad pengenalan dan nama penuh anda',
        isTrap: false,
        explanation: 'Menyebut nama atau nombor IC adalah taktik scammer yang membeli data bocor daripada internet, bukan bukti mereka polis sebenar.'
      },
      {
        id: 't-3',
        text: 'Larangan bercakap dengan ahli keluarga atas alasan Akta Rahsia Rasmi (OSA)',
        isTrap: true,
        explanation: 'Helah mengasingkan mangsa agar mangsa tidak sempat mendapat nasihat atau bantuan daripada anak-anak atau pasangan.'
      },
      {
        id: 't-4',
        text: 'Arahan memindahkan wang ke "Akaun Audit Sementara" individu',
        isTrap: true,
        explanation: 'PDRM dan Bank Negara TIDAK PERNAH memiliki akaun bank persendirian untuk tujuan "audit aset". Ini adalah 100% akaun keldai sindiket.'
      }
    ],
    semakMuleData: {
      queryNumber: '011-84923810',
      reportsCount: 14,
      policeStatus: 'AMARAN MERAH (KERAJAAN / KELUDA)',
      lastReportedCategory: 'Panggilan Menyamar Pegawai Polis / Macau Scam'
    },
    actions: [
      {
        id: 'act-transfer',
        title: 'Pindahkan RM8,500 ke akaun audit sementara pegawai tersebut',
        description: 'Ikuti arahan Inspektor Azman untuk membersihkan nama dan mengelakkan tangkapan.',
        isSafe: false,
        consequence: 'MALAPETAKA! Wang RM8,500 anda lesap serta-merta ke dalam akaun keldai sindiket dan tidak boleh dikembalikan.'
      },
      {
        id: 'act-beg',
        title: 'Merayu kepada pegawai dan minta tempoh 3 hari untuk selesaikan kes',
        description: 'Terus melayan panggilan dan mendedahkan rasa takut serta baki simpanan anda.',
        isSafe: false,
        consequence: 'BERBAHAYA! Scammer akan terus menekan psikologi anda dan mengugut dengan jumlah wang yang lebih besar!'
      },
      {
        id: 'act-verify-branch',
        title: 'Minta alamat balai polis dan janji untuk pergi sendiri bersama peguam',
        description: 'Menangguhkan panggilan untuk mendapatkan maklumat lanjut daripada pemanggil.',
        isSafe: false,
        consequence: 'KURANG TEPAT: Menjawab atau berhujah dengan scammer membuang masa. Tindakan terbaik adalah menamatkan panggilan serta-merta.'
      },
      {
        id: 'act-safe',
        title: 'Letak telefon serta-merta & hubungi balai polis berdekatan atau talian 997',
        description: 'Bertenang dan putuskan panggilan. Jangan sesekali pindahkan sebarang wang.',
        isSafe: true,
        consequence: 'TAHNIAH! Anda berjaya menyelamatkan wang simpanan anda. PDRM mengesahkan tiada sebarang waran tangkap atas nama anda!'
      }
    ]
  },
  {
    id: 'call-02',
    title: 'Tunggakan Cukai Syarikat LHDN Cawangan Cyberjaya',
    callerIdentity: 'Encik Faris (Menyamar Pegawai Penguatkuasaan LHDN)',
    claimedAgency: 'Lembaga Hasil Dalam Negeri (LHDN)',
    phoneNumber: '+603-8313 8888',
    callDuration: '02:15',
    scenarioContext: 'Pemanggil mendakwa sebuah syarikat enterprise yang didaftarkan atas nama anda mempunyai tunggakan cukai RM38,400 dan nama anda akan disenaraihitamkan daripada imigresen hari ini.',
    urgencyLevel: 'TINGGI',
    realCaseExample: realWorldCallScamStories[1],
    audioSimulatedText: `"Selamat pagi, saya Faris dari LHDN Cawangan Cyberjaya. Rekod kami mendapati syarikat 'Maju Bersatu Enterprise' yang didaftarkan atas IC anda mempunyai tunggakan cukai pendapatan RM38,400.
    
Sekiranya baki ini tidak diselesaikan sebelum jam 1 tengah hari ini, nama anda akan disekat serta-merta oleh Jabatan Imigresen dan semua akaun bank akan dibekukan! Sila buat bayaran pendaftaran penyelesaian RM3,200 ke akaun pengarah perantara kami untuk batalkan sekatan."`,
    tactics: [
      {
        id: 't-1',
        text: 'Ugutan sekatan perjalanan imigresen dan pembekuan bank hari ini juga',
        isTrap: true,
        explanation: 'Tindakan undang-undang LHDN mengambil masa berbulan-bulan melalui notis bertulis rasmi, bukan ugutan telefon mengejut.'
      },
      {
        id: 't-2',
        text: 'Menyebut nama syarikat yang tidak pernah anda buka atau kenali',
        isTrap: true,
        explanation: 'Scammer sering menggunakan nama syarikat rekaan untuk mencetuskan kekeliruan dan panik.'
      },
      {
        id: 't-3',
        text: 'Pemanggil menggunakan nombor telefon talian pejabat bermula 03',
        isTrap: false,
        explanation: 'Scammer menggunakan teknologi Caller ID Spoofing untuk memalsukan nombor pemanggil menyerupai talian pejabat LHDN sebenar.'
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
      lastReportedCategory: 'Helah Nombor Pejabat Palsu (Caller ID Spoofing LHDN)'
    },
    actions: [
      {
        id: 'act-pay',
        title: 'Buat bayaran RM3,200 ke akaun yang diberikan pemanggil',
        description: 'Bayar segera untuk mengelakkan pasport disekat imigresen.',
        isSafe: false,
        consequence: 'RUGI BESAR! Wang anda masuk terus ke akaun sindiket keldai. LHDN tidak pernah menggunakan akaun individu.'
      },
      {
        id: 'act-share-ic',
        title: 'Hantar gambar kad pengenalan (IC) melalui WhatsApp untuk buktikan bukan syarikat anda',
        description: 'Menghantar dokumen pengenalan diri anda kepada pemanggil.',
        isSafe: false,
        consequence: 'AMAT BERBAHAYA! Gambar IC anda kini digunakan scammer untuk membuka akaun keldai atau membuat pinjaman haram atas nama anda!'
      },
      {
        id: 'act-ask-neighbor',
        title: 'Beri telefon kepada jiran atau rakan untuk tolong jelaskan',
        description: 'Meminta bantuan orang lain bercakap dengan scammer.',
        isSafe: false,
        consequence: 'KURANG TEPAT! Tindakan terbaik adalah menamatkan panggilan serta-merta tanpa membuang masa melayan helah mereka.'
      },
      {
        id: 'act-safe',
        title: 'Putuskan panggilan & log masuk ke portal MyTax rasmi (mytax.hasil.gov.my)',
        description: 'Semak rekod percukaian sebenar anda melalui portal rasmi LHDN secara terus.',
        isSafe: true,
        consequence: 'BIJAKSANA & SELAMAT! Di portal MyTax, anda dapati tiada sebarang rekod syarikat atau tunggakan cukai. Anda terselamat daripada jerat scammer!'
      }
    ]
  },
  {
    id: 'call-03',
    title: 'Pegawai Pusat Kad Kredit & Permintaan Kod TAC Rahsia',
    callerIdentity: 'Puan Sheila (Menyamar Pegawai Pusat Kad Kredit)',
    claimedAgency: 'Pusat Transaksi Perbankan Bersepadu',
    phoneNumber: '+6018-9271 004',
    callDuration: '01:50',
    scenarioContext: 'Anda menerima panggilan memaklumkan bahawa kad debit/kredit anda baru sahaja digunakan untuk membeli barangan mewah bernilai RM4,890 di sebuah pusat beli-belah di Johor Bahru.',
    urgencyLevel: 'KRITIKAL',
    realCaseExample: realWorldCallScamStories[2],
    audioSimulatedText: `"Encik/Puan, kami mengesan transaksi mencurigakan kad anda bernilai RM4,890 di Senai jam 2.15 petang tadi. Adakah anda yang membuat pembelian ini?
    
Jika BUKAN, kami perlu batalkan transaksi ini dalam tempoh 60 saat sebelum wang ditolak! Saya telah hantarkan satu kod 6-digit TAC pengesahan pembatalan ke telefon anda sekarang. Tolong bacakan kod 6-digit tersebut kepada saya dengan segera untuk sekat wang anda!"`,
    tactics: [
      {
        id: 't-1',
        text: 'Desakan masa 60 saat untuk membatalkan pembelian',
        isTrap: true,
        explanation: 'Had masa pendek sengaja direka supaya mangsa panik dan tidak sempat membaca mesej SMS yang mengandungi kod TAC sebenar.'
      },
      {
        id: 't-2',
        text: 'Menghantar mesej teks kod 6-digit ke telefon mangsa',
        isTrap: false,
        explanation: 'Scammer sebenarnya sedang cuba memindahkan wang mangsa di portal online, dan bank menghantar kod kebenaran perpindahan wang.'
      },
      {
        id: 't-3',
        text: 'Meminta mangsa membaca kod 6-digit TAC kepada pemanggil',
        isTrap: true,
        explanation: 'Pihak bank TIDAK PERNAH meminta kod TAC/OTP daripada pelanggan sama sekali dalam apa jua keadaan.'
      }
    ],
    semakMuleData: {
      queryNumber: '018-9271004',
      reportsCount: 22,
      policeStatus: 'AKAUN KELDAI DISAHKAN',
      lastReportedCategory: 'Kecurian Kod Rahsia TAC & Perbankan Internet'
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
        id: 'act-sms-back',
        title: 'Balas SMS tersebut dengan perkataan "BATAL"',
        description: 'Menghantar mesej balasan terus ke nombor SMS tersebut.',
        isSafe: false,
        consequence: 'TIDAK BERKESAN: SMS sistem perbankan adalah mesej satu hala automatik yang tidak memproses arahan teks manual.'
      },
      {
        id: 'act-ask-call-back',
        title: 'Minta pemanggil telefon semula selepas anda berbincang dengan anak',
        description: 'Menangguhkan perbualan dengan pemanggil.',
        isSafe: false,
        consequence: 'KURANG TEPAT: Jangan beri ruang kepada pemanggil untuk menghubungi anda lagi. Segera sekat nombor tersebut.'
      },
      {
        id: 'act-safe',
        title: 'Tolak permintaan, letak telefon dan hubungi nombor di belakang kad ATM anda',
        description: 'Jangan sekali-kali berkongsi kod OTP/TAC. Hubungi talian kecemasan bank rasmi.',
        isSafe: true,
        consequence: 'CEMERLANG! Kod TAC tersebut sebenarnya adalah kod kebenaran memindahkan duit keluar. Dengan menyimpannya secara rahsia, wang anda kekal selamat!'
      }
    ]
  },
  {
    id: 'call-04',
    title: 'Anak Kemalangan / Masuk ICU Hospital & Bayaran Segera',
    callerIdentity: 'Dr. Zulkifli / Menyamar Pegawai Hospital Daerah',
    claimedAgency: 'Unit Rawatan Rapi Hospital Awam',
    phoneNumber: '+6019-3381 992',
    callDuration: '02:08',
    scenarioContext: 'Pemanggil cemas mendakwa anak anda terlibat dalam kemalangan jalan raya parah dan memerlukan deposit ubat RM2,500 sebelum pembedahan kecemasan boleh dimulakan.',
    urgencyLevel: 'KRITIKAL',
    realCaseExample: realWorldCallScamStories[2],
    audioSimulatedText: `"Puan! Bertenang puan! Ini Hospital Bahagian Kecemasan. Anak puan Haikal kemalangan motosikal langgar lari. Keadaannya kritikal dan perlu pembedahan kepala segera!
    
Pihak hospital perlukan deposit segera RM2,500 untuk bekalan darah dan bilik bedah. Jangan buang masa datang ke sini sekarang, pindahkan wang ke akaun jururawat bertugas kami ini sekarang juga supaya kami boleh mula bedah anak puan!"`,
    tactics: [
      {
        id: 't-1',
        text: 'Menggunakan emosi cemas ibu bapa terhadap berita anak kemalangan',
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
        id: 'act-cry',
        title: 'Tanya pemanggil "Anak saya yang mana satu kemalangan?"',
        description: 'Memberi maklumat keluarga anda secara sukarela kepada penjenayah.',
        isSafe: false,
        consequence: 'BERBAHAYA! Scammer akan menggunakan maklumat nama anak-anak anda untuk mengukuhkan lagi lakonan penipuan mereka.'
      },
      {
        id: 'act-rush-atm',
        title: 'Tergesa-gesa keluar rumah ke mesin ATM tanpa memeriksa keadaan anak',
        description: 'Panik dan cuba membuat pindahan tunai segera.',
        isSafe: false,
        consequence: 'BERISIKO TINGGI! Anda membahayakan diri di jalan raya semasa panik dan berisiko kerugian wang simpanan.'
      },
      {
        id: 'act-safe',
        title: 'Bertenang, hubungi telefon bimbit anak anda atau rakan sekerjanya secara terus',
        description: 'Buat pengesahan bebas sebelum membuat sebarang bayaran.',
        isSafe: true,
        consequence: 'TERBAIK & BIJAK! Anda menghubungi anak anda dan dia menjawab panggilan dalam keadaan selamat. Anda menyelamatkan wang dan menewaskan sindiket!'
      }
    ]
  }
];

export const callScamCasesEn: CallScamCase[] = [
  {
    id: 'call-01',
    title: 'Court Arrest Warrant & Bukit Aman Police Officer Impersonation',
    callerIdentity: 'Inspector Azman (Impersonating State Police IPK Officer)',
    claimedAgency: 'State Police Contingent HQ & High Court',
    phoneNumber: '+6011-8492 3810',
    callDuration: '03:42',
    scenarioContext: 'You receive an urgent call claiming an arrest warrant has been issued in your name because your Identity Card was implicated in a RM2.4 million money laundering syndicate.',
    urgencyLevel: 'CRITICAL',
    realCaseExample: realWorldCallScamStoriesEn[0],
    audioSimulatedText: `"Hello! This is an official transfer from the Kuantan High Court to State Police HQ. I am Inspector Azman. An arrest warrant has been issued against your IC number in connection with an RM2.4 million money laundering cartel!
    
To avoid being handcuffed in front of your neighbors within 2 hours, listen carefully! Do not inform anyone—not even your spouse or children—as this case is sealed under the Official Secrets Act (OSA). You must transfer RM8,500 immediately to our investigating officer's temporary audit escrow account for asset clearance."`,
    tactics: [
      {
        id: 't-1',
        text: 'Threat of being handcuffed and arrested in front of neighbors within 2 hours',
        isTrap: true,
        explanation: 'Police and Courts never threaten arrest over a phone call with arbitrary tight deadlines.'
      },
      {
        id: 't-2',
        text: 'Stating your full legal name and national ID (IC) number',
        isTrap: false,
        explanation: 'Quoting your IC number is a common psychological trick; scammers buy leaked personal data off the dark web. It is not proof of authority.'
      },
      {
        id: 't-3',
        text: 'Forbidding you from talking to family citing the Official Secrets Act (OSA)',
        isTrap: true,
        explanation: 'Isolating the victim prevents them from getting sound advice from family or friends who would spot the scam.'
      },
      {
        id: 't-4',
        text: 'Instructing you to transfer money into an individual\'s "Temporary Audit Account"',
        isTrap: true,
        explanation: 'Police and Bank Negara NEVER maintain private individual bank accounts for "asset auditing". These are 100% syndicate mule accounts.'
      }
    ],
    semakMuleData: {
      queryNumber: '011-84923810',
      reportsCount: 14,
      policeStatus: 'RED ALERT (CONFIRMED MULE ACCOUNT)',
      lastReportedCategory: 'Police Officer Impersonation / Macau Scam'
    },
    actions: [
      {
        id: 'act-transfer',
        title: 'Transfer RM8,500 to the officer’s temporary audit account',
        description: 'Follow Inspector Azman’s orders to clear your name and prevent arrest.',
        isSafe: false,
        consequence: 'DISASTER! Your RM8,500 is instantly withdrawn by criminal syndicates through a mule account and cannot be recovered.'
      },
      {
        id: 'act-beg',
        title: 'Plead with the officer and request 3 days to gather the funds',
        description: 'Keep engaging on the call and reveal your panic and savings balance.',
        isSafe: false,
        consequence: 'DANGEROUS! Scammers will escalate psychological pressure and extort even larger sums of money!'
      },
      {
        id: 'act-verify-branch',
        title: 'Ask for the police station address and promise to come in person with a lawyer',
        description: 'Prolong the call to question the caller.',
        isSafe: false,
        consequence: 'INADVISABLE: Arguing with scammers wastes time. The correct response is hanging up immediately.'
      },
      {
        id: 'act-safe',
        title: 'Hang up immediately & call your nearest police station or dial 997',
        description: 'Stay calm and terminate the call. Never transfer any money.',
        isSafe: true,
        consequence: 'EXCELLENT! You saved your savings. The police confirm no arrest warrant exists in your name.'
      }
    ]
  },
  {
    id: 'call-02',
    title: 'LHDN Inland Revenue Tax Arrears & Immigration Blacklist',
    callerIdentity: 'Mr. Faris (Impersonating LHDN Enforcement Officer)',
    claimedAgency: 'Inland Revenue Board (LHDN Malaysia)',
    phoneNumber: '+603-8313 8888',
    callDuration: '02:15',
    scenarioContext: 'The caller claims an enterprise company registered in your name has RM38,400 in back taxes and that you will be blacklisted by immigration today.',
    urgencyLevel: 'HIGH',
    realCaseExample: realWorldCallScamStoriesEn[1],
    audioSimulatedText: `"Good morning, this is Faris from LHDN Cyberjaya Branch. Our records show that 'Maju Bersatu Enterprise', registered under your IC, owes RM38,400 in back taxes.
    
If this balance is not resolved by 1:00 PM today, an immediate travel ban will be issued by the Immigration Department and all your bank accounts will be frozen! Please make a settlement deposit of RM3,200 to our intermediary director's account to lift the restriction."`,
    tactics: [
      {
        id: 't-1',
        text: 'Threat of immediate immigration travel blacklist and bank freeze today',
        isTrap: true,
        explanation: 'Statutory tax enforcement follows formal registered postal notices over months, never sudden coercive telephone ultimatums.'
      },
      {
        id: 't-2',
        text: 'Naming a business entity you never registered or owned',
        isTrap: true,
        explanation: 'Scammers invent phantom business names to induce confusion and self-doubt.'
      },
      {
        id: 't-3',
        text: 'Caller ID display begins with "03" mimicking an authentic office phone',
        isTrap: false,
        explanation: 'Scammers use VoIP Caller ID Spoofing technology to forge official government telephone numbers on victim screens.'
      },
      {
        id: 't-4',
        text: 'Demanding payment to an individual / intermediary director account',
        isTrap: true,
        explanation: 'Tax payments in Malaysia can ONLY be remitted to the official Inland Revenue Board account or through the official MyTax portal.'
      }
    ],
    semakMuleData: {
      queryNumber: '03-83138888',
      reportsCount: 8,
      policeStatus: 'RED ALERT (SPOOFED OFFICE NUMBER)',
      lastReportedCategory: 'Caller ID Office Spoofing (LHDN Impersonation)'
    },
    actions: [
      {
        id: 'act-pay',
        title: 'Pay RM3,200 to the account provided by the caller',
        description: 'Pay quickly to avoid an immigration passport restriction.',
        isSafe: false,
        consequence: 'HEAVY LOSS! Your money goes directly to syndicate money mules. LHDN never accepts personal account transfers.'
      },
      {
        id: 'act-share-ic',
        title: 'Send a photo of your IC over WhatsApp to prove you do not own the company',
        description: 'Sending your identification card image to the caller.',
        isSafe: false,
        consequence: 'CRITICAL HAZARD! Scammers will use your IC photo to open bank mule accounts or apply for fraudulent online loans in your name!'
      },
      {
        id: 'act-ask-neighbor',
        title: 'Pass the phone to a coworker or neighbor to explain for you',
        description: 'Asking someone else to talk with the caller.',
        isSafe: false,
        consequence: 'SUBOPTIMAL: Do not waste time entertaining scammers. Hang up immediately.'
      },
      {
        id: 'act-safe',
        title: 'Hang up & log in independently to the official MyTax portal (mytax.hasil.gov.my)',
        description: 'Verify your actual tax records directly on the authentic government portal.',
        isSafe: true,
        consequence: 'BRILLIANT & SAFE! On the MyTax portal, you verify no such company or tax arrears exist. You completely evaded the scam!'
      }
    ]
  },
  {
    id: 'call-03',
    title: 'Credit Card Fraud Center & Solicitation of Secret TAC Code',
    callerIdentity: 'Ms. Sheila (Impersonating Bank Card Center)',
    claimedAgency: 'Central Integrated Card Processing Center',
    phoneNumber: '+6018-9271 004',
    callDuration: '01:50',
    scenarioContext: 'You receive a call stating that your debit/credit card was just used to purchase RM4,890 of luxury items in Johor Bahru.',
    urgencyLevel: 'CRITICAL',
    realCaseExample: realWorldCallScamStoriesEn[2],
    audioSimulatedText: `"Sir/Madam, we detected a suspicious purchase of RM4,890 on your card in Senai at 2:15 PM today. Did you authorize this transaction?
    
If NOT, we must cancel this charge within 60 seconds before funds clear! I have sent an authorization cancellation TAC code to your phone right now. Please read out the 6-digit code immediately so we can block the payment!"`,
    tactics: [
      {
        id: 't-1',
        text: '60-second artificial countdown to reverse the transaction',
        isTrap: true,
        explanation: 'Arbitrary short deadlines prevent victims from reading the SMS warning text carefully.'
      },
      {
        id: 't-2',
        text: 'An authentic 6-digit TAC/OTP SMS arrives on your phone',
        isTrap: false,
        explanation: 'Scammers are actively attempting an outbound fund transfer, triggering an authentic security prompt from your real bank.'
      },
      {
        id: 't-3',
        text: 'Caller explicitly asks you to read out the 6-digit TAC code',
        isTrap: true,
        explanation: 'Legitimate banks NEVER ask customers to disclose TAC/OTP codes over the phone under any circumstance.'
      }
    ],
    semakMuleData: {
      queryNumber: '018-9271004',
      reportsCount: 22,
      policeStatus: 'CONFIRMED MULE NUMBER',
      lastReportedCategory: 'Theft of Confidential TAC & Online Banking Credentials'
    },
    actions: [
      {
        id: 'act-tell-tac',
        title: 'Read the 6-digit code to the caller so the transaction is cancelled',
        description: 'Provide the code you just received via SMS.',
        isSafe: false,
        consequence: 'CATASTROPHE! The moment you read the code, syndicates complete the fund transfer and empty your savings.'
      },
      {
        id: 'act-sms-back',
        title: 'Reply to the SMS with the word "CANCEL"',
        description: 'Sending a text reply back to the automated shortcode.',
        isSafe: false,
        consequence: 'INEFFECTIVE: Automated banking SMS numbers are one-way dispatch systems and do not process text replies.'
      },
      {
        id: 'act-ask-call-back',
        title: 'Ask the caller to phone back after you consult your children',
        description: 'Delaying the conversation with the fraudster.',
        isSafe: false,
        consequence: 'SUBOPTIMAL: Never invite scammers to call back. Block the number immediately.'
      },
      {
        id: 'act-safe',
        title: 'Refuse, hang up, and call the official hotline on the back of your ATM card',
        description: 'Never share OTP/TAC codes. Contact your bank\'s authentic emergency fraud line.',
        isSafe: true,
        consequence: 'OUTSTANDING! The TAC was an outbound fund authorization. Keeping it secret kept your money 100% safe!'
      }
    ]
  },
  {
    id: 'call-04',
    title: 'Hospital ICU Emergency / Child Accident Medical Deposit Extortion',
    callerIdentity: 'Dr. Zulkifli / Impersonating District Hospital Officer',
    claimedAgency: 'Public Hospital Intensive Care Unit',
    phoneNumber: '+6019-3381 992',
    callDuration: '02:08',
    scenarioContext: 'An agitated caller claims your child was critically injured in a hit-and-run accident and demands an urgent RM2,500 blood and surgery deposit before operations can begin.',
    urgencyLevel: 'CRITICAL',
    realCaseExample: realWorldCallScamStoriesEn[2],
    audioSimulatedText: `"Madam! Please stay calm! This is Emergency Intensive Care. Your son Haikal was involved in a severe hit-and-run motorcycle collision. His condition is critical and he requires immediate neurosurgery!
    
The hospital urgently requires an RM2,500 deposit for blood supplies and the operating theatre. Do not waste time travelling here now—transfer the deposit to our duty nurse's account right this second so we can operate!"`,
    tactics: [
      {
        id: 't-1',
        text: 'Preying on intense parental panic regarding child life-or-death accidents',
        isTrap: true,
        explanation: 'Scammers target parents with fake accident claims to completely disable rational cognitive processing.'
      },
      {
        id: 't-2',
        text: 'Telling you not to visit the hospital and transfer money to a nurse\'s personal account',
        isTrap: true,
        explanation: 'Public hospitals in Malaysia NEVER refuse life-saving emergency surgery over an upfront cash deposit.'
      },
      {
        id: 't-3',
        text: 'Knowing your child\'s name harvested from public social media posts',
        isTrap: false,
        explanation: 'Scammers harvest names of family members from public Facebook, Instagram, or TikTok posts.'
      }
    ],
    semakMuleData: {
      queryNumber: '019-3381992',
      reportsCount: 9,
      policeStatus: 'RED ALERT (CONFIRMED FRAUDULENT NUMBER)',
      lastReportedCategory: 'Fake Child Hospital Accident Extortion Scam'
    },
    actions: [
      {
        id: 'act-panic-pay',
        title: 'Transfer RM2,500 immediately fearing your child\'s life is at risk',
        description: 'Pay first and visit the hospital afterwards.',
        isSafe: false,
        consequence: 'CRUEL TRAP! Your child is safe and well at work or school. Your RM2,500 has been stolen by fraudsters.'
      },
      {
        id: 'act-cry',
        title: 'Ask the caller "Which of my children was in the accident?"',
        description: 'Volunteering family details to the fraudster.',
        isSafe: false,
        consequence: 'DANGEROUS! Scammers use the names you mention to reinforce their fabricated extortion scheme.'
      },
      {
        id: 'act-rush-atm',
        title: 'Rush out to an ATM in a panic without checking on your child',
        description: 'Panicking and attempting an immediate physical ATM transfer.',
        isSafe: false,
        consequence: 'HIGH RISK! You endanger yourself driving under severe distress and risk losing your hard-earned money.'
      },
      {
        id: 'act-safe',
        title: 'Stay calm, call your child\'s mobile or their workplace directly',
        description: 'Independently verify before making any payment.',
        isSafe: true,
        consequence: 'EXCELLENT & WISE! You call your child directly and they answer safely from their desk. You protected your family and defeated the syndicate!'
      }
    ]
  }
];

export const getCallScamCases = (language: 'bm' | 'en' = 'bm'): CallScamCase[] => {
  return language === 'en' ? callScamCasesEn : callScamCases;
};

export const getRealWorldCallScamStories = (language: 'bm' | 'en' = 'bm'): RealWorldScamStory[] => {
  return language === 'en' ? realWorldCallScamStoriesEn : realWorldCallScamStories;
};

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

