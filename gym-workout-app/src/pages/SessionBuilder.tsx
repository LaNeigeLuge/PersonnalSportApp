import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore';
import ExerciseCard from '../components/ExerciseCard';
import exercisesData from '../data/exercises.json';
import type { Exercise, DifficultyLevel, SessionItem, CustomSession } from '../types';

const exercises = exercisesData.exercises as Exercise[];

interface SelectedExercise {
  exerciseId: string;
  difficulty: DifficultyLevel;
}

export default function SessionBuilder() {
  const navigate = useNavigate();
  const { addCustomSession } = useSessionStore();

  const [sessionName, setSessionName] = useState('');
  const [transitionTimer, setTransitionTimer] = useState<5 | 10 | 15>(10);
  const [selectedExercises, setSelectedExercises] = useState<SessionItem[]>([]);
  const [currentlySelecting, setCurrentlySelecting] = useState<string | null>(null);
  const [filterBodyPart, setFilterBodyPart] = useState<string>('All');

  // Get unique body parts
  const allBodyParts = ['All', ...new Set(exercises.flatMap((e) => e.bodyParts))];

  // Filter exercises
  const filteredExercises =
    filterBodyPart === 'All'
      ? exercises
      : exercises.filter((e) => e.bodyParts.includes(filterBodyPart));

  const handleExerciseSelect = (exerciseId: string) => {
    setCurrentlySelecting(exerciseId);
  };

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    if (currentlySelecting) {
      setSelectedExercises([
        ...selectedExercises,
        { exerciseId: currentlySelecting, difficulty },
      ]);
      setCurrentlySelecting(null);
    }
  };

  const handleAddBreak = () => {
    const duration = parseInt(prompt('Break duration in seconds?') || '60');
    if (duration && duration > 0) {
      setSelectedExercises([...selectedExercises, { type: 'break', duration }]);
    }
  };

  const handleRemoveItem = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const handleSaveSession = () => {
    if (!sessionName.trim()) {
      alert('Please enter a session name');
      return;
    }
    if (selectedExercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    const session: CustomSession = {
      id: `custom-${Date.now()}`,
      name: sessionName,
      createdAt: new Date().toISOString(),
      transitionTimer,
      exercises: selectedExercises,
    };

    addCustomSession(session);
    navigate(`/session/${session.id}`);
  };

  const getExerciseById = (id: string) => exercises.find((e) => e.id === id);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-coral-600 hover:text-coral-700 mb-4 flex items-center gap-2"
          >
            ← Back to Home
          </button>
          <h1 className="text-5xl font-serif font-bold text-gray-900 mb-2">
            Create Your Session
          </h1>
          <p className="text-gray-600">Build a custom workout tailored to your goals</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Exercise Selection */}
          <div className="lg:col-span-2">
            {/* Session Name */}
            <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Name
              </label>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="e.g., Morning Core Routine"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-coral-500 focus:outline-none"
              />
            </div>

            {/* Transition Timer */}
            <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Transition Timer (between exercises)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[5, 10, 15].map((seconds) => (
                  <button
                    key={seconds}
                    onClick={() => setTransitionTimer(seconds as 5 | 10 | 15)}
                    className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                      transitionTimer === seconds
                        ? 'bg-coral-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {seconds}s
                  </button>
                ))}
              </div>
            </div>

            {/* Body Part Filter */}
            <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Filter by Body Part
              </label>
              <div className="flex flex-wrap gap-2">
                {allBodyParts.map((part) => (
                  <button
                    key={part}
                    onClick={() => setFilterBodyPart(part)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      filterBodyPart === part
                        ? 'bg-coral-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {part}
                  </button>
                ))}
              </div>
            </div>

            {/* Exercise List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredExercises.map((exercise) => {
                const isSelecting = currentlySelecting === exercise.id;
                return (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    selected={isSelecting}
                    selectedDifficulty={isSelecting ? undefined : undefined}
                    onSelect={() => handleExerciseSelect(exercise.id)}
                    onDifficultyChange={handleDifficultySelect}
                  />
                );
              })}
            </div>
          </div>

          {/* Right: Session Builder */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-3xl p-6 shadow-lg">
              <h2 className="text-2xl font-serif font-bold mb-4">Your Session</h2>

              {selectedExercises.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No exercises added yet
                </p>
              ) : (
                <div className="space-y-3 mb-6">
                  {selectedExercises.map((item, index) => {
                    if ('type' in item && item.type === 'break') {
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-blue-50 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">☕</span>
                            <div>
                              <p className="font-medium text-blue-900">Break</p>
                              <p className="text-sm text-blue-600">{item.duration}s</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    }

                    const exercise = getExerciseById(item.exerciseId);
                    if (!exercise) return null;

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-coral-50 rounded-xl"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{exercise.name}</p>
                          <p className="text-sm text-gray-600">
                            {item.difficulty} • {exercise.timers[item.difficulty]}s
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                onClick={handleAddBreak}
                className="w-full mb-4 px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-xl font-medium transition-colors"
              >
                + Add Break
              </button>

              <button
                onClick={handleSaveSession}
                disabled={selectedExercises.length === 0 || !sessionName.trim()}
                className="w-full px-6 py-4 bg-coral-500 hover:bg-coral-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg transition-colors"
              >
                Start Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
