import { InvestigationCase } from '@/types/game';

export const investigationCases: InvestigationCase[] = [
  {
    id: 1,
    title: 'Kes 01 — SMS Penjadualan Semula Bungkusan Pos',
    scenarioContext: 'Anda sedang menanti pesanan beli-belah dalam talian apabila anda menerima SMS ini pada telefon pintar anda:',
    format: 'sms',
    sender: 'Parcel Notice (+6011-8291-0394)',
    receivedTime: 'Hari ini pada 10:42 AM',
    urgencyBadge: 'Had Masa 15 Minit',
    body: 'Pemberitahuan: Penghantaran bungkusan anda gagal kerana alamat tidak lengkap. Sila bayar caj RM2.50 untuk penjadualan semula segera dalam 15 minit bagi mengelakkan pembatalan: http://pos-redeliver-pay.cc/track992',
    clues: [
      {
        id: 'c1-sender',
        targetText: '+6011-8291-0394',
        label: 'Nombor Telefon Bimbit Peribadi Tidak Dikenali',
        explanation: 'Sistem penghantaran kurier rasmi menggunakan kod pendek (shortcode) atau nama perniagaan berdaftar, bukan nombor telefon peribadi prabayar rawak.',
        isSuspicious: true
      },
      {
        id: 'c1-fee',
        targetText: 'bayar caj RM2.50',
        label: 'Permintaan Bayaran Caj Kecil (RM2.50)',
        explanation: 'Penipu sengaja meminta bayaran kecil seperti RM2.50 agar mangsa tidak curiga. Perangkap sebenar adalah mencuri nombor kad debit atau maklumat log masuk bank anda di laman web palsu tersebut.',
        isSuspicious: true
      },
      {
        id: 'c1-urgency',
        targetText: 'dalam 15 minit',
        label: 'Desakan Masa Terhad (15 Minit)',
        explanation: 'Menetapkan had masa 15 minit direka khas untuk menimbulkan rasa panik supaya mangsa bertindak terburu-buru tanpa sempat berfikir atau berbincang.',
        isSuspicious: true
      },
      {
        id: 'c1-url',
        targetText: 'http://pos-redeliver-pay.cc/track992',
        label: 'Pautan Palsu Tanpa Keselamatan (.cc)',
        explanation: 'Pautan ini menggunakan sambungan HTTP (bukan HTTPS selamat) dan domain tidak rasmi .cc, bukannya portal rasmi kurier (seperti pos.com.my).',
        isSuspicious: true
      }
    ],
    actions: [
      {
        id: 'a1-safe',
        title: 'Semak status bungkusan di aplikasi atau laman web rasmi kurier',
        description: 'Jangan klik pautan dalam SMS. Buka aplikasi kurier sendiri atau masukkan nombor penjejakan di portal rasmi mereka.',
        isSafe: true,
        consequence: 'Tindakan Selamat! Dengan menyemak portal rasmi sendiri, anda mengesahkan sama ada bungkusan benar-benar wujud tanpa mendedahkan maklumat kewangan anda.'
      },
      {
        id: 'a1-pay',
        title: 'Tekan pautan dan bayar RM2.50 segera bagi mengelak pembatalan',
        description: 'Ikuti pautan dalam SMS dan masukkan maklumat kad debit pada borang tersebut.',
        isSafe: false,
        consequence: 'Tindakan Bahaya! Pautan membawa ke portal bayaran tiruan yang direka untuk mencuri nombor kad debit, kod CVV, dan maklumat perbankan anda.'
      },
      {
        id: 'a1-reply',
        title: 'Balas SMS dengan alamat rumah dan nombor kad pengenalan anda',
        description: 'Hantar teks kembali kepada pengirim untuk memberikan butiran pengenalan diri anda.',
        isSafe: false,
        consequence: 'Tindakan Bahaya! Membalas mengesahkan bahawa nombor telefon anda aktif dan menyerahkan data peribadi anda kepada penipu untuk kecurian identiti.'
      }
    ]
  },
  {
    id: 2,
    title: 'Kes 02 — Amaran Palsu Penyekatan Akaun Bank',
    scenarioContext: 'Satu SMS kecemasan tiba mendakwa akaun bank anda telah digantung akibat aktiviti mencurigakan:',
    format: 'sms',
    sender: 'MY-BANK-ALERT',
    receivedTime: 'Hari ini pada 02:15 PM',
    urgencyBadge: 'Kecemasan: Akaun Digantung',
    body: 'PERINGATAN KESELAMATAN: Akaun perbankan internet anda telah digantung akibat percubaan akses tanpa kebenaran. Sila sahkan maklumat dan nombor TAC anda di: https://mybank-online-security.com/verify dalam tempoh 1 jam.',
    clues: [
      {
        id: 'c2-threat',
        targetText: 'telah digantung',
        label: 'Ugutan Akaun Digantung Serta-Merta',
        explanation: 'Mendakwa akaun disekat atau digantung adalah taktik psikologi klasik untuk menimbulkan rasa cemas dan ketakutan mangsa.',
        isSuspicious: true
      },
      {
        id: 'c2-url',
        targetText: 'https://mybank-online-security.com/verify',
        label: 'Domain Phishing Tidak Rasmi',
        explanation: 'Bank Negara Malaysia telah melarang semua bank menghantar pautan melalui SMS. Bank komersial sah tidak menggunakan domain generik seperti mybank-online-security.com.',
        isSuspicious: true
      },
      {
        id: 'c2-tac',
        targetText: 'nombor TAC anda',
        label: 'Permintaan Nombor Kod Kelulusan TAC / OTP',
        explanation: 'Pihak bank TIDAK PERNAH meminta anda menekan pautan untuk memasukkan TAC atau OTP. Memberikan TAC membolehkan penyerang memindahkan wang simpanan anda.',
        isSuspicious: true
      }
    ],
    actions: [
      {
        id: 'a2-safe',
        title: 'Hubungi talian rasmi bank di belakang kad bank fizikal anda',
        description: 'Abaikan pautan SMS. Telefon nombor khidmat pelanggan yang tertera di belakang kad ATM/kredit anda atau buka aplikasi rasmi bank.',
        isSafe: true,
        consequence: 'Tindakan Selamat! Menghubungi nombor rasmi memastikan anda bercakap dengan pegawai bank yang sah dan mengesahkan bahawa akaun anda sebenarnya selamat.'
      },
      {
        id: 'a2-login',
        title: 'Buka pautan dan masukkan nama pengguna, kata laluan serta TAC untuk buka sekatan',
        description: 'Taip maklumat akaun bank anda untuk melengkapkan borang pengesahan.',
        isSafe: false,
        consequence: 'Tindakan Bahaya! Borang palsu merakam maklumat perbankan anda serta-merta. Penggodam akan menggunakan kata laluan dan TAC untuk mengosongkan wang simpanan anda.'
      },
      {
        id: 'a2-wait',
        title: 'Panjangkan (forward) SMS ini kepada kenalan WhatsApp untuk bertanya',
        description: 'Kongsi pautan mencurigakan ini kepada keluarga dan rakan-rakan.',
        isSafe: false,
        consequence: 'Tindakan Bahaya! Menyebarkan pautan penipuan membahayakan ahli keluarga atau rakan warga emas yang mungkin tertekan dan menjadi mangsa.'
      }
    ]
  },
  {
    id: 3,
    title: 'Kes 03 — Notifikasi Hadiah Wang Tunai Bantuan Kerajaan',
    scenarioContext: 'Anda menerima emel mengejut mendakwa anda memenangi cabutan bertuah bantuan wang tunai kerajaan:',
    format: 'email',
    sender: 'Bantuan Khas Kerajaan',
    senderAddress: 'hadiah-bonus@ewallet-claim-2025.com',
    subject: 'Tahniah! Anda telah terpilih untuk menerima Bantuan Khas RM1,000',
    receivedTime: 'Semalam pada 04:30 PM',
    urgencyBadge: 'Tuntut Dalam 24 Jam',
    body: 'Pelanggan yang dihormati,\n\nNombor telefon anda telah dicabut sebagai pemenang Bantuan Musim Perayaan sebanyak RM1,000.\n\nUntuk menyalurkan wang tunai terus ke akaun Touch \'n Go eWallet anda, sila muat turun borang pendaftaran di bawah dan masukkan nombor PIN keselamatan 6-digit eWallet anda.',
    attachmentName: 'Borang_Penebusan_Bantuan_Tunai.apk',
    clues: [
      {
        id: 'c3-sender',
        targetText: 'hadiah-bonus@ewallet-claim-2025.com',
        label: 'Alamat Emel Domain Luar Tidak Rasmi',
        explanation: 'Agensi kerajaan dan perkhidmatan kewangan sah beroperasi menggunakan domain rasmi (.gov.my atau .com.my), bukannya domain bebas seperti ewallet-claim-2025.com.',
        isSuspicious: true
      },
      {
        id: 'c3-apk',
        targetText: 'Borang_Penebusan_Bantuan_Tunai.apk',
        label: 'Lampiran Fail Pemasangan Android (.apk) Berbahaya',
        explanation: 'Borang sepatutnya dalam fail PDF atau laman web. Fail .apk adalah aplikasi mudah alih Android yang memasang perisian intip (spyware) atau perakam kekunci pada telefon anda.',
        isSuspicious: true
      },
      {
        id: 'c3-pin',
        targetText: 'nombor PIN keselamatan 6-digit',
        label: 'Permintaan Nombor PIN Rahsia 6-Digit eWallet',
        explanation: 'Nombor PIN 6-digit adalah tandatangan digital peribadi anda. Tiada program bantuan rasmi yang memerlukan PIN rahsia untuk menyalurkan wang kepada anda.',
        isSuspicious: true
      }
    ],
    actions: [
      {
        id: 'a3-safe',
        title: 'Padam emel dan jangan sesekali membuka fail lampiran .apk',
        description: 'Ketahui bahawa hadiah cabutan yang tidak pernah disertai adalah penipuan. Semak saluran rasmi kerajaan (seperti portal STR / e-Kasih).',
        isSafe: true,
        consequence: 'Tindakan Selamat! Anda berjaya menghalang pemasangan perisian hasad pada telefon dan melindungi PIN rahsia e-dompet anda.'
      },
      {
        id: 'a3-download',
        title: 'Muat turun dan pasang fail APK untuk menuntut wang RM1,000',
        description: 'Benarkan pemasangan aplikasi sumber tidak diketahui pada telefon anda.',
        isSafe: false,
        consequence: 'Tindakan Bahaya! Fail APK memasang perisian intip yang membaca SMS masuk (termasuk kod OTP bank) dan mengawal telefon anda.'
      },
      {
        id: 'a3-reply',
        title: 'Balas emel dan minta mereka pindahkan wang ke akaun bank anda',
        description: 'Hantar maklumat nombor akaun bank kepada pengirim emel.',
        isSafe: false,
        consequence: 'Tindakan Bahaya! Membalas emel mengundang sindiket untuk menjalankan serangan penipuan bersasar yang lebih berbahaya terhadap akaun bank anda.'
      }
    ]
  },
  {
    id: 4,
    title: 'Kes 04 — Amaran Pemotongan Bekalan Elektrik 2 Jam',
    scenarioContext: 'Satu emel kecemasan tiba mendakwa bekalan elektrik rumah anda akan dipotong hari ini:',
    format: 'email',
    sender: 'Jabatan Pengebilan Elektrik',
    senderAddress: 'billing-support@tenaga-online-alert.xyz',
    subject: 'NOTIS AKHIR: Bekalan elektrik anda akan dipotong dalam 2 Jam!',
    receivedTime: 'Hari ini pada 07:15 AM',
    urgencyBadge: 'Potong Dalam 2 Jam',
    body: 'Pelanggan yang dihormati, akaun anda mempunyai tunggakan bil tertunggak sebanyak RM84.20. Tindakan pemotongan bekalan elektrik serta-merta akan dilaksanakan dalam tempoh 2 Jam melainkan pembayaran disahkan sekarang di: http://tenaga-quickpay.xyz/bill\n\nSila masukkan kata laluan perbankan dan nombor TAC untuk pengesahan bayaran segera.',
    clues: [
      {
        id: 'c4-domain',
        targetText: 'billing-support@tenaga-online-alert.xyz',
        label: 'Domain Emel Murah Tidak Rasmi (.xyz)',
        explanation: 'Syarikat pembekal utiliti menggunakan domain korporat rasmi (seperti tnb.com.my). Mereka tidak menghantar bil menggunakan domain murah .xyz.',
        isSuspicious: true
      },
      {
        id: 'c4-time',
        targetText: 'dalam tempoh 2 Jam',
        label: 'Ugutan Melampau Pemotongan Dalam 2 Jam',
        explanation: 'Syarikat utiliti terikat dengan peraturan dan tempoh notis yang sah. Mereka tidak memotong bekalan elektrik secara tiba-tiba dengan notis 2 jam melalui emel.',
        isSuspicious: true
      },
      {
        id: 'c4-link',
        targetText: 'http://tenaga-quickpay.xyz/bill',
        label: 'Pautan Bayaran Luar Tanpa Keselamatan (HTTP)',
        explanation: 'Pautan ini membawa ke portal penipuan tidak disulitkan (HTTP) yang menyamar sebagai halaman pembayaran bil untuk mencuri maklumat log masuk bank anda.',
        isSuspicious: true
      },
      {
        id: 'c4-creds',
        targetText: 'kata laluan perbankan dan nombor TAC',
        label: 'Permintaan Kata Laluan Perbankan & Nombor TAC',
        explanation: 'Membayar bil utiliti hanya memerlukan nombor akaun bil. Syarikat utiliti tidak pernah meminta kata laluan bank peribadi atau nombor TAC anda.',
        isSuspicious: true
      }
    ],
    actions: [
      {
        id: 'a4-safe',
        title: 'Semak bil melalui aplikasi rasmi utiliti atau bayar di kaunter fizikal / pejabat pos',
        description: 'Sahkan baki bil sebenar anda secara bebas menggunakan saluran pengebilan yang dipercayai.',
        isSafe: true,
        consequence: 'Tindakan Selamat! Semakan bebas mengesahkan sama ada bil anda benar-benar tertunggak atau palsu, mengelakkan anda daripada ditipu.'
      },
      {
        id: 'a4-pay',
        title: 'Tekan pautan dan bayar RM84.20 segera agar bekalan elektrik tidak dipotong',
        description: 'Ikuti pautan dan masukkan maklumat perbankan anda dengan segera.',
        isSafe: false,
        consequence: 'Tindakan Bahaya! Nama pengguna, kata laluan dan nombor TAC anda dirampas oleh penggodam untuk mengosongkan baki akaun bank anda.'
      },
      {
        id: 'a4-attach',
        title: 'Balas emel dengan melampirkan penyata bank bulanan anda',
        description: 'Berikan bukti pembayaran terdahulu kepada alamat pengirim.',
        isSafe: false,
        consequence: 'Tindakan Bahaya! Menghantar penyata bank memberikan penjenayah siber nama penuh, alamat rumah, nombor akaun, dan corak kewangan anda.'
      }
    ]
  },
  {
    id: 5,
    title: 'Kes 05 — Mesej Kecemasan Lebuhraya daripada "Ahli Keluarga"',
    scenarioContext: 'Anda menerima mesej kecemasan daripada nombor tidak dikenali menggunakan gambar profil saudara anda:',
    format: 'sms',
    sender: 'Nombor Tidak Dikenali (+6019-338-9210)',
    receivedTime: 'Hari ini pada 05:45 PM',
    urgencyBadge: 'Kecemasan Keluarga',
    body: 'Salam Makcik/Pakcik, telefon saya jatuh dalam air tadi jadi saya guna telefon kawan. Kereta saya rosak tepi jalan kat lebuhraya sekarang dan bateri kawan pun nak habis. Boleh tolong pindahkan RM350 ke akaun bengkel kawan saya: Maybank 1140-2938-1209 sekarang? Saya bayar balik malam nanti.',
    clues: [
      {
        id: 'c5-number',
        targetText: '+6019-338-9210',
        label: 'Nombor Asing Mengaku Telefon Dipinjam',
        explanation: 'Penipu sering memberi alasan "telefon jatuh air / rosak" untuk menjelaskan mengapa mereka menghubungi anda dari nombor telefon yang berbeza.',
        isSuspicious: true
      },
      {
        id: 'c5-account',
        targetText: 'Maybank 1140-2938-1209',
        label: 'Permintaan Pindahan Wang ke Akaun Pihak Ketiga',
        explanation: 'Sindiket menggunakan akaun keldai (mule account) milik orang lain untuk melarikan wang mangsa dengan cepat tanpa dapat dikesan.',
        isSuspicious: true
      },
      {
        id: 'c5-panic',
        targetText: 'bateri kawan pun nak habis',
        label: 'Desakan Bateri Hendak Habis',
        explanation: 'Alasan bateri telefon hendak habis adalah helah agar anda tidak sempat menelefon mereka untuk mendengar suara sebenar saudara anda.',
        isSuspicious: true
      }
    ],
    actions: [
      {
        id: 'a5-safe',
        title: 'Telefon saudara anda secara terus di nombor biasa atau hubungi ahli keluarga lain',
        description: 'Bertenang dan buat pengesahan melalui saluran yang dipercayai sebelum menghantar sebarang wang.',
        isSafe: true,
        consequence: 'Tindakan Selamat! Menelefon saudara di nombor biasanya atau menghubungi ibu bapanya membuktikan mereka selamat di rumah dan gambar profil mereka telah diklon oleh penipu.'
      },
      {
        id: 'a5-transfer',
        title: 'Pindahkan RM350 serta-merta kerana bimbang kecemasan keluarga',
        description: 'Hantar wang ke akaun pihak ketiga tersebut dengan segera.',
        isSafe: false,
        consequence: 'Tindakan Bahaya! Wang anda dikeluarkan serta-merta oleh sindiket melalui akaun keldai, dan saudara anda tidak menerima sebarang bantuan.'
      },
      {
        id: 'a5-partial',
        title: 'Pindahkan RM50 dahulu sebagai ujian untuk melihat nama pemilik akaun',
        description: 'Hantar sejumlah wang kecil untuk memeriksa akaun penerima.',
        isSafe: false,
        consequence: 'Tindakan Bahaya! Memindahkan wang ujian tetap mendatangkan kerugian dan memberi isyarat kepada penipu bahawa nombor anda mudah dimanipulasi.'
      }
    ]
  }
];
