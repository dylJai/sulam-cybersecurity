# CyberSafe Community — Interactive Cybersecurity Awareness Workshop

A modern, interactive, and beginner-friendly cybersecurity awareness web application built for community workshops (such as in Malaysian kampung and community centers). The platform is optimized for laptop stations where multi-generational teams (kids, adults, elders) collaborate to identify online scams and strengthen their password habits.

---

## 🌟 Key Features

1. **Station Team Mode**:
   - Zero login or personal data collection required.
   - Live persistent station score tracker (up to 100 points).
   - "Set Semula Stesen" (Reset Station) button in the header so facilitators can quickly reset progress for the next team.

2. **Challenge 1: Phishing Detection (5 Scenarios)**:
   - **Realistic Mock Interfaces**: Authentic SMS smartphone preview and email inbox UI.
   - **Local Malaysian Scenarios**: RM2.50 parcel delivery redelivery scam, fake banking TAC security alert, festive eWallet cash prize with malicious `.apk` attachment, emergency WhatsApp relative impersonation.
   - **Interactive Feature: Spot the Warning Signs**: Interactive inspection of sender domains, artificial 2-hour deadlines, unverified links, and credential-harvesting forms.

3. **Challenge 2: Password Protector (5 Scenarios)**:
   - **Interactive Feature: Choose the Safer Password**: Side-by-side entropy comparison of short predictable words (`password123`), personal info with symbols (`Kamal1985!`), and long memorable passphrases (`kucing-suka-makan-ikan-kembung`).
   - Educational lessons on credential stuffing, Two-Factor Authentication (2FA), password managers (Bitwarden, Google, Apple), and avoiding OTP theft.

4. **Scoring & Rewarding Results**:
   - 10 points per question (50 points per challenge, 100 points maximum).
   - Immediate educational feedback explaining *why* an action is safe or risky without punishing learners.
   - Non-judgmental results screen with key takeaway summaries and encouraging badges.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) (Dark Navy & Electric Cyan theme)
- **Icons**: [Lucide React](https://lucide.dev)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

---

## 🚀 Getting Started

### 1. Navigate to the project directory:
```bash
cd ~/Documents/"Sulam CyberSecurity"
```

### 2. Start the development server:
```bash
npm run dev
```

### 3. Open in your browser:
Navigate to [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Architecture

```
src/
├── app/
│   ├── layout.tsx             # Root layout with Header, Footer, and theme
│   ├── page.tsx               # Workshop Home: Hero, Challenge Cards, How It Works
│   ├── globals.css            # Custom dark theme, glows, and accessibility styles
│   └── challenge/[id]/
│       └── page.tsx           # Dynamic challenge route (/challenge/phishing, /challenge/passwords)
├── components/
│   ├── Header.tsx             # Team score counter and station reset modal
│   ├── Footer.tsx             # National Scam Response Centre (NSRC 997) hotline
│   ├── ChallengeCard.tsx      # Home screen interactive challenge cards
│   ├── ChallengeInstructions.tsx # Pre-challenge briefing and objectives
│   ├── ChallengeEngine.tsx    # Unified quiz runner with state and transitions
│   ├── ProgressBar.tsx        # Step indicator and challenge score meter
│   ├── MockMessage.tsx        # Authentic SMS bubble and Email client mockup
│   ├── SpotTheCluesQuestion.tsx # Interactive hotspot inspector for phishing clues
│   ├── PasswordStrengthQuestion.tsx # Interactive password comparison & crack time
│   └── ResultsScreen.tsx      # Final score, badge, and summary takeaways
├── data/
│   ├── challenges.ts          # Central registry for dynamic challenge loading
│   ├── phishing-challenge.ts  # 5 Phishing scenarios & explanations
│   └── password-challenge.ts  # 5 Password scenarios & explanations
├── types/
│   └── challenge.ts           # TypeScript interfaces and types
└── lib/
    └── storage.ts             # LocalStorage station tracker and reset helpers
```

---

## ➕ Adding New Challenges in the Future

To add future workshop stations (e.g., *Online Shopping Scam*, *OTP Protection*, *Public Wi-Fi Safety*):

1. Create a data file in `src/data/your-challenge.ts` implementing `ChallengeMeta` and `ChallengeQuestion[]`.
2. Register the challenge in `src/data/challenges.ts`.
3. The dynamic route `/challenge/[id]` and Home Page will automatically render and track it without changing the core quiz engine!

---

## 🛡️ Community Hotline Reference
- **NSRC Malaysia (National Scam Response Centre)**: Dial **997** immediately if you or family members have transferred funds to a suspected scammer.
