import type { LabTest } from '../../types';
import { StatusBadge } from '../tests/StatusBadge';

interface HealthSummaryCardProps {
  category: string;
  tests: Array<LabTest & { reportDate: string }>;
}

export function HealthSummaryCard({ category, tests }: HealthSummaryCardProps) {
  const abnormal = tests.filter((t) => t.status !== 'normal');
  const allNormal = abnormal.length === 0;

  return (
    <div className={`rounded-2xl border p-4 ${allNormal ? 'border-success-100 bg-success-50/30' : 'border-danger-100 bg-danger-50/30'}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm text-slate-700">{category}</h4>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          allNormal ? 'bg-success-100 text-success-600' : 'bg-danger-100 text-danger-600'
        }`}>
          {allNormal ? 'All Normal' : `${abnormal.length} Abnormal`}
        </span>
      </div>
      <div className="space-y-2">
        {tests.slice(0, 5).map((t, i) => (
          <div key={`${t.testName}-${i}`} className="flex items-center justify-between text-sm">
            <span className="text-slate-600">{t.testName}</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-800">{t.value} <span className="text-slate-400">{t.unit}</span></span>
              <StatusBadge status={t.status} />
            </div>
          </div>
        ))}
        {tests.length > 5 && (
          <p className="text-xs text-slate-400">+{tests.length - 5} more</p>
        )}
      </div>
    </div>
  );
}
