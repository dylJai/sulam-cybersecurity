'use client';

import React, { useState } from 'react';
import { ChallengeMeta, ChallengeQuestion, SpotCluesQuestion, PasswordCompareQuestion } from '@/types/challenge';
import { ProgressBar } from '@/components/ProgressBar';
import { MockMessage } from '@/components/MockMessage';
import { SpotTheCluesQuestionView } from '@/components/SpotTheCluesQuestion';
import { PasswordStrengthQuestionView } from '@/components/PasswordStrengthQuestion';
import { ChallengeInstructions } from '@/components/ChallengeInstructions';
import { ResultsScreen } from '@/components/ResultsScreen';
import { saveChallengeResult } from '@/lib/storage';
import { Check, X, ArrowRight, HelpCircle } from 'lucide-react';
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
      const finalScore = score;
      saveChallengeResult(meta.id, finalScore, meta.maxScore);
      setPhase('results');
    }
  };

  const handlePlayAgain = () => {
    handleStart();
  };

  if (phase === 'instructions') {
    return <ChallengeInstructions meta={meta} onStart={handleStart} />;
  }

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

  const isCorrectAnswer = !!currentQuestion.options.find(o => o.id === selectedOptionId)?.isCorrect;

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      {/* Top Progress & Score */}
      <ProgressBar
        currentQuestionIndex={currentIndex}
        totalQuestions={questions.length}
        currentScore={score}
        maxScore={meta.maxScore}
      />

      {/* Main Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6"
        >
          {/* Question Title & Scenario Context */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
              <span>{meta.title}</span>
              <span>•</span>
              <span>Soalan {currentIndex + 1} daripada {questions.length}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {currentQuestion.title}
            </h2>
            {currentQuestion.scenarioContext && (
              <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
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
                <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>{currentQuestion.questionText}</span>
                </h4>

                {/* Multiple Choice Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => {
                    const isSelected = selectedOptionId === option.id;
                    let optionStyles = 'border-slate-200 bg-white hover:border-blue-400 hover:bg-slate-50 text-slate-800';

                    if (isSelected) {
                      optionStyles = 'border-2 border-blue-600 bg-blue-50/50 text-blue-950 shadow-sm';
                    }

                    if (isSubmitted) {
                      if (option.isCorrect) {
                        optionStyles = 'border-2 border-emerald-600 bg-emerald-50 text-emerald-950';
                      } else if (isSelected && !option.isCorrect) {
                        optionStyles = 'border-2 border-rose-500 bg-rose-50 text-rose-950';
                      } else {
                        optionStyles = 'border-slate-100 bg-slate-50 text-slate-400';
                      }
                    }

                    return (
                      <button
                        key={option.id}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(option.id)}
                        className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 cursor-pointer min-h-[56px] ${optionStyles}`}
                      >
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {option.id}
                        </span>
                        <span className="text-sm sm:text-base leading-relaxed font-medium">{option.text}</span>
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
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-2xl border ${
                isCorrectAnswer
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
                  : 'border-rose-200 bg-rose-50 text-rose-950'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  isCorrectAnswer ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}>
                  {isCorrectAnswer ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                </div>
                <div className="space-y-1.5">
                  <div className="font-bold text-base">
                    {isCorrectAnswer ? 'Tepat Sekali! (+10 Mata)' : 'Kurang Tepat, Tetapi Peluang Pembelajaran Berharga.'}
                  </div>
                  <div className="text-sm leading-relaxed text-slate-700">
                    <span className="text-xs uppercase font-bold text-slate-900 block mb-1">
                      💡 Penerangan Keselamatan Siber:
                    </span>
                    <p>{currentQuestion.explanation}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Footer: Submit or Next */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <span className="text-xs sm:text-sm text-slate-500 font-medium">
              {!isSubmitted
                ? 'Bincang bersama pasukan sebelum menghantar jawapan.'
                : 'Fahami penerangan sebelum ke soalan seterusnya.'}
            </span>

            <div className="w-full sm:w-auto">
              {!isSubmitted ? (
                <button
                  type="button"
                  disabled={!selectedOptionId}
                  onClick={handleSubmitAnswer}
                  className={`w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.985] ${
                    selectedOptionId
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>Hantar Jawapan</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.985]"
                >
                  <span>
                    {currentIndex + 1 < questions.length ? 'Soalan Seterusnya' : 'Lihat Keputusan'}
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
