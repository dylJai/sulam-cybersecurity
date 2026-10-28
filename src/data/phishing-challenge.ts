import { ChallengeMeta, ChallengeQuestion } from '@/types/challenge';

export const phishingMeta: ChallengeMeta = {
  id: 'phishing',
  title: 'Misi 01: Pancingan Tipu & Jerat Mesej Palsu',
  shortDescription: 'Pelajari cara mengesan SMS mencurigakan, amaran bank palsu, dan emel tipu helah sebelum terjerumus ke dalam perangkap scammer.',
  learningObjective: 'Mengenal pasti tanda-tanda amaran dalam mesej digital—seperti ugutan masa singkat, domain pengirim palsu, dan cubaan meminta kod rahsia—sebelum menekan sebarang pautan atau memindahkan wang.',
  difficulty: 'Asas',
  estimatedTime: '5-7 Minit',
  iconName: 'ShieldAlert',
  accentColor: 'from-amber-500 to-rose-500',
  badgeText: 'Misi 01',
  instructions: [
    'Baca setiap senario dan periksa nama pengirim, teks mesej, serta pautan dengan teliti.',
    'Bincang bersama rakan sepasukan di stesen ini tentang bahagian yang mencurigakan.',
    'Pilih tindakan paling selamat atau klik pada zon tanda bahaya apabila diminta.',
    'Kumpul 10 mata bagi setiap jawapan yang tepat (Maksimum: 50 mata)!'
  ],
  keyTakeaways: [
    'Syarikat kurier dan pihak bank tidak akan sesekali memberi ugutan masa 15 minit untuk mendesak bayaran melalui pautan pelik.',
    'Jangan sekali-kali berkongsi nombor TAC, OTP, atau PIN e-Dompet dengan sesiapa pun, walaupun mereka mengaku sebagai pegawai bank atau kenalan.',
    'Sentiasa sahkan sebarang mesej luar biasa dengan menghubungi talian rasmi atau membuka aplikasi rasmi secara terus.',
    'Perhatikan alamat emel pengirim dengan teliti—penipu kerap menggunakan domain palsu seperti @tenaga-alert.xyz.',
    'Bertenang dan hubungi ahli keluarga secara terus melalui panggilan suara sebelum memindahkan wang kecemasan yang diminta melalui WhatsApp atau SMS.'
  ],
  totalQuestions: 5,
  maxScore: 50
};

export const phishingQuestions: ChallengeQuestion[] = [
  {
    id: 1,
    type: 'multiple-choice',
    title: 'SMS Penghantaran Bungkusan Mencurigakan',
    scenarioContext: 'Anda sedang menunggu bungkusan belian barang dalam talian dan tiba-tiba menerima SMS ini di telefon bimbit anda:',
    messageFormat: 'sms',
    sender: 'Notis Penghantaran Pos (+6011-8291-0394)',
    messageBody: 'Pemberitahuan Pos: Penghantaran bungkusan anda gagal kerana alamat tidak lengkap. Sila bayar caj RM2.50 untuk penjadualan semula segera dalam tempoh 15 minit bagi mengelakkan pembatalan: http://pos-redeliver-pay.cc/track992',
    urgencyBadge: 'Had Masa 15 Minit',
    questionText: 'Apakah tindakan paling selamat untuk anda dan pasukan stesen lakukan?',
    options: [
      {
        id: 'A',
        text: 'Tekan pautan tersebut dan bayar RM2.50 segera supaya bungkusan tidak dibatalkan.',
        isCorrect: false
      },
      {
        id: 'B',
        text: 'Balas SMS tersebut dengan memberikan nama penuh, alamat rumah, dan nombor kad pengenalan anda.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'Jangan tekan pautan. Buka aplikasi rasmi syarikat kurier atau layari laman web rasmi mereka untuk menyemak status bungkusan sebenar.',
        isCorrect: true
      },
      {
        id: 'D',
        text: 'Panjangkan (forward) mesej ini ke dalam WhatsApp keluarga untuk meminta bantuan ahli keluarga membayarnya.',
        isCorrect: false
      }
    ],
    explanation: 'Scammer kerap menghantar SMS palsu kononnya daripada pihak kurier dengan caj kecil (seperti RM2.50) untuk mencuri maklumat kad bank anda. Syarikat kurier yang sah tidak akan membatalkan barang dalam tempoh 15 minit atau mengarahkan anda ke pautan domain pelik (.cc). Sentiasa buat semakan melalui portal rasmi.',
    points: 10
  },
  {
    id: 2,
    type: 'multiple-choice',
    title: 'Amaran Keselamatan Bank Palsu',
    scenarioContext: 'Anda menerima SMS cemas yang mendakwa dihantar oleh pihak bank tempatan:',
    messageFormat: 'sms',
    sender: 'MY-BANK-ALERT',
    messageBody: 'PERINGATAN KESELAMATAN: Akaun perbankan internet anda telah digantung akibat percubaan akses tanpa kebenaran. Sila sahkan maklumat akaun dan nombor TAC anda di: https://mybank-online-security.com/verify dalam tempoh 1 jam.',
    urgencyBadge: 'Amaran: Akaun Digantung',
    questionText: 'Mesej mendakwa akaun anda disekat melainkan anda mengesahkan nombor TAC segera. Apakah yang patut anda lakukan?',
    options: [
      {
        id: 'A',
        text: 'Tekan pautan serta-merta dan masukkan nama pengguna, kata laluan, serta TAC untuk melindungi baki wang anda.',
        isCorrect: false
      },
      {
        id: 'B',
        text: 'Jangan tekan pautan. Buka aplikasi perbankan rasmi secara berasingan atau hubungi talian khidmat pelanggan rasmi yang tertera di belakang kad bank anda.',
        isCorrect: true
      },
      {
        id: 'C',
        text: 'Tekan pautan untuk melihat laman web tersebut terlebih dahulu, dan hanya masukkan kata laluan jika rupanya nampak meyakinkan.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Balas SMS itu meminta pegawai bank menyatakan nombor ID pekerja mereka.',
        isCorrect: false
      }
    ],
    explanation: 'Pihak bank di Malaysia telah mengharamkan penghantaran sebarang pautan melalui SMS! Bank yang sah TIDAK AKAN meminta anda menekan pautan untuk memasukkan kata laluan atau kod TAC. Jika anda berasa ragu, hubungi nombor khidmat pelanggan pada kad fizikal anda.',
    points: 10
  },
  {
    id: 3,
    type: 'multiple-choice',
    title: 'Emel Menang Wang Hadiah & Bantuan Khas',
    scenarioContext: 'Anda membuka peti masuk emel dan melihat kiriman tahniah kononnya anda terpilih menerima bantuan tunai:',
    messageFormat: 'email',
    sender: 'Bantuan Khas Kerajaan <hadiah-bonus@ewallet-claim-2025.com>',
    subject: 'Tahniah! Anda telah terpilih untuk menerima Bantuan Khas RM1,000',
    messageBody: 'Pelanggan yang dihormati,\n\nNombor telefon anda telah dicabut sebagai pemenang Bertuah Bantuan Tunai Musim Perayaan sebanyak RM1,000.\n\nUntuk menyalurkan wang terus ke akaun Touch \'n Go eWallet anda, sila muat turun borang pendaftaran di bawah dan masukkan nombor PIN keselamatan 6-digit eWallet anda.',
    attachmentName: 'Borang_Penebusan_Bantuan_Tunai.apk',
    urgencyBadge: 'Tuntut Dalam Tempoh 24 Jam',
    questionText: 'Apakah tanda amaran paling jelas yang membuktikan emel ini adalah cubaan menipu (scam)?',
    options: [
      {
        id: 'A',
        text: 'Emel tersebut menyebut tentang musim perayaan percutian.',
        isCorrect: false
      },
      {
        id: 'B',
        text: 'Anda tidak pernah menyertai sebarang cabutan bertuah, alamat emel pengirim tidak rasmi (@ewallet-claim-2025.com), disertakan fail aplikasi (.apk) yang bahaya, dan meminta nombor PIN rahsia anda.',
        isCorrect: true
      },
      {
        id: 'C',
        text: 'Jumlah bantuan tunai adalah RM1,000 dan bukannya RM2,000.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Emel tersebut dihantar pada hari bekerja dan bukannya pada hujung minggu.',
        isCorrect: false
      }
    ],
    explanation: 'Jika anda tidak pernah menyertai pertandingan atau cabutan bertuah, anda tidak mungkin menang! Pihak kerajaan dan syarikat e-Dompet sah tidak akan meminta nombor PIN rahsia anda, serta tidak akan menyebarkan fail .APK yang boleh memasang perisian intip (spyware) ke dalam telefon pintar anda.',
    points: 10
  },
  {
    id: 4,
    type: 'spot-clues',
    title: 'Aktiviti Interaktif: Siasat Zon Petunjuk Bahaya',
    scenarioContext: 'Di bawah adalah emel tunggakan bil elektrik yang mencurigakan. Klik pada setiap 4 zon amaran bertanda untuk menyiasat helah penipu:',
    sender: 'Jabatan Pengebilan Elektrik',
    senderEmail: 'billing-support@tenaga-online-alert.xyz',
    receivedTime: 'Hari ini, 7:15 Pagi',
    subject: 'NOTIS AKHIR: Bekalan elektrik anda akan dipotong dalam tempoh 2 Jam!',
    instructions: 'Klik setiap zon bertanda (1-4) di dalam emel untuk meneliti helah scammer, kemudian pilih tindakan terbaik.',
    clues: [
      {
        id: 'clue-sender',
        label: '1. Domain Pengirim Yang Mencurigakan',
        explanation: 'Perhatikan bahagian alamat "@tenaga-online-alert.xyz". Agensi utiliti rasmi sentiasa menggunakan domain korporat sah (seperti .com.my atau .my), bukan domain rawak .xyz yang dibeli murah oleh penipu.',
        isSuspicious: true
      },
      {
        id: 'clue-urgency',
        label: '2. Ugutan Cemas & Had Masa 2 Jam',
        explanation: 'Penipu menggunakan ayat panik seperti "Potong dalam 2 jam!" supaya mangsa berasa cemas lalu bertindak melulu tanpa sempat berfikir atau berbincang dengan keluarga.',
        isSuspicious: true
      },
      {
        id: 'clue-link',
        label: '3. Butang / Pautan Bayaran Tidak Rasmi',
        explanation: 'Pautan bayaran ini menghalakan mangsa ke laman web palsu yang meniru paparan portal sebenar untuk mencuri nama pengguna dan kata laluan perbankan.',
        isSuspicious: true
      },
      {
        id: 'clue-sensitive',
        label: '4. Meminta Kata Laluan Bank & Nombor TAC',
        explanation: 'Urusan semakan bil elektrik hanya memerlukan nombor akaun bil. Pihak utiliti TIDAK PERNAH memerlukan kata laluan perbankan internet mahupun kod TAC anda.',
        isSuspicious: true
      }
    ],
    questionText: 'Selepas menyiasat petunjuk di atas, apakah amalan terbaik semasa menguruskan bil utiliti?',
    options: [
      {
        id: 'A',
        text: 'Buat bayaran terus melalui pautan emel dengan segera supaya elektrik di rumah tidak terputus.',
        isCorrect: false
      },
      {
        id: 'B',
        text: 'Buat semakan tunggakan bil secara terus melalui aplikasi rasmi pembekal, kiosk bayaran fizikal, atau kaunter pejabat pos yang sah.',
        isCorrect: true
      },
      {
        id: 'C',
        text: 'Balas emel pengirim dengan melampirkan penyata akaun bank terkini anda.',
        isCorrect: false
      }
    ],
    explanation: 'Kebolehan mengecam alamat domain palsu, ugutan masa yang tidak masuk akal, serta desakan meminta kata laluan bank merupakan benteng utama menghalang scam penyamaran utiliti.',
    points: 10
  },
  {
    id: 5,
    type: 'multiple-choice',
    title: 'Mesej Cemas Menyamar Sebagai "Ahli Keluarga"',
    scenarioContext: 'Anda menerima mesej WhatsApp daripada nombor tidak dikenali yang memaparkan gambar profil anak saudara anda:',
    messageFormat: 'sms',
    sender: 'Nombor Tidak Dikenali (+6019-338-9210)',
    messageBody: 'Salam Makcik/Pakcik, telefon saya jatuh dalam air tadi jadi saya guna nombor kawan. Kereta saya rosak tepi jalan kat lebuhraya sekarang dan bateri kawan pun nak habis. Boleh tolong pindahkan RM350 ke akaun bengkel kawan saya: Maybank 1140-2938-1209 sekarang? Saya bayar balik malam nanti.',
    urgencyBadge: 'Kecemasan Keluarga',
    questionText: 'Nombor tidak dikenali mendakwa saudara anda terkandas dan memerlukan wang kecemasan segera. Apakah langkah pertama anda?',
    options: [
      {
        id: 'A',
        text: 'Pindahkan wang RM350 serta-merta kerana membantu darah daging dalam kecemasan adalah keutamaan.',
        isCorrect: false
      },
      {
        id: 'B',
        text: 'Hubungi nombor telefon asal saudara anda yang tersimpan dalam kenalan, atau telefon ahli keluarga terdekat yang lain untuk mengesahkan situasi sebenar.',
        isCorrect: true
      },
      {
        id: 'C',
        text: 'Pindahkan RM50 dahulu sekadar mencuba sama ada nama pemilik akaun bank tersebut sepadan.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Minta pengirim mengambil gambar swafoto (selfie) sambil memegang surat khabar hari ini.',
        isCorrect: false
      }
    ],
    explanation: 'Scam penyamaran identiti keluarga sangat berleluasa. Penipu mencuri gambar profil daripada media sosial dan mereka-reka kisah kecemasan. SENTIASA buat panggilan suara atau video ke nombor telefon asal saudara anda sebelum memindahkan sebarang wang.',
    points: 10
  }
];

