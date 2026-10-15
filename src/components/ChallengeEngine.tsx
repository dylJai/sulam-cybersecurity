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
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="rounded-sm border border-[#171914]/20 bg-white p-5 sm:p-7 shadow-xs space-y-6"
        >
          {/* Question Title & Scenario Context */}
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#7C7E77] uppercase tracking-wider mb-1">
              <span>{meta.title}</span>
              <span>/</span>
              <span>Soalan 0{currentIndex + 1}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#171914] tracking-tight">
              {currentQuestion.title}
            </h2>
            {currentQuestion.scenarioContext && (
              <p className="text-xs sm:text-sm text-[#575953] mt-2 leading-relaxed">
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
                <h4 className="text-base font-bold text-[#171914] mb-3 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#7C7E77]" />
                  <span>{currentQuestion.questionText}</span>
                </h4>

                {/* Multiple Choice Options */}
                <div className="space-y-2.5">
                  {currentQuestion.options.map((option) => {
                    const isSelected = selectedOptionId === option.id;
                    let optionStyles = 'border-[#171914]/20 bg-white hover:border-[#171914] text-[#171914]';

                    if (isSelected) {
                      optionStyles = 'border-2 border-[#171914] bg-[#F5F4EE] text-[#171914] shadow-xs';
                    }

                    if (isSubmitted) {
                      if (option.isCorrect) {
                        optionStyles = 'border-2 border-[#1E4D2B] bg-[#E7F3EB] text-[#123E23]';
                      } else if (isSelected && !option.isCorrect) {
                        optionStyles = 'border-2 border-[#8A241C] bg-[#FAF0E6] text-[#78271C]';
                      } else {
                        optionStyles = 'border-[#171914]/10 bg-[#ECEAE2]/40 text-[#82847C]';
                      }
                    }

                    return (
                      <button
                        key={option.id}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(option.id)}
                        className={`w-full p-3.5 rounded-sm border text-left transition-colors flex items-start gap-3 cursor-pointer ${optionStyles}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-xs flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-[#171914] text-[#D9FA62]'
                              : 'bg-[#ECEAE2] text-[#171914]'
                          }`}
                        >
                          {option.id}
                        </span>
                        <span className="text-sm leading-relaxed">{option.text}</span>
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
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-sm border-l-4 ${
                isCorrectAnswer
                  ? 'border-l-[#1E4D2B] bg-[#E7F3EB] border border-[#1E4D2B]/20 text-[#123E23]'
                  : 'border-l-[#8A241C] bg-[#FAF0E6] border border-[#8A241C]/20 text-[#78271C]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-xs flex items-center justify-center shrink-0 mt-0.5 ${
                  isCorrectAnswer ? 'bg-[#1E4D2B] text-white' : 'bg-[#8A241C] text-white'
                }`}>
                  {isCorrectAnswer ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-sm">
                    {isCorrectAnswer ? 'Tepat Sekali! (+10 Mata)' : 'Kurang Tepat, Tetapi Pembelajaran Yang Bagus.'}
                  </div>
                  <div className="text-xs sm:text-sm leading-relaxed text-[#575953]">
                    <span className="font-mono text-[10px] uppercase font-bold text-[#171914] block mb-0.5">
                      Penerangan Keselamatan Siber:
                    </span>
                    <p>{currentQuestion.explanation}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Footer: Submit or Next */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#171914]/10">
            <span className="font-mono text-xs text-[#7C7E77]">
              {!isSubmitted
                ? 'Bincang bersama pasukan sebelum menghantar.'
                : 'Fahami penerangan sebelum ke soalan seterusnya.'}
            </span>

            <div className="w-full sm:w-auto">
              {!isSubmitted ? (
                <button
                  type="button"
                  disabled={!selectedOptionId}
                  onClick={handleSubmitAnswer}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-sm font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                    selectedOptionId
                      ? 'bg-[#171914] hover:bg-[#2A2D25] text-[#D9FA62] border border-[#171914] cursor-pointer'
                      : 'bg-[#ECEAE2] text-[#82847C] cursor-not-allowed border border-[#171914]/10'
                  }`}
                >
                  <span>Hantar Jawapan</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border border-[#171914] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>
                    {currentIndex + 1 < questions.length ? 'Soalan Seterusnya' : 'Lihat Keputusan'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
