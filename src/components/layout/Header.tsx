import type { FamilyMember } from '../../types';
import { Activity, Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  members: FamilyMember[];
  selectedMemberId: string | null;
  onSelectMember: (id: string | null) => void;
  ollamaConnected: boolean;
}

export function Header({ members, selectedMemberId, onSelectMember, ollamaConnected }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-7 h-7 text-medical-600" />
          <h1 className="text-xl font-bold text-slate-800">MedTrack</h1>
        </div>

        <div className="flex items-center gap-3">
          {members.length > 0 && (
            <select
              value={selectedMemberId ?? ''}
              onChange={(e) => onSelectMember(e.target.value || null)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-medical-500"
            >
              <option value="">All Members</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          )}

          <div
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${
              ollamaConnected ? 'bg-success-50 text-success-600' : 'bg-slate-100 text-slate-400'
            }`}
            title={ollamaConnected ? 'Ollama connected' : 'Ollama offline'}
          >
            {ollamaConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">AI</span>
          </div>
        </div>
      </div>
    </header>
  );
}
