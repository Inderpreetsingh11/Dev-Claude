import { useState } from 'react';
import type { FamilyMember, LabReport } from '../types';
import { TrendChart } from '../components/trends/TrendChart';
import { MarkerSelector } from '../components/trends/MarkerSelector';
import { EmptyState } from '../components/ui/EmptyState';
import { TrendingUp } from 'lucide-react';

interface TrendsPageProps {
  members: FamilyMember[];
  reports: LabReport[];
  selectedMemberId: string | null;
}

export function TrendsPage({ members, reports, selectedMemberId }: TrendsPageProps) {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  const member = selectedMemberId ? members.find((m) => m.id === selectedMemberId) : members[0];

  if (!member) {
    return (
      <EmptyState
        icon={<TrendingUp className="w-16 h-16" />}
        title="No member selected"
        description="Select a family member to view their trends."
      />
    );
  }

  const memberReports = reports.filter((r) => r.memberId === member.id);

  if (memberReports.length === 0) {
    return (
      <EmptyState
        icon={<TrendingUp className="w-16 h-16" />}
        title="No reports yet"
        description={`Upload lab reports for ${member.name} to see trends.`}
      />
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Trends for {member.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <MarkerSelector reports={memberReports} selected={selectedMarker} onSelect={setSelectedMarker} />
        </div>
        <div className="md:col-span-2">
          {selectedMarker ? (
            <TrendChart reports={memberReports} markerName={selectedMarker} />
          ) : (
            <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-slate-100 text-slate-400 text-sm">
              Select a marker to view its trend
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
