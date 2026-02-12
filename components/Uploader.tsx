import React, { useState, useRef } from 'react';
import { Question } from '../types';

interface UploaderProps {
  onCsvLoaded: (questions: Question[]) => void;
  onBack: () => void;
}

const Uploader: React.FC<UploaderProps> = ({ onCsvLoaded, onBack }) => {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 改良された堅牢なCSVパーサー: クォート内の改行を維持し、エスケープされた二重クォートを処理
  const parseCSV = (csvText: string): Question[] => {
    const result: string[][] = [];
    let row: string[] = [];
    let field = '';
    let inQuotes = false;

    // BOMの除去
    const cleanText = csvText.startsWith('\uFEFF') ? csvText.slice(1) : csvText;

    for (let i = 0; i < cleanText.length; i++) {
      const char = cleanText[i];
      const nextChar = cleanText[i + 1];

      if (inQuotes) {
        if (char === '"' && nextChar === '"') {
          field += '"';
          i++; // 二重クォートのエスケープをスキップ
        } else if (char === '"') {
          inQuotes = false;
        } else {
          field += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          row.push(field.trim());
          field = '';
        } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
          if (char === '\r') i++;
          row.push(field.trim());
          if (row.length > 0 && row.some(f => f !== '')) {
            result.push(row);
          }
          row = [];
          field = '';
        } else if (char === '\r') {
          // 単独の \r も行末として扱う（古い環境用）
          row.push(field.trim());
          if (row.length > 0 && row.some(f => f !== '')) {
            result.push(row);
          }
          row = [];
          field = '';
        } else {
          field += char;
        }
      }
    }
    // 最後の行の処理
    if (field || row.length > 0) {
      row.push(field.trim());
      if (row.some(f => f !== '')) {
        result.push(row);
      }
    }

    return result.map((parts, index) => {
      if (parts.length < 7) {
        throw new Error(`行 ${index + 1} の形式が正しくありません。カラムが不足しています（現在 ${parts.length} カラム）。必要カラム数: 7`);
      }
      return {
        id: `q-csv-${index}-${Date.now()}`,
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
        console.error(err);
        setError(err.message || 'ファイルの読み込みに失敗しました。形式を確認してください。');
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const generateSampleData = () => {
    const sample = `"次のコードを実行した結果はどれか
x = 42
if x == 0:
    print(""xはゼロです"")
elif x > 1:
    print(""xは1より大きい整数です"")
elif x > 10:
    print(""xは10より大きい整数です"")
elif x < 50:
    print(""xは50未満の整数です"")",xはゼロです,xは1より大きい整数です,xは10より大きい整数です,xは50未満の整数です,3,基礎試験問題集 第1章 4`;
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'quiz_sample_multiline.csv');
    link.click();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-colors border-none bg-transparent cursor-pointer"
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
            改行を含む複雑なコード問題も読み込めます。<br/>
            (クォートで囲まれた範囲の改行に対応しています)
          </p>
        </div>

        <div 
          className="border-2 border-dashed border-slate-200 rounded-xl p-10 bg-slate-50 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all group"
          onClick={() => fileInputRef.current?.click()}
        >
          <i className="fas fa-cloud-upload-alt text-4xl text-slate-300 group-hover:text-indigo-400 mb-4 transition-colors"></i>
          <p className="text-slate-600 font-medium">CSVファイルを選択</p>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv"
            className="hidden" 
          />
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-start gap-2 text-left">
            <i className="fas fa-exclamation-circle mt-0.5"></i>
            <span>{error}</span>
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-slate-100 text-left">
          <h3 className="font-semibold text-slate-700 mb-3 text-sm">推奨形式:</h3>
          <p className="text-[10px] text-slate-400 mb-4 bg-slate-50 p-3 rounded font-mono break-all leading-relaxed">
            "問題文(改行可)", "選択肢1(改行可)", "選択肢2", "選択肢3", "選択肢4", 正解Index, 解説メモ
          </p>
          <button 
            onClick={generateSampleData}
            className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1 border-none bg-transparent cursor-pointer"
          >
            <i className="fas fa-download text-xs"></i>
            複数行対応サンプルのダウンロード
          </button>
        </div>
      </div>
    </div>
  );
};

export default Uploader;