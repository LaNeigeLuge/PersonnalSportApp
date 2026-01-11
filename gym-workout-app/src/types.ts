// App types
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  bodyParts: string[];
  image: string;
  timers: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export interface SessionExercise {
  exerciseId: string;
  difficulty: DifficultyLevel;
}

export interface SessionBreak {
  type: 'break';
  duration: number;
}

export type SessionItem = SessionExercise | SessionBreak;

export interface PresetSession {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  transitionTimer: number;
  exercises: SessionItem[];
}

export interface CustomSession {
  id: string;
  name: string;
  createdAt: string;
  transitionTimer: number;
  exercises: SessionItem[];
}

export interface CompletedSession {
  sessionId: string;
  sessionName: string;
  completedAt: string;
  duration: number;
  exercisesCompleted: number;
  feeling?: 'exhausted' | 'ok' | 'good' | 'fire';
}

export interface ActiveSessionState {
  currentIndex: number;
  isPaused: boolean;
  timeRemaining: number;
  session: PresetSession | CustomSession;
}
