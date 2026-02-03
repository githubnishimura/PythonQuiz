
export interface Question {
  id: string;
  text: string;
  choices: string[];
  correctIndex: number;
  memo: string;
}

export interface UserAnswer {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  question: Question;
}

export enum AppState {
  HOME = 'HOME',
  UPLOADING = 'UPLOADING',
  QUIZ = 'QUIZ',
  RESULTS = 'RESULTS'
}
