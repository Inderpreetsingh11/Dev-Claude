export type TestStatus = 'normal' | 'high' | 'low';

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  avatarColor: string;
}

export interface LabTest {
  id: string;
  testName: string;
  originalName: string;
  value: number;
  unit: string;
  referenceMin: number | null;
  referenceMax: number | null;
  category: string;
  status: TestStatus;
}

export interface LabReport {
  id: string;
  memberId: string;
  labName: string;
  reportDate: string;
  uploadedAt: string;
  source: 'ai-extracted' | 'manual';
  tests: LabTest[];
}

export interface NormalizationMap {
  [rawName: string]: string;
}

export interface AppSettings {
  ollamaUrl: string;
  modelName: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  ollamaUrl: import.meta.env.VITE_OLLAMA_URL || (import.meta.env.DEV ? '/ollama' : 'http://localhost:11434'),
  modelName: 'gemma4:e4b',
};

export const AVATAR_COLORS = [
  '#14b8a6', '#6366f1', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
];

export const RELATIONSHIPS = [
  'Self', 'Spouse', 'Mother', 'Father', 'Son', 'Daughter',
  'Brother', 'Sister', 'Grandmother', 'Grandfather', 'Other',
];

export const CATEGORIES = [
  'CBC', 'Liver', 'Kidney', 'Lipid', 'Thyroid', 'Diabetes',
  'Vitamin', 'Mineral', 'Hormone', 'Urine', 'Cardiac', 'Other',
];
