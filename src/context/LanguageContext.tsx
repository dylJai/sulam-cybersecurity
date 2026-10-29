'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'bm' | 'en';
export type FontSize = 'normal' | 'large' | 'xlarge';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  bm: {
    // Header & Navigation
    'app.title': 'CyberSafe Community',
    'app.subtitle': 'Bengkel Keselamatan Siber Komuniti',
    'nav.mainMenu': 'Menu Utama',
    'nav.backToMenu': '← [MENU UTAMA]',
    'nav.scoreLabel': 'Mata Stesen:',
    'nav.resetBtn': 'Set Semula Stesen',
    'nav.resetConfirmTitle': 'Set Semula Stesen untuk Pasukan Baru?',
    'nav.resetConfirmDesc': 'Tindakan ini akan mengosongkan mata dan sejarah jawapan stesen ini supaya pasukan peserta seterusnya dapat memulakan cabaran dari awal.',
    'nav.resetCancel': 'Batal',
    'nav.resetConfirm': 'Sahkan Set Semula',

    // Home Page Hero
    'home.topTag': 'BENGKEL KESELAMATAN SIBER KOMUNITI • 6 STESEN INTERAKTIF',
    'home.heroBadge': 'CyberSafe Community • Komuniti Siber Selamat',
    'home.heroTitle1': 'Kenali Jerat Scam.',
    'home.heroTitle2': 'Lindungi Keluarga.',
    'home.heroQuote': '“Kesan pancingan tipu, kuatkan kata laluan, dan sekat penipu siber bersama komuniti.”',
    'home.heroDesc': 'Modul latihan praktikal stesen komputer riba untuk bengkel komuniti & kampung. Bekerjasama dalam kumpulan untuk mengesan SMS tipu, menangkis panggilan polis palsu, dan menyekat aplikasi pencuri duit.',
    'home.startBtn': 'Mula Cabaran 01: Jerat Mesej Palsu',
    'home.browseBtn': 'Pilih Modul di Bawah',
    'home.progressLabel': 'Kemajuan Stesen:',
    'home.completedText': 'Selesai',
    'home.pointsText': 'Mata',

    // Home Sections
    'home.missionsHeader': 'BAHAGIAN 01 / MISI AMALI INTERAKTIF',
    'home.missionsTitle': 'Misi Keselamatan Siber Stesen Komuniti',
    'home.missionsSummary': '6 PERMAINAN INTERAKTIF • 300 MATA MAKSIMUM',
    'home.guideHeader': 'BAHAGIAN 02 / PANDUAN PENYIASATAN',
    'home.guideTitle': 'Bagaimana Misi Interaktif Ini Berfungsi?',
    'home.step1Num': '01.',
    'home.step1Title': 'Siasat Tanda Bahaya',
    'home.step1Desc': 'Klik pada bahagian mesej yang meragukan—seperti pautan pelik, fail .apk luar, atau desakan bayar dalam 2 jam.',
    'home.step2Num': '02.',
    'home.step2Title': 'Buat Keputusan Bertindak',
    'home.step2Desc': 'Pilih tindakan paling selamat untuk menyelamatkan duit simpanan dan lihat kesan serta-merta setiap pilihan.',
    'home.step3Num': '03.',
    'home.step3Title': 'Kukuhkan Benteng Pertahanan',
    'home.step3Desc': 'Bina frasa kata laluan panjang, amalkan kata rahsia keluarga, dan hafal talian kecemasan 997.',
    'home.rulesHeader': 'PRINSIP PERTAHANAN UTAMA',
    'home.rulesSubtitle': 'INGATAN PANTAS KOMUNITI',
    'home.ruleATitle': 'A. JANGAN PANIK & JANGAN TERBURU-BURU',
    'home.ruleADesc': 'Scammer sengaja menakut-nakutkan anda kononnya polis nak tangkap atau bekalan elektrik nak dipotong. Bertenang dan semak dahulu.',
    'home.ruleBTitle': 'B. JANGAN SESEKALI KLIK PAUTAN PELIK',
    'home.ruleBDesc': 'Pihak bank dan agensi kerajaan tidak lagi menghantar pautan melalui SMS. Sentiasa buka aplikasi rasmi sendiri.',
    'home.ruleCTitle': 'C. JANGAN KONGSI KOD SMS 6-DIGIT (TAC/OTP)',
    'home.ruleCDesc': 'Kod SMS 6-digit adalah rahsia peribadi mutlak. Pihak bank dan polis sebenar tidak pernah meminta kod ini melalui panggilan telefon.',

    // Challenge Cards & Metadata
    'm1.title': 'Misi 01: Pancingan Tipu & Jerat Mesej Palsu',
    'm1.desc': 'Pelajari cara mengesan SMS mencurigakan, amaran bank palsu, dan emel tipu helah sebelum terjerumus ke dalam perangkap scammer.',
    'm2.title': 'Misi 02: Pertahanan Kata Laluan & Kunci Akaun',
    'm2.desc': 'Kuasai cara membina frasa laluan kukuh yang sukar dipecahkan, hentikan pengambilalihan akaun, dan fahami 2FA serta pengurus kata laluan.',
    'm3.title': 'Misi 03: Scam Panggilan & Talian NSRC 997',
    'm3.desc': 'Siasat panggilan mencurigakan daripada individu yang mengaku "Polis", "Mahkamah", dan "LHDN". Gunakan alat SemakMule PDRM dan ketahui fungsi talian kecemasan 997.',
    'm4.title': 'Misi 04: Perangkap Pemasangan Fail APK',
    'm4.desc': 'Bedah siasat fail APK meragukan yang meminta kebenaran membaca SMS dan kenalan. Ketahui perbezaan gerbang FPX rasmi dan perangkap pencuri TAC.',
    'm5.title': 'Misi 05: Skim Pelaburan Telegram & Kripto Palsu',
    'm5.desc': 'Bongkar kumpulan Telegram yang menjanjikan pulangan 500% dalam 24 jam. Gunakan Senarai Peringatan Pelabur SC Malaysia untuk menyemak status syarikat.',
    'm6.title': 'Misi 06: Privasi Media Sosial & Pengesan Klon AI',
    'm6.desc': 'Audit hantaran Facebook yang mendedahkan kod bar tiket penerbangan dan rumah kosong. Tangkis panggilan klon suara AI menggunakan protokol Kata Laluan Rahsia Keluarga.',

    // Common Game UI Frame
    'game.case': 'KES',
    'game.of': '/',
    'game.backMenu': '← [MENU UTAMA]',
    'game.backToMain': '← [KEMBALI KE MENU UTAMA]',
    'game.resetFromStart': 'Set Semula',
    'game.badges': 'Lencana',
    'game.score': 'MATA:',
    'game.pts': 'Mata',
    'game.missionProgress': 'Kemajuan Misi:',
    'game.realStoryBtn': 'Kisah Sebenar',
    'game.step1Badge': 'LANGKAH 1: KESAN TANDA BAHAYA',
    'game.step2Badge': 'LANGKAH 2: BERTINDAK',
    'game.step1Header': 'Langkah 1: Tandakan Tanda-Tanda Bahaya',
    'game.step2Header': 'Langkah 2: Apakah Tindakan Paling Selamat?',
    'game.step2Sub': 'Pilih satu keputusan terbaik untuk melindungi diri dan keluarga:',
    'game.mark': '+ TANDAKAN',
    'game.marked': '✓ DITANDAKAN',
    'game.yourChoice': 'PILIHAN ANDA ✓',
    'game.submitStep1': 'Sahkan Tanda Bahaya & Ke Langkah 2 →',
    'game.submitStep2': 'Sahkan Keputusan Tindakan',
    'game.nextScenario': 'Senario Seterusnya',
    'game.viewFinalReport': 'Lihat Laporan Misi Selesai',
    'game.retry': 'Ulang Siasatan',
    'game.mainMenu': 'Kembali Ke Menu Utama',
    'game.nextMission': 'Misi Seterusnya',
    'game.realWorldModalTitle': 'Kisah Sebenar Mangsa Scam di Malaysia',
    'game.closeModal': 'Faham & Tutup',

    // Results Screen Labels
    'results.reportTitle': 'LAPORAN SELESAI',
    'results.scenariosTested': 'Senario Disiasat',
    'results.cluesFound': 'Tanda Dikesan',
    'results.safeDecisions': 'Keputusan Selamat',
    'results.totalScore': 'Jumlah Mata',

    // Font Size & Accessibility
    'header.fontSize': 'Saiz Tulisan',
    'header.fontNormal': 'Biasa',
    'header.fontLarge': 'Besar',
    'header.fontXLarge': 'Sangat Besar',
    'nav.backToMenuFriendly': 'Kembali ke Menu Utama',
    'footer.callNow': 'Hubungi 997 Sekarang',
    'footer.callFree': 'Panggilan Percuma',

    // Footer
    'footer.initiative': 'CyberSafe Community — Inisiatif Keselamatan Siber Komuniti',
    'footer.subtext': 'Modul pembelajaran interaktif stesen komputer riba untuk bengkel komuniti, kampung & sekolah.',
    'footer.hotlineTitle': 'Talian Kecemasan Scam Kebangsaan (NSRC):',
    'footer.hotlineDesc': 'Dail 997 dengan segera (dalam tempoh 1 jam) jika anda terpedaya memindahkan wang kepada scammer.',
    'footer.year': 'KEMASKINI: 2026 / MALAYSIA'
  },
  en: {
    // Header & Navigation
    'app.title': 'CyberSafe Community',
    'app.subtitle': 'Community Cybersecurity Workshop',
    'nav.mainMenu': 'Main Menu',
    'nav.backToMenu': '← [MAIN MENU]',
    'nav.scoreLabel': 'Station Score:',
    'nav.resetBtn': 'Reset Station',
    'nav.resetConfirmTitle': 'Reset Station for Next Team?',
    'nav.resetConfirmDesc': 'This will clear all scores and answer history on this station so the next group can start fresh.',
    'nav.resetCancel': 'Cancel',
    'nav.resetConfirm': 'Confirm Reset',

    // Home Page Hero
    'home.topTag': 'COMMUNITY CYBERSECURITY WORKSHOP • 6 INTERACTIVE STATIONS',
    'home.heroBadge': 'CyberSafe Community • Stay Safe Online',
    'home.heroTitle1': 'Spot the Scams.',
    'home.heroTitle2': 'Protect Your Family.',
    'home.heroQuote': '“Detect phishing traps, strengthen your passwords, and stop cyber scammers together as a community.”',
    'home.heroDesc': 'Hands-on laptop station training for community workshops and local centers. Collaborate in groups to spot fake SMS, fend off bogus police calls, and block money-stealing apps.',
    'home.startBtn': 'Start Mission 01: Fake Message Traps',
    'home.browseBtn': 'Explore Modules Below',
    'home.progressLabel': 'Station Progress:',
    'home.completedText': 'Completed',
    'home.pointsText': 'Points',

    // Home Sections
    'home.missionsHeader': 'PART 01 / INTERACTIVE PRACTICAL MISSIONS',
    'home.missionsTitle': 'Community Station Cybersecurity Missions',
    'home.missionsSummary': '6 INTERACTIVE GAMES • 300 MAXIMUM POINTS',
    'home.guideHeader': 'PART 02 / INVESTIGATION GUIDE',
    'home.guideTitle': 'How Do These Interactive Missions Work?',
    'home.step1Num': '01.',
    'home.step1Title': 'Investigate Red Flags',
    'home.step1Desc': 'Click on suspicious parts of messages—like odd links, external .apk files, or demands to pay within 2 hours.',
    'home.step2Num': '02.',
    'home.step2Title': 'Make Safe Decisions',
    'home.step2Desc': 'Choose the safest action to protect your hard-earned savings and see the immediate consequences of each choice.',
    'home.step3Num': '03.',
    'home.step3Title': 'Strengthen Your Defenses',
    'home.step3Desc': 'Build long memorable passphrases, establish a family secret codeword, and memorize the 997 hotline.',
    'home.rulesHeader': 'CORE DEFENSE PRINCIPLES',
    'home.rulesSubtitle': 'COMMUNITY QUICK REMINDER',
    'home.ruleATitle': 'A. NEVER PANIC OR RUSH',
    'home.ruleADesc': 'Scammers deliberately induce fear claiming police will arrest you or utilities will be cut. Stay calm and verify first.',
    'home.ruleBTitle': 'B. NEVER CLICK RANDOM LINKS',
    'home.ruleBDesc': 'Banks and government agencies no longer send links via SMS. Always open your official app directly.',
    'home.ruleCTitle': 'C. NEVER SHARE 6-DIGIT SMS CODES (TAC/OTP)',
    'home.ruleCDesc': 'Your 6-digit SMS code is strictly confidential. Legitimate banks and police will never ask for it over a phone call.',

    // Challenge Cards & Metadata
    'm1.title': 'Mission 01: Phishing Traps & Fake Messages',
    'm1.desc': 'Learn how to detect suspicious SMS, fake bank alerts, and trick emails before falling into a scammer trap.',
    'm2.title': 'Mission 02: Password Defense & Account Vault',
    'm2.desc': 'Master how to build unbreakable long passphrases, stop account takeovers, and understand 2FA and password managers.',
    'm3.title': 'Mission 03: Scam Calls & NSRC 997 Hotline',
    'm3.desc': 'Investigate suspicious calls from fake "Police", "Courts", and "Tax Officers". Use CCID SemakMule and learn the 997 hotline.',
    'm4.title': 'Mission 04: APK Traps & Fake Shopping Apps',
    'm4.desc': 'Dissect suspicious APK files requesting SMS and contact access. Spot fake FPX payment gateways and trojans.',
    'm5.title': 'Mission 05: Telegram Investment Scams & Fake Crypto',
    'm5.desc': 'Expose Telegram groups promising 500% returns in 24 hours. Check companies on the SC Malaysia Investor Alert List.',
    'm6.title': 'Mission 06: Social Media Privacy & AI Voice Clones',
    'm6.desc': 'Audit Facebook posts exposing flight boarding passes and empty homes. Thwart AI voice clones using the Family Secret Word.',

    // Common Game UI Frame
    'game.case': 'CASE',
    'game.of': '/',
    'game.backMenu': '← [MAIN MENU]',
    'game.backToMain': '← [BACK TO MAIN MENU]',
    'game.resetFromStart': 'Restart',
    'game.badges': 'Badges',
    'game.score': 'SCORE:',
    'game.pts': 'Pts',
    'game.missionProgress': 'Mission Progress:',
    'game.realStoryBtn': 'Real Case Story',
    'game.step1Badge': 'STEP 1: SPOT RED FLAGS',
    'game.step2Badge': 'STEP 2: TAKE ACTION',
    'game.step1Header': 'Step 1: Mark All Warning Signs / Red Flags',
    'game.step2Header': 'Step 2: What Is the Safest Action?',
    'game.step2Sub': 'Select the best decision to protect yourself and your family:',
    'game.mark': '+ SELECT',
    'game.marked': '✓ SELECTED',
    'game.yourChoice': 'YOUR CHOICE ✓',
    'game.submitStep1': 'Confirm Red Flags & Go to Step 2 →',
    'game.submitStep2': 'Confirm Action Decision',
    'game.nextScenario': 'Next Scenario',
    'game.viewFinalReport': 'View Completed Mission Report',
    'game.retry': 'Retry Mission',
    'game.mainMenu': 'Back to Main Menu',
    'game.nextMission': 'Next Mission',
    'game.realWorldModalTitle': 'Real Scam Stories in Malaysia',
    'game.closeModal': 'Understood & Close',

    // Results Screen Labels
    'results.reportTitle': 'MISSION REPORT COMPLETE',
    'results.scenariosTested': 'Scenarios Investigated',
    'results.cluesFound': 'Red Flags Found',
    'results.safeDecisions': 'Safe Decisions',
    'results.totalScore': 'Total Score',

    // Font Size & Accessibility
    'header.fontSize': 'Text Size',
    'header.fontNormal': 'Normal',
    'header.fontLarge': 'Large',
    'header.fontXLarge': 'Extra Large',
    'nav.backToMenuFriendly': 'Back to Main Menu',
    'footer.callNow': 'Call 997 Now',
    'footer.callFree': 'Toll-Free National Helpline',

    // Footer
    'footer.initiative': 'CyberSafe Community — Community Cybersecurity Initiative',
    'footer.subtext': 'Interactive laptop learning modules designed for community halls, villages & schools.',
    'footer.hotlineTitle': 'National Scam Response Centre (NSRC):',
    'footer.hotlineDesc': 'Dial 997 immediately (within 1 hour) if you were tricked into transferring money to a scammer.',
    'footer.year': 'UPDATED: 2026 / MALAYSIA'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'bm',
  setLanguage: () => {},
  fontSize: 'normal',
  setFontSize: () => {},
  t: (key: string) => key
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('bm');
  const [fontSize, setFontSizeState] = useState<FontSize>('normal');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('cybersafe_lang') as Language | null;
      if (savedLang === 'bm' || savedLang === 'en') {
        setLanguageState(savedLang);
      }
      const savedSize = localStorage.getItem('cybersafe_font_size') as FontSize | null;
      if (savedSize === 'normal' || savedSize === 'large' || savedSize === 'xlarge') {
        setFontSizeState(savedSize);
        document.documentElement.classList.remove('font-size-normal', 'font-size-large', 'font-size-xlarge');
        document.documentElement.classList.add(`font-size-${savedSize}`);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cybersafe_lang', lang);
    }
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cybersafe_font_size', size);
      document.documentElement.classList.remove('font-size-normal', 'font-size-large', 'font-size-xlarge');
      document.documentElement.classList.add(`font-size-${size}`);
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || translations.bm[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, fontSize, setFontSize, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
