import { useState } from 'react';
import type { FamilyMember, LabReport } from '../types';
import { ReportUpload } from '../components/reports/ReportUpload';
import { ReportList } from '../components/reports/ReportList';
import { ReportForm } from '../components/reports/ReportForm';
import { EmptyState } from '../components/ui/EmptyState';
import { FileText, Plus } from 'lucide-react';

interface ReportsPageProps {
  members: FamilyMember[];
  reports: LabReport[];
  selectedMemberId: string | null;
  onAddReport: (report: LabReport) => void;
  onUpdateReport: (report: LabReport) => void;
  onDeleteReport: (id: string) => void;
  ollamaConnected: boolean;
  onNavigate: (page: 'members') => void;
}

export function ReportsPage({
  members,
  reports,
  selectedMemberId,
  onAddReport,
  onUpdateReport,
  onDeleteReport,
  ollamaConnected,
  onNavigate,
}: ReportsPageProps) {
  const [showManualForm, setShowManualForm] = useState(false);

  const member = selectedMemberId ? members.find((m) => m.id === selectedMemberId) : members[0];

  if (!member) {
    return (
      <EmptyState
        icon={<FileText className="w-16 h-16" />}
        title="No member selected"
        description="Add a family member first, then upload reports for them."
        action={
          <button
            onClick={() => onNavigate('members')}
            className="px-4 py-2 bg-medical-600 text-white rounded-lg hover:bg-medical-700 transition-colors"
          >
            Add Family Member
          </button>
        }
      />
    );
  }

  const memberReports = reports
    .filter((r) => r.memberId === member.id)
    .sort((a, b) => b.reportDate.localeCompare(a.reportDate));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">
          Reports for {member.name}
        </h2>
        <button
          onClick={() => setShowManualForm(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Manual Entry
        </button>
      </div>

      <ReportUpload
        memberId={member.id}
        onReportExtracted={onAddReport}
        ollamaConnected={ollamaConnected}
      />

      <ReportList
        reports={memberReports}
        onUpdate={onUpdateReport}
        onDelete={onDeleteReport}
      />

      <ReportForm
        open={showManualForm}
        onClose={() => setShowManualForm(false)}
        onSave={onAddReport}
        memberId={member.id}
      />
    </div>
  );
}
