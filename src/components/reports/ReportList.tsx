import type { LabReport } from '../../types';
import { ReportDetail } from './ReportDetail';
import { EmptyState } from '../ui/EmptyState';
import { FileText } from 'lucide-react';

interface ReportListProps {
  reports: LabReport[];
  onUpdate: (report: LabReport) => void;
  onDelete: (id: string) => void;
}

export function ReportList({ reports, onUpdate, onDelete }: ReportListProps) {
  if (reports.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="w-16 h-16" />}
        title="No reports yet"
        description="Upload a PDF lab report or add one manually to get started."
      />
    );
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <ReportDetail
          key={report.id}
          report={report}
          onUpdate={onUpdate}
          onDelete={() => onDelete(report.id)}
        />
      ))}
    </div>
  );
}
