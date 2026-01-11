import { Link } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore';
import presetSessionsData from '../data/presetSessions.json';
import type { PresetSession } from '../types';

const presetSessions = presetSessionsData.presetSessions as PresetSession[];

export default function Home() {
  const { getRecentSessions, soundEnabled, toggleSound } = useSessionStore();
  const recentSessions = getRecentSessions(5);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-5xl font-serif font-bold text-gray-900 mb-2">
            Your Workout Journey
          </h1>
          <p className="text-gray-600">Choose a session or create your own</p>
        </header>

        {/* Settings Toggle */}
        <div className="mb-8 flex items-center gap-3">
          <button
            onClick={toggleSound}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-gray-200 hover:border-coral-500 transition-colors"
          >
            <span className="text-xl">{soundEnabled ? '🔊' : '🔇'}</span>
            <span className="text-sm font-medium">
              Sound {soundEnabled ? 'On' : 'Off'}
            </span>
          </button>
        </div>

        {/* Recent Sessions */}
        {recentSessions.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-4">Recent Sessions</h2>
            <div className="grid grid-cols-1 gap-4">
              {recentSessions.map((session, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{session.sessionName}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(session.completedAt).toLocaleDateString()} •{' '}
                        {Math.floor(session.duration / 60)} min •{' '}
                        {session.exercisesCompleted} exercises
                      </p>
                    </div>
                    {session.feeling && (
                      <span className="text-3xl">
                        {session.feeling === 'exhausted' && '😫'}
                        {session.feeling === 'ok' && '😐'}
                        {session.feeling === 'good' && '😊'}
                        {session.feeling === 'fire' && '🔥'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Create Custom Session */}
        <section className="mb-12">
          <Link
            to="/create"
            className="block w-full bg-coral-500 hover:bg-coral-600 text-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
          >
            <div className="text-5xl mb-3">➕ 🏋️</div>
            <h3 className="text-2xl font-serif font-bold mb-2">
              Create Session
            </h3>
            <p className="text-coral-100">Build your own workout from scratch</p>
          </Link>
        </section>

        {/* Preset Sessions */}
        <section>
          <h2 className="text-2xl font-serif font-bold mb-4">Preset Workouts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {presetSessions.map((session) => (
              <Link
                key={session.id}
                to={`/session/${session.id}`}
                className="group"
              >
                <div
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-coral-500 cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${session.color}15 0%, white 100%)`,
                  }}
                >
                  <div className="text-3xl mb-3">{session.emoji}</div>
                  <h3 className="text-lg font-serif font-bold mb-1 text-gray-900">
                    {session.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{session.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{session.exercises.length} exercises</span>
                    <span>•</span>
                    <span>{session.transitionTimer}s transitions</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
