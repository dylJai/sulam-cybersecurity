import { ChallengeMeta } from '@/types/challenge';

export interface SocialPrivacyCase {
  id: string;
  title: string;
  category: 'AUDIT PRIVASI PROFIL' | 'PENGESAN KLON SUARA AI' | 'PROFILE PRIVACY AUDIT' | 'AI VOICE CLONE DETECTOR';
  profileOwner: string;
  postContent: {
    text: string;
    imageCaption: string;
    privacySetting: string;
    aiVoiceIllustrationUrl?: string;
    exampleImages?: {
      id: string;
      title: string;
      tag: string;
      imageUrl?: string;
      details: string[];
      warningNote: string;
    }[];
  };
  leakItems: {
    id: string;
    label: string;
    dangerLevel: 'TINGGI' | 'KRITIKAL' | 'SEDERHANA' | 'HIGH' | 'CRITICAL' | 'MODERATE';
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
      privacySetting: 'AWAM (PUBLIC)',
      exampleImages: [
        {
          id: 'img-boarding-pass',
          title: 'Pas Masuk Penerbangan (Boarding Pass)',
          tag: 'KOD BAR SENSITIF',
          imageUrl: '/images/social-privacy/boarding-pass.png',
          details: [
            'Nama Penumpang: SALMAH / AHMAD MRS',
            'Penerbangan: MH 002 (KUL ➔ LHR London)',
            'No Tempat Duduk: 14A | Pintu: C12',
            'Kod PNR Booking: K7X9LQ'
          ],
          warningNote: 'Kod bar mengandungi Nombor Pasport, No. Telefon, dan PNR yang boleh dicuri orang asing!'
        },
        {
          id: 'img-keys',
          title: 'Foto Kunci Rumah & Tag Alamat',
          tag: 'LOKASI RUMAH KOSONG',
          imageUrl: '/images/social-privacy/house-keys.png',
          details: [
            'Tag Kunci: "No 12, Jalan Melati 4"',
            'Status: Rumah kosong 2 minggu',
            'Kawasan: Taman Melati, Selangor'
          ],
          warningNote: 'Mengumumkan rumah tidak berpenghuni membuka peluang keemasan kepada perompak pecah rumah!'
        },
        {
          id: 'img-badge',
          title: 'Foto Anak Memakai Pakaian Seragam',
          tag: 'IDENTITI KANAK-KANAK',
          imageUrl: '/images/social-privacy/school-badge.png',
          details: [
            'Nama Anak: Farhan (Tahun 4)',
            'Lencana: SK Taman Melati',
            'Sesi Persekolahan: Sesi Pagi'
          ],
          warningNote: 'Mendedahkan nama anak dan sekolah harian memudahkan penjenayah melakukan penipuan penculikan palsu!'
        }
      ]
    },
    leakItems: [
      {
        id: 'leak-empty-house',
        label: 'Makluman rumah kosong selama 2 minggu kepada umum di Facebook',
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
        label: 'Lencana sekolah dan nama anak pada pakaian seragam',
        dangerLevel: 'TINGGI',
        isVulnerability: true,
        explanation: 'Mendedahkan lokasi sekolah harian anak memudahkan penjenayah melakukan penipuan penculikan atau penjejakan fizikal.'
      },
      {
        id: 'leak-congrats',
        label: 'Ucapan "Alhamdulillah akhirnya impian sekeluarga tercapai"',
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
      privacySetting: 'AWAM (PUBLIC)',
      aiVoiceIllustrationUrl: '/images/social-privacy/ai-voice-clone.png'
    },
    leakItems: [
      {
        id: 'leak-voice-clone',
        label: 'Suara anak dijana menggunakan sampel video awam di media sosial (TikTok)',
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
  },
  {
    id: 'soc-03',
    title: 'Audit Gambar Tayang Lesen Memandu JPJ & MyKad Baharu di Instagram',
    category: 'AUDIT PRIVASI PROFIL',
    profileOwner: 'Amirul (Akaun Instagram Terbuka / Public)',
    postContent: {
      text: `"Alhamdulillah setelah 3 kali gagal, akhirnya hari ini lulus juga ujian memandu JPJ dan dapat lesen memandu penuh! Terima kasih cikgu memandu yang banyak bersabar. Lepas ni dah boleh ronda-ronda naik kereta sendiri! 🚗🎉✨"`,
      imageCaption: 'Foto swafoto menunjukkan Amirul memegang kad lesen memandu dan MyKad dengan nombor kad pengenalan 12-digit, alamat kediaman penuh, dan tandatangan jelas kelihatan.',
      privacySetting: 'AWAM (PUBLIC)',
      exampleImages: [
        {
          id: 'img-mykad-leak',
          title: 'Foto MyKad & Lesen Memandu JPJ',
          tag: 'DATA IDENTITI RASMI',
          details: [
            'Nombor MyKad: 040512-10-5843 (Terpapar Jelas)',
            'Nama Penuh: AMIRUL BIN ZULKIFLI',
            'Alamat Kediaman: No 45, Jalan Anggerik 3, Shah Alam',
            'Tandatangan Pemilik: Boleh Ditiru'
          ],
          warningNote: 'Nombor kad pengenalan dan tandatangan boleh disalahgunakan sindiket pinjaman ah long atau pendaftaran akaun keldai!'
        }
      ]
    },
    leakItems: [
      {
        id: 'leak-ic-number',
        label: 'Nombor kad pengenalan (MyKad) 12-digit jelas terpapar tanpa ditutup',
        dangerLevel: 'KRITIKAL',
        isVulnerability: true,
        explanation: 'Nombor MyKad adalah kunci identiti paling berharga di Malaysia. Scammer boleh menggunakannya untuk memohon pinjaman wang haram atau membeli kad SIM prabayar atas nama anda.'
      },
      {
        id: 'leak-home-address',
        label: 'Alamat tempat tinggal penuh pada kad lesen memandu',
        dangerLevel: 'TINGGI',
        isVulnerability: true,
        explanation: 'Mendedahkan alamat rumah kepada ribuan orang asing di internet mendedahkan anda dan keluarga kepada risiko intipan fizikal.'
      },
      {
        id: 'leak-signature',
        label: 'Tandatangan pemilik pada kad lesen memandu boleh dizum dengan jelas',
        dangerLevel: 'KRITIKAL',
        isVulnerability: true,
        explanation: 'Penjenayah siber boleh menyalin imej tandatangan anda untuk memalsukan dokumen rasmi atau perjanjian sewa.'
      },
      {
        id: 'leak-congrats-text',
        label: 'Ungkapan "Terima kasih cikgu memandu yang banyak bersabar"',
        dangerLevel: 'SEDERHANA',
        isVulnerability: false,
        explanation: 'Ucapan penghargaan biasa yang tidak mengandungi sebarang data peribadi atau keselamatan digital.'
      }
    ],
    actions: [
      {
        id: 'act-safe',
        title: 'Padam hantaran atau kaburkan (blur) nombor MyKad, alamat, dan tandatangan sebelum memuat naik',
        description: 'Kongsi kegembiraan dengan menutup semua data rasmi penting dan hadkan audiens kepada kenalan rapat.',
        isSafe: true,
        consequence: 'LINDUNGI IDENTITI! Anda berjaya menghalang sindiket pemalsuan dokumen daripada mencuri identiti MyKad anda.'
      },
      {
        id: 'act-leave-proud',
        title: 'Biarkan foto berstatus awam kerana berbangga memegang lesen memandu baharu',
        description: 'Mengharapkan ucapan tahniah daripada lebih ramai kenalan di internet.',
        isSafe: false,
        consequence: 'IDENTITI DICURI! Dalam masa 48 jam, nombor MyKad anda telah digunakan oleh sindiket untuk mendaftar talian telekomunikasi gelap.'
      }
    ]
  },
  {
    id: 'soc-04',
    title: 'Perkongsian Lokasi Langsung & Jadual Rutin Harian di Media Sosial',
    category: 'AUDIT PRIVASI PROFIL',
    profileOwner: 'Puan Siti (Hantaran Facebook Awam)',
    postContent: {
      text: `"Rutin harian seorang ibu: Hantar si kecil Damia ke Taska Cahaya Kasih Seksyen 7 tepat jam 7:15 pagi setiap hari, lepas tu joging sendirian kat Taman Tasik sampai jam 8:30 pagi. Rasa segar sangat cuaca pagi ni! 🏃‍♀️🌳✨"`,
      imageCaption: 'Hantaran menggunakan fungsi "Check-In Lokasi Langsung" dengan pin GPS Taska dan peta laluan joging di taman tasik yang sunyi.',
      privacySetting: 'AWAM (PUBLIC)',
      exampleImages: [
        {
          id: 'img-checkin-leak',
          title: 'Pin GPS Lokasi Langsung & Rutin Harian',
          tag: 'LOKASI MASA NYATA',
          details: [
            'Lokasi 1: Taska Cahaya Kasih (Tepat 7:15 AM)',
            'Lokasi 2: Laluan Joging Taman Tasik (7:30 - 8:30 AM)',
            'Status: Bersendirian di kawasan tasik sunyi'
          ],
          warningNote: 'Menyiarkan rutin masa dan lokasi sunyi membolehkan pemangsa merancang masa dan tempat untuk mengekori mangsa!'
        }
      ]
    },
    leakItems: [
      {
        id: 'leak-daily-schedule',
        label: 'Jadual waktu harian yang tepat dan konsisten (7:15 pagi & 8:30 pagi)',
        dangerLevel: 'KRITIKAL',
        isVulnerability: true,
        explanation: 'Mendedahkan pola jadual waktu harian memudahkan penjenayah atau pencuri mengetahui bila mangsa tiada di rumah dan berada di tempat sunyi.'
      },
      {
        id: 'leak-child-nursery',
        label: 'Nama spesifik taska dan lokasi tepat anak ditinggalkan setiap pagi',
        dangerLevel: 'KRITIKAL',
        isVulnerability: true,
        explanation: 'Maklumat ini memberi peluang kepada penjenayah menyamar sebagai wakil ibu bapa untuk mengambil anak atau merancang penipuan penculikan.'
      },
      {
        id: 'leak-lone-jogging',
        label: 'Pengumuman bahawa anda joging sendirian di kawasan taman rekreasi',
        dangerLevel: 'TINGGI',
        isVulnerability: true,
        explanation: 'Mengumumkan status bersendirian di lokasi awam meningkatkan risiko menjadi mangsa jenayah ragut atau serangan fizikal.'
      },
      {
        id: 'leak-fresh-weather',
        label: 'Kenyataan "Rasa segar sangat cuaca pagi ni!"',
        dangerLevel: 'SEDERHANA',
        isVulnerability: false,
        explanation: 'Komen umum mengenai cuaca pagi yang tidak membawa sebarang risiko keselamatan diri.'
      }
    ],
    actions: [
      {
        id: 'act-safe',
        title: 'Matikan check-in lokasi langsung, jangan siarkan jadual anak, dan muat naik foto hanya selepas meninggalkan lokasi',
        description: 'Amalkan disiplin "post-trip sharing" dan sembunyikan lokasi anak demi keselamatan keluarga.',
        isSafe: true,
        consequence: 'KESEJAHTERAAN TERJAMIN! Menutup pola pergerakan rutin menghalang pemangsa daripada mengintai jadual anak dan keluarga anda.'
      },
      {
        id: 'act-keep-checkin',
        title: 'Teruskan check-in langsung setiap pagi supaya rakan Facebook boleh datang joging bersama',
        description: 'Ingin bergaul mesra dengan komuniti setempat.',
        isSafe: false,
        consequence: 'ANCAMAN KESELAMATAN! Bukan sahaja rakan, sesiapa sahaja termasuk penjenayah di internet kini tahu jadual dan lokasi anda bersendirian.'
      }
    ]
  },
  {
    id: 'soc-05',
    title: 'Kuiz & Cabaran Viral Pengumpul Soalan Keselamatan Perbankan',
    category: 'AUDIT PRIVASI PROFIL',
    profileOwner: 'Halaman Cabaran Tular / Viral Challenge Page',
    postContent: {
      text: `"Cabaran Santai: Ketahui nama kod ejen rahsia anda! 🕵️‍♂️✨\n👉 Nama panggilan ibu anda + Nama sekolah rendah pertama anda + Tarikh lahir anda!\nContoh: 'Aminah-SKSubang-14'! Komen nama ejen anda di bawah dan tag 3 orang adik-beradik anda sekarang!"`,
      imageCaption: 'Grafik kuiz berwarna-warni yang telah dijawab oleh lebih 12,000 pengguna media sosial di ruangan komen awam.',
      privacySetting: 'AWAM (PUBLIC)',
      exampleImages: [
        {
          id: 'img-quiz-leak',
          title: 'Grafik Kuiz Ejen & Ruangan Komen Awam',
          tag: 'SOALAN KESELAMATAN BANK',
          details: [
            'Data 1: Nama Panggilan Ibu (Soalan Keselamatan Perbankan)',
            'Data 2: Sekolah Rendah Pertama (Soalan Reset Kata Laluan)',
            'Data 3: Tarikh Lahir & Tag Nama Adik-Beradik'
          ],
          warningNote: 'Data yang dikumpul melalui kuiz ini merupakan soalan keselamatan standard perbankan dan emel peribadi!'
        }
      ]
    },
    leakItems: [
      {
        id: 'leak-security-questions',
        label: 'Nama ibu dan sekolah rendah adalah soalan pemulihan keselamatan akaun bank',
        dangerLevel: 'KRITIKAL',
        isVulnerability: true,
        explanation: 'Institusi perbankan dan perkhidmatan emel menggunakan nama ibu dan sekolah rendah sebagai soalan pengesahan pemulihan akaun apabila kata laluan terlupa.'
      },
      {
        id: 'leak-birthdate',
        label: 'Tarikh lahir pengguna dikumpul secara terbuka pada ruangan komen',
        dangerLevel: 'TINGGI',
        isVulnerability: true,
        explanation: 'Tarikh lahir adalah maklumat penting yang sering digunakan untuk mengesahkan identiti pengguna semasa berurusan dengan pusat khidmat pelanggan.'
      },
      {
        id: 'leak-family-tagging',
        label: 'Menanda (tag) adik-beradik mendedahkan struktur salasilah keluarga',
        dangerLevel: 'TINGGI',
        isVulnerability: true,
        explanation: 'Penjenayah siber memetakan hubungan kekeluargaan mangsa untuk melancarkan penipuan emosi dan kecemasan palsu.'
      },
      {
        id: 'leak-agent-game',
        label: 'Format permainan "Ketahui nama kod ejen rahsia anda"',
        dangerLevel: 'SEDERHANA',
        isVulnerability: false,
        explanation: 'Format tema ejen rahsia itu sendiri hanyalah topeng hiburan yang digunakan sindiket untuk mengumpan orang ramai.'
      }
    ],
    actions: [
      {
        id: 'act-safe',
        title: 'Jangan sesekali menjawab kuiz tersebut dan padam komen terdahulu yang mendedahkan data keselamatan',
        description: 'Sedar bahawa kuiz santai media sosial sering direka khas oleh pengumpul data (data miners) untuk mencuri maklumat peribadi.',
        isSafe: true,
        consequence: 'PERLINDUNGAN TINGGI! Anda melindungi soalan pemulihan akaun bank anda daripada dieksploitasi oleh sindiket penggodam siber.'
      },
      {
        id: 'act-comment-answer',
        title: 'Komen jawapan penuh kerana menganggap ia hanyalah permainan suka-suka yang tidak mendatangkan bahaya',
        description: 'Ingin bergembira bersama rakan yang lain.',
        isSafe: false,
        consequence: 'AKAUN DIGODAM! Penjenayah menggunakan nama ibu dan sekolah rendah anda untuk menetapkan semula kata laluan emel dan perbankan anda.'
      }
    ]
  }
];

export const socialPrivacyCasesEn: SocialPrivacyCase[] = [
  {
    id: 'soc-01',
    title: 'Public Facebook Post Audit "Our Family Vacation Abroad"',
    category: 'PROFILE PRIVACY AUDIT',
    profileOwner: 'Kak Salmah (Public Facebook Account)',
    postContent: {
      text: `"Praise God our lifelong family dream has come true! We are flying off to London today for 2 weeks. Our home in Taman Melati will be vacant until end of the month. Pray for our safe journey dear friends! ❤️✈️"`,
      imageCaption: 'Photo shows: Airline Boarding Pass with high-res PNR Barcode, House Key set with address tag, and Child in primary school uniform badge.',
      privacySetting: 'PUBLIC',
      exampleImages: [
        {
          id: 'img-boarding-pass',
          title: 'Airline Boarding Pass',
          tag: 'SENSITIVE BARCODE',
          imageUrl: '/images/social-privacy/boarding-pass.png',
          details: [
            'Passenger: SALMAH / AHMAD MRS',
            'Flight: MH 002 (KUL ➔ LHR London)',
            'Seat: 14A | Gate: C12',
            'PNR Booking Code: K7X9LQ'
          ],
          warningNote: 'Barcodes embed Passport Number, Mobile Phone, and PNR details that can be extracted to hijack flights!'
        },
        {
          id: 'img-keys',
          title: 'House Keys & Address Tag',
          tag: 'UNOCCUPIED HOUSE LOCATION',
          imageUrl: '/images/social-privacy/house-keys.png',
          details: [
            'Key Tag: "No 12, Jalan Melati 4"',
            'Status: House vacant for 2 weeks',
            'Area: Taman Melati, Selangor'
          ],
          warningNote: 'Broadcasting an empty home provides a golden invitation for burglary rings!'
        },
        {
          id: 'img-badge',
          title: 'Child in School Uniform Photo',
          tag: 'MINOR IDENTIFIER',
          imageUrl: '/images/social-privacy/school-badge.png',
          details: [
            'Child Name: Farhan (Grade 4)',
            'School Badge: SK Taman Melati',
            'Daily Session: Morning Class'
          ],
          warningNote: 'Exposing children\'s names and school locations enables kidnapper extortion schemes!'
        }
      ]
    },
    leakItems: [
      {
        id: 'leak-empty-house',
        label: 'Broadcasting to the public that your house is vacant for 2 weeks',
        dangerLevel: 'CRITICAL',
        isVulnerability: true,
        explanation: 'Alerting strangers that your residence is empty invites residential break-ins and burglaries.'
      },
      {
        id: 'leak-barcode',
        label: 'Scannable barcode and PNR on the airline boarding pass',
        dangerLevel: 'CRITICAL',
        isVulnerability: true,
        explanation: 'Anyone can decode that barcode to steal passport numbers, ticket numbers, phone details, and alter or cancel flight itineraries.'
      },
      {
        id: 'leak-child-badge',
        label: 'Child\'s daily school uniform badge and name tag',
        dangerLevel: 'HIGH',
        isVulnerability: true,
        explanation: 'Exposing school locations enables impostors to engineer synthetic kidnapping and accident scams against parents.'
      },
      {
        id: 'leak-congrats',
        label: 'Phrase: "Praise God our lifelong family dream has come true!"',
        dangerLevel: 'MODERATE',
        isVulnerability: false,
        explanation: 'Personal sentiment and polite celebration that contains neither physical nor digital security vulnerabilities.'
      }
    ],
    actions: [
      {
        id: 'act-leave-public',
        title: 'Leave the post set to Public so more Facebook acquaintances can see it',
        description: 'Gain more likes and engagement from other Facebook users.',
        isSafe: false,
        consequence: 'DANGEROUS! Your personal itinerary and home location are exposed to anyone on the open internet.'
      },
      {
        id: 'act-safe',
        title: 'Delete post, redact sensitive data (blur barcodes), and restrict privacy to "Friends Only"',
        description: 'Post vacation photos after returning home to safeguard physical property.',
        isSafe: true,
        consequence: 'EXCELLENT! You protected your home from burglary and your family\'s passport credentials from identity theft.'
      }
    ]
  },
  {
    id: 'soc-02',
    title: 'AI Cloned Voice Note Call from Child Demanding Emergency Funds',
    category: 'AI VOICE CLONE DETECTOR',
    profileOwner: 'WhatsApp Voice Note from Unknown Number',
    postContent: {
      text: `[Audio Voice Note]: "Mum! It's Farhan... Please help me mum! My phone was snatched at the bus terminal. I am using my friend's phone. I urgently need RM1,500 now to settle my friend's emergency hospital bill! Please transfer to my friend's account immediately mum, do not call my old number!"`,
      imageCaption: 'The audio voice note matches your son\'s (Farhan) voice with 95% acoustic similarity generated via AI Voice Cloning using short clips from his public TikTok videos.',
      privacySetting: 'PUBLIC',
      aiVoiceIllustrationUrl: '/images/social-privacy/ai-voice-clone.png'
    },
    leakItems: [
      {
        id: 'leak-voice-clone',
        label: 'Child\'s voice synthesized using public short-form video clips (TikTok)',
        dangerLevel: 'CRITICAL',
        isVulnerability: true,
        explanation: 'Modern AI voice synthesizers require only 3 seconds of clean audio from public social media videos to clone realistic speech.'
      },
      {
        id: 'leak-dont-call',
        label: 'Strict instruction: "Do not call my old phone number"',
        dangerLevel: 'CRITICAL',
        isVulnerability: true,
        explanation: 'Scammers forbid calling the real number because your child\'s genuine phone is active and undamaged!'
      },
      {
        id: 'leak-friend-account',
        label: 'Demanding immediate wire transfer to a third-party (friend\'s) account',
        dangerLevel: 'HIGH',
        isVulnerability: true,
        explanation: 'The third-party bank account is a syndicate money mule designed to siphon funds beyond recall.'
      }
    ],
    actions: [
      {
        id: 'act-panic-send',
        title: 'Transfer RM1,500 immediately because the voice sounds exactly like your child',
        description: 'Terrified your child is suffering at the hospital.',
        isSafe: false,
        consequence: 'DECEIVED! The voice was an AI synthesis. Your child was safe and sound in their dormitory bedroom.'
      },
      {
        id: 'act-safe',
        title: 'Use the "Family Secret Safe Word" or call your child\'s real phone number directly',
        description: 'Ask a private question that only your authentic child could know before making any transfer.',
        isSafe: true,
        consequence: 'BRILLIANT & SECURE! When prompted for the Family Secret Safe Word, the AI syndicate immediately hung up because they had no answer!'
      }
    ]
  },
  {
    id: 'soc-03',
    title: 'Instagram Post Audit: Flaunting New JPJ Driving License & MyKad',
    category: 'PROFILE PRIVACY AUDIT',
    profileOwner: 'Amirul (Public Instagram Profile)',
    postContent: {
      text: `"Praise God after failing 3 times, today I finally passed my JPJ road test and secured my full driving license! Huge thanks to my driving instructor for bearing with me. Finally can drive on my own! 🚗🎉✨"`,
      imageCaption: 'Selfie photo shows Amirul proudly holding his brand-new driving license and MyKad with 12-digit IC number, full residential address, and clear signature exposed.',
      privacySetting: 'PUBLIC',
      exampleImages: [
        {
          id: 'img-mykad-leak',
          title: 'Photo of MyKad & JPJ Driving License',
          tag: 'OFFICIAL IDENTITY DATA',
          details: [
            'MyKad Number: 040512-10-5843 (Clearly Legible)',
            'Full Name: AMIRUL BIN ZULKIFLI',
            'Home Address: No 45, Jalan Anggerik 3, Shah Alam',
            'Card Signature: Fully Visible for Replication'
          ],
          warningNote: 'Identity card numbers and signatures are used by syndicates for unauthorized loan applications and registering illicit prepaid lines!'
        }
      ]
    },
    leakItems: [
      {
        id: 'leak-ic-number',
        label: '12-digit Malaysian Identity Card (MyKad) clearly visible without redaction',
        dangerLevel: 'CRITICAL',
        isVulnerability: true,
        explanation: 'The MyKad number is Malaysia’s primary identity key. Fraudsters exploit it to open mule bank accounts and apply for illegal money lender loans in your name.'
      },
      {
        id: 'leak-home-address',
        label: 'Full home residential address printed on the driver’s license card',
        dangerLevel: 'HIGH',
        isVulnerability: true,
        explanation: 'Broadcasting your home address to thousands of strangers on social media exposes your family to physical stalking and mail interception risks.'
      },
      {
        id: 'leak-signature',
        label: 'Owner signature on the license card can be easily magnified and copied',
        dangerLevel: 'CRITICAL',
        isVulnerability: true,
        explanation: 'Cybercriminals can extract and trace your handwritten signature to forge commercial rental agreements or authorizations.'
      },
      {
        id: 'leak-congrats-text',
        label: 'Statement "Huge thanks to my driving instructor for bearing with me"',
        dangerLevel: 'MODERATE',
        isVulnerability: false,
        explanation: 'Standard celebratory statement that contains no sensitive digital identity or financial information.'
      }
    ],
    actions: [
      {
        id: 'act-safe',
        title: 'Delete post or blur MyKad number, address, and signature before uploading, and restrict to Close Friends',
        description: 'Celebrate achievements while blacking out all sensitive state-issued identity documents.',
        isSafe: true,
        consequence: 'IDENTITY PROTECTED! You prevented document forgery syndicates from abusing your national identity credentials.'
      },
      {
        id: 'act-leave-proud',
        title: 'Keep the photo public out of excitement for obtaining your new driver’s license',
        description: 'Aiming to receive more congratulations from online acquaintances.',
        isSafe: false,
        consequence: 'IDENTITY THEFT! Within 48 hours, your MyKad number was harvested by syndicates to register dark-web telecommunication accounts.'
      }
    ]
  },
  {
    id: 'soc-04',
    title: 'Live Location Check-Ins & Predictable Daily Routine Schedules',
    category: 'PROFILE PRIVACY AUDIT',
    profileOwner: 'Puan Siti (Public Facebook Post)',
    postContent: {
      text: `"Mom's morning routine: Dropped baby Damia off at Taska Cahaya Kasih Seksyen 7 at 7:15 AM sharp, then solo jogging at the Lake Garden until 8:30 AM. Weather feels so refreshing this morning! 🏃‍♀️🌳✨"`,
      imageCaption: 'Post utilizes real-time GPS Location Check-In tagging the specific childcare nursery and a secluded park jogging route.',
      privacySetting: 'PUBLIC',
      exampleImages: [
        {
          id: 'img-checkin-leak',
          title: 'Live GPS Pin & Morning Route Map',
          tag: 'REAL-TIME LOCATION',
          details: [
            'Location 1: Taska Cahaya Kasih (Exact 7:15 AM)',
            'Location 2: Lake Garden Jogging Path (7:30 - 8:30 AM)',
            'Status: Exercising alone in isolated park area'
          ],
          warningNote: 'Publishing predictable daily timetables and isolated locations enables criminals to pre-plan stalking and targeting windows!'
        }
      ]
    },
    leakItems: [
      {
        id: 'leak-daily-schedule',
        label: 'Exact and predictable daily timetable patterns (7:15 AM & 8:30 AM)',
        dangerLevel: 'CRITICAL',
        isVulnerability: true,
        explanation: 'Predictable public timetables broadcast exactly when a home is unoccupied and when a victim is in an isolated physical environment.'
      },
      {
        id: 'leak-child-nursery',
        label: 'Specific name and exact geographic location where the child is dropped off daily',
        dangerLevel: 'CRITICAL',
        isVulnerability: true,
        explanation: 'Enables child predators or extortion scammers to impersonate family representatives or fabricate targeted kidnapping phone calls.'
      },
      {
        id: 'leak-lone-jogging',
        label: 'Publicly announcing that you jog alone in a secluded park area',
        dangerLevel: 'HIGH',
        isVulnerability: true,
        explanation: 'Broadcasting your isolated location increases the risk of snatch thefts or physical assaults.'
      },
      {
        id: 'leak-fresh-weather',
        label: 'Remark "Weather feels so refreshing this morning!"',
        dangerLevel: 'MODERATE',
        isVulnerability: false,
        explanation: 'Harmless lifestyle remark with no security or identity exposure implications.'
      }
    ],
    actions: [
      {
        id: 'act-safe',
        title: 'Turn off live location check-ins, conceal child schedules, and share photos only after leaving the venue',
        description: 'Practice delayed post-trip sharing and protect child location routines.',
        isSafe: true,
        consequence: 'SAFETY SECURED! Eliminating routine movement tracking protects your children and household from malicious surveillance.'
      },
      {
        id: 'act-keep-checkin',
        title: 'Keep daily live check-ins active so Facebook friends can join your morning workout',
        description: 'Seeking social companionship in the neighbourhood.',
        isSafe: false,
        consequence: 'SAFETY COMPROMISED! Strangers and criminals now know the precise times you are walking alone in secluded spots.'
      }
    ]
  },
  {
    id: 'soc-05',
    title: 'Viral Quiz & Social Challenges Harvesting Bank Password Recovery Answers',
    category: 'PROFILE PRIVACY AUDIT',
    profileOwner: 'Viral Challenge Community Page',
    postContent: {
      text: `"Fun Quiz: Discover your secret agent code name! 🕵️‍♂️✨\n👉 Your mother's first name + Your primary school name + Your birthdate!\nExample: 'Aminah-SKSubang-14'! Comment your agent name below and tag 3 siblings right now!"`,
      imageCaption: 'Bright cartoon challenge graphic with over 12,000 public comments answering security prompt combinations.',
      privacySetting: 'PUBLIC',
      exampleImages: [
        {
          id: 'img-quiz-leak',
          title: 'Secret Agent Quiz & Public Comments',
          tag: 'BANK SECURITY PROMPTS',
          details: [
            'Prompt 1: Mother\'s Name (Standard Bank Security Question)',
            'Prompt 2: First Primary School (Password Reset Prompt)',
            'Prompt 3: Exact Birth Date & Sibling Tag Links'
          ],
          warningNote: 'Data gathered in this viral challenge directly maps to password reset recovery questions across major Malaysian banks and email providers!'
        }
      ]
    },
    leakItems: [
      {
        id: 'leak-security-questions',
        label: 'Mother\'s name and primary school are standard bank security challenge questions',
        dangerLevel: 'CRITICAL',
        isVulnerability: true,
        explanation: 'Financial institutions and email providers utilize mother’s maiden names and primary schools as authentication challenge questions for password resets.'
      },
      {
        id: 'leak-birthdate',
        label: 'Exact date of birth collected in public comments alongside full social identity',
        dangerLevel: 'HIGH',
        isVulnerability: true,
        explanation: 'Birth dates are critical secondary verification tokens demanded by customer service centers.'
      },
      {
        id: 'leak-family-tagging',
        label: 'Tagging siblings discloses complete extended family tree structures',
        dangerLevel: 'HIGH',
        isVulnerability: true,
        explanation: 'Social engineering rings map family relations to stage targeted distress and impersonation scams against relatives.'
      },
      {
        id: 'leak-agent-game',
        label: 'Playful "Secret agent code name" quiz format',
        dangerLevel: 'MODERATE',
        isVulnerability: false,
        explanation: 'The whimsical agent theme is simply an entertaining facade employed to distract users from noticing data harvesting.'
      }
    ],
    actions: [
      {
        id: 'act-safe',
        title: 'Never reply to personal prompt quizzes and delete past comments revealing family security answers',
        description: 'Understand that viral quizzes are frequently data mining operations engineered to harvest password reset answers.',
        isSafe: true,
        consequence: 'HIGH SECURITY! You shielded your bank password recovery prompts from being exploited by credential theft operations.'
      },
      {
        id: 'act-comment-answer',
        title: 'Post your full answer because you view it as harmless lighthearted entertainment',
        description: 'Joining in the fun alongside friends.',
        isSafe: false,
        consequence: 'ACCOUNT BREACHED! Fraudsters used your mother\'s name and primary school to reset credentials and take over your email and online banking.'
      }
    ]
  }
];

export const getSocialPrivacyCases = (language: 'bm' | 'en' = 'bm'): SocialPrivacyCase[] => {
  return language === 'en' ? socialPrivacyCasesEn : socialPrivacyCases;
};

export const socialPrivacyMeta: ChallengeMeta = {
  id: 'social-privacy',
  title: 'Misi 06: Privasi Media Sosial & Pengesan Klon AI',
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
  totalQuestions: 5,
  maxScore: 50
};

