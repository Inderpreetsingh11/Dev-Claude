import type { FamilyMember, LabReport } from '../types';
import { DashboardView } from '../components/dashboard/DashboardView';
import { EmptyState } from '../components/ui/EmptyState';
import { LayoutDashboard } from 'lucide-react';

interface DashboardPageProps {
  members: FamilyMember[];
  reports: LabReport[];
  selectedMemberId: string | null;
  onNavigate: (page: 'members') => void;
}

export function DashboardPage({ members, reports, selectedMemberId, onNavigate }: DashboardPageProps) {
  const member = selectedMemberId ? members.find((m) => m.id === selectedMemberId) : members[0];

  if (!member) {
    return (
      <EmptyState
        icon={<LayoutDashboard className="w-16 h-16" />}
        title="Welcome to MedTrack"
        description="Add a family member to start tracking lab results."
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

  return <DashboardView member={member} reports={memberReports} />;
}
