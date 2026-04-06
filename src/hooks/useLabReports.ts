import { useCallback, useMemo } from 'react';
import type { LabReport } from '../types';
import { useLocalStorage } from './useLocalStorage';

export function useLabReports(memberId?: string) {
  const [allReports, setReports] = useLocalStorage<LabReport[]>('medtrack:reports', []);

  const reports = useMemo(
    () =>
      memberId
        ? allReports.filter((r) => r.memberId === memberId).sort((a, b) => b.reportDate.localeCompare(a.reportDate))
        : allReports.sort((a, b) => b.reportDate.localeCompare(a.reportDate)),
    [allReports, memberId],
  );

  const addReport = useCallback(
    (report: LabReport) => {
      setReports((prev) => [...prev, report]);
    },
    [setReports],
  );

  const updateReport = useCallback(
    (report: LabReport) => {
      setReports((prev) => prev.map((r) => (r.id === report.id ? report : r)));
    },
    [setReports],
  );

  const deleteReport = useCallback(
    (id: string) => {
      setReports((prev) => prev.filter((r) => r.id !== id));
    },
    [setReports],
  );

  return { reports, allReports, addReport, updateReport, deleteReport };
}
