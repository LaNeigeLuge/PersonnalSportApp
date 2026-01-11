import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CompletedSession, CustomSession } from '../types';

interface SessionStore {
  // History
  completedSessions: CompletedSession[];
  addCompletedSession: (session: CompletedSession) => void;
  getRecentSessions: (limit: number) => CompletedSession[];

  // Custom sessions
  customSessions: CustomSession[];
  addCustomSession: (session: CustomSession) => void;
  deleteCustomSession: (sessionId: string) => void;

  // Settings
  soundEnabled: boolean;
  toggleSound: () => void;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      // History
      completedSessions: [],
      addCompletedSession: (session) =>
        set((state) => ({
          completedSessions: [session, ...state.completedSessions],
        })),
      getRecentSessions: (limit) => {
        const sessions = get().completedSessions;
        return sessions.slice(0, limit);
      },

      // Custom sessions
      customSessions: [],
      addCustomSession: (session) =>
        set((state) => ({
          customSessions: [...state.customSessions, session],
        })),
      deleteCustomSession: (sessionId) =>
        set((state) => ({
          customSessions: state.customSessions.filter((s) => s.id !== sessionId),
        })),

      // Settings
      soundEnabled: true,
      toggleSound: () =>
        set((state) => ({
          soundEnabled: !state.soundEnabled,
        })),
    }),
    {
      name: 'gym-workout-storage',
    }
  )
);
