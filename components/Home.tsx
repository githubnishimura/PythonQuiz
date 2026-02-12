import React from 'react';

interface HomeProps {
  onStartPredefined: (setNumber: 1 | 2) => void;
  onGoToUpload: () => void;
}

const Home: React.FC<HomeProps> = ({ onStartPredefined, onGoToUpload }) => {
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
            <h2 className="text-3xl font-extrabold mb-2 text-center">Pythonクイズへようこそ</h2>
            <p className="text-indigo-100 text-center max-w-md">
              学習の成果を試しましょう。AIが作成した40問、または自分で作成したCSVファイルから開始できます。
            </p>
          </div>
        </div>

        <div className="p-10 grid sm:grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">AI作成問題</h3>
            
            <button 
              onClick={() => onStartPredefined(1)}
              className="group p-6 bg-indigo-50 border-2 border-indigo-100 rounded-2xl text-left hover:border-indigo-400 hover:bg-white transition-all hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800">セット I：基礎編</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Pythonの基本文法からライブラリの基礎まで
                  </p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => onStartPredefined(2)}
              className="group p-6 bg-amber-50 border-2 border-amber-100 rounded-2xl text-left hover:border-amber-400 hover:bg-white transition-all hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-600 text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800">セット II：実践編</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    第13章を中心としたより実戦的な内容
                  </p>
                </div>
              </div>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">自作データ</h3>
            
            <button 
              onClick={onGoToUpload}
              className="group h-full p-8 bg-white border-2 border-slate-100 rounded-2xl text-left hover:border-slate-400 transition-all hover:shadow-lg flex flex-col justify-center"
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
      </div>

      <div className="mt-12 grid grid-cols-3 gap-4">
        <div className="text-center p-4">
          <div className="text-indigo-600 font-bold text-2xl mb-1">80</div>
          <div className="text-slate-400 text-xs uppercase tracking-widest">Total Questions</div>
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