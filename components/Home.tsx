
import React from 'react';

interface HomeProps {
  onStartDefault: () => void;
  onGoToUpload: () => void;
}

const Home: React.FC<HomeProps> = ({ onStartDefault, onGoToUpload }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="relative h-64 bg-indigo-600 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 -left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 -right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative h-full flex flex-col items-center justify-center text-white p-8">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/30">
              <i className="fas fa-brain text-4xl text-white"></i>
            </div>
            <h2 className="text-3xl font-extrabold mb-2 text-center">クイズマスターへようこそ</h2>
            <p className="text-indigo-100 text-center max-w-md">
              学習の成果を試しましょう。内蔵の40問クイズ、または自分で作成したCSVファイルから開始できます。
            </p>
          </div>
        </div>

        <div className="p-10 grid sm:grid-cols-2 gap-6">
          <button 
            onClick={onStartDefault}
            className="group p-8 bg-indigo-50 border-2 border-indigo-100 rounded-2xl text-left hover:border-indigo-400 hover:bg-white transition-all hover:shadow-lg"
          >
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <i className="fas fa-play"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">標準クイズを開始</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              あらかじめ用意された40問のクイズに挑戦します。問題順・選択肢順は毎回ランダムです。
            </p>
          </button>

          <button 
            onClick={onGoToUpload}
            className="group p-8 bg-white border-2 border-slate-100 rounded-2xl text-left hover:border-slate-400 transition-all hover:shadow-lg"
          >
            <div className="w-12 h-12 bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-slate-800 group-hover:text-white transition-all group-hover:scale-110">
              <i className="fas fa-file-upload"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">CSVから作成</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              お手持ちのクイズデータをアップロードして開始します。形式はサンプルをご確認ください。
            </p>
          </button>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-4">
        <div className="text-center p-4">
          <div className="text-indigo-600 font-bold text-2xl mb-1">40</div>
          <div className="text-slate-400 text-xs uppercase tracking-widest">Questions</div>
        </div>
        <div className="text-center p-4">
          <div className="text-indigo-600 font-bold text-2xl mb-1">Random</div>
          <div className="text-slate-400 text-xs uppercase tracking-widest">Algorithm</div>
        </div>
        <div className="text-center p-4">
          <div className="text-indigo-600 font-bold text-2xl mb-1">PDF</div>
          <div className="text-slate-400 text-xs uppercase tracking-widest">Report</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
