import type { FamilyMember, LabReport } from '../../types';
import { MemberCard } from './MemberCard';
import { EmptyState } from '../ui/EmptyState';
import { Users, Plus } from 'lucide-react';

interface MemberListProps {
  members: FamilyMember[];
  allReports: LabReport[];
  onEdit: (member: FamilyMember) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  onAdd: () => void;
}

export function MemberList({ members, allReports, onEdit, onDelete, onSelect, onAdd }: MemberListProps) {
  if (members.length === 0) {
    return (
      <EmptyState
        icon={<Users className="w-16 h-16" />}
        title="No family members yet"
        description="Add your first family member to start tracking their lab results."
        action={
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-medical-600 text-white rounded-lg hover:bg-medical-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Member
          </button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((m) => (
        <MemberCard
          key={m.id}
          member={m}
          reportCount={allReports.filter((r) => r.memberId === m.id).length}
          onEdit={() => onEdit(m)}
          onDelete={() => onDelete(m.id)}
          onSelect={() => onSelect(m.id)}
        />
      ))}
    </div>
  );
}
