import React, { useState, useCallback } from 'react';
import { AppState, Question, UserAnswer } from './types';
import Home from './components/Home';
import Uploader from './components/Uploader';
import Quiz from './components/Quiz';
import Results from './components/Results';

// Provided 40 Python Quiz Questions
const DEFAULT_QUESTIONS: Question[] = [
  { id: 'p1', text: 'Pythonの言語的特徴として、あてはまるものはどれですか？', choices: ['低レベルなメモリ管理をユーザーが行う必要がある', '実行時にソースコードをコンピュータが実行できる形式へと逐次解釈しながら処理を進める', 'コンパイルが必須であり、スクリプト作成には向かない', '実行速度を最優先し、構文の読みやすさを犠牲にしている'], correctIndex: 1, memo: '第1章：食欲をそそってみる。Pythonはインタプリタ言語であり、読みやすさを重視しています。' },
  { id: 'p2', text: 'Python インタプリタの対話モードについて、あてはまるものはどれですか？', choices: ['GUIのデバッグ手法である', '一時プロンプトが「>>>」二時プロンプトが「．．．」である。', 'バイナリファイルを直接編集できる', '複数行の長いプログラムをまとめて実行するのに便利である'], correctIndex: 1, memo: '第2章：Python インタプリタを使う。対話モードは短いコードのテストに最適です。' },
  { id: 'p3', text: 'Pythonを「電卓」として使う際、基本的な演算に含まれないものはどれですか？', choices: ['加算 (+)', '乗算 (*)', 'ポインタ演算 (&)', '除算 (/)'], correctIndex: 2, memo: '第3章：Python の非公式な紹介。Pythonはポインタ演算を直接行いません。' },
  { id: 'p4', text: 'テキストの操作において、あてはまる機能はどれですか？', choices: ['メモリを直接割り当てる', 'インデックスを使って文字を切り出す、スライスを使い文字を切り出す', 'ハードウェアを制御する', '累残代入文を使い、追加や削除をする'], correctIndex: 1, memo: '第3章：Python の非公式な紹介。文字列は不変（immutable）でありスライスが多用されます。' },
  { id: 'p5', text: 'リストというデータ型について、正しい説明はどれですか？', choices: ['Pythonには存在しないデータ型である', '文字列しか格納できない', 'Pythonで複数の値を扱うためのデータ構造である', '一度作成すると内容を一切変更できない'], correctIndex: 2, memo: '第3章：Python の非公式な紹介。リストは可変（mutable）なシーケンスです。' },
  { id: 'p6', text: 'Pythonがスクリプト作成に適している理由はどれですか？', choices: ['文法がシンプルで読みやすい', '新しい言語のため、標準ライブラリや外部ライブラリが貧弱である', 'すべてのプラットフォームで有料であること', 'コンパイルが必要だが、実行速度が高速である'], correctIndex: 0, memo: '第3章：Python の非公式な紹介。可読性の高さが大きな特徴です。' },
  { id: 'p7', text: 'リストをキューとして使う方法について、あてはまる説明はどれですか？', choices: ['stackとpopを使う', 'appendとpopを使う', 'stackとappendを使う', 'リストはスタックとしてのみ、使うことができる'], correctIndex: 1, memo: '第3章：Python の非公式な紹介。ただし効率面からcollections.dequeの使用が推奨されます。' },
  { id: 'p8', text: 'Pythonのインタプリタについて正しい説明はどれですか？', choices: ['実行前に必ず機械語への完全なコンパイルが必要である', '迅速なアプリケーション開発（RAD）に適している', '実行時にOSを必要としない', '現代のコンピュータでは動作しない'], correctIndex: 1, memo: '第3章：Python の非公式な紹介。迅速なプロトタイピングに向いています。' },
  { id: 'p9', text: '条件分岐を行うためのステートメントはどれですか？', choices: ['switch case', 'if / elif / else', 'select', 'when'], correctIndex: 1, memo: '第4章：制御構造ツール。Python 3.10からはmatch-caseも導入されました。' },
  { id: 'p10', text: 'Pythonの for 文について、あてはまる説明はどれですか？', choices: ['常に無限ループを作成する', '数値のインクリメントのみを行う', '繰り返しを行うための構文である', '実行ファイルを生成する'], correctIndex: 2, memo: '第4章：制御構造ツール。イテラブルなオブジェクトの要素を順に処理します。' },
  { id: 'p11', text: '連続した数値を生成するため、よく使用される関数は何ですか？', choices: ['sequence()', 'count()', 'range()', 'list()'], correctIndex: 2, memo: '第4章：制御構造ツール。range(start, stop, step)の形式で使用します。' },
  { id: 'p12', text: 'ループを途中で終了させるために使われるステートメントは何ですか？', choices: ['exit', 'break', 'stop', 'end'], correctIndex: 1, memo: '第4章：制御構造ツール。breakは最も内側のfor/whileループを抜けます。' },
  { id: 'p13', text: '何もしないことであり、構文上のプレースホルダ（代替物）として機能するものはどれですか？', choices: ['null', 'void', 'pass', 'empty'], correctIndex: 2, memo: '第4章：制御構造ツール。中身が未実装の関数などで使われます。' },
  { id: 'p14', text: '関数を定義する際に最初に使用するキーワードは何ですか？', choices: ['function', 'def', 'define', 'procedure'], correctIndex: 1, memo: '第4章：制御構造ツール。defの後に関数名と引数を続けます。' },
  { id: 'p15', text: '関数の引数に、呼び出し側が値を指定しなかった場合のデフォルト値を設定できますか？', choices: ['できる', 'できない', '数値の場合のみできる', 'Python 3.4では廃止された'], correctIndex: 0, memo: '第4章：制御構造ツール。def f(a=1)のように定義可能です。' },
  { id: 'p16', text: '関数呼び出し時に、name=\'value\' のように引数名を指定して渡す方式を何と呼びますか？', choices: ['位置引数', 'キーワード引数', '静的引数', '匿名引数'], correctIndex: 1, memo: '第4章：制御構造ツール。引数の順番に関わらず値を指定できます。' },
  { id: 'p17', text: '1行で記述できる短い無名関数を作成する際に使用されるキーワードはどれですか？', choices: ['inline', 'shortfunc', 'Lambda', 'mini-def'], correctIndex: 2, memo: '第4章：制御構造ツール。lambda式と呼ばれます。' },
  { id: 'p18', text: 'リストをスタックとして使う際、後入れ先出し（LIFO）を実現するために主に使われるメソッドの組み合わせはどれですか？', choices: ['push と pop', 'append と pop', 'add と remove', 'insert と delete'], correctIndex: 1, memo: '第5章：データ構造。リストの末尾への追加と削除は効率的です。' },
  { id: 'p19', text: 'リストを生成するための簡潔な記法（[x for x in ...] など）を何と呼びますか？', choices: ['リストマッピング', 'リスト内包表記', 'リストジェネレータ', 'リストフィルタリング'], correctIndex: 1, memo: '第5章：データ構造。読みやすく効率的なリスト生成が可能です。' },
  { id: 'p20', text: '指定したインデックスの要素を削除するために使われるステートメントはどれですか？', choices: ['remove', 'pop', 'del', 'clear'], correctIndex: 2, memo: '第5章：データ構造。del文はスライスも削除可能です。' },
  { id: 'p21', text: 'カンマで区切られた値を持ち、一度作成すると変更できないデータ型はどれですか？', choices: ['タプル', 'リスト', '辞書', 'スロット'], correctIndex: 0, memo: '第5章：データ構造。タプルは不変（immutable）です。' },
  { id: 'p22', text: 'データ型（set）の特徴はどれですか？', choices: ['要素の順序が厳密に保持される', '重複する要素を保持しない', 'インデックスによるアクセスが必須である', '数値しか格納できない'], correctIndex: 1, memo: '第5章：データ構造。集合（set）は一意な要素の集まりです。' },
  { id: 'p23', text: '「キー」と「値」のペアでデータを管理するデータ構造は何ですか？', choices: ['リスト', 'タブル', '辞書', 'レンジ'], correctIndex: 2, memo: '第5章：データ構造。dict型と呼ばれます。' },
  { id: 'p24', text: '辞書などのデータ構造から効率的に値を取り出して処理する手法を何と呼びますか？', choices: ['ループ技法', 'キャッシュ技法', 'ソート技法', '再帰技法'], correctIndex: 0, memo: '第5章：データ構造。items()メソッドなどを使うループが一般的です。' },
  { id: 'p25', text: '関連する関数などを一つのファイルにまとめ、他のスクリプトから呼び出す仕組みを何と呼びますか？', choices: ['フォルダ', 'モジュール', 'ライブラリファイル', 'プロジェクト'], correctIndex: 1, memo: '第6章：モジュール。import文で呼び出します。' },
  { id: 'p26', text: 'あるモジュールがどのような名前（変数や関数）を定義しているか調べるための関数はどれですか？', choices: ['list()', 'search()', 'dir()', 'find()'], correctIndex: 2, memo: '第6章：モジュール。dir()関数で名前の一覧を取得できます。' },
  { id: 'p27', text: 'ファイル入出力のopen()関数のモードについて、間違っている説明はどれですか。', choices: ['mode=\'a\' は読み込み専用', 'mode=\'r+\' は読み書き両用', 'mode=\'b\' はバイナリモード', 'mode=\'w\' は新規書き込み'], correctIndex: 0, memo: '第7章：入出力。\'a\'モードは「追記（append）」用です。' },
  { id: 'p28', text: 'プログラムが解釈される前に、記述ミス（コロンの忘れなど）で見つかるエラーは何ですか？', choices: ['実行時エラー', '構文エラー', '論理エラー', 'メモリエラー'], correctIndex: 1, memo: '第8章：エラーと例外。SyntaxErrorとして報告されます。' },
  { id: 'p29', text: 'プログラムの実行中に発生し、適切に処理しないと停止の原因となるエラーを何と呼びますか？', choices: ['例外', '警告', 'バグ', 'シグナル'], correctIndex: 0, memo: '第8章：エラーと例外。実行中のエラーは「例外」と呼ばれます。' },
  { id: 'p30', text: '例外をキャッチして処理するために使用されるキーワードの組み合わせはどれですか？', choices: ['try ... catch', 'check ... error', 'try ... except', 'if ... error'], correctIndex: 2, memo: '第8章：エラーと例外。他の言語ではcatchが一般的ですが、Pythonはexceptです。' },
  { id: 'p31', text: '例外の発生に関わらず、ファイルのクローズなどの「後始末」を確実に行うための構文はどれですか？', choices: ['always', 'finally', 'ensure', 'after'], correctIndex: 1, memo: '第8章：エラーと例外。try-finallyまたはwith文を使用します。' },
  { id: 'p32', text: 'クラスについて誤っている説明はどれか', choices: ['クラスから生成されたオブジェクトをインスタンスと呼ぶ', 'クラスで保持する変数のことをクラス変数と呼ぶ', 'クラスに定義された関数をメソッドと呼ぶ', '特殊メソッド__init__()は、selfのみの引数で使うもので、self以外の引数を自由に追加できない'], correctIndex: 3, memo: '第9章：クラス。__init__には自由に引数を追加できます。' },
  { id: 'p33', text: 'すでに存在するクラスの機能を引き継いで、新しいクラスを定義することを何と呼びますか？', choices: ['継承', '複製', 'マングリング', 'インポート'], correctIndex: 0, memo: '第9章：クラス。コードの再利用性を高める仕組みです。' },
  { id: 'p34', text: 'ディレクトリ操作などを利用するためのインターフェースを提供するモジュールはどれですか？', choices: ['sys', 'os', 'kernel', 'path'], correctIndex: 1, memo: '第10章：標準ライブラリめぐり。OS依存の機能にアクセスできます。' },
  { id: 'p35', text: '*.txt のようなワイルドカードを使ってファイル一覧を取得するのに適したモジュールはどれですか？', choices: ['re', 'math', 'glob', 'string'], correctIndex: 2, memo: '第10章：標準ライブラリめぐり。ディレクトリのワイルドカード検索が可能です。' },
  { id: 'p36', text: '階乗を求めるfactorial()関数があるモジュールはどれですか？', choices: ['math', 'calc', 'NumPy', 'numbers'], correctIndex: 0, memo: '第10章：標準ライブラリめぐり。mathモジュールに含まれます。' },
  { id: 'p37', text: 'プログラムの実行時間を計測するなど、パフォーマンスを測定するための項目はありますか？', choices: ['ある', 'ない', 'Python 3.4では外部ライブラリが必須である', 'OSの機能でのみ可能である'], correctIndex: 0, memo: '第10章：標準ライブラリめぐり。timeitなどのモジュールがあります。' },
  { id: 'p38', text: 'マルチスレッドの説明で、間違っているものはどれか', choices: ['別のスレッドで計算処理と並行してI/Oを実行すること', 'Pythonでは、threadingモジュールが提供されている', 'リソースへのアクセスは、分散化した複数のスレッドで行う設計が推奨される', 'スレッド間の通信と調整にQueueオブジェクトを使用すると、設計が容易になりやすい。'], correctIndex: 2, memo: '第11章：標準ライブラリめぐり。GILがあるため計算中心の並列処理には向きません。' },
  { id: 'p39', text: 'Pythonのパッケージをインストール・管理するために使用されるツールとして記載されているものはどれですか？', choices: ['apt', 'yum', 'pip', 'npm'], correctIndex: 2, memo: '第12章：仮想環境とパッケージ。PyPIからパッケージを導入します。' },
  { id: 'p40', text: '対話モードの利便性を高める機能として、間違っているものはどれか', choices: ['Tabキーを押すことにより、補完機能を呼び出すことができる', '入力履歴は、デフォルトでは.python_historyという名前で保存される', '式を書くだけで結果がその場で返ってくる', 'チルダ ^ により直前の結果を参照できる'], correctIndex: 3, memo: '第14章：対話環境。直前の結果はアンダースコア _ で参照します。' }
];

const App: React.FC = () => {
  const [currentState, setCurrentState] = useState<AppState>(AppState.HOME);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);

  const prepareAndStartQuiz = useCallback((rawQuestions: Question[]) => {
    // 1. 各問題の選択肢をシャッフルし、正解インデックスを再計算
    const processedQuestions = rawQuestions.map(q => {
      const choicesWithMetadata = q.choices.map((text, index) => ({
        text,
        isCorrect: index === q.correctIndex
      }));
      const shuffledChoices = [...choicesWithMetadata].sort(() => Math.random() - 0.5);
      return {
        ...q,
        choices: shuffledChoices.map(c => c.text),
        correctIndex: shuffledChoices.findIndex(c => c.isCorrect)
      };
    });

    // 2. 問題の順番をランダムに並び替え
    const shuffledQuestions = [...processedQuestions].sort(() => Math.random() - 0.5);

    setQuestions(shuffledQuestions);
    setStartTime(Date.now());
    setCurrentState(AppState.QUIZ);
  }, []);

  const handleStartDefault = useCallback(() => {
    prepareAndStartQuiz(DEFAULT_QUESTIONS);
  }, [prepareAndStartQuiz]);

  const handleCsvLoaded = useCallback((loadedQuestions: Question[]) => {
    prepareAndStartQuiz(loadedQuestions);
  }, [prepareAndStartQuiz]);

  const handleQuizFinish = useCallback((answers: UserAnswer[]) => {
    setUserAnswers(answers);
    setTotalTime(Math.floor((Date.now() - startTime) / 1000));
    setCurrentState(AppState.RESULTS);
  }, [startTime]);

  const goToHome = useCallback(() => {
    setCurrentState(AppState.HOME);
    setQuestions([]);
    setUserAnswers([]);
    setTotalTime(0);
  }, []);

  const goToUploader = useCallback(() => {
    setCurrentState(AppState.UPLOADING);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-50 shadow-sm no-print">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button onClick={goToHome} className="flex items-center gap-2 group border-none bg-transparent cursor-pointer outline-none">
            <div className="bg-indigo-600 p-2 rounded-lg group-hover:bg-indigo-700 transition-colors">
              <i className="fas fa-graduation-cap text-white"></i>
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Senju Soft</h1>
          </button>
          {currentState !== AppState.HOME && (
            <button 
              onClick={goToHome}
              className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors border-none bg-transparent cursor-pointer outline-none"
            >
              ホームへ戻る
            </button>
          )}
        </div>
      </header>

      {/* 印刷用ヘッダー */}
      <div className="print-only p-8 border-b-4 border-slate-800 mb-8 bg-white">
        <h1 className="text-4xl font-black text-slate-900">クイズ学習 実施結果レポート</h1>
        <p className="text-slate-500 mt-2 font-bold">Senju Soft - システム生成ドキュメント</p>
        <p className="text-slate-400 text-sm">生成日時: {new Date().toLocaleString('ja-JP', { dateStyle: 'long', timeStyle: 'medium' })}</p>
      </div>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 flex-grow w-full">
        {currentState === AppState.HOME && (
          <Home onStartDefault={handleStartDefault} onGoToUpload={goToUploader} />
        )}

        {currentState === AppState.UPLOADING && (
          <Uploader onCsvLoaded={handleCsvLoaded} onBack={goToHome} />
        )}

        {currentState === AppState.QUIZ && (
          <Quiz 
            questions={questions} 
            onFinish={handleQuizFinish} 
          />
        )}

        {currentState === AppState.RESULTS && (
          <Results 
            questions={questions} 
            userAnswers={userAnswers} 
            totalTime={totalTime}
            onRetry={goToHome}
          />
        )}
      </main>

      <footer className="py-8 border-t border-slate-200 text-center text-slate-400 text-sm no-print">
        &copy; 2026 Senju Soft - Python Learning Tool
      </footer>
    </div>
  );
};

export default App;