import type { Exercise, DifficultyLevel } from '../types';
import { getBodyPartColor } from '../utils/bodyPartColors';

interface ExerciseCardProps {
  exercise: Exercise;
  selected: boolean;
  selectedDifficulty?: DifficultyLevel;
  onSelect: () => void;
  onDifficultyChange?: (difficulty: DifficultyLevel) => void;
}

export default function ExerciseCard({
  exercise,
  selected,
  selectedDifficulty,
  onSelect,
  onDifficultyChange,
}: ExerciseCardProps) {
  const difficulties: DifficultyLevel[] = ['easy', 'medium', 'hard'];

  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-sm transition-all cursor-pointer ${
        selected
          ? 'border-2 border-coral-500 shadow-lg'
          : 'border-2 border-gray-100 hover:border-coral-300'
      }`}
      onClick={!selected ? onSelect : undefined}
    >
      <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-gray-50">
        <img
          src={exercise.image}
          alt={exercise.name}
          className="w-full h-full object-contain"
        />
      </div>

      <h3 className="text-xl font-semibold mb-1">{exercise.name}</h3>
      <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>

      <div className="flex flex-wrap gap-1 mb-4">
        {exercise.bodyParts.map((part) => {
          const colors = getBodyPartColor(part);
          return (
            <span
              key={part}
              className={`text-xs px-2 py-1 ${colors.bg} ${colors.text} rounded-lg font-medium`}
            >
              {part}
            </span>
          );
        })}
      </div>

      {selected && onDifficultyChange && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Difficulty</p>
          <div className="grid grid-cols-3 gap-2">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                onClick={(e) => {
                  e.stopPropagation();
                  onDifficultyChange(difficulty);
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDifficulty === difficulty
                    ? 'bg-coral-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                <span className="block text-xs opacity-75">
                  {exercise.timers[difficulty]}s
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
