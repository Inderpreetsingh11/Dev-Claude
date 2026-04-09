import { useMemo, useState } from 'react';
import type { LabReport } from '../../types';
import { Search } from 'lucide-react';

interface MarkerSelectorProps {
  reports: LabReport[];
  selected: string | null;
  onSelect: (marker: string) => void;
}

export function MarkerSelector({ reports, selected, onSelect }: MarkerSelectorProps) {
  const [search, setSearch] = useState('');

  const markers = useMemo(() => {
    const map = new Map<string, { count: number; categories: Set<string> }>();
    for (const report of reports) {
      for (const test of report.tests) {
        const existing = map.get(test.testName);
        if (existing) {
          existing.count++;
          existing.categories.add(test.category);
        } else {
          map.set(test.testName, { count: 1, categories: new Set([test.category]) });
        }
      }
    }
    return [...map.entries()]
      .map(([name, { count, categories }]) => ({
        name,
        count,
        category: [...categories][0],
      }))
      .sort((a, b) => b.count - a.count);
  }, [reports]);

  const filtered = search
    ? markers.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
    : markers;

  const grouped = useMemo(() => {
    const groups: Record<string, typeof filtered> = {};
    for (const m of filtered) {
      const cat = m.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(m);
    }
    return groups;
  }, [filtered]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4">
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search markers..."
          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-medical-500"
        />
      </div>

      <div className="max-h-[500px] overflow-y-auto space-y-4">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{category}</div>
            <div className="space-y-0.5">
              {items.map((m) => (
                <button
                  key={m.name}
                  onClick={() => onSelect(m.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                    selected === m.name
                      ? 'bg-medical-50 text-medical-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{m.name}</span>
                  <span className="text-xs text-slate-400">{m.count}x</span>
                </button>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">No markers found</p>
        )}
      </div>
    </div>
  );
}
