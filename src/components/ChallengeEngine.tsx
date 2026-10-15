'use client';

import React, { useState } from 'react';
import { ChallengeMeta, ChallengeQuestion, MultipleChoiceQuestion, SpotCluesQuestion, PasswordCompareQuestion } from '@/types/challenge';
import { ProgressBar } from '@/components/ProgressBar';
import { MockMessage } from '@/components/MockMessage';
import { SpotTheCluesQuestionView } from '@/components/SpotTheCluesQuestion';
import { PasswordStrengthQuestionView } from '@/components/PasswordStrengthQuestion';
import { ChallengeInstructions } from '@/components/ChallengeInstructions';
import { ResultsScreen } from '@/components/ResultsScreen';
import { saveChallengeResult } from '@/lib/storage';
import { CheckCircle2, XCircle, ArrowRight, Lightbulb, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChallengeEngineProps {
  meta: ChallengeMeta;
  questions: ChallengeQuestion[];
}

export const ChallengeEngine: React.FC<ChallengeEngineProps> = ({ meta, questions }) => {
  const [phase, setPhase] = useState<'instructions' | 'playing' | 'results'>('instructions');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);

  const currentQuestion = questions[currentIndex];

  const handleStart = () => {
    setPhase('playing');
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setScore(0);
    setCorrectCount(0);
  };

  const handleSelectOption = (id: string) => {
    if (isSubmitted) return;
    setSelectedOptionId(id);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || isSubmitted) return;

    setIsSubmitted(true);

    const selected = currentQuestion.options.find(o => o.id === selectedOptionId);
    const isCorrect = !!selected?.isCorrect;

    if (isCorrect) {
      setScore(prev => prev + currentQuestion.points);
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setIsSubmitted(false);
    } else {
      // Finished all questions!
      const finalScore = score;
      saveChallengeResult(meta.id, finalScore, meta.maxScore);
      setPhase('results');
    }
  };

  const handlePlayAgain = () => {
    handleStart();
  };

  // Render Instructions Phase
  if (phase === 'instructions') {
    return <ChallengeInstructions meta={meta} onStart={handleStart} />;
  }

  // Render Results Phase
  if (phase === 'results') {
    return (
      <ResultsScreen
        meta={meta}
        score={score}
        maxScore={meta.maxScore}
        correctCount={correctCount}
        totalQuestions={questions.length}
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  // Render Playing Question Phase
  const isCorrectAnswer = !!currentQuestion.options.find(o => o.id === selectedOptionId)?.isCorrect;

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* Top Progress & Score */}
      <ProgressBar
        currentQuestionIndex={currentIndex}
        totalQuestions={questions.length}
        currentScore={score}
        maxScore={meta.maxScore}
      />

      {/* Main Question Card with Smooth Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="rounded-3xl border-2 border-slate-700 bg-slate-900/90 p-5 sm:p-8 shadow-2xl space-y-6"
        >
          {/* Question Title & Scenario Context */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
              <span>{meta.title}</span>
              <span>•</span>
              <span>Soalan {currentIndex + 1}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {currentQuestion.title}
            </h2>
            {currentQuestion.scenarioContext && (
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                {currentQuestion.scenarioContext}
              </p>
            )}
          </div>

          {/* Conditional Question Rendering by Type */}
          {currentQuestion.type === 'multiple-choice' && (
            <div className="space-y-6">
              {/* Message Simulation if applicable */}
              {(currentQuestion.messageBody || currentQuestion.sender) && (
                <MockMessage
                  format={currentQuestion.messageFormat}
                  sender={currentQuestion.sender}
                  subject={currentQuestion.subject}
                  messageBody={currentQuestion.messageBody}
                  attachmentName={currentQuestion.attachmentName}
                  urgencyBadge={currentQuestion.urgencyBadge}
                />
              )}

              {/* Question Text */}
              <div className="pt-2">
                <h4 className="text-base font-bold text-slate-100 mb-3 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-cyan-400" />
                  <span>{currentQuestion.questionText}</span>
                </h4>

                {/* Multiple Choice Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => {
                    const isSelected = selectedOptionId === option.id;
                    let optionStyles = 'border-slate-800 bg-slate-900/80 hover:border-cyan-500 hover:bg-slate-900';

                    if (isSelected) {
                      optionStyles = 'border-cyan-500 bg-cyan-950/40 text-cyan-100 shadow-md shadow-cyan-950/50';
                    }

                    if (isSubmitted) {
                      if (option.isCorrect) {
                        optionStyles = 'border-emerald-500 bg-emerald-950/50 text-emerald-100';
                      } else if (isSelected && !option.isCorrect) {
                        optionStyles = 'border-rose-500 bg-rose-950/50 text-rose-100';
                      } else {
                        optionStyles = 'border-slate-800 bg-slate-900/40 opacity-50';
                      }
                    }

                    return (
                      <button
                        key={option.id}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(option.id)}
                        className={`w-full p-4 rounded-xl border text-left transition-all duration-150 flex items-start gap-3.5 cursor-pointer ${optionStyles}`}
                      >
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-cyan-500 text-slate-950'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {option.id}
                        </span>
                        <span className="text-sm font-medium leading-relaxed">{option.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {currentQuestion.type === 'spot-clues' && (
            <SpotTheCluesQuestionView
              question={currentQuestion as SpotCluesQuestion}
              selectedOptionId={selectedOptionId}
              onSelectOption={handleSelectOption}
              isSubmitted={isSubmitted}
            />
          )}

          {currentQuestion.type === 'password-compare' && (
            <PasswordStrengthQuestionView
              question={currentQuestion as PasswordCompareQuestion}
              selectedOptionId={selectedOptionId}
              onSelectOption={handleSelectOption}
              isSubmitted={isSubmitted}
            />
          )}

          {/* Feedback Area after Submission */}
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-2xl border-2 ${
                isCorrectAnswer
                  ? 'border-emerald-500/80 bg-emerald-950/40 text-emerald-100'
                  : 'border-amber-500/80 bg-amber-950/40 text-amber-100'
              }`}
            >
              <div className="flex items-start gap-3">
                {isCorrectAnswer ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base">
                      {isCorrectAnswer ? 'Tepat Sekali! (+10 Mata)' : 'Kurang Tepat, Tetapi Pembelajaran Yang Bagus!'}
                    </span>
                  </div>
                  <div className="text-sm leading-relaxed text-slate-200">
                    <div className="flex items-center gap-1.5 font-semibold text-xs uppercase tracking-wider text-cyan-300 mb-1">
                      <Lightbulb className="w-4 h-4 text-cyan-300" />
                      <span>Penerangan Keselamatan Siber:</span>
                    </div>
                    <p>{currentQuestion.explanation}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Footer: Submit or Next */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
            <span className="text-xs text-slate-400">
              {!isSubmitted
                ? 'Pilih satu jawapan bersama pasukan anda sebelum menekan butang hantar.'
                : 'Fahami penerangan sebelum meneruskan ke soalan seterusnya.'}
            </span>

            <div className="w-full sm:w-auto">
              {!isSubmitted ? (
                <button
                  type="button"
                  disabled={!selectedOptionId}
                  onClick={handleSubmitAnswer}
                  className={`w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm transition-all duration-150 flex items-center justify-center gap-2 ${
                    selectedOptionId
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/30 cursor-pointer hover:scale-[1.02]'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <span>Hantar Jawapan</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all duration-150 shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
                >
                  <span>
                    {currentIndex + 1 < questions.length ? 'Soalan Seterusnya' : 'Lihat Keputusan Akhir'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
