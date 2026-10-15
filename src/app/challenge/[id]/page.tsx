import React from 'react';
import { notFound } from 'next/navigation';
import { getChallenge, allChallengesMeta } from '@/data/challenges';
import { InvestigationGame } from '@/components/game/InvestigationGame';
import { AccountWorkshopGame } from '@/components/game/AccountWorkshopGame';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {id === 'phishing' ? (
        <InvestigationGame />
      ) : id === 'passwords' ? (
        <AccountWorkshopGame />
      ) : (
        <ChallengeEngine
          meta={challenge.meta}
          questions={challenge.questions}
        />
      )}
    </div>
  );
}
