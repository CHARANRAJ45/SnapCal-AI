
export enum Goal {
  LoseWeight = 'lose-weight',
  MaintainWeight = 'maintain-weight',
  GainWeight = 'gain-weight',
}

export interface User {
  id: string;
  email: string;
  goal: Goal | null;
  // Optional stored password hash for mock backend use. Not expected in public responses.
  passwordHash?: string;
}

export interface NutritionInfo {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodLog extends NutritionInfo {
  id: string;
  userId: string;
  createdAt: string; // ISO string
  imageUrl?: string; // Storing base64 for demo
}
