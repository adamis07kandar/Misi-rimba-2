/**
 * Data structures and types for Detective Room Game
 */

export type DifficultyLevel = 'mudah' | 'sederhana' | 'susah';

export interface DetectiveQuestion {
  id: string;
  level: DifficultyLevel;
  clueTitle: string;
  clueIcon: string;
  clueLocationName: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  points: number;
  narrativeContext: string;
}

export interface AgentProfile {
  name: string;
  classroom: string;
  school: string;
  agentId: string;
  certificateCode: string;
  startedAt: number;
}

export interface QuestionResult {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  pointsEarned: number;
  timeSpentSeconds: number;
}

export interface PerformanceAnalysis {
  totalScore: number;
  maxScore: number;
  percentage: number;
  correctCount: number;
  totalQuestions: number;
  accuracyRate: number;
  timeTakenFormatted: string;
  totalSeconds: number;
  rankTitle: string;
  rankGrade: 'A+' | 'A' | 'B+' | 'B' | 'C';
  rankDescription: string;
  metrics: {
    observation: number; // Ketelitian (0-100)
    deduction: number;   // Logik Deduktif (0-100)
    agility: number;     // Ketangkasan Jari / Masa (0-100)
    comprehension: number; // Kefahaman Teks (0-100)
  };
  answersBreakdown: Array<{
    questionId: string;
    level: DifficultyLevel;
    clueTitle: string;
    isCorrect: boolean;
    points: number;
    maxPoints: number;
  }>;
}

export type GameScreen = 'registration' | 'room' | 'results' | 'certificate';
