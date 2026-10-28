import { ChallengeMeta, ChallengeQuestion } from '@/types/challenge';

export const passwordMeta: ChallengeMeta = {
  id: 'passwords',
  title: 'Misi 02: Pertahanan Kata Laluan & Kunci Akaun',
  shortDescription: 'Kuasai cara membina frasa laluan kukuh yang sukar dipecahkan, hentikan pengambilalihan akaun, dan fahami 2FA serta pengurus kata laluan.',
  learningObjective: 'Memahami bagaimana penggodam memecahkan kata laluan yang lemah, mengapa panjang frasa laluan mengatasi kerumitan simbol, dan bagaimana Pengesahan Dua Faktor (2FA) melindungi akaun peribadi anda.',
  difficulty: 'Asas',
  estimatedTime: '5-7 Minit',
  iconName: 'KeyRound',
  accentColor: 'from-emerald-500 to-cyan-500',
  badgeText: 'Misi 02',
  instructions: [
    'Bincangkan tabiat kata laluan, amaran keselamatan, dan kesilapan lazim bersama pasukan.',
    'Uji dan bandingkan ketahanan kata laluan yang berbeza secara interaktif.',
    'Pelajari fungsi alat keselamatan moden seperti 2FA dan Pengurus Kata Laluan (Password Manager).',
    'Kumpul 10 mata bagi setiap amalan keselamatan yang tepat (Maksimum: 50 mata)!'
  ],
  keyTakeaways: [
    'Panjang adalah kunci: Frasa laluan gabungan 4–5 perkataan rawak mudah diingati oleh manusia tetapi memerlukan ribuan tahun untuk dipecahkan oleh komputer.',
    'Jangan guna kata laluan yang sama untuk pelbagai akaun—kebocoran satu laman web boleh mendedahkan semua akaun anda yang lain.',
    'Pengesahan Dua Faktor (2FA) bertindak sebagai benteng kedua sekiranya kata laluan anda terlepas ke tangan orang lain.',
    'Gunakan aplikasi Pengurus Kata Laluan (Password Manager) yang dipercayai untuk menjana dan menyimpan kata laluan unik dengan selamat.',
    'Jangan sesekali berkongsi Kod Pengesahan Sekali Sahaja (OTP / TAC) dengan sesiapa pun melalui telefon atau mesej.'
  ],
  totalQuestions: 5,
  maxScore: 50
};

export const passwordQuestions: ChallengeQuestion[] = [
  {
    id: 1,
    type: 'multiple-choice',
    title: 'Satu Kata Laluan Untuk Semua Akaun',
    scenarioContext: 'Pak Ali menggunakan kata laluan yang sama ("KampungDamai2024!") untuk emel peribadi, aplikasi membeli-belah, media sosial, dan portal bayaran bil elektrik.',
    questionText: 'Mengapakah tabiat menggunakan satu kata laluan bagi banyak akaun sangat berbahaya?',
    options: [
      {
        id: 'A',
        text: 'Ia melambatkan pemproses komputer dan mengurangkan kelajuan internet di rumah.',
        isCorrect: false
      },
      {
        id: 'B',
        text: 'Sekiranya salah satu laman web membeli-belah mengalami kebocoran data, penggodam akan menggunakan kata laluan itu untuk membuka emel, perbankan, dan semua akaun anda yang lain.',
        isCorrect: true
      },
      {
        id: 'C',
        text: 'Suruhanjaya Komunikasi dan Multimedia Malaysia (MCMC) akan memadam akaun tersebut secara automatik.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Ia menyebabkan penghala (router) Wi-Fi terputus sambungan setiap malam.',
        isCorrect: false
      }
    ],
    explanation: 'Serangan ini dinamakan "Credential Stuffing (Pencuri Cuba Password Sama Di Merata Tempat)". Penggodam menggunakan perisian automatik untuk menguji gabungan emel dan kata laluan yang bocor pada ratusan laman web lain. Jika anda mengulang kata laluan yang sama, kebocoran pada laman kecil yang kurang selamat boleh mendedahkan akaun bank dan emel utama anda.',
    points: 10
  },
  {
    id: 2,
    type: 'password-compare',
    title: 'Aktiviti Interaktif: Pilih Kata Laluan Paling Selamat',
    scenarioContext: 'Bandingkan tiga contoh kata laluan di bawah yang dicipta untuk akaun emel. Klik pada setiap contoh untuk meneliti anggaran masa komputer penggodam memecahkannya:',
    questionPrompt: 'Berdasarkan prinsip keselamatan siber, pilihan manakah yang memberikan perlindungan paling kukuh dan mengapa?',
    passwords: [
      {
        id: 'pw-1',
        label: 'Pilihan A: Pendek & Mudah Diteka',
        passwordText: 'password123',
        entropy: 'very-weak',
        crackTimeEstimate: 'Kurang daripada 1 milisaat',
        characteristics: [
          'Perkataan kamus yang sangat lazim digunakan',
          'Urutan nombor mudah (123)',
          'Antara 10 kata laluan paling kerap digodam di dunia'
        ],
        isSafest: false
      },
      {
        id: 'pw-2',
        label: 'Pilihan B: Nama + Tahun Lahir + Simbol',
        passwordText: 'Kamal1985!',
        entropy: 'weak',
        crackTimeEstimate: 'Bawah 5 saat pada kad grafik moden',
        characteristics: [
          'Menggunakan nama dan tahun kelahiran',
          'Mudah dicari penipu daripada kad pengenalan atau profil media sosial',
          'Sekadar menambah simbol tanda seru (!) tidak mencukupi untuk menghalang serangan automatik'
        ],
        isSafest: false
      },
      {
        id: 'pw-3',
        label: 'Pilihan C: Frasa Laluan Pelbagai Perkataan',
        passwordText: 'kucing-suka-makan-ikan-kembung',
        entropy: 'strong',
        crackTimeEstimate: 'Ribuan tahun',
        characteristics: [
          'Sepanjang 31 aksara (Panjang Frasa Mengatasi Simbol!)',
          'Gabungan 5 perkataan Bahasa Melayu yang mudah diingati oleh manusia',
          'Sangat sukar untuk dipecahkan oleh komputer penggodam'
        ],
        isSafest: true
      }
    ],
    options: [
      {
        id: 'A',
        text: 'Pilihan A, kerana ia pendek dan mudah ditaip tanpa berlaku kesilapan ejaan.',
        isCorrect: false
      },
      {
        id: 'B',
        text: 'Pilihan B, kerana mempunyai huruf besar, nombor, dan tanda seru (!) yang menjadikannya mustahil dipecahkan.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'Pilihan C, kerana kepanjangan aksara dan gabungan perkataan rawak menghasilkan rintangan matematik yang sangat tinggi terhadap serangan tekaan komputer.',
        isCorrect: true
      },
      {
        id: 'D',
        text: 'Ketiga-tiga pilihan adalah sama selamat asalkan tiada orang yang menjeling skrin anda semasa menaip.',
        isCorrect: false
      }
    ],
    questionText: 'Pilihan manakah yang mewakili amalan kata laluan paling selamat?',
    explanation: 'Kepanjangan frasa laluan jauh lebih berkesan berbanding sekadar menukar huruf kepada simbol! Frasa laluan daripada gabungan 4 ke 5 perkataan biasa (seperti "kucing-suka-makan-ikan-kembung") sangat mudah diingati oleh otak manusia tetapi memerlukan ribuan tahun untuk dipecahkan oleh komputer super.',
    points: 10
  },
  {
    id: 3,
    type: 'multiple-choice',
    title: 'Perisai Pengesahan Dua Faktor (2FA)',
    scenarioContext: 'Semasa mendaftar aplikasi perbankan atau media sosial yang baharu, skrin memaparkan cadangan: "Aktifkan Pengesahan Dua Faktor (2FA) / Two-Factor Authentication".',
    questionText: 'Bagaimanakah Pengesahan Dua Faktor (2FA) melindungi akaun anda?',
    options: [
      {
        id: 'A',
        text: 'Ia mewajibkan anda menaip dua kata laluan yang berbeza berturut-turut setiap kali membuka aplikasi.',
        isCorrect: false
      },
      {
        id: 'B',
        text: 'Walaupun penjenayah siber berjaya meneka atau mencuri kata laluan anda, mereka tetap tidak dapat log masuk tanpa pengesahan kedua (seperti notifikasi atau kod pada telefon fizikal anda).',
        isCorrect: true
      },
      {
        id: 'C',
        text: 'Ia memadam semua emel sampah dan iklan daripada masuk ke dalam telefon anda.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Ia menghalang bateri komputer riba atau telefon daripada habis semasa melakukan transaksi kewangan.',
        isCorrect: false
      }
    ],
    explanation: '2FA berfungsi seperti memerlukan anak kunci dan imbasan cap jari serentak untuk membuka pintu rumah. Sekiranya kata laluan anda terdedah dalam kebocoran pangkalan data, penjenayah tetap gagal menceroboh kerana mereka tidak memegang telefon fizikal anda.',
    points: 10
  },
  {
    id: 4,
    type: 'multiple-choice',
    title: 'Kaedah Menguruskan 30 Kata Laluan Berbeza',
    scenarioContext: 'Seorang peserta bengkel bertanya: "Jika setiap akaun memerlukan kata laluan unik yang panjang, bagaimana kita mampu mengingati puluhan kata laluan tanpa mencatatnya di atas kertas nota?"',
    questionText: 'Apakah alat keselamatan yang disyorkan oleh pakar untuk menyelesaikan masalah ini secara selamat?',
    options: [
      {
        id: 'A',
        text: 'Tulis semua kata laluan di atas kertas pelekat (sticky note) dan tampal pada bingkai skrin komputer riba.',
        isCorrect: false
      },
      {
        id: 'B',
        text: 'Simpan semua kata laluan dalam perbualan WhatsApp peribadi atau nota biasa tanpa kata laluan pada telefon.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'Gunakan aplikasi Pengurus Kata Laluan (Password Manager) yang dipercayai (seperti Bitwarden, Apple Keychain, atau Google Password Manager) yang menyulitkan dan mengisi kata laluan unik secara selamat.',
        isCorrect: true
      },
      {
        id: 'D',
        text: 'Tekan butang "Lupa Kata Laluan" (Forgot Password) setiap kali anda mahu log masuk ke akaun.',
        isCorrect: false
      }
    ],
    explanation: 'Aplikasi Pengurus Kata Laluan (Password Manager) dicipta khas untuk tujuan ini! Ia menyulitkan (encrypt) dan menyimpan semua kata laluan rumit anda dalam peti kebal digital yang selamat. Anda hanya perlu mengingati satu frasa laluan utama (master passphrase) yang kukuh untuk membukanya.',
    points: 10
  },
  {
    id: 5,
    type: 'multiple-choice',
    title: 'Panggilan "Tersilap Hantar Kod Pengesahan"',
    scenarioContext: 'Anda menerima SMS daripada Google yang mengandungi nombor pengesahan: "492019 ialah kod pengesahan Google anda. Jangan berkongsi kod ini dengan sesiapa." Seminit kemudian, seorang pemanggil yang ramah menghubungi anda dan berkata: "Helo encik/puan! Saya tersilap taip nombor telefon encik untuk akaun saya. Boleh bacakan 6 nombor yang baru masuk tadi tak?"',
    questionText: 'Apakah yang wajib anda lakukan dalam situasi ini?',
    options: [
      {
        id: 'A',
        text: 'Bacakan kod tersebut kepada pemanggil kerana bersangka baik bahawa dia tersilap menaip nombor telefon.',
        isCorrect: false
      },
      {
        id: 'B',
        text: 'JANGAN SEKALI-KALI berkongsi kod tersebut! Letak telefon serta-merta. Pemanggil sebenarnya cuba menceroboh akaun anda, dan kod itu akan memberi mereka akses penuh.',
        isCorrect: true
      },
      {
        id: 'C',
        text: 'Bacakan 3 nombor terawal sahaja sebagai tanda prihatin.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Panjangkan (forward) mesej SMS itu ke nombor WhatsApp pemanggil tersebut.',
        isCorrect: false
      }
    ],
    explanation: 'Jangan sekali-kali berkongsi kod pengesahan atau OTP dengan sesiapa pun—walaupun mereka mendakwa sebagai kakitangan bantuan teknikal atau merayu tersilap nombor! Kod 6-digit itu adalah benteng terakhir yang menghalang penceroboh daripada merampas akaun Google, WhatsApp, atau perbankan anda.',
    points: 10
  }
];

