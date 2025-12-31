export enum CurrencyType {
  Coin = 'COIN',
  Bill = 'BILL'
}

export interface Denomination {
  value: number; // Value in TND (e.g., 0.050, 10.000)
  label: string;
  displayValue: string; // Short text for icon (e.g., "50", "1")
  type: CurrencyType;
  colorClass: string; // Tailwind color class helper
  id: string;
}

export interface Batch {
  id: string;
  denominationValue: number;
  count: number; // How many coins/bills in this batch
  totalValue: number; // denominationValue * count
  isCompleted: boolean;
  completedAt?: number; // Timestamp
}

export interface GoalConfig {
  name: string;
  targetAmount: number;
  durationDays: number;
  startDate: number;
  selectedDenominations: number[]; // Array of values
}

export interface Goal {
  id: string;
  config: GoalConfig;
  batches: Batch[];
}

export interface AppState {
  goals: Goal[];
  activeGoalId: string | null; // ID of the goal currently being viewed
  isCreating: boolean; // UI state for showing creation screen
}