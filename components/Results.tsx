
import React, { useState, useRef } from 'react';
import { UserAnswer } from '../types';

interface ResultsProps {
  questions: any[];
  userAnswers: UserAnswer[];
  totalTime: number;
  onRetry: () => void;
}

const Results: React.FC<ResultsProps> = ({ userAnswers, totalTime, onRetry }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const correctCount = userAnswers.filter(a => a.isCorrect).length;
  const scorePercent = Math.round((correctCount / userAnswers.length) * 100);
  
  const [filter, setFilter] = useState<'all' | 'incorrect'>('incorrect');

  const filteredAnswers = filter === 'all' 
    ? userAnswers 
    : userAnswers.filter(a => !a.isCorrect);

  const handleDownloadPDF = async () => {
    if (!resultsRef.current) return;
    
    const html2pdf = (window as any).html2pdf;
    if (!html2pdf) {
      handleNativePrint();
      return;
    }

    setIsGenerating(true);
    
    const element = resultsRef.current;
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `QuizResult_${new Date().toISOString().slice(0, 10)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        logging: false 
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('PDF生成エラー:', error);
      alert('PDFの直接保存に失敗しました。印刷ダイアログから「PDFに保存」をお試しください。');
      handleNativePrint();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNativePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div ref={resultsRef} className="pdf-content p-4 sm:p-0">
        <div className="hidden print:block mb-8 border-b-2 border-slate-200 pb-4">
          <h1 className="text-2xl font-bold text-slate-800">クイズ学習結果レポート</h1>
          <p className="text-slate-500 text-sm">生成日: {new Date().toLocaleDateString('ja-JP')}</p>
        </div>

        {/* 統計セクション */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-slate-100 print:shadow-none print:border-slate-200">
          <div className="bg-indigo-600 p-8 text-center text-white print:bg-slate-800">
            <h2 className="text-3xl font-bold mb-1">学習完了スコア</h2>
            <p className="text-indigo-100 opacity-90">すべての問題への回答が完了しました。</p>
          </div>
          
          <div className="grid grid-cols-3 divide-x divide-slate-100 bg-white">
            <div className="p-4 sm:p-6 text-center">
              <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">正解数</p>
              <p className="text-xl sm:text-3xl font-bold text-green-600">{correctCount} / {userAnswers.length}</p>
            </div>
            <div className="p-4 sm:p-6 text-center">
              <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">正解率</p>
              <p className="text-xl sm:text-3xl font-bold text-indigo-600">{scorePercent}%</p>
            </div>
            <div className="p-4 sm:p-6 text-center">
              <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">時間</p>
              <p className="text-xl sm:text-3xl font-bold text-slate-700">{Math.floor(totalTime / 60)}分 {totalTime % 60}秒</p>
            </div>
          </div>
        </div>

        {/* 詳細リスト */}
        <div className="space-y-6 results-list">
          {filteredAnswers.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
              <p className="text-slate-500">表示するデータがありません。</p>
            </div>
          ) : (
            filteredAnswers.map((ans, idx) => {
              const isCodeQuestion = ans.question.text.includes('\n');
              return (
                <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden break-inside-avoid page-break-inside-avoid">
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-grow">
                        <span className="text-indigo-600 mr-2 font-black">Q{idx + 1}.</span>
                        <div className={`mt-2 p-4 whitespace-pre-wrap leading-relaxed ${isCodeQuestion ? 'font-mono text-sm bg-slate-800 text-slate-100 rounded-lg' : 'font-bold text-slate-800 text-base sm:text-lg'}`}>
                          {ans.question.text}
                        </div>
                      </div>
                      <div className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-black border ${
                        ans.isCorrect ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {ans.isCorrect ? 'OK' : 'MISS'}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className={`p-3 rounded-lg border ${ans.isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                        <p className="text-[9px] font-bold text-slate-400 mb-1 uppercase">あなたの回答</p>
                        <p className="text-sm font-bold">{ans.question.choices[ans.selectedIndex]}</p>
                      </div>
                      {!ans.isCorrect && (
                        <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                          <p className="text-[9px] font-bold text-green-600 mb-1 uppercase">正しい答え</p>
                          <p className="text-sm font-bold text-green-800">{ans.question.choices[ans.question.correctIndex]}</p>
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[9px] font-bold text-slate-400 mb-1 uppercase">解説メモ</p>
                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{ans.question.memo || 'メモはありません。'}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-6 no-print">
        <div className="flex flex-wrap justify-center gap-3">
          <button 
            onClick={() => setFilter('incorrect')}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all border-none cursor-pointer ${filter === 'incorrect' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            誤答のみ表示
          </button>
          <button 
            onClick={() => setFilter('all')}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all border-none cursor-pointer ${filter === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            すべて表示
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-4 w-full px-4">
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-900 transition-all border-none cursor-pointer ${isGenerating ? 'opacity-70 cursor-wait' : 'active:scale-95'}`}
          >
            {isGenerating ? (
              <>
                <i className="fas fa-spinner animate-spin"></i>
                PDF生成中...
              </>
            ) : (
              <>
                <i className="fas fa-download"></i>
                PDFを保存
              </>
            )}
          </button>
          
          <button
            onClick={handleNativePrint}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-800 border border-slate-200 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
          >
            <i className="fas fa-print"></i>
            印刷
          </button>
        </div>

        <button
          onClick={onRetry}
          className="mt-4 text-indigo-600 font-bold hover:underline border-none bg-transparent cursor-pointer"
        >
          ホーム画面に戻る
        </button>
      </div>
    </div>
  );
};

export default Results;
