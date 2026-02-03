
import React, { useState, useRef } from 'react';
import { Question } from '../types';

interface UploaderProps {
  onCsvLoaded: (questions: Question[]) => void;
  onBack: () => void;
}

const Uploader: React.FC<UploaderProps> = ({ onCsvLoaded, onBack }) => {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (csvText: string): Question[] => {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
    return lines.map((line, index) => {
      const parts = line.split(',').map(part => part.trim().replace(/^"|"$/g, ''));
      if (parts.length < 7) {
        throw new Error(`行 ${index + 1} の形式が正しくありません。カラムが不足しています。`);
      }
      return {
        id: `q-csv-${index}`,
        text: parts[0],
        choices: [parts[1], parts[2], parts[3], parts[4]],
        correctIndex: parseInt(parts[5], 10),
        memo: parts[6]
      };
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const questions = parseCSV(text);
        if (questions.length === 0) {
          setError('CSVファイルが空です。');
          return;
        }
        onCsvLoaded(questions);
      } catch (err: any) {
        setError(err.message || 'ファイルの読み込みに失敗しました。');
      }
    };
    reader.readAsText(file);
  };

  const generateSampleData = () => {
    const sample = Array.from({ length: 40 }).map((_, i) => 
      `カスタム問題 ${i + 1} の内容,選択肢A,選択肢B,選択肢C,選択肢D,0,この問題の正解はAです。`
    ).join('\n');
    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'quiz_sample.csv');
    link.click();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-colors"
      >
        <i className="fas fa-arrow-left text-xs"></i>
        ホームに戻る
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
        <div className="mb-6">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-file-csv text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">CSVをアップロード</h2>
          <p className="text-slate-500 mt-2">
            独自のクイズファイルを読み込んで、自分専用の学習を開始しましょう。
          </p>
        </div>

        <div 
          className="border-2 border-dashed border-slate-200 rounded-xl p-10 bg-slate-50 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all group"
          onClick={() => fileInputRef.current?.click()}
        >
          <i className="fas fa-cloud-upload-alt text-4xl text-slate-300 group-hover:text-indigo-400 mb-4 transition-colors"></i>
          <p className="text-slate-600 font-medium">ファイルを選択、またはドラッグ＆ドロップ</p>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv"
            className="hidden" 
          />
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-slate-100 text-left">
          <h3 className="font-semibold text-slate-700 mb-3 text-sm">推奨形式:</h3>
          <p className="text-xs text-slate-400 mb-4 bg-slate-50 p-3 rounded font-mono break-all">
            問題文, 選択肢1, 選択肢2, 選択肢3, 選択肢4, 正解Index(0-3), 解説メモ
          </p>
          <button 
            onClick={generateSampleData}
            className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1"
          >
            <i className="fas fa-download text-xs"></i>
            サンプルをダウンロード
          </button>
        </div>
      </div>
    </div>
  );
};

export default Uploader;
