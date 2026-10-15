import { ChallengeMeta } from '@/types/challenge';

export interface WifiNetworkItem {
  id: string;
  ssid: string;
  signalStrength: 'KUAT' | 'SEDERHANA' | 'LEMAH';
  securityType: 'TERBUKA (TIADA ENKRIPSI)' | 'WPA2 / WPA3 (DISULITKAN)' | 'PERANGKAP EVIL TWIN';
  isSafe: boolean;
  captivePortalWarning?: string;
  sniffableSampleText: string;
  encryptedSampleText: string;
  notes: string;
}

export const wifiNetworksList: WifiNetworkItem[] = [
  {
    id: 'wifi-open-cafe',
    ssid: 'Kopitiam_Free_WiFi_Pantas',
    signalStrength: 'KUAT',
    securityType: 'TERBUKA (TIADA ENKRIPSI)',
    isSafe: false,
    captivePortalWarning: 'Laman log masuk meminta anda memasukkan No. Kad Pengenalan, Nombor Telefon, dan Log Masuk Akaun Media Sosial.',
    sniffableSampleText: 'DATA TERDEDAH: GET /akaun HTTP/1.1 -> User: pak_ali@gmail.com | Pass: RahsiaKu123! | Lokasi: Kedai Kopi',
    encryptedSampleText: 'DATA DISULITKAN (VPN AKTIF): [AES-256 GCM] 9f8a3c...d71b (Mustahil dibaca pengintip rangkaian)',
    notes: 'Rangkaian terbuka tanpa kata laluan membolehkan sesiapa sahaja di kedai yang sama mengintip trafik data yang tidak disulitkan.'
  },
  {
    id: 'wifi-official-cafe',
    ssid: 'Kopitiam_Official_WPA3',
    signalStrength: 'KUAT',
    securityType: 'WPA2 / WPA3 (DISULITKAN)',
    isSafe: true,
    captivePortalWarning: undefined,
    sniffableSampleText: 'KATA LALUAN DIPERLUKAN: Terdapat pada resit pembelian kopi kaunter (cth: "kopi-sedap-2025").',
    encryptedSampleText: 'SAMBUNGAN SELAMAT: Trafik data antara komputer riba dan penghala (router) disulitkan dengan WPA3.',
    notes: 'Rangkaian sah milik kedai yang memerlukan kata laluan rasmi daripada resit pembelian.'
  },
  {
    id: 'wifi-evil-twin',
    ssid: 'AirPort_Free_HighSpeed_WiFi',
    signalStrength: 'KUAT',
    securityType: 'PERANGKAP EVIL TWIN',
    isSafe: false,
    captivePortalWarning: 'AMARAN: Sijil keselamatan SSL tidak sah! Pemilik hotspot cuba memasang profil pensijilan palsu ke dalam komputer riba anda.',
    sniffableSampleText: 'SERANGAN MAN-IN-THE-MIDDLE: Penggodam memasang alat penghala mini untuk menyalin semua sesi perbankan mangsa.',
    encryptedSampleText: 'DILINDUNGI: VPN menyalurkan trafik melalui terowong selamat yang tidak dapat dipintas penghala penjenayah.',
    notes: 'Hotspot palsu yang dinamakan seakan-akan nama rasmi lapangan terbang untuk memperdaya pelancong.'
  },
  {
    id: 'wifi-personal-hotspot',
    ssid: 'Hotspot Peribadi 5G Telefon Anda',
    signalStrength: 'SEDERHANA',
    securityType: 'WPA2 / WPA3 (DISULITKAN)',
    isSafe: true,
    captivePortalWarning: undefined,
    sniffableSampleText: 'DATA SENDIRI: Menggunakan kuota data telekomunikasi persendirian yang selamat sepenuhnya daripada intipan awam.',
    encryptedSampleText: 'SELAMAT 100%: Tiada perkongsian rangkaian dengan orang asing di ruang awam.',
    notes: 'Pilihan paling selamat untuk urusan perbankan atau kerja penting semasa berada di luar rumah.'
  }
];

export const publicWifiMeta: ChallengeMeta = {
  id: 'public-wifi',
  title: 'Misi 05: Perangkap Wi-Fi Awam & Hotspot Palsu',
  shortDescription: 'Imbas gelombang Wi-Fi di kedai kopi dan lapangan terbang. Saksikan bagaimana peranti pengintip mencuri kata laluan dan gunakan perisai VPN untuk menyekatnya.',
  learningObjective: 'Membezakan rangkaian Wi-Fi selamat dan terbuka, memahami risiko intipan data (*sniffing*), dan mengamalkan penggunaan VPN serta hotspot peribadi.',
  difficulty: 'Pertengahan',
  estimatedTime: '5-7 Minit',
  iconName: 'Wifi',
  accentColor: '#D9FA62',
  badgeText: 'PERISAI RANGKAIAN',
  instructions: [
    'Lihat Radar Pengimbas Rangkaian Wi-Fi di sebelah kiri.',
    'Pilih rangkaian dan periksa status keselamatan serta sijil SSL.',
    'Uji alat simulasi pintasan data (*Packet Sniffer*) di sebelah kanan.',
    'Togol suis VPN untuk melihat bagaimana enkripsi menukar teks dedah menjadi kebal.'
  ],
  keyTakeaways: [
    'Jangan sesekali melakukan urusan perbankan atau memasukkan kata laluan semasa menyambung ke Wi-Fi awam terbuka.',
    'Gunakan data mudah alih peribadi (Personal Hotspot) untuk transaksi sensitif.',
    'Pastikan ikon mangga hijau (HTTPS) sentiasa aktif dan gunakan VPN sekiranya perlu menggunakan Wi-Fi awam.'
  ],
  totalQuestions: 3,
  maxScore: 50
};
