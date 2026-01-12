import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore';
import { audioManager, vibrate } from '../utils/audio';
import { getBodyPartColor } from '../utils/bodyPartColors';
import exercisesData from '../data/exercises.json';
import presetSessionsData from '../data/presetSessions.json';
import type { Exercise, PresetSession } from '../types';

const exercises = exercisesData.exercises as Exercise[];
const presetSessions = presetSessionsData.presetSessions as PresetSession[];

type SessionPhase = 'countdown' | 'exercise' | 'transition' | 'break' | 'complete';

export default function ActiveSession() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { soundEnabled, addCompletedSession, customSessions } = useSessionStore();

  // Find session
  const session =
    presetSessions.find((s) => s.id === sessionId) ||
    customSessions.find((s) => s.id === sessionId);

  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [phase, setPhase] = useState<SessionPhase>('countdown');
  const [timeRemaining, setTimeRemaining] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime] = useState(Date.now());
  const [completedCount, setCompletedCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  if (!session) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Session not found</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-coral-500 text-white rounded-xl"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const currentItem = session.exercises[currentItemIndex];
  const currentExercise =
    currentItem && 'exerciseId' in currentItem
      ? exercises.find((e) => e.id === currentItem.exerciseId)
      : null;

  // Timer logic
  useEffect(() => {
    if (isPaused || phase === 'complete') return;

    // Don't run timer for rep-based exercises during exercise phase
    if (phase === 'exercise' && currentExercise?.exerciseType === 'reps') {
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handlePhaseComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, phase, currentItemIndex]);

  const handlePhaseComplete = () => {
    if (phase === 'countdown') {
      // Start exercise
      if (currentItem && 'exerciseId' in currentItem) {
        const exercise = exercises.find((e) => e.id === currentItem.exerciseId);
        if (exercise) {
          setPhase('exercise');
          // Only start timer for timer-based exercises
          if (exercise.exerciseType === 'timer' || !exercise.exerciseType) {
            setTimeRemaining(exercise.timers[currentItem.difficulty]);
          } else {
            setTimeRemaining(0); // Rep-based exercises don't use timer
          }
          if (soundEnabled) {
            audioManager.exerciseStart();
            vibrate([200, 100, 200]);
          }
        }
      } else if (currentItem && 'type' in currentItem && currentItem.type === 'break') {
        setPhase('break');
        setTimeRemaining(currentItem.duration);
        if (soundEnabled) {
          audioManager.breakStart();
          vibrate(300);
        }
      }
    } else if (phase === 'exercise' || phase === 'break') {
      // Move to next or transition
      const nextIndex = currentItemIndex + 1;
      setCompletedCount((prev) => prev + 1);

      if (nextIndex >= session.exercises.length) {
        // Session complete
        setPhase('complete');
        setShowSummary(true);
        if (soundEnabled) {
          audioManager.sessionComplete();
          vibrate([200, 100, 200, 100, 400]);
        }
      } else {
        // Transition to next
        setPhase('transition');
        setTimeRemaining(session.transitionTimer);
        if (soundEnabled) {
          audioManager.transition();
          vibrate(100);
        }
      }
    } else if (phase === 'transition') {
      // Next exercise
      setCurrentItemIndex((prev) => prev + 1);
      setPhase('countdown');
      setTimeRemaining(3);
    }
  };

  const handlePause = () => setIsPaused(!isPaused);

  const handleSkip = () => {
    const nextIndex = currentItemIndex + 1;
    if (nextIndex >= session.exercises.length) {
      setPhase('complete');
      setShowSummary(true);
    } else {
      setCurrentItemIndex(nextIndex);
      setPhase('countdown');
      setTimeRemaining(3);
    }
  };

  const handleExtend = () => {
    setTimeRemaining((prev) => prev + 15);
  };

  const handleCompleteReps = () => {
    // For rep-based exercises, manually complete
    handlePhaseComplete();
  };

  const handleExit = () => {
    if (confirm('Are you sure you want to exit this session?')) {
      navigate('/');
    }
  };

  const handleSaveSummary = (feeling: 'exhausted' | 'ok' | 'good' | 'fire') => {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    addCompletedSession({
      sessionId: session.id,
      sessionName: session.name,
      completedAt: new Date().toISOString(),
      duration,
      exercisesCompleted: completedCount,
      feeling,
    });
    navigate('/');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        handlePause();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSkip();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleExit();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Summary Modal
  if (showSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coral-500 to-coral-600 p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-12 max-w-2xl w-full text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-4xl font-serif font-bold mb-4">Session Complete!</h1>
          <p className="text-xl text-gray-600 mb-8">
            You completed {completedCount} exercises in{' '}
            {Math.floor((Date.now() - startTime) / 60000)} minutes
          </p>

          <p className="text-lg font-medium mb-4">How did it feel?</p>
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { emoji: '😫', label: 'Exhausted', value: 'exhausted' as const },
              { emoji: '😐', label: 'Ok', value: 'ok' as const },
              { emoji: '😊', label: 'Good', value: 'good' as const },
              { emoji: '🔥', label: 'Fire!', value: 'fire' as const },
            ].map((feeling) => (
              <button
                key={feeling.value}
                onClick={() => handleSaveSummary(feeling.value)}
                className="p-6 bg-cream-100 hover:bg-coral-100 rounded-2xl transition-colors"
              >
                <div className="text-4xl mb-2">{feeling.emoji}</div>
                <div className="text-sm font-medium">{feeling.label}</div>
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-700"
          >
            Skip and go home
          </button>
        </div>
      </div>
    );
  }

  // Main session view
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-serif font-bold">{session.name}</h2>
            <p className="text-gray-400">
              Exercise {currentItemIndex + 1} of {session.exercises.length}
            </p>
          </div>
          <button
            onClick={handleExit}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl transition-colors"
          >
            Exit (Esc)
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 mb-12">
          <div
            className="bg-coral-500 h-3 rounded-full transition-all duration-300"
            style={{
              width: `${((currentItemIndex + 1) / session.exercises.length) * 100}%`,
            }}
          />
        </div>

        {/* Main Content */}
        <div className="text-center mb-12">
          {/* Phase Label */}
          <div className="mb-6">
            {phase === 'countdown' && (
              <span className="px-6 py-2 bg-yellow-500/20 text-yellow-300 rounded-full text-lg font-medium">
                Get Ready!
              </span>
            )}
            {phase === 'exercise' && (
              <span className="px-6 py-2 bg-coral-500/20 text-coral-300 rounded-full text-lg font-medium">
                Exercise
              </span>
            )}
            {phase === 'transition' && (
              <span className="px-6 py-2 bg-blue-500/20 text-blue-300 rounded-full text-lg font-medium">
                Transition
              </span>
            )}
            {phase === 'break' && (
              <span className="px-6 py-2 bg-green-500/20 text-green-300 rounded-full text-lg font-medium">
                Break Time
              </span>
            )}
          </div>

          {/* Timer or Reps Display */}
          {currentExercise && phase === 'exercise' && currentExercise.exerciseType === 'reps' ? (
            // Rep-based exercise display
            <div className="mb-8">
              <div className="text-6xl font-bold font-serif mb-4 text-coral-400">
                {currentExercise.reps}
              </div>
              <p className="text-2xl text-gray-400">séries × répétitions</p>
            </div>
          ) : (
            // Timer display
            <div className="text-9xl font-bold font-serif mb-8 tabular-nums">
              {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
            </div>
          )}

          {/* Exercise Info */}
          {currentExercise && phase !== 'transition' && (
            <>
              <h1 className="text-5xl font-serif font-bold mb-4">{currentExercise.name}</h1>
              <p className="text-xl text-gray-400 mb-8">{currentExercise.description}</p>

              {/* Exercise Image */}
              <div className="max-w-2xl mx-auto mb-8 bg-white/5 rounded-3xl p-8">
                <img
                  src={currentExercise.image}
                  alt={currentExercise.name}
                  className="w-full h-auto rounded-2xl"
                />
              </div>

              {/* Tips (for rep-based exercises) */}
              {currentExercise.tips && currentExercise.tips.length > 0 && phase === 'exercise' && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
                  <h3 className="text-lg font-semibold text-blue-300 mb-3">💡 Conseils</h3>
                  <ul className="text-left text-gray-300 space-y-2">
                    {currentExercise.tips.map((tip) => (
                      <li key={tip} className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Body Parts */}
              <div className="flex justify-center gap-2 mb-8">
                {currentExercise.bodyParts.map((part) => {
                  const colors = getBodyPartColor(part);
                  return (
                    <span
                      key={part}
                      className={`px-4 py-2 ${colors.bg} ${colors.text} rounded-xl text-sm font-medium`}
                    >
                      {part}
                    </span>
                  );
                })}
              </div>
            </>
          )}

          {phase === 'break' && (
            <div className="text-6xl mb-8">☕</div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {phase === 'exercise' && currentExercise?.exerciseType === 'reps' ? (
            // Rep-based exercise: Show "Terminer" button
            <button
              onClick={handleCompleteReps}
              className="px-12 py-6 bg-coral-500 hover:bg-coral-600 text-white rounded-2xl font-bold text-2xl transition-all shadow-lg hover:shadow-xl border-2 border-coral-400"
            >
              ✓ Terminer l'exercice
            </button>
          ) : (
            // Timer-based exercise: Show normal controls
            <>
              <button
                onClick={handlePause}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold text-lg transition-colors"
              >
                {isPaused ? '▶ Resume' : '⏸ Pause'} (Space)
              </button>

              {phase === 'exercise' && (
                <button
                  onClick={handleExtend}
                  className="px-8 py-4 bg-coral-500 hover:bg-coral-600 text-white rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl border-2 border-coral-400"
                >
                  ⏱️ +15s
                </button>
              )}

              <button
                onClick={handleSkip}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold text-lg transition-colors"
              >
                Skip (→)
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
