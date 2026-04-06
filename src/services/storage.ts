import type { FamilyMember, LabReport, NormalizationMap, AppSettings } from '../types';
import { DEFAULT_SETTINGS } from '../types';

const KEYS = {
  members: 'medtrack:members',
  reports: 'medtrack:reports',
  normMap: 'medtrack:normalization-map',
  settings: 'medtrack:settings',
} as const;

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function set(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Members
export function getMembers(): FamilyMember[] {
  return get<FamilyMember[]>(KEYS.members, []);
}

export function saveMembers(members: FamilyMember[]): void {
  set(KEYS.members, members);
}

// Reports
export function getReports(): LabReport[] {
  return get<LabReport[]>(KEYS.reports, []);
}

export function getReportsForMember(memberId: string): LabReport[] {
  return getReports().filter((r) => r.memberId === memberId);
}

export function saveReports(reports: LabReport[]): void {
  set(KEYS.reports, reports);
}

export function addReport(report: LabReport): void {
  const reports = getReports();
  reports.push(report);
  saveReports(reports);
}

export function updateReport(report: LabReport): void {
  const reports = getReports().map((r) => (r.id === report.id ? report : r));
  saveReports(reports);
}

export function deleteReport(id: string): void {
  saveReports(getReports().filter((r) => r.id !== id));
}

// Normalization Map
export function getNormalizationMap(): NormalizationMap {
  return get<NormalizationMap>(KEYS.normMap, {});
}

export function updateNormalizationMap(map: NormalizationMap): void {
  const existing = getNormalizationMap();
  set(KEYS.normMap, { ...existing, ...map });
}

// Settings
export function getSettings(): AppSettings {
  return get<AppSettings>(KEYS.settings, DEFAULT_SETTINGS);
}

export function saveSettings(settings: AppSettings): void {
  set(KEYS.settings, settings);
}

// Export / Import
export function exportAllData(): string {
  return JSON.stringify({
    members: getMembers(),
    reports: getReports(),
    normalizationMap: getNormalizationMap(),
    settings: getSettings(),
    exportedAt: new Date().toISOString(),
  }, null, 2);
}

export function importData(json: string): void {
  const data = JSON.parse(json) as {
    members?: FamilyMember[];
    reports?: LabReport[];
    normalizationMap?: NormalizationMap;
    settings?: AppSettings;
  };
  if (data.members) saveMembers(data.members);
  if (data.reports) saveReports(data.reports);
  if (data.normalizationMap) set(KEYS.normMap, data.normalizationMap);
  if (data.settings) saveSettings(data.settings);
}
