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
        id: 'c1-notice',
        targetText: 'Pemberitahuan: Penghantaran bungkusan anda',
        label: 'Ayat Permulaan Makluman Biasa',
        explanation: 'Ayat ini hanyalah teks pengenalan biasa dalam komunikasi penghantaran dan bukan petunjuk penipuan.',
        isSuspicious: false
      },
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
        explanation: 'Penipu sengaja meminta bayaran kecil seperti RM2.50 agar mangsa tidak curiga. Perangkap sebenar adalah mencuri nombor kad debit atau maklumat perbankan anda.',
        isSuspicious: true
      },
      {
        id: 'c1-urgency',
        targetText: 'dalam 15 minit',
        label: 'Desakan Masa Terhad (15 Minit)',
        explanation: 'Menetapkan had masa 15 minit direka khas untuk menimbulkan rasa panik supaya mangsa bertindak terburu-buru tanpa berfikir panjang.',
        isSuspicious: true
      },
      {
        id: 'c1-url',
        targetText: 'http://pos-redeliver-pay.cc/track992',
        label: 'Pautan Palsu Tanpa Keselamatan (.cc)',
        explanation: 'Pautan ini menggunakan sambungan HTTP tidak selamat dan domain tidak rasmi .cc, bukannya portal rasmi kurier (seperti pos.com.my).',
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
        id: 'c2-prefix',
        targetText: 'PERINGATAN KESELAMATAN:',
        label: 'Tajuk Amaran Makluman Biasa',
        explanation: 'Frasa peringatan keselamatan sering digunakan dalam mesej biasa dan bukanlah tanda jenayah siber dengan sendirinya.',
        isSuspicious: false
      },
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
      },
      {
        id: 'c2-deadline',
        targetText: 'dalam tempoh 1 jam',
        label: 'Desakan Masa 1 Jam',
        explanation: 'Memberi had masa singkat bertujuan menekan mangsa supaya mengambil tindakan segera tanpa sempat membuat pengesahan dengan pihak bank.',
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
        id: 'c3-greeting',
        targetText: 'Pelanggan yang dihormati',
        label: 'Kata Sapaan Pelanggan Biasa',
        explanation: 'Kata sapaan umum seperti ini adalah biasa dalam emel dan bukan bukti berlakunya jenayah siber.',
        isSuspicious: false
      },
      {
        id: 'c3-sender',
        targetText: 'hadiah-bonus@ewallet-claim-2025.com',
        label: 'Alamat Emel Domain Luar Tidak Rasmi',
        explanation: 'Agensi kerajaan dan perkhidmatan kewangan sah beroperasi menggunakan domain rasmi (.gov.my atau .com.my), bukannya domain bebas seperti ewallet-claim-2025.com.',
        isSuspicious: true
      },
      {
        id: 'c3-prize',
        targetText: 'Bantuan Musim Perayaan sebanyak RM1,000',
        label: 'Tawaran Wang Cabutan Bertuah Tanpa Permohonan',
        explanation: 'Bantuan kerajaan yang sah disalurkan terus melalui pangkalan data rasmi, bukan melalui cabutan nombor telefon rawak yang menjanjikan wang tunai segera.',
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
        id: 'c4-amount',
        targetText: 'tunggakan bil tertunggak sebanyak RM84.20',
        label: 'Maklumat Jumlah Baki Bil',
        explanation: 'Penyataan jumlah bil adalah maklumat biasa bil utiliti dan bukannya tanda jenayah siber.',
        isSuspicious: false
      },
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
        id: 'c5-greeting',
        targetText: 'Salam Makcik/Pakcik',
        label: 'Kata Sapaan Mesra Biasa',
        explanation: 'Ucapan salam mesra adalah sapaan harian biasa masyarakat kita dan bukannya tanda jenayah siber.',
        isSuspicious: false
      },
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
      },
      {
        id: 'c5-repay',
        targetText: 'Saya bayar balik malam nanti',
        label: 'Janji Pembayaran Balik Biasa',
        explanation: 'Janji untuk memulangkan wang adalah ayat perbualan biasa dan bukanlah bukti teknikal ancaman siber.',
        isSuspicious: false
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

export const investigationCasesEn: InvestigationCase[] = [
  {
    id: 1,
    title: 'Case 01 — Postal Parcel Redelivery SMS Scam',
    scenarioContext: 'You are waiting for an online shopping delivery when you receive this SMS on your smartphone:',
    format: 'sms',
    sender: 'Parcel Notice (+6011-8291-0394)',
    receivedTime: 'Today at 10:42 AM',
    urgencyBadge: '15-Minute Limit',
    body: 'Notification: Your parcel delivery failed due to incomplete address. Please pay a RM2.50 fee for immediate redelivery within 15 minutes to avoid cancellation: http://pos-redeliver-pay.cc/track992',
    clues: [
      {
        id: 'c1-notice',
        targetText: 'Notification: Your parcel delivery',
        label: 'Standard Opening Notification Phrase',
        explanation: 'This phrase is standard introductory delivery wording and not a cyber threat indicator.',
        isSuspicious: false
      },
      {
        id: 'c1-sender',
        targetText: '+6011-8291-0394',
        label: 'Unverified Personal Mobile Phone Number',
        explanation: 'Official courier dispatchers use official shortcodes or registered corporate IDs, never an unverified prepaid mobile number.',
        isSuspicious: true
      },
      {
        id: 'c1-fee',
        targetText: 'pay a RM2.50 fee',
        label: 'Low-Amount Fee Lure (RM2.50)',
        explanation: 'Scammers deliberately request tiny fees like RM2.50 so victims let their guard down. The real trap is stealing your debit card details and banking password.',
        isSuspicious: true
      },
      {
        id: 'c1-urgency',
        targetText: 'within 15 minutes',
        label: 'Artificial Urgency Pressure (15 Mins)',
        explanation: 'Setting a 15-minute deadline creates panic so victims act impulsively without verifying.',
        isSuspicious: true
      },
      {
        id: 'c1-url',
        targetText: 'http://pos-redeliver-pay.cc/track992',
        label: 'Unencrypted Fake Phishing Domain (.cc)',
        explanation: 'This URL uses an unencrypted HTTP link and an unofficial .cc domain rather than the legitimate courier domain (e.g. pos.com.my).',
        isSuspicious: true
      }
    ],
    actions: [
      {
        id: 'a1-safe',
        title: 'Check parcel status directly in the official courier app or website',
        description: 'Do not click the SMS link. Open the official courier app or type your tracking number on their authentic portal.',
        isSafe: true,
        consequence: 'Safe Action! By independently checking the official portal, you verify if the parcel really exists without exposing financial data.'
      },
      {
        id: 'a1-pay',
        title: 'Click the link and pay RM2.50 immediately to avoid cancellation',
        description: 'Follow the link and type your debit card number and CVV on the web form.',
        isSafe: false,
        consequence: 'Dangerous Action! The link leads to a cloned payment portal designed to steal your debit card number, CVV code, and online banking credentials.'
      },
      {
        id: 'a1-reply',
        title: 'Reply to the SMS with your home address and IC number',
        description: 'Text back to provide your identification details to the sender.',
        isSafe: false,
        consequence: 'Dangerous Action! Replying confirms that your mobile number is active and hands over personal identity data for potential identity theft.'
      }
    ]
  },
  {
    id: 2,
    title: 'Case 02 — Fake Bank Account Suspension Warning',
    scenarioContext: 'An urgent SMS arrives claiming your bank account has been suspended due to unauthorized login attempts:',
    format: 'sms',
    sender: 'MY-BANK-ALERT',
    receivedTime: 'Today at 02:15 PM',
    urgencyBadge: 'Urgent: Account Frozen',
    body: 'SECURITY ALERT: Your online banking account has been suspended due to unauthorized access attempts. Please verify your identity and TAC code at: https://mybank-online-security.com/verify within 1 hour.',
    clues: [
      {
        id: 'c2-prefix',
        targetText: 'SECURITY ALERT:',
        label: 'Standard Warning Headline',
        explanation: 'Standard security warning text is common across banking correspondence and is not inherently malicious.',
        isSuspicious: false
      },
      {
        id: 'c2-threat',
        targetText: 'has been suspended',
        label: 'Sudden Account Freeze Threat',
        explanation: 'Claiming an account is blocked or suspended is a classic scare tactic designed to trigger immediate panic.',
        isSuspicious: true
      },
      {
        id: 'c2-url',
        targetText: 'https://mybank-online-security.com/verify',
        label: 'Unofficial Bank Phishing Domain',
        explanation: 'Bank Negara Malaysia has banned all banks from sending clickable links via SMS. Real banks never use generic domains like mybank-online-security.com.',
        isSuspicious: true
      },
      {
        id: 'c2-tac',
        targetText: 'TAC code',
        label: 'Solicitation of Confidential TAC / OTP',
        explanation: 'Banks NEVER ask you to click a link to input a TAC or OTP. Giving away your TAC allows attackers to empty your account.',
        isSuspicious: true
      },
      {
        id: 'c2-deadline',
        targetText: 'within 1 hour',
        label: '1-Hour Coercive Deadline',
        explanation: 'A short deadline pressures victims into rushing without calling their bank to double-check.',
        isSuspicious: true
      }
    ],
    actions: [
      {
        id: 'a2-safe',
        title: 'Call the official hotline printed on the back of your physical bank card',
        description: 'Ignore the SMS link. Call customer care at the back of your ATM card or log in through your bank mobile app.',
        isSafe: true,
        consequence: 'Safe Action! Calling the official phone number connects you with real bank officers and confirms that your account was never in danger.'
      },
      {
        id: 'a2-login',
        title: 'Open link and enter username, password, and TAC to unblock account',
        description: 'Type your bank account credentials to finish the verification form.',
        isSafe: false,
        consequence: 'Dangerous Action! The fake form captures your credentials in real time. Hackers use your password and TAC to drain your savings.'
      },
      {
        id: 'a2-wait',
        title: 'Forward this SMS to your family WhatsApp group to ask them',
        description: 'Share the suspicious link with relatives and friends.',
        isSafe: false,
        consequence: 'Dangerous Action! Forwarding phishing links puts elderly relatives at risk who may click out of curiosity and fall victim.'
      }
    ]
  },
  {
    id: 3,
    title: 'Case 03 — Fake Government Cash Aid Lucky Draw',
    scenarioContext: 'You receive an unexpected email claiming you won a government festive cash aid grant:',
    format: 'email',
    sender: 'National Special Aid',
    senderAddress: 'hadiah-bonus@ewallet-claim-2025.com',
    subject: 'Congratulations! You have been selected for RM1,000 Special Aid',
    receivedTime: 'Yesterday at 04:30 PM',
    urgencyBadge: 'Claim within 24 Hours',
    body: 'Dear Valued Citizen,\n\nYour phone number was drawn as a winner of the RM1,000 Festive Season Cash Grant.\n\nTo transfer funds directly to your Touch \'n Go eWallet, please download the redemption form below and enter your 6-digit eWallet security PIN.',
    attachmentName: 'Cash_Aid_Redemption_Form.apk',
    clues: [
      {
        id: 'c3-greeting',
        targetText: 'Dear Valued Citizen',
        label: 'Generic Polite Salutation',
        explanation: 'Polite salutations are standard email formatting and not evidence of cybercrime.',
        isSuspicious: false
      },
      {
        id: 'c3-sender',
        targetText: 'hadiah-bonus@ewallet-claim-2025.com',
        label: 'Unofficial Foreign Domain (.com)',
        explanation: 'Malaysian government agencies operate exclusively on official government domains (.gov.my), never free commercial domains like ewallet-claim-2025.com.',
        isSuspicious: true
      },
      {
        id: 'c3-prize',
        targetText: 'RM1,000 Festive Season Cash Grant',
        label: 'Unsolicited Cash Award Lottery Lure',
        explanation: 'Real government cash assistance programs are disbursed via official databases (e.g. STR / e-Kasih), never through random lotteries.',
        isSuspicious: true
      },
      {
        id: 'c3-apk',
        targetText: 'Cash_Aid_Redemption_Form.apk',
        label: 'Dangerous Android Installation (.apk) File',
        explanation: 'Legitimate forms are provided as PDF documents or web portals. An .apk file installs spyware or keyloggers on your Android smartphone.',
        isSuspicious: true
      },
      {
        id: 'c3-pin',
        targetText: '6-digit eWallet security PIN',
        label: 'Demand for Confidential 6-Digit PIN',
        explanation: 'Your 6-digit PIN is your confidential digital signature. No authentic aid disbursement requires your PIN to credit money into your wallet.',
        isSuspicious: true
      }
    ],
    actions: [
      {
        id: 'a3-safe',
        title: 'Delete the email and never open the attached .apk file',
        description: 'Understand that unexpected lotteries are always scams. Verify through official STR or government portals.',
        isSafe: true,
        consequence: 'Safe Action! You prevented malicious spyware from installing on your phone and protected your confidential eWallet PIN.'
      },
      {
        id: 'a3-download',
        title: 'Download and install the APK file to claim the RM1,000 cash',
        description: 'Enable installation from unknown sources in Android settings.',
        isSafe: false,
        consequence: 'Dangerous Action! The APK installs malware that intercepts incoming SMS (including banking OTPs) and hijacks your device.'
      },
      {
        id: 'a3-reply',
        title: 'Reply to the email asking them to transfer money to your bank account',
        description: 'Send your bank account details to the email sender.',
        isSafe: false,
        consequence: 'Dangerous Action! Replying triggers targeted phishing and social engineering attacks against your specific bank account.'
      }
    ]
  },
  {
    id: 4,
    title: 'Case 04 — Threat of Electricity Disconnection in 2 Hours',
    scenarioContext: 'An urgent email arrives claiming your home electricity will be disconnected today:',
    format: 'email',
    sender: 'Electricity Billing Support',
    senderAddress: 'billing-support@tenaga-online-alert.xyz',
    subject: 'FINAL NOTICE: Your power supply will be cut in 2 Hours!',
    receivedTime: 'Today at 07:15 AM',
    urgencyBadge: 'Cut in 2 Hours',
    body: 'Dear customer, your utility account has an overdue balance of RM84.20. Immediate power disconnection will occur within 2 Hours unless payment is verified now at: http://tenaga-quickpay.xyz/bill\n\nPlease enter your online banking credentials and TAC code for instant clearance.',
    clues: [
      {
        id: 'c4-amount',
        targetText: 'overdue balance of RM84.20',
        label: 'Standard Account Balance Info',
        explanation: 'Stating a billing amount is standard utility correspondence and not a threat indicator by itself.',
        isSuspicious: false
      },
      {
        id: 'c4-domain',
        targetText: 'billing-support@tenaga-online-alert.xyz',
        label: 'Cheap Disposable Email Domain (.xyz)',
        explanation: 'Real national utility providers use official corporate domains (such as tnb.com.my), never cheap throwaway .xyz domains.',
        isSuspicious: true
      },
      {
        id: 'c4-time',
        targetText: 'within 2 Hours',
        label: 'Extreme 2-Hour Disconnection Threat',
        explanation: 'Utility providers follow statutory notice periods and never cut electricity without written registered warnings and due process.',
        isSuspicious: true
      },
      {
        id: 'c4-link',
        targetText: 'http://tenaga-quickpay.xyz/bill',
        label: 'Unencrypted HTTP External Payment Link',
        explanation: 'This link leads to an unencrypted phishing portal designed to clone the payment gateway and harvest banking logins.',
        isSuspicious: true
      },
      {
        id: 'c4-creds',
        targetText: 'online banking credentials and TAC code',
        label: 'Request for Banking Passwords & TAC',
        explanation: 'Paying a utility bill requires only an account number. Utility companies never ask for your online banking password or TAC.',
        isSuspicious: true
      }
    ],
    actions: [
      {
        id: 'a4-safe',
        title: 'Check bill via the official utility app or pay at a physical post office',
        description: 'Independently verify your billing status through trusted, authenticated channels.',
        isSafe: true,
        consequence: 'Safe Action! Independent verification confirms whether you have overdue bills or if this was an extortion scam.'
      },
      {
        id: 'a4-pay',
        title: 'Click the link and pay RM84.20 immediately so electricity is not cut',
        description: 'Follow the link and type your online banking login immediately.',
        isSafe: false,
        consequence: 'Dangerous Action! Your username, password, and TAC code are captured by hackers to transfer out all your money.'
      },
      {
        id: 'a4-attach',
        title: 'Reply to the email attaching your monthly bank statement',
        description: 'Provide past payment receipts to the unknown email address.',
        isSafe: false,
        consequence: 'Dangerous Action! Sending bank statements gives cybercriminals your full legal name, home address, account numbers, and cashflow details.'
      }
    ]
  },
  {
    id: 5,
    title: 'Case 05 — Highway Roadside Emergency from "Family Member"',
    scenarioContext: 'You receive an urgent SMS from an unknown number displaying your relative\'s profile photo:',
    format: 'sms',
    sender: 'Unknown Number (+6019-338-9210)',
    receivedTime: 'Today at 05:45 PM',
    urgencyBadge: 'Family Emergency',
    body: 'Hi Auntie/Uncle, my phone fell into water so I am using a friend\'s phone. My car broke down on the highway roadside and my friend\'s battery is dying. Could you please transfer RM350 to my friend\'s workshop account: Maybank 1140-2938-1209 right now? I will repay you tonight.',
    clues: [
      {
        id: 'c5-greeting',
        targetText: 'Hi Auntie/Uncle',
        label: 'Warm Everyday Greeting',
        explanation: 'Warm everyday greetings are standard community dialogue and not a cyber threat by themselves.',
        isSuspicious: false
      },
      {
        id: 'c5-number',
        targetText: '+6019-338-9210',
        label: 'Unknown Number Claiming Borrowed Phone',
        explanation: 'Impostors frequently claim "my phone fell into water or broke" to explain why they are texting from an unfamiliar number.',
        isSuspicious: true
      },
      {
        id: 'c5-account',
        targetText: 'Maybank 1140-2938-1209',
        label: 'Money Transfer Request to 3rd-Party Account',
        explanation: 'Syndicates use third-party mule accounts to siphon money instantly before it can be traced or reversed.',
        isSuspicious: true
      },
      {
        id: 'c5-panic',
        targetText: 'friend\'s battery is dying',
        label: 'Battery Dying Pressure Tactic',
        explanation: 'Claiming the battery is about to die prevents you from calling them to hear your real relative\'s voice.',
        isSuspicious: true
      },
      {
        id: 'c5-repay',
        targetText: 'I will repay you tonight',
        label: 'Standard Repayment Promise',
        explanation: 'Promises to repay are standard conversational courtesy and not technical threat indicators.',
        isSuspicious: false
      }
    ],
    actions: [
      {
        id: 'a5-safe',
        title: 'Call your relative directly on their usual number or call other family members',
        description: 'Stay calm and confirm through a trusted channel before transferring any funds.',
        isSafe: true,
        consequence: 'Safe Action! Calling your relative\'s usual number or contacting their parents proves they are safe at home and their profile photo was impersonated.'
      },
      {
        id: 'a5-transfer',
        title: 'Transfer RM350 immediately out of concern for family emergency',
        description: 'Send funds to the third-party bank account right away.',
        isSafe: false,
        consequence: 'Dangerous Action! Your money is immediately withdrawn by scammers through a mule account, and your relative receives nothing.'
      },
      {
        id: 'a5-partial',
        title: 'Transfer RM50 first as a test to see the account owner\'s name',
        description: 'Send a small amount to verify the account recipient.',
        isSafe: false,
        consequence: 'Dangerous Action! Transferring any money incurs an immediate financial loss and signals to scammers that you are susceptible to manipulation.'
      }
    ]
  }
];

export const getInvestigationCases = (language: 'bm' | 'en' = 'bm'): InvestigationCase[] => {
  return language === 'en' ? investigationCasesEn : investigationCases;
};
