import { useState } from 'react';
import type { FamilyMember, LabReport } from '../types';
import { MemberList } from '../components/members/MemberList';
import { MemberForm } from '../components/members/MemberForm';
import { Plus } from 'lucide-react';

interface MembersPageProps {
  members: FamilyMember[];
  allReports: LabReport[];
  onAddMember: (member: Omit<FamilyMember, 'id'>) => void;
  onUpdateMember: (member: FamilyMember) => void;
  onDeleteMember: (id: string) => void;
  onSelectMember: (id: string) => void;
}

export function MembersPage({ members, allReports, onAddMember, onUpdateMember, onDeleteMember, onSelectMember }: MembersPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<FamilyMember | undefined>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">Family Members</h2>
        <button
          onClick={() => { setEditing(undefined); setShowForm(true); }}
          className="flex items-center gap-1.5 px-3 py-2 text-sm bg-medical-600 text-white rounded-lg hover:bg-medical-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      <MemberList
        members={members}
        allReports={allReports}
        onEdit={(m) => { setEditing(m); setShowForm(true); }}
        onDelete={onDeleteMember}
        onSelect={onSelectMember}
        onAdd={() => setShowForm(true)}
      />

      <MemberForm
        open={showForm}
        onClose={() => { setShowForm(false); setEditing(undefined); }}
        onSave={(member) => {
          if ('id' in member) {
            onUpdateMember(member as FamilyMember);
          } else {
            onAddMember(member);
          }
        }}
        initial={editing}
      />
    </div>
  );
}
