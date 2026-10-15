import { ChallengeMeta } from '@/types/challenge';

export interface SocialPrivacyCase {
  id: string;
  title: string;
  category: 'AUDIT PRIVASI PROFIL' | 'PENGESAN KLON SUARA AI';
  profileOwner: string;
  postContent: {
    text: string;
    imageCaption: string;
    privacySetting: 'AWAM (PUBLIC)' | 'RAKAN SAHAJA (FRIENDS ONLY)';
  };
  leakItems: {
    id: string;
    label: string;
    dangerLevel: 'TINGGI' | 'KRITIKAL' | 'SEDERHANA';
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
      privacySetting: 'AWAM (PUBLIC)'
    },
    leakItems: [
      {
        id: 'leak-empty-house',
        label: 'Makluman rumah kosong selama 2 minggu kepada umum',
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
        label: 'Lencana sekolah dan nama anak pada pakaian',
        dangerLevel: 'TINGGI',
        isVulnerability: true,
        explanation: 'Mendedahkan lokasi sekolah harian anak memudahkan penjenayah melakukan penipuan penculikan atau penjejakan fizikal.'
      },
      {
        id: 'leak-congrats',
        label: 'Ucapan "Alhamdulillah impian sekeluarga tercapai"',
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
      privacySetting: 'AWAM (PUBLIC)'
    },
    leakItems: [
      {
        id: 'leak-voice-clone',
        label: 'Suara anak dijana menggunakan sampel video awam di media sosial',
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

export const socialPrivacyMeta: ChallengeMeta = {
  id: 'social-privacy',
  title: 'Misi 07: Privasi Media Sosial & Pengesan Klon AI',
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
