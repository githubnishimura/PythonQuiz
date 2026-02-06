
import React, { useState, useCallback } from 'react';
import { Question, UserAnswer } from '../types';

interface QuizProps {
  questions: Question[];
  onFinish: (answers: UserAnswer[]) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleNext = useCallback(() => {
    if (selectedOption === null) return;

    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedIndex: selectedOption,
      isCorrect: selectedOption === currentQuestion.correctIndex,
      question: currentQuestion
    };

    const updatedAnswers = [...answers, newAnswer];
    
    if (currentIndex < questions.length - 1) {
      setAnswers(updatedAnswers);
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      onFinish(updatedAnswers);
    }
  }, [currentIndex, questions, selectedOption, answers, currentQuestion, onFinish]);

  // 改行が含まれている場合はコードとみなし、デザインを調整
  const isCodeQuestion = currentQuestion.text.includes('\n');

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8 no-print">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-slate-500">
            問題 {currentIndex + 1} / {questions.length}
          </span>
          <span className="text-sm font-bold text-indigo-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden mb-6">
        <div className={`p-8 ${isCodeQuestion ? 'bg-slate-50/50' : 'bg-white'}`}>
          <h3 className={`text-xl font-bold text-slate-800 leading-relaxed whitespace-pre-wrap ${isCodeQuestion ? 'font-mono text-base bg-slate-800 text-slate-100 p-6 rounded-xl shadow-inner' : ''}`}>
            {currentQuestion.text}
          </h3>
        </div>

        <div className="p-8 pt-0 space-y-4">
          {currentQuestion.choices.map((choice, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedOption(idx)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                selectedOption === idx
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-md'
                  : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-bold border-2 ${
                selectedOption === idx ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-400 border-slate-200'
              }`}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span className="font-medium text-lg">{choice}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Area */}
      <div className="flex justify-end no-print">
        <button
          onClick={handleNext}
          disabled={selectedOption === null}
          className={`px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center gap-2 border-none cursor-pointer ${
            selectedOption === null
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0'
          }`}
        >
          {currentIndex === questions.length - 1 ? '結果を見る' : '次の問題へ'}
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Quiz;
