// Color coding for different body parts
export const bodyPartColors: Record<string, { bg: string; text: string }> = {
  // Core & Abs
  Core: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  Abs: { bg: 'bg-yellow-100', text: 'text-yellow-700' },

  // Upper body
  Shoulders: { bg: 'bg-blue-100', text: 'text-blue-700' },
  Chest: { bg: 'bg-blue-100', text: 'text-blue-700' },
  Back: { bg: 'bg-blue-100', text: 'text-blue-700' },
  Arms: { bg: 'bg-blue-100', text: 'text-blue-700' },

  // Lower body
  Glutes: { bg: 'bg-purple-100', text: 'text-purple-700' },
  Legs: { bg: 'bg-green-100', text: 'text-green-700' },
  Hamstrings: { bg: 'bg-green-100', text: 'text-green-700' },
  Quads: { bg: 'bg-green-100', text: 'text-green-700' },
  Calves: { bg: 'bg-green-100', text: 'text-green-700' },

  // Cardio
  Cardio: { bg: 'bg-red-100', text: 'text-red-700' },

  // Default
  default: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

export const getBodyPartColor = (bodyPart: string) => {
  return bodyPartColors[bodyPart] || bodyPartColors.default;
};
