import React from 'react';
import { notFound } from 'next/navigation';
import { getChallenge, allChallengesMeta } from '@/data/challenges';
import { InvestigationGame } from '@/components/game/InvestigationGame';
import { AccountWorkshopGame } from '@/components/game/AccountWorkshopGame';
import { CallScamGame } from '@/components/game/CallScamGame';
import { ApkMalwareGame } from '@/components/game/ApkMalwareGame';
import { InvestmentScamGame } from '@/components/game/InvestmentScamGame';
import { SocialPrivacyGame } from '@/components/game/SocialPrivacyGame';
import { ChallengeEngine } from '@/components/ChallengeEngine';
import { Metadata } from 'next';

interface ChallengePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ChallengePageProps): Promise<Metadata> {
  const { id } = await params;
  const challenge = getChallenge(id);
  if (!challenge) return { title: 'Misi Tidak Dijumpai' };

  return {
    title: `${challenge.meta.title} | CyberSafe Community`,
    description: challenge.meta.shortDescription
  };
}

export async function generateStaticParams() {
  return allChallengesMeta.map((c) => ({
    id: c.id
  }));
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const { id } = await params;
  const challenge = getChallenge(id);

  if (!challenge) {
    notFound();
  }

  return (
    <div className="max-w-[1500px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      {id === 'phishing' ? (
        <InvestigationGame />
      ) : id === 'passwords' ? (
        <AccountWorkshopGame />
      ) : id === 'call-scam' ? (
        <CallScamGame />
      ) : id === 'apk-malware' ? (
        <ApkMalwareGame />
      ) : id === 'investment-scam' ? (
        <InvestmentScamGame />
      ) : id === 'social-privacy' ? (
        <SocialPrivacyGame />
      ) : (
        <ChallengeEngine
          meta={challenge.meta}
          questions={challenge.questions}
        />
      )}
    </div>
  );
}
