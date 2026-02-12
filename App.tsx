import React, { useState, useCallback } from 'react';
import { AppState, Question, UserAnswer } from './types';
import Home from './components/Home';
import Uploader from './components/Uploader';
import Quiz from './components/Quiz';
import Results from './components/Results';

// 既存の問題セット I
const QUESTIONS_SET_1: Question[] = [
  { id: 'p1-1', text: 'Pythonの言語的特徴として、あてはまるものはどれですか？', choices: ['低レベルなメモリ管理をユーザーが行う必要がある', '実行時にソースコードをコンピュータが実行できる形式へと逐次解釈しながら処理を進める', 'コンパイルが必須であり、スクリプト作成には向かない', '実行速度を最優先し、構文の読みやすさを犠牲にしている'], correctIndex: 1, memo: '第1章：食欲をそそってみる。Pythonはインタプリタ言語であり、読みやすさを重視しています。' },
  { id: 'p1-2', text: 'Python インタプリタの対話モードについて、あてはまるものはどれですか？', choices: ['GUIのデバッグ手法である', '一時プロンプトが「>>>」二時プロンプトが「．．．」である。', 'バイナリファイルを直接編集できる', '複数行の長いプログラムをまとめて実行するのに便利である'], correctIndex: 1, memo: '第2章：Python インタプリタを使う。対話モードは短いコードのテストに最適です。' },
  { id: 'p1-3', text: 'Pythonを「電卓」として使う際、基本的な演算に含まれないものはどれですか？', choices: ['加算 (+)', '乗算 (*)', 'ポインタ演算 (&)', '除算 (/)'], correctIndex: 2, memo: '第3章：Python の非公式な紹介。Pythonはポインタ演算を直接行いません。' },
  { id: 'p1-4', text: 'テキストの操作において、あてはまる機能はどれですか？', choices: ['メモリを直接割り当てる', 'インデックスを使って文字を切り出す、スライスを使い文字を切り出す', 'ハードウェアを制御する', '累残代入文を使い、追加や削除をする'], correctIndex: 1, memo: '第3章：Python の非公式な紹介。文字列は不変（immutable）でありスライスが多用されます。' },
  { id: 'p1-5', text: 'リストというデータ型について、正しい説明はどれですか？', choices: ['Pythonには存在しないデータ型である', '文字列しか格納できない', 'Pythonで複数の値を扱うためのデータ構造である', '一度作成すると内容を一切変更できない'], correctIndex: 2, memo: '第3章：Python の非公式な紹介。リストは可変（mutable）なシーケンスです。' },
  { id: 'p1-6', text: 'Pythonがスクリプト作成に適している理由はどれですか？', choices: ['文法がシンプルで読みやすい', '新しい言語のため、標準ライブラリや外部ライブラリが貧弱である', 'すべてのプラットフォームで有料であること', 'コンパイルが必要だが、実行速度が高速である'], correctIndex: 0, memo: '第3章：Python の非公式な紹介。可読性の高さが大きな特徴です。' },
  { id: 'p1-7', text: 'リストをキューとして使う方法について、あてはまる説明はどれですか？', choices: ['stackとpopを使う', 'appendとpopを使う', 'stackとappendを使う', 'リストはスタックとしてのみ、使うことができる'], correctIndex: 1, memo: '第3章：Python の非公式な紹介。ただし効率面からcollections.dequeの使用が推奨されます。' },
  { id: 'p1-8', text: 'Pythonのインタプリタについて正しい説明はどれですか？', choices: ['実行前に必ず機械語への完全なコンパイルが必要である', '迅速なアプリケーション開発（RAD）に適している', '実行時にOSを必要としない', '現代のコンピュータでは動作しない'], correctIndex: 1, memo: '第3章：Python の非公式な紹介。迅速なプロトタイピングに向いています。' },
  { id: 'p1-9', text: '条件分岐を行うためのステートメントはどれですか？', choices: ['switch case', 'if / elif / else', 'select', 'when'], correctIndex: 1, memo: '第4章：制御構造ツール。Python 3.10からはmatch-caseも導入されました。' },
  { id: 'p1-10', text: 'Pythonの for 文について、あてはまる説明はどれですか？', choices: ['常に無限ループを作成する', '数値のインクリメントのみを行う', '繰り返しを行うための構文である', '実行ファイルを生成する'], correctIndex: 2, memo: '第4章：制御構造ツール。イテラブルなオブジェクトの要素を順に処理します。' },
  { id: 'p1-11', text: '連続した数値を生成するため、よく使用される関数は何ですか？', choices: ['sequence()', 'count()', 'range()', 'list()'], correctIndex: 2, memo: '第4章：制御構造ツール。range(start, stop, step)の形式で使用します。' },
  { id: 'p1-12', text: 'ループを途中で終了させるために使われるステートメントは何ですか？', choices: ['exit', 'break', 'stop', 'end'], correctIndex: 1, memo: '第4章：制御構造ツール。breakは最も内側のfor/whileループを抜けます。' },
  { id: 'p1-13', text: '何もしないことであり、構文上のプレースホルダ（代替物）として機能するものはどれですか？', choices: ['null', 'void', 'pass', 'empty'], correctIndex: 2, memo: '第4章：制御構造ツール。中身が未実装の関数などで使われます。' },
  { id: 'p1-14', text: '関数を定義する際に最初に使用するキーワードは何ですか？', choices: ['function', 'def', 'define', 'procedure'], correctIndex: 1, memo: '第4章：制御構造ツール。defの後に関数名と引数を続けます。' },
  { id: 'p1-15', text: '関数の引数に、呼び出し側が値を指定しなかった場合のデフォルト値を設定できますか？', choices: ['できる', 'できない', '数値の場合のみできる', 'Python 3.4では廃止された'], correctIndex: 0, memo: '第4章：制御構造ツール。def f(a=1)のように定義可能です。' },
  { id: 'p1-16', text: '関数呼び出し時に、name=\'value\' のように引数名を指定して渡す方式を何と呼びますか？', choices: ['位置引数', 'キーワード引数', '静的引数', '匿名引数'], correctIndex: 1, memo: '第4章：制御構造ツール。引数の順番に関わらず値を指定できます。' },
  { id: 'p1-17', text: '1行で記述できる短い無名関数を作成する際に使用されるキーワードはどれですか？', choices: ['inline', 'shortfunc', 'Lambda', 'mini-def'], correctIndex: 2, memo: '第4章：制御構造ツール。lambda式と呼ばれます。' },
  { id: 'p1-18', text: 'リストをスタックとして使う際、後入れ先出し（LIFO）を実現するために主に使われるメソッドの組み合わせはどれですか？', choices: ['push と pop', 'append と pop', 'add と remove', 'insert と delete'], correctIndex: 1, memo: '第5章：データ構造。リストの末尾への追加と削除は効率的です。' },
  { id: 'p1-19', text: 'リストを生成するための簡潔な記法（[x for x in ...] など）を何と呼びますか？', choices: ['リストマッピング', 'リスト内包表記', 'リストジェネレータ', 'リストフィルタリング'], correctIndex: 1, memo: '第5章：データ構造。読みやすく効率的なリスト生成が可能です。' },
  { id: 'p1-20', text: '指定したインデックスの要素を削除するために使われるステートメントはどれですか？', choices: ['remove', 'pop', 'del', 'clear'], correctIndex: 2, memo: '第5章：データ構造。del文はスライスも削除可能です。' },
  { id: 'p1-21', text: 'カンマで区切られた値を持ち、一度作成すると変更できないデータ型はどれですか？', choices: ['タプル', 'リスト', '辞書', 'スロット'], correctIndex: 0, memo: '第5章：データ構造。タプルは不変（immutable）です。' },
  { id: 'p1-22', text: 'データ型（set）の特徴はどれですか？', choices: ['要素の順序が厳密に保持される', '重複する要素を保持しない', 'インデックスによるアクセスが必須である', '数値しか格納できない'], correctIndex: 1, memo: '第5章：データ構造。集合（set）は一意な要素の集まりです。' },
  { id: 'p1-23', text: '「キー」と「値」のペアでデータを管理するデータ構造は何ですか？', choices: ['リスト', 'タブル', '辞書', 'レンジ'], correctIndex: 2, memo: '第5章：データ構造。dict型と呼ばれます。' },
  { id: 'p1-24', text: '辞書などのデータ構造から効率的に値を取り出して処理する手法を何と呼びますか？', choices: ['ループ技法', 'キャッシュ技法', 'ソート技法', '再帰技法'], correctIndex: 0, memo: '第5章：データ構造。items()メソッドなどを使うループが一般的です。' },
  { id: 'p1-25', text: '関連する関数などを一つのファイルにまとめ、他のスクリプトから呼び出す仕組みを何と呼びますか？', choices: ['フォルダ', 'モジュール', 'ライブラリファイル', 'プロジェクト'], correctIndex: 1, memo: '第6章：モジュール。import文で呼び出します。' },
  { id: 'p1-26', text: 'あるモジュールがどのような名前（変数や関数）を定義しているか調べるための関数はどれですか？', choices: ['list()', 'search()', 'dir()', 'find()'], correctIndex: 2, memo: '第6章：モジュール。dir()関数で名前の一覧を取得できます。' },
  { id: 'p1-27', text: 'ファイル入出力のopen()関数のモードについて、間違っている説明はどれですか。', choices: ['mode=\'a\' は読み込み専用', 'mode=\'r+\' は読み書き両用', 'mode=\'b\' はバイナリモード', 'mode=\'w\' は新規書き込み'], correctIndex: 0, memo: '第7章：入出力。\'a\'モードは「追記（append）」用です。' },
  { id: 'p1-28', text: 'プログラムが解釈される前に、記述ミス（コロンの忘れなど）で見つかるエラーは何ですか？', choices: ['実行時エラー', '構文エラー', '論理エラー', 'メモリエラー'], correctIndex: 1, memo: '第8章：エラーと例外。SyntaxErrorとして報告されます。' },
  { id: 'p1-29', text: 'プログラムの実行中に発生し、適切に処理しないと停止の原因となるエラーを何と呼びますか？', choices: ['例外', '警告', 'バグ', 'シグナル'], correctIndex: 0, memo: '第8章：エラーと例外。実行中のエラーは「例外」と呼ばれます。' },
  { id: 'p1-30', text: '例外をキャッチして処理するために使用されるキーワードの組み合わせはどれですか？', choices: ['try ... catch', 'check ... error', 'try ... except', 'if ... error'], correctIndex: 2, memo: '第8章：エラーと例外。他の言語ではcatchが一般的ですが、Pythonはexceptです。' },
  { id: 'p1-31', text: '例外の発生に関わらず、ファイルのクローズなどの「後始末」を確実に行うための構文はどれですか？', choices: ['always', 'finally', 'ensure', 'after'], correctIndex: 1, memo: '第8章：エラーと例外。try-finallyまたはwith文を使用します。' },
  { id: 'p1-32', text: 'クラスについて誤っている説明はどれか', choices: ['クラスから生成されたオブジェクトをインスタンスと呼ぶ', 'クラスで保持する変数のことをクラス変数と呼ぶ', 'クラスに定義された関数をメソッドと呼ぶ', '特殊メソッド__init__()は、selfのみの引数で使うもので、self以外の引数を自由に追加できない'], correctIndex: 3, memo: '第9章：クラス。__init__には自由に引数を追加できます。' },
  { id: 'p1-33', text: 'すでに存在するクラスの機能を引き継いで、新しいクラスを定義することを何と呼びますか？', choices: ['継承', '複製', 'マングリング', 'インポート'], correctIndex: 0, memo: '第9章：クラス。コードの再利用性を高める仕組みです。' },
  { id: 'p1-34', text: 'ディレクトリ操作などを利用するためのインターフェースを提供するモジュールはどれですか？', choices: ['sys', 'os', 'kernel', 'path'], correctIndex: 1, memo: '第10章：標準ライブラリめぐり。OS依存の機能にアクセスできます。' },
  { id: 'p1-35', text: '*.txt のようなワイルドカードを使ってファイル一覧を取得するのに適したモジュールはどれですか？', choices: ['re', 'math', 'glob', 'string'], correctIndex: 2, memo: '第10章：標準ライブラリめぐり。ディレクトリのワイルドカード検索が可能です。' },
  { id: 'p1-36', text: '階乗を求めるfactorial()関数があるモジュールはどれですか？', choices: ['math', 'calc', 'NumPy', 'numbers'], correctIndex: 0, memo: '第10章：標準ライブラリめぐり。mathモジュールに含まれます。' },
  { id: 'p1-37', text: 'プログラムの実行時間を計測するなど、パフォーマンスを測定するための項目はありますか？', choices: ['ある', 'ない', 'Python 3.4では外部ライブラリが必須である', 'OSの機能でのみ可能である'], correctIndex: 0, memo: '第10章：標準ライブラリめぐり。timeitなどのモジュールがあります。' },
  { id: 'p1-38', text: 'マルチスレッドの説明で、間違っているものはどれか', choices: ['別のスレッドで計算処理と並行してI/Oを実行すること', 'Pythonでは、threadingモジュールが提供されている', 'リソースへのアクセスは、分散化した複数のスレッドで行う設計が推奨される', 'スレッド間の通信と調整にQueueオブジェクトを使用すると、設計が容易になりやすい。'], correctIndex: 2, memo: '第11章：標準ライブラリめぐり。GILがあるため計算中心の並列処理には向きません。' },
  { id: 'p1-39', text: 'Pythonのパッケージをインストール・管理するために使用されるツールとして記載されているものはどれですか？', choices: ['apt', 'yum', 'pip', 'npm'], correctIndex: 2, memo: '第12章：仮想環境とパッケージ。PyPIからパッケージを導入します。' },
  { id: 'p1-40', text: '対話モードの利便性を高める機能として、間違っているものはどれか', choices: ['Tabキーを押すことにより、補完機能を呼び出すことができる', '入力履歴は、デフォルトでは.python_historyという名前で保存される', '式を書くだけで結果がその場で返ってくる', 'チルダ ^ により直前の結果を参照できる'], correctIndex: 3, memo: '第14章：対話環境。直前の結果はアンダースコア _ で参照します。' }
];

// 新規の問題セット II (第13章ベース) - 最新のCSVデータに基づき修正
const QUESTIONS_SET_2: Question[] = [
  { id: 'p2-1', text: 'Pythonの特徴として正しいものはどれですか', choices: ['文のグルーピングにおいて、開始と終了に括弧を用いる', '変数や引数を使うときは、事前にデータ型の宣言が必要になる', 'Pythonという言語はインタープリタ言語である', '他のプログラミング言語で書かれたプログラムによる機能拡張に対応していない'], correctIndex: 2, memo: '基礎試験問題集　第13章　1' },
  { id: 'p2-2', text: '対話モードの特徴として正しいものはどれですか', choices: ['プロンプトは、バージョン番号と開発者情報のメッセージの後に表示される', '一次プロンプトは「>>>」', '二次プロンプトは「=>」', '行を継続すると正しいインデントが自動で表示される'], correctIndex: 1, memo: '基礎試験問題集　第13章　2' },
  { id: 'p2-3', text: "次のコードを実行した結果はどれか\n\npi = 3.1415\nif pi == 3:\n    print('piは3です')\nelif pi < 3:\n    print('piは3より小さい整数です')\nelif pi > 3:\n    print('piは3より大きい整数です')\nelif pi >= 3:\n    print(piは3以上の整数です')", choices: ['piは3です', 'piは3より小さい整数です', 'piは3より大きい整数です', 'piは3以上の整数です'], correctIndex: 2, memo: '基礎試験問題集　第13章　3' },
  { id: 'p2-4', text: "次のコードを実行した結果はどれか\n\nx= 'first'\ny = 'second'\nx, y = y, x\nprint('x:', x, 'y:', y)\n", choices: ["x: 'first' y: 'second'\n", "x: 'first' y: 'first'", "x: 'second' y: 'second'", "x: 'second' y: 'first'"], correctIndex: 3, memo: '基礎試験問題集　第13章　4' },
  { id: 'p2-5', text: "次のコードを実行した結果はどれか\n\nz=5**2 + 6 // 4\nprint(z)\n", choices: ['4', '11', '26', '27'], correctIndex: 2, memo: '基礎試験問題集　第13章　5' },
  { id: 'p2-6', text: "次のコードを実行し「tauの値は6.28です」と表示する場合、【空欄①】 にあてはまるものはどれか\n\nimport math\n\nprint(f'tauの値はおよそ{ 【空欄①】 }である')", choices: ['math.tau:2', 'math.tau:2f', 'math.tau:.2', 'math.tau:.2f'], correctIndex: 3, memo: '基礎試験問題集　第13章　6' },
  { id: 'p2-7', text: 'リストの特徴として正しいものはどれか', choices: ['丸括弧「()」内にカンマ区切りで記述します', 'インデックス１で、先頭の要素を指定します', 'インデックスを指定し参照できますが、更新はできません', 'インデックス-1で、末尾の要素を指定できます。'], correctIndex: 3, memo: '基礎試験問題集　第13章　7' },
  { id: 'p2-8', text: "次のコードを実行した結果として正しいものはどれか\n\nlist = [10, 20, 30, 40]\nprint(list[3:], list[:2])\n", choices: ['[30,40] [10,20]', '[40] [10, 20, 30]', '[30] [10,20]', '[40] [10,20]'], correctIndex: 3, memo: '基礎試験問題集　第13章　8' },
  { id: 'p2-9', text: 'Pythonのコーディングスタイルといて不適切なものはどれか', choices: ['インデントには空白４つを使う', 'ソースコードの幅が81文字を超えないように折り返す', 'インデントにタブを使わない', '可能なら、コメントは独立した行に書く'], correctIndex: 1, memo: '基礎試験問題集　第13章　9' },
  { id: 'p2-10', text: "次のコードを実行し、期待する結果が表示されるとき、【空欄①】～【空欄③】に入る記述の組み合わせとして正しいものはどれか\n\nfor i in { 3, 4, 5, 15, 20 }:\n    if i % 3 == 0  【空欄①】  i % 5 == 0:\n         print(f'{i}は、15の倍数')\n    elif i % 3 == 0 【空欄②】i % 5 == 0: \n        print(f'{i}は、3か5の倍数')\n    【空欄③】:\n        print(f'{i}は、3の倍数でも5の倍数でもない\')\n\n＜期待する結果＞\n3は、3から5の倍数\n4は、3の倍数でも5の倍数でもない\n5は、3か5の倍数\n15は、15の倍数", choices: ['①or ②and ③else', '①or ②and ③not', '①and ②or ③else', '①and ②or ③not'], correctIndex: 2, memo: '基礎試験問題集　第13章　10' },
  { id: 'p2-11', text: "次のコードでfor文の繰り返し回数で、正しいのはどれか\n\nfor i in range(1, 7, 2):\n    print(i)", choices: ['2', '3', '4', '5'], correctIndex: 1, memo: '基礎試験問題集　第13章　11' },
  { id: 'p2-12', text: "次のコードを実行した結果「p」が表示されるとき、【空欄①】にあてはまるのはどれか\n\nfor a in 'Apple':\n    if a == 'p':\n        【空欄①】\n\nprint(a)\n", choices: ['else', 'break', 'return', 'continue'], correctIndex: 1, memo: '基礎試験問題集　第13章　12' },
  { id: 'p2-13', text: '関数で使用する変数の特徴として誤っているものはどれか', choices: ['関数内で、グローバル変数への代入を行う場合は、global文を使う', 'global文のない関数内での変数への代入は、その関数のローカル変数として扱われる', '関数内では、関数の外側で定義された変数に値を直接代入できる', '関数内で定義したすべての変数は、関数の外側で参照できない'], correctIndex: 2, memo: '基礎試験問題集　第13章　13' },
  { id: 'p2-14', text: "キーワード引数を使った関数を呼び出す方法として正しいものを選択してください\n\ndef procedure(x, y, z='foo', w='bar'):\n    print(x, y, z, w)", choices: ["procedure(z='eggs', w='pork', 'spam', 'ham')", "procedure('spam', 'ham', 'eggs', z='foo', w='port')", "procedure('spam', 'ham', z='eggs', a='pork')", "procedure('spam', 'ham', z='eggs', w='pork')"], correctIndex: 3, memo: '基礎試験問題集　第13章　14' },
  { id: 'p2-15', text: "次のコードを実行した結果として正しいものはどれか\n\ndefault_name = 'Yamada'\n\ndef hello1(name=default_name):\n    return f'Hello { name }.'\n\ndef hello2(name=None):\n    if name is None:\n        name = default_name\n    return f'Hello {name}.'\n\ndefault_name = 'Tarou'\nprint(hello1(), hello2())", choices: ['Hello Yamada. Hello Yamada.', 'Hello Yamada. Hello Tarou.', 'Hello Tarou. Hello Yamada.', 'Hello Tarou. Hello Tarou.'], correctIndex: 1, memo: '基礎試験問題集　第13章　15' },
  { id: 'p2-16', text: "次のコードを実行して「new_bar」と表示されるとき、【空欄①】にあてはまる記述として正しいものはどれか\n\ndef concat(arg1, arg2, sep='/'):\n    return sep.join([arg1, arg2])\n\nwords = ['new', 'bar']\noptions = {'sep': '_'}\nprint(【空欄①】)", choices: ['concat(arg1, arg2=words, sep=options)', "concat(*words, **options)\n", 'concat(words, sep=options)', 'concat(**words, **options)'], correctIndex: 1, memo: '基礎試験問題集　第13章　16' },
  { id: 'p2-17', text: "次のコードを実行した結果として正しいものはどれか\n\nfunc = lambda a, b: (b * 3, a + 2)\nx, y = 5, 6\np, q = func(x, y)\nprint(p, q)", choices: ['7 18', '5 6', '6 5', '18 7'], correctIndex: 3, memo: '基礎試験問題集　第13章　17' },
  { id: 'p2-18', text: "次のコードを実行した結果として正しいものはどれか\n\ndata = [1, 2, 3, 4]\nresult = []\nwhile data:\n    result.append(data.pop())\nprint(result)", choices: ['[0, 1, 2, 3]', '[1, 2, 3, 4]', '[4, 3, 2, 1]', 'IndexErrorとなる'], correctIndex: 2, memo: '基礎試験問題集　第13章　18' },
  { id: 'p2-19', text: 'リストの要素に関する記述の中で、正しいものを選べ', choices: ['[[1,2],[3,4,5,6]]のように、異なる長さのリストはリストの要素にできない', '[[1,2,3,4]]の長さは4である', '[[1,2],[3,4]]の長さは4である', '[[1,2],[3,4]]をリストの入れ子と呼ぶ'], correctIndex: 3, memo: '基礎試験問題集　第13章　19' },
  { id: 'p2-20', text: "次のコードを実行した結果として正しいものを選べ\n\ndef value(arg):\n    return arg\n\nresult1 = value(0) and value(1) and value(2)\nresult2 = value(0) or value(1) or value(2)\nprint(result1, result2)", choices: ['True False', '0 1', 'False True', '0 2'], correctIndex: 1, memo: '基礎試験問題集　第13章　20' },
  { id: 'p2-21', text: "次のコードを実行した結果として正しいものを選べ\n\nfor i, j in zip([1, 10, 100], [1, 2, 3]):\n    print( i * j )", choices: ["1\n12\n103", "1\n20\n300", "10\n100\n6", "1\n22\n333"], correctIndex: 1, memo: '基礎試験問題集　第13章　21' },
  { id: 'p2-22', text: '次のコードを実行した結果として、タプルが生成されるものはどれか', choices: ["tuple1 = ['spam', 'ham', 'eggs']", "tuple1 = {'spam', 'ham', 'eggs'}", "tuple1 =tuple('spam', 'ham', 'eggs')", "tuple1 = 'spam', "], correctIndex: 3, memo: '基礎試験問題集　第13章　22' },
  { id: 'p2-23', text: 'setの性質として正しいものはどれか', choices: ['追加した要素の順序は保持されない', '２つのsetの差集合は求めることはできない', 'append()メソッドで要素を追加できる', '重複する要素を持てる'], correctIndex: 0, memo: '基礎試験問題集　第13章　23' },
  { id: 'p2-24', text: "次のコードを実行した結果として表示されるものはどれか\n\nprice = {'red':180, 'green': 250)\ndel price(['red'])\nprice['blue']=230\nprice['orange']=120\nprice['green']=240\nprint(price)\n\n", choices: ["{'red': 180, 'blue':230, 'green': 240, 'orange':120}", "{'orange': 120, 'blue': 230, 'green': 250}", "{'red':180, 'orange':120, 'green': 250, 'blue': 230}", "{'green': 240, 'blue': 230, 'orange': 120}"], correctIndex: 3, memo: '基礎試験問題集　第13章　24' },
  { id: 'p2-25', text: "次のコードを「メインモジュールとしてmessage()関数を実行したときのみ」その結果を表示させたい場合、【空欄①】に入る記述として正しいものはどれか\n\ndef message():\n    print('Hello')\n\n【空欄①】", choices: ["if __main__ == '__name__':\n    message()", "if __name__ == '__main__':\n    message()", "if __module__ == '__name__':\n    message()", 'message()'], correctIndex: 1, memo: '基礎試験問題集　第13章　25' },
  { id: 'p2-26', text: "下記ディレクトリ構成を持つパッケージにおいて、サブモジュール「load.py」の属性をパッケージ「save」で読み込む必要があります。このとき、my_app/save/__init__.pyの内容として正しいものを選べ\n\n<ディレクトリ構成>\nmy_app/\n    __init__.py\n    load.py\n    save/\n        __init__.py", choices: ['from . Import load', 'from ..load import', 'from ..load import *', 'from load import *'], correctIndex: 2, memo: '基礎試験問題集　第13章　26' },
  { id: 'p2-27', text: 'open()関数のmode引数について誤ってる説明はどれか', choices: ['「r+」を指定すると、テキストモードで読み書きできる', '「b」を指定すると、バイナリモードで読み書きできる', '「ab」を指定すると、バイナリモードで追加読み書きできる', '「wb」を指定すると、バイナリモードで新規書き込みできる'], correctIndex: 1, memo: '基礎試験問題集　第13章　27' },
  { id: 'p2-28', text: "次のコードを実行したときにおこるエラーはどれですか\n\ndata = [0, 1, 2]\nfor i data:\n    print(i)", choices: ['SyntaxError', 'ValueError', 'TypeError', 'NameError'], correctIndex: 0, memo: '基礎試験問題集　第13章　28' },
  { id: 'p2-29', text: "次のコードで起こりうる例外を処理するとき、【空欄①】に当てはまる記述として正しいものはどれか\n\ntry:\n    times = input('分割回数:')\n    value = 100 / int(times)\n    print(value)\nexcept 【空欄①】:\n    print('エラーが発生しました')", choices: ['(TypeError, NameError)', '(ZeroDivisionError, TypeError)', '(ValueError, ZeroDivisionError)', '(NameError, ValueError)'], correctIndex: 2, memo: '基礎試験問題集　第13章　29' },
  { id: 'p2-30', text: "次のコードでValueErrorを発生させるために、【空欄①】に当てはまる記述として正しいものを選べ\n\n【空欄①】ValueError('ValueErrorです')", choices: ['send', 'raise', 'throw', 'return'], correctIndex: 1, memo: '基礎試験問題集　第13章　30' },
  { id: 'p2-31', text: "次のコードを実行した結果として正しいものはどれか\n\ndef divide(number, divider):\n    try:\n        answer = number / divider\n        return answer\n    except ZeroDivisionError:\n        print('ゼロ除算が行われました')\n    except TypeError:\n        print('引数の型が不正です')\n    finally:\n        print('--finally節の処理--')\n\nanswer = divide(50.0, 0)\nprint(f'結果: { answer }')", choices: ["ゼロ除算が行われました\n--finally節の処理--\n結果: None", "引数の型が不正です\n結果: None", "ゼロ除算が行われました\n結果: None", "引数の型が不正です\n--finally節の処理--\n結果: None"], correctIndex: 0, memo: '基礎試験問題集　第13章　31' },
  { id: 'p2-32', text: "次のコードはShinnosukeクラスにクラス変数family、インスタンス変数voice、メソッドshow_familyを定義しています。コードが正しく実行されるとき、【空欄①】～【空欄⑤】に入る記述の組み合わせとして正しいものはどれか\n\nclass Shinosuke:\n    【空欄①】 = 'Nohara'\n\n    def 【空欄②】:\n          【空欄③】= 'dazo'\n\n    def show_family【空欄④】:\n        return f'The Shinnosuke belongs to the {【空欄⑤】} family.'", choices: ['①family ②__init__() ③verbal_tic ④()  ⑤family', '①self.family ②__init__() ③verbal_tic ④()  ⑤family', '①family ②__init__(self) ③self.verbal_tic ④(self)  ⑤self.family', '①self.family ②__init__(self) ③self.verbal_tic ④(self)  ⑤self.family'], correctIndex: 2, memo: '基礎試験問題集　第13章　32' },
  { id: 'p2-33', text: "次のコードを実行し、期待する結果が表示されるとき、【空欄①】～【空欄②】に入る記述の組み合わせとして正しいものはどれか\n\nclass Shinosuke:\n    def __init__(self):\n        self.verbal_tic = 'dazo'\n\n    def sing(self):\n        【空欄①】\n        print(verbal_tic)\n        print(self.verbal_tic)\n        【空欄②】\n        print(self.verbal_tic)\n        print(verbal_tic)\n\nshinnosuke = Shinosuke()\nshinnosuke.sing()\n\n＜期待する結果＞\nora\ndazo\nho ho-i\nora", choices: ["①self.verbal_tic = 'dazo'\n②verbal_tic = 'ora'", "①self.verbal_tic = 'ho ho-i'\n②verbal_tic = 'ora'", "①verbal_tic = 'ora'\n②self.verbal_tic = 'ho ho-i'", "①verbal_tic = 'ora'\n②self.verbal_tic = 'dazo'"], correctIndex: 2, memo: '基礎試験問題集　第13章　33' },
  { id: 'p2-34', text: "globモジュールを使い、カレントディレクトリにある拡張子が.txtであるファイル名のリストを取得する方法として正しいものはどれか", choices: ["glob.glob('.txt')", "glob.findall('.txt')", "glob.glob('*.txt')", "glob.findall('*.txt')"], correctIndex: 2, memo: '基礎試験問題集　第13章　34' },
  { id: 'p2-35', text: "次のファイルmain.pyを「python main.py --command=show tokyo osaka」と実行した結果はどれか\n\nimport argparse\n\nparser = argparse.ArgumentParser()\nparser.add_argument('--command')\nparser.add_argument('target', nargs='+')\nargs = parser.parse_args()\nprint(args)", choices: ["Namespace(command=['show', 'tokyo', 'osaka'])", "Namespace(target='show', 'tokyo', 'osaka'])", "Namespace(command=['show'], target=[ 'tokyo', 'osaka'])", "Namespace(command='show', target=[ 'tokyo', 'osaka'])"], correctIndex: 3, memo: '基礎試験問題集　第13章　35' },
  { id: 'p2-36', text: "次のコードの説明として、誤っているのはどれか\n\nimport re\n\ns = 'bling bang bang bong'\nprint(re.sub(r'([a-z]+) \\1', r'\\1', s))", choices: ['reモジュールは、正規表現で文字列の処理ができる', 're.subは特定のパターンを変換する関数である', '出力は「bling bang bong」となる', "print(s.replace('bang ', ''))と同じ出力となる"], correctIndex: 3, memo: '基礎試験問題集　第13章　36' },
  { id: 'p2-37', text: "次のコードを「-m unittest」を付けて実行し、以下の実行結果が表示されるとき、【空欄①】に入る記述として正しいものはどれか\n\nimport unittest\n\nclass TestApplication(unittest.TestCase):\n    def mytest(self):\n        actual = 'Chiba'\n        expected = 'Tokyo'\n        【空欄①】\n\n<実行結果＞\n（略）\nAssertionError: 'Chiba' != 'Tokyo'\n- Chiba\n+ Tokyo\n（略）", choices: ['self.assert(actual == expected)', 'self.assertEqual(actual, expected)', 'self.assertEqual(actual == expected)', 'assert actual == expected'], correctIndex: 1, memo: '基礎試験問題集　第13章　37' },
  { id: 'p2-38', text: "次のコードを実行し、期待する結果が表示されるとき、【空欄①】に入る記述として正しいものはどれか\n\ntext = [f'{i} sheep jumped a fence.' for i in range(1,4)]\n【空欄①】\n\n＜期待する結果＞\n1 sheep jumped a fence.,\n2 sheep jumped a fence.,\n3 sheep jumped a fence.", choices: ["import textwrap\n\nprint(textwrap.fill(', '.join(text), width=24))", 'print(text)', "import pprint\n\npprint.pprint(text)\n", "print('\\n'.join(text))"], correctIndex: 0, memo: '基礎試験問題集　第13章　38' },
  { id: 'p2-39', text: '仮想環境の特徴として、誤っているのはどれか', choices: ['仮想環境をアクティベートすると、プロンプトが変わる', '仮想環境が複数あるとき、異なるパッケージをそれぞれの仮想環境にインストールができる', '仮想環境のパッケージのパッケージのバージョンを変更すると、別の仮想環境に影響する', '仮想環境が複数あるとき、Pythonの異なるバージョンを指定できる'], correctIndex: 2, memo: '基礎試験問題集　第13章　39' },
  { id: 'p2-40', text: '対話モードでの入力履歴はファイルに保存されるが、このファイル名はどれか', choices: ['.command_history', '.python_history', 'command_history', 'python_histrory'], correctIndex: 1, memo: '基礎試験問題集　第13章　40' }
];

const App: React.FC = () => {
  const [currentState, setCurrentState] = useState<AppState>(AppState.HOME);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);

  const prepareAndStartQuiz = useCallback((rawQuestions: Question[]) => {
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

    const shuffledQuestions = [...processedQuestions].sort(() => Math.random() - 0.5);

    setQuestions(shuffledQuestions);
    setStartTime(Date.now());
    setCurrentState(AppState.QUIZ);
  }, []);

  const handleStartPredefined = useCallback((setNumber: 1 | 2) => {
    const selectedSet = setNumber === 1 ? QUESTIONS_SET_1 : QUESTIONS_SET_2;
    prepareAndStartQuiz(selectedSet);
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

      <div className="print-only p-8 border-b-4 border-slate-800 mb-8 bg-white">
        <h1 className="text-4xl font-black text-slate-900">クイズ学習 実施結果レポート</h1>
        <p className="text-slate-500 mt-2 font-bold">Senju Soft - システム生成ドキュメント</p>
        <p className="text-slate-400 text-sm">生成日時: {new Date().toLocaleString('ja-JP', { dateStyle: 'long', timeStyle: 'medium' })}</p>
      </div>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 flex-grow w-full">
        {currentState === AppState.HOME && (
          <Home onStartPredefined={handleStartPredefined} onGoToUpload={goToUploader} />
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
