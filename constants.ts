
import { Goal } from './types';

export const GOAL_CALORIE_TARGETS: Record<Goal, number> = {
  [Goal.LoseWeight]: 2000,
  [Goal.MaintainWeight]: 2500,
  [Goal.GainWeight]: 3000,
};

export const GOAL_DESCRIPTIONS: Record<Goal, { title: string; description: string }> = {
    [Goal.LoseWeight]: {
        title: 'Lose Weight',
        description: 'Create a calorie deficit to shed pounds.'
    },
    [Goal.MaintainWeight]: {
        title: 'Maintain Weight',
        description: 'Keep your current weight with a balanced diet.'
    },
    [Goal.GainWeight]: {
        title: 'Gain Weight',
        description: 'Build muscle and mass with a calorie surplus.'
    }
};
