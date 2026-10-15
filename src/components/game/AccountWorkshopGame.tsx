'use client';

import React, { useState } from 'react';
import { initialAccounts, passwordLabOptions, upgradedPassphrases, securityChecklist } from '@/data/account-workshop-data';
import { FictionalAccount, LabPasswordOption } from '@/types/game';
import { saveChallengeResult } from '@/lib/storage';
import { Shield, ShieldAlert, ShieldCheck, KeyRound, AlertTriangle, Check, ArrowRight, RotateCcw, Home, Sparkles, Lock, Unlock, Mail, ShoppingCart, Share2, CheckSquare, Square } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export const AccountWorkshopGame: React.FC = () => {
  // Workshop Stages: 1. Briefing, 2. Inspect Accounts, 3. Password Lab, 4. Domino Breach, 5. Defense Checklist, 6. Results
  const [stage, setStage] = useState<number>(1);

  // Stage 2 state: Accounts inspected
  const [inspectedAccountIds, setInspectedAccountIds] = useState<string[]>([]);
  const [activeAccountId, setActiveAccountId] = useState<string>('acc-email');

  // Stage 3 state: Password lab selected
  const [selectedLabPwId, setSelectedLabPwId] = useState<string | null>(null);
  const [labSubmitted, setLabSubmitted] = useState<boolean>(false);

  // Stage 4 state: Domino breach simulation
  const [dominoStep, setDominoStep] = useState<'initial' | 'breached-all' | 'upgraded' | 'breached-contained'>('initial');

  // Stage 5 state: Security checklist checked items
  const [checkedMeasures, setCheckedMeasures] = useState<string[]>([]);

  // Scoring
  const [stageScores, setStageScores] = useState<Record<number, number>>({
    2: 0, // 10 pts for account audit
    3: 0, // 10 pts for password lab
    4: 0, // 15 pts for domino breach fix
    5: 0  // 15 pts for defense checklist
  });

  const totalScore = Object.values(stageScores).reduce((a, b) => a + b, 0);

  const handleStart = () => {
    setStage(2);
    setInspectedAccountIds(['acc-email']);
    setActiveAccountId('acc-email');
    setSelectedLabPwId(null);
    setLabSubmitted(false);
    setDominoStep('initial');
    setCheckedMeasures([]);
    setStageScores({ 2: 0, 3: 0, 4: 0, 5: 0 });
  };

  /* --- Handler: Stage 2 Inspect Account --- */
  const handleInspectAccount = (accId: string) => {
    setActiveAccountId(accId);
    if (!inspectedAccountIds.includes(accId)) {
      setInspectedAccountIds(prev => [...prev, accId]);
    }
  };

  const handleCompleteAudit = () => {
    setStageScores(prev => ({ ...prev, 2: 10 }));
    setStage(3);
  };

  /* --- Handler: Stage 3 Password Lab --- */
  const handleSelectLabPassword = (id: string) => {
    if (labSubmitted) return;
    setSelectedLabPwId(id);
  };

  const handleSubmitLabPassword = () => {
    if (!selectedLabPwId || labSubmitted) return;
    setLabSubmitted(true);
    const chosen = passwordLabOptions.find(p => p.id === selectedLabPwId);
    if (chosen?.isSafest) {
      setStageScores(prev => ({ ...prev, 3: 10 }));
    } else {
      setStageScores(prev => ({ ...prev, 3: 5 }));
    }
  };

  const handleProceedToDomino = () => {
    setStage(4);
  };

  /* --- Handler: Stage 4 Domino Breach --- */
  const handleTestDominoBreach = () => {
    setDominoStep('breached-all');
  };

  const handleApplyUniquePassphrases = () => {
    setDominoStep('upgraded');
  };

  const handleRetestBreach = () => {
    setDominoStep('breached-contained');
    setStageScores(prev => ({ ...prev, 4: 15 }));
  };

  const handleProceedToChecklist = () => {
    setStage(5);
  };

  /* --- Handler: Stage 5 Checklist --- */
  const handleToggleMeasure = (id: string) => {
    setCheckedMeasures(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleCompleteWorkshop = () => {
    const points = checkedMeasures.length >= 4 ? 15 : 10;
    setStageScores(prev => ({ ...prev, 5: points }));
    const finalScore = Math.min(50, totalScore + points);
    saveChallengeResult('passwords', finalScore, 50);
    setStage(6);
  };

  /* =========================================================================
     STAGE 1: MISSION BRIEFING
     ========================================================================= */
  if (stage === 1) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 py-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-[#7C7E77] hover:text-[#171914] transition-colors"
          >
            ← [KEMBALI KE MENU UTAMA]
          </Link>
        </div>

        <div className="rounded-sm border-2 border-[#171914] bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="pb-4 border-b border-[#171914]/15">
            <div className="flex items-center justify-between font-mono text-xs mb-2">
              <span className="font-bold text-[#171914] bg-[#D9FA62] px-2 py-0.5 rounded-xs border border-[#171914]/20">
                MISI 02
              </span>
              <span className="text-[#7C7E77]">
                MASA: 5-7 MINIT • MAKSIMUM: 50 MATA
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#171914] tracking-tight">
              Bengkel Pertahanan Akaun & Kata Laluan
            </h1>
            <p className="text-sm text-[#575953] mt-2 leading-relaxed">
              &ldquo;Seorang pengguna (Pak Ali) menggunakan kata laluan yang sama dan lemah untuk ketiga-tiga akaun utamanya. Bantu beliau memperkukuh pertahanan sebelum akaun beliau diceroboh.&rdquo;
            </p>
          </div>

          <div className="p-4 bg-[#F5F4EE] border border-[#171914]/12 rounded-sm space-y-1">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#171914] block">
              Misi Amali Anda:
            </span>
            <p className="text-xs sm:text-sm text-[#575953] leading-relaxed">
              Ini bukan sekadar kuiz teori. Pasukan anda akan <strong>mengaudit kelemahan akaun sebenar</strong>, menguji ketahanan kata laluan di <strong>Makmal Kata Laluan</strong>, menghentikan <strong>kesan domino pencerobohan data</strong>, dan mengaktifkan <strong>senarai semak perisai akaun</strong>.
            </p>
          </div>

          <div className="space-y-2.5 font-mono text-xs text-[#575953]">
            <span className="font-bold uppercase tracking-wider text-[#171914] block">
              4 Fasa Bengkel Stesen:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                <strong className="text-[#171914] block mb-1">01. Audit Akaun</strong>
                Kesan kelemahan kata laluan sepunya.
              </div>
              <div className="p-2.5 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                <strong className="text-[#171914] block mb-1">02. Makmal Frasa</strong>
                Bandingkan masa pemecahan penggodam.
              </div>
              <div className="p-2.5 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                <strong className="text-[#171914] block mb-1">03. Simulasi Domino</strong>
                Hentikan kebocoran berjangkit.
              </div>
              <div className="p-2.5 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                <strong className="text-[#171914] block mb-1">04. Perisai 2FA</strong>
                Lengkapkan perlindungan 100%.
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleStart}
              className="w-full py-3.5 px-6 rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Mulakan Bengkel Pertahanan Akaun</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     STAGE 2: INSPECT THE ACCOUNTS (ACCOUNT AUDIT)
     ========================================================================= */
  if (stage === 2) {
    const activeAcc = initialAccounts.find(a => a.id === activeAccountId) || initialAccounts[0];
    const allAudited = inspectedAccountIds.length === initialAccounts.length;

    return (
      <div className="max-w-3xl mx-auto space-y-6 py-4">
        {/* Step Indicator */}
        <div className="bg-white border border-[#171914]/15 rounded-sm p-4 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold bg-[#ECEAE2] px-2 py-0.5 rounded-xs">FASA 01 / 04: AUDIT KESELAMATAN AKAUN</span>
          </div>
          <div className="font-bold">
            MATA: <span className="bg-[#D9FA62] px-2 py-0.5 border border-[#171914]/20">{totalScore} / 50</span>
          </div>
        </div>

        {/* Fictional Account Grid */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#171914] tracking-tight">
              Audit 3 Akaun Digital Pak Ali
            </h2>
            <p className="text-xs sm:text-sm text-[#575953] mt-1 leading-relaxed">
              Klik pada setiap akaun di bawah untuk menyiasat kata laluan dan tahap keselamatan yang digunakan:
            </p>
          </div>

          {/* Visual Shared Password Banner */}
          <div className="p-3 bg-[#FAF0E6] border-2 border-[#8A241C]/30 rounded-sm flex items-center gap-3 text-xs text-[#78271C]">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              <strong>Perhatian:</strong> Ketiga-tiga akaun ini berkongsi kata laluan yang sama: <code className="font-mono bg-white px-1.5 py-0.5 border border-[#8A241C]/30 font-bold">Kampung123!</code>
            </span>
          </div>

          {/* 3 Account Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {initialAccounts.map(acc => {
              const isActive = activeAccountId === acc.id;
              const isChecked = inspectedAccountIds.includes(acc.id);

              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleInspectAccount(acc.id)}
                  className={`p-4 rounded-sm border text-left transition-colors cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'border-2 border-[#171914] bg-[#F5F4EE] shadow-xs'
                      : 'border-[#171914]/15 bg-white hover:border-[#171914]/40'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono text-xs">
                      {acc.serviceType === 'email' && <Mail className="w-4 h-4 text-[#171914]" />}
                      {acc.serviceType === 'social' && <Share2 className="w-4 h-4 text-[#171914]" />}
                      {acc.serviceType === 'shopping' && <ShoppingCart className="w-4 h-4 text-[#171914]" />}

                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-xs border ${
                        isChecked ? 'bg-[#E7F3EB] text-[#123E23] border-[#1E4D2B]/30' : 'bg-[#ECEAE2] text-[#82847C]'
                      }`}>
                        {isChecked ? 'DIAUDIT ✓' : 'KLIK UNTUK AUDIT'}
                      </span>
                    </div>

                    <div>
                      <span className="font-bold text-sm text-[#171914] block">{acc.name}</span>
                      <span className="font-mono text-xs text-[#7C7E77] block">{acc.identifier}</span>
                    </div>

                    <div className="font-mono text-xs bg-white p-1.5 border border-[#171914]/10 rounded-xs">
                      <span className="text-[10px] text-[#7C7E77] block">Kata Laluan Semasa:</span>
                      <span className="font-bold text-[#8A241C]">&ldquo;{acc.currentPassword}&rdquo;</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Account Audit Drawer */}
          <div className="p-5 bg-white border border-[#171914]/20 rounded-sm shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#171914]/10 font-mono text-xs">
              <span className="font-bold text-[#171914]">
                Hasil Pemeriksaan: {activeAcc.name}
              </span>
              <span className="text-[#8A241C] font-bold bg-[#FAF0E6] px-2 py-0.5 rounded-xs">
                RISIKO TINGGI: KATA LALUAN DIULANG
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#575953] leading-relaxed">
              {activeAcc.statusNotes}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-2.5 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs space-y-1">
                <span className="font-mono font-bold text-[#171914] block">Kelemahan Kata Laluan:</span>
                <p className="text-[#575953]">
                  Mengandungi nama kampung (&ldquo;Kampung&rdquo;) dan urutan nombor (&ldquo;123&rdquo;). Sangat mudah diteka menggunakan kamus penggodam.
                </p>
              </div>

              <div className="p-2.5 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs space-y-1">
                <span className="font-mono font-bold text-[#171914] block">Tiada Pengesahan 2FA:</span>
                <p className="text-[#575953]">
                  Akaun ini tidak dilindungi oleh sebarang kod telefon atau pengesahan kedua jika kata laluan bocor.
                </p>
              </div>
            </div>
          </div>

          {/* Action to proceed */}
          <div className="pt-2 flex items-center justify-between">
            <span className="font-mono text-xs text-[#7C7E77]">
              {allAudited
                ? 'Semua 3 akaun telah diaudit! Pasukan anda sedia melangkah ke Makmal Kata Laluan.'
                : `Sila klik dan audit kesemua 3 akaun (${inspectedAccountIds.length} / 3 selesai).`}
            </span>

            <button
              type="button"
              disabled={!allAudited}
              onClick={handleCompleteAudit}
              className={`px-6 py-3 rounded-sm font-mono font-bold text-xs uppercase tracking-wider transition-colors ${
                allAudited
                  ? 'bg-[#D9FA62] text-[#171914] hover:bg-[#CCF050] border-2 border-[#171914] cursor-pointer shadow-xs'
                  : 'bg-[#ECEAE2] text-[#82847C] cursor-not-allowed border border-[#171914]/10'
              }`}
            >
              Selesai Audit & Ke Makmal Kata Laluan (+10 Mata) →
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     STAGE 3: PASSWORD STRENGTH LAB
     ========================================================================= */
  if (stage === 3) {
    const activePw = passwordLabOptions.find(p => p.id === selectedLabPwId);

    return (
      <div className="max-w-3xl mx-auto space-y-6 py-4">
        {/* Step Indicator */}
        <div className="bg-white border border-[#171914]/15 rounded-sm p-4 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold bg-[#ECEAE2] px-2 py-0.5 rounded-xs">FASA 02 / 04: MAKMAL KEKUATAN KATA LALUAN</span>
          </div>
          <div className="font-bold">
            MATA: <span className="bg-[#D9FA62] px-2 py-0.5 border border-[#171914]/20">{totalScore} / 50</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#171914] tracking-tight">
              Banding & Pilih Kata Laluan Terkuat
            </h2>
            <p className="text-xs sm:text-sm text-[#575953] mt-1 leading-relaxed">
              Bantu Pak Ali memilih kata laluan yang paling kebal daripada perisian tekaan komputer. Klik setiap pilihan untuk meneliti anggaran masa komputer memecahkannya:
            </p>
          </div>

          {/* 3 Password Choices */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {passwordLabOptions.map(pw => {
              const isSelected = selectedLabPwId === pw.id;

              return (
                <button
                  key={pw.id}
                  type="button"
                  disabled={labSubmitted}
                  onClick={() => handleSelectLabPassword(pw.id)}
                  className={`p-4 rounded-sm border text-left transition-colors cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-2 border-[#171914] bg-[#F5F4EE] shadow-xs'
                      : 'border-[#171914]/15 bg-white hover:border-[#171914]/40'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-bold text-[#171914]">{pw.label.split(':')[0]}</span>
                      {isSelected && <span className="font-bold text-[#171914]">[PILIHAN]</span>}
                    </div>

                    <div className="p-2 bg-[#ECEAE2] border border-[#171914]/10 rounded-xs font-mono text-xs text-[#171914] break-all select-none">
                      {pw.passwordText}
                    </div>

                    <div className="pt-2 border-t border-[#171914]/10 font-mono text-[11px] text-[#575953]">
                      Anggaran Masa: <strong className="text-[#171914] block">{pw.crackTimeEstimate}</strong>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Inspection Box */}
          {activePw && (
            <div className="p-5 bg-white border border-[#171914]/20 rounded-sm shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#171914]/10 font-mono text-xs">
                <span className="font-bold text-[#171914]">Analisis: {activePw.label}</span>
                <span className={`px-2 py-0.5 rounded-xs font-bold border ${
                  activePw.isSafest ? 'bg-[#E7F3EB] text-[#123E23] border-[#1E4D2B]/30' : 'bg-[#FAF0E6] text-[#78271C] border-[#8A241C]/30'
                }`}>
                  {activePw.isSafest ? 'PILIHAN KUKUH ✓' : 'BERISIKO'}
                </span>
              </div>

              <ul className="space-y-1.5 text-xs text-[#575953]">
                {activePw.characteristics.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-mono text-[#171914] font-bold">—</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-[#171914] font-medium pt-1">
                {activePw.explanation}
              </p>
            </div>
          )}

          {/* Submission and Transition */}
          <div className="pt-2 flex items-center justify-between">
            <span className="font-mono text-xs text-[#7C7E77]">
              {!labSubmitted
                ? 'Pilih kata laluan terbaik dan sahkan pilihan pasukan anda.'
                : 'Fahami mengapa kepanjangan frasa laluan adalah kunci utama.'}
            </span>

            {!labSubmitted ? (
              <button
                type="button"
                disabled={!selectedLabPwId}
                onClick={handleSubmitLabPassword}
                className={`px-6 py-3 rounded-sm font-mono font-bold text-xs uppercase tracking-wider transition-colors ${
                  selectedLabPwId
                    ? 'bg-[#171914] text-[#D9FA62] hover:bg-[#2A2D25] border border-[#171914] cursor-pointer'
                    : 'bg-[#ECEAE2] text-[#82847C] cursor-not-allowed border border-[#171914]/10'
                }`}
              >
                Sahkan Pilihan Kata Laluan
              </button>
            ) : (
              <button
                type="button"
                onClick={handleProceedToDomino}
                className="px-6 py-3 rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Ke Fasa 03: Hentikan Kesan Domino</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     STAGE 4: STOP THE ACCOUNT DOMINO EFFECT (BREACH SIMULATION)
     ========================================================================= */
  if (stage === 4) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 py-4">
        {/* Step Indicator */}
        <div className="bg-white border border-[#171914]/15 rounded-sm p-4 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold bg-[#ECEAE2] px-2 py-0.5 rounded-xs">FASA 03 / 04: HENTIKAN KESAN DOMINO KEBOCORAN</span>
          </div>
          <div className="font-bold">
            MATA: <span className="bg-[#D9FA62] px-2 py-0.5 border border-[#171914]/20">{totalScore} / 50</span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#171914] tracking-tight">
              Simulasi Pencerobohan Data: Serangan &ldquo;Credential Stuffing&rdquo;
            </h2>
            <p className="text-xs sm:text-sm text-[#575953] mt-1 leading-relaxed">
              Lihat apa yang berlaku apabila salah satu portal beli-belah kecil mengalami kebocoran data pangkalan data:
            </p>
          </div>

          {/* Interactive Domino Accounts Visualization */}
          <div className="p-6 bg-white border border-[#171914]/20 rounded-sm shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#171914]/15 font-mono text-xs">
              <span className="font-bold text-[#171914]">Rangkaian 3 Akaun Pak Ali</span>
              <span className={`px-2 py-0.5 rounded-xs font-bold ${
                dominoStep === 'breached-contained'
                  ? 'bg-[#E7F3EB] text-[#123E23]'
                  : dominoStep === 'breached-all'
                  ? 'bg-[#FAF0E6] text-[#78271C]'
                  : 'bg-[#ECEAE2] text-[#171914]'
              }`}>
                STATUS: {
                  dominoStep === 'breached-contained'
                    ? 'KEBOCORAN BERJAYA DISEKAT ✓'
                    : dominoStep === 'breached-all'
                    ? 'SEMUA AKAUN DICEROBOH! ⚠'
                    : dominoStep === 'upgraded'
                    ? 'KATA LALUAN UNIK DITETAPKAN'
                    : 'SEDIA UNTUK UJIAN'
                }
              </span>
            </div>

            {/* 3 Interactive Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative">
              {/* Account 1: Shopping */}
              <div className={`p-4 rounded-sm border-2 transition-all ${
                dominoStep === 'breached-all' || dominoStep === 'breached-contained'
                  ? 'border-[#8A241C] bg-[#FAF0E6]'
                  : 'border-[#171914]/20 bg-[#FAF9F5]'
              }`}>
                <div className="flex items-center justify-between font-mono text-xs mb-2">
                  <span className="font-bold">01. PasarOnline.my</span>
                  <ShoppingCart className="w-4 h-4 text-[#8A241C]" />
                </div>
                <div className="text-xs font-mono text-[#575953] space-y-1">
                  <span>Kata Laluan:</span>
                  <code className="block bg-white p-1 border font-bold text-[#171914]">
                    {dominoStep === 'upgraded' || dominoStep === 'breached-contained'
                      ? upgradedPassphrases['acc-shopping']
                      : 'Kampung123!'}
                  </code>
                </div>
                <div className="mt-3 pt-2 border-t font-mono text-[10px] font-bold text-[#8A241C]">
                  {dominoStep === 'breached-all' || dominoStep === 'breached-contained'
                    ? 'PANGKALAN DATA BOCOR!'
                    : 'Punca Pencerobohan'}
                </div>
              </div>

              {/* Account 2: Social Media */}
              <div className={`p-4 rounded-sm border-2 transition-all ${
                dominoStep === 'breached-all'
                  ? 'border-[#8A241C] bg-[#FAF0E6]'
                  : dominoStep === 'breached-contained'
                  ? 'border-[#1E4D2B] bg-[#E7F3EB]'
                  : 'border-[#171914]/20 bg-[#FAF9F5]'
              }`}>
                <div className="flex items-center justify-between font-mono text-xs mb-2">
                  <span className="font-bold">02. Media Sosial</span>
                  <Share2 className="w-4 h-4 text-[#171914]" />
                </div>
                <div className="text-xs font-mono text-[#575953] space-y-1">
                  <span>Kata Laluan:</span>
                  <code className="block bg-white p-1 border font-bold text-[#171914]">
                    {dominoStep === 'upgraded' || dominoStep === 'breached-contained'
                      ? upgradedPassphrases['acc-social']
                      : 'Kampung123!'}
                  </code>
                </div>
                <div className="mt-3 pt-2 border-t font-mono text-[10px] font-bold">
                  {dominoStep === 'breached-all' && (
                    <span className="text-[#8A241C]">PENGGODAM BERJAYA MASUK!</span>
                  )}
                  {dominoStep === 'breached-contained' && (
                    <span className="text-[#123E23]">SELAMAT! KATA LALUAN BERBEZA</span>
                  )}
                  {dominoStep === 'initial' && <span className="text-[#7C7E77]">Guna Kata Laluan Sama</span>}
                </div>
              </div>

              {/* Account 3: Email */}
              <div className={`p-4 rounded-sm border-2 transition-all ${
                dominoStep === 'breached-all'
                  ? 'border-[#8A241C] bg-[#FAF0E6]'
                  : dominoStep === 'breached-contained'
                  ? 'border-[#1E4D2B] bg-[#E7F3EB]'
                  : 'border-[#171914]/20 bg-[#FAF9F5]'
              }`}>
                <div className="flex items-center justify-between font-mono text-xs mb-2">
                  <span className="font-bold">03. Emel Peribadi</span>
                  <Mail className="w-4 h-4 text-[#171914]" />
                </div>
                <div className="text-xs font-mono text-[#575953] space-y-1">
                  <span>Kata Laluan:</span>
                  <code className="block bg-white p-1 border font-bold text-[#171914]">
                    {dominoStep === 'upgraded' || dominoStep === 'breached-contained'
                      ? upgradedPassphrases['acc-email']
                      : 'Kampung123!'}
                  </code>
                </div>
                <div className="mt-3 pt-2 border-t font-mono text-[10px] font-bold">
                  {dominoStep === 'breached-all' && (
                    <span className="text-[#8A241C]">EMEL & BANK DITAWAN!</span>
                  )}
                  {dominoStep === 'breached-contained' && (
                    <span className="text-[#123E23]">SELAMAT! KATA LALUAN BERBEZA</span>
                  )}
                  {dominoStep === 'initial' && <span className="text-[#7C7E77]">Guna Kata Laluan Sama</span>}
                </div>
              </div>
            </div>

            {/* Educational Explanation Box */}
            <div className="p-4 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs text-xs leading-relaxed text-[#575953]">
              {dominoStep === 'initial' && (
                <p>
                  Kedua-dua akaun emel dan media sosial kini dalam bahaya besar kerana berkongsi kata laluan <code>Kampung123!</code> dengan laman membeli-belah. Tekan butang di bawah untuk menguji simulasi pencerobohan.
                </p>
              )}
              {dominoStep === 'breached-all' && (
                <p className="text-[#78271C]">
                  <strong>Kesan Domino Berlaku!</strong> Penggodam mencuri <code>Kampung123!</code> dari PasarOnline dan mencubanya pada media sosial dan emel peribadi Pak Ali. Kerana kata laluan sama diulang, semua akaun berjaya dibuka!
                </p>
              )}
              {(dominoStep === 'upgraded' || dominoStep === 'breached-contained') && (
                <p className="text-[#123E23]">
                  <strong>Pertahanan Berjaya!</strong> Dengan menetapkan kata laluan berbeza bagi setiap akaun, kebocoran pada PasarOnline langsung tidak memberi kesan kepada media sosial atau emel utama anda.
                </p>
              )}
            </div>

            {/* Interactive Control Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {dominoStep === 'initial' && (
                <button
                  type="button"
                  onClick={handleTestDominoBreach}
                  className="px-6 py-3 rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#F5F4EE] bg-[#8A241C] hover:bg-[#6E1C15] transition-colors cursor-pointer"
                >
                  Uji Kebocoran PasarOnline (Lihat Kesan Domino)
                </button>
              )}

              {dominoStep === 'breached-all' && (
                <button
                  type="button"
                  onClick={handleApplyUniquePassphrases}
                  className="px-6 py-3 rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors cursor-pointer shadow-xs"
                >
                  Selesaikan Masalah: Berikan Kata Laluan Unik Setiap Akaun →
                </button>
              )}

              {dominoStep === 'upgraded' && (
                <button
                  type="button"
                  onClick={handleRetestBreach}
                  className="px-6 py-3 rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors cursor-pointer shadow-xs"
                >
                  Uji Semula Kebocoran (Sahkan Sekatan Pencerobohan)
                </button>
              )}

              {dominoStep === 'breached-contained' && (
                <button
                  type="button"
                  onClick={handleProceedToChecklist}
                  className="px-6 py-3 rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Teruskan ke Fasa 04: Perisai Pertahanan Akaun (+15 Mata)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     STAGE 5: SECURE THE ACCOUNTS (DEFENSE CHECKLIST & SHIELD METER)
     ========================================================================= */
  if (stage === 5) {
    const defenseScore = Math.min(100, 20 + checkedMeasures.length * 16);

    return (
      <div className="max-w-3xl mx-auto space-y-6 py-4">
        {/* Step Indicator */}
        <div className="bg-white border border-[#171914]/15 rounded-sm p-4 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold bg-[#ECEAE2] px-2 py-0.5 rounded-xs">FASA 04 / 04: SENARAI SEMAK PERISAI PERTAHANAN</span>
          </div>
          <div className="font-bold">
            MATA: <span className="bg-[#D9FA62] px-2 py-0.5 border border-[#171914]/20">{totalScore} / 50</span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#171914] tracking-tight">
              Aktifkan Lapisan Perlindungan Akaun Pak Ali
            </h2>
            <p className="text-xs sm:text-sm text-[#575953] mt-1 leading-relaxed">
              Tandakan langkah keselamatan amali yang disyorkan oleh pakar keselamatan siber untuk menaikkan tahap perlindungan akaun:
            </p>
          </div>

          {/* Real-time Account Defense Level Meter */}
          <div className="p-5 bg-white border border-[#171914]/20 rounded-sm shadow-xs space-y-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="font-bold uppercase tracking-wider text-[#171914]">
                Tahap Perlindungan Akaun Keseluruhan:
              </span>
              <span className="font-bold text-sm bg-[#D9FA62] px-2.5 py-0.5 border border-[#171914]/20 text-[#171914]">
                {defenseScore}% {defenseScore >= 90 ? '(KEBAL & KUKUH)' : '(SEDANG DIKUKUHKAN)'}
              </span>
            </div>

            <div className="h-3 w-full bg-[#ECEAE2] rounded-xs overflow-hidden border border-[#171914]/10">
              <motion.div
                className="h-full bg-[#171914]"
                animate={{ width: `${defenseScore}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Interactive Checklist Items */}
          <div className="space-y-3">
            {securityChecklist.map(item => {
              const isChecked = checkedMeasures.includes(item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleToggleMeasure(item.id)}
                  className={`w-full p-4 rounded-sm border text-left transition-colors cursor-pointer flex items-start gap-3.5 ${
                    isChecked
                      ? 'bg-[#E7F3EB] border-2 border-[#1E4D2B] text-[#123E23]'
                      : 'bg-white border-[#171914]/15 hover:border-[#171914]/40 text-[#171914]'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-[#1E4D2B]" />
                    ) : (
                      <Square className="w-5 h-5 text-[#82847C]" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{item.title}</span>
                      <span className="font-mono text-xs text-[#575953] bg-white/60 px-2 py-0.2 rounded-xs border border-current/15">
                        +{item.impactScore}% Keselamatan
                      </span>
                    </div>
                    <p className="text-xs text-[#575953] leading-relaxed">
                      {item.shortDescription}
                    </p>
                    {isChecked && (
                      <p className="text-xs text-[#123E23] font-medium pt-1">
                        ✓ {item.howItProtects}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Finish Button */}
          <div className="pt-2 flex items-center justify-between">
            <span className="font-mono text-xs text-[#7C7E77]">
              {checkedMeasures.length >= 4
                ? 'Tahniah! Akaun Pak Ali kini dilindungi dengan pertahanan menyeluruh.'
                : 'Sila tandakan langkah perlindungan di atas bersama pasukan anda.'}
            </span>

            <button
              type="button"
              disabled={checkedMeasures.length < 3}
              onClick={handleCompleteWorkshop}
              className={`px-6 py-3 rounded-sm font-mono font-bold text-xs uppercase tracking-wider transition-colors ${
                checkedMeasures.length >= 3
                  ? 'bg-[#D9FA62] text-[#171914] hover:bg-[#CCF050] border-2 border-[#171914] cursor-pointer shadow-xs'
                  : 'bg-[#ECEAE2] text-[#82847C] cursor-not-allowed border border-[#171914]/10'
              }`}
            >
              Lengkapkan Bengkel & Lihat Keputusan (+15 Mata) →
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     STAGE 6: MISSION RESULTS
     ========================================================================= */
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      <div className="rounded-sm border-2 border-[#171914] bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#171914]/15 font-mono text-xs">
          <span className="font-bold uppercase tracking-wider text-[#171914] bg-[#D9FA62] px-2.5 py-0.5 rounded-xs border border-[#171914]/20">
            LAPORAN SELESAI
          </span>
          <span className="text-[#7C7E77]">
            MISI 02 / BENGKEL PERTAHANAN KATA LALUAN
          </span>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171914] tracking-tight">
            Akaun Berjaya Diperkukuh!
          </h2>
          <p className="text-xs sm:text-sm text-[#575953] mt-2 leading-relaxed">
            Pasukan anda berjaya mengaudit kelemahan akaun Pak Ali, memilih frasa laluan kukuh, menyekat kesan domino kebocoran data, dan mengaktifkan perisai pertahanan 2FA.
          </p>
        </div>

        {/* Mission Stats Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-y border-[#171914]/10 py-5">
          <div>
            <span className="font-mono text-[10px] uppercase text-[#7C7E77] block">Akaun Diaudit</span>
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#171914] mt-1 block">3 / 3</span>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase text-[#7C7E77] block">Makmal Frasa</span>
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#171914] mt-1 block">Lengkap ✓</span>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase text-[#7C7E77] block">Kesan Domino</span>
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#171914] mt-1 block">Disekat ✓</span>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase text-[#7C7E77] block">Jumlah Mata</span>
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#171914] mt-1 block">
              {totalScore} <span className="text-xs font-normal text-[#82847C]">/ 50</span>
            </span>
          </div>
        </div>

        {/* Key Takeaways */}
        <div className="space-y-3 pt-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#171914] block">
            Rumusan Amalan Pertahanan Kata Laluan:
          </span>
          <ul className="space-y-2 text-xs sm:text-sm text-[#575953]">
            <li className="flex items-start gap-2.5">
              <span className="w-4 h-4 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </span>
              <span>Gunakan kata laluan berbeza bagi setiap akaun—kebocoran satu laman tidak akan menjejaskan akaun lain.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-4 h-4 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </span>
              <span>Kepanjangan frasa laluan (4–5 perkataan seperti &ldquo;kucing-suka-makan-ikan-kembung&rdquo;) mengatasi kerumitan simbol.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-4 h-4 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </span>
              <span>Aktifkan Pengesahan Dua Faktor (2FA) pada semua akaun penting seperti emel dan perbankan.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-4 h-4 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </span>
              <span>Gunakan aplikasi Pengurus Kata Laluan untuk menjana dan mengingati puluhan kata laluan unik secara automatik.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
        <button
          onClick={handleStart}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-white hover:bg-[#ECEAE2] border border-[#171914]/20 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Ulang Bengkel Ini</span>
        </button>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-white hover:bg-[#ECEAE2] border border-[#171914]/20 transition-colors cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Menu Utama</span>
        </Link>

        <Link
          href="/challenge/phishing"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors shadow-xs"
        >
          <span>Misi 01: Siasatan Phishing</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
