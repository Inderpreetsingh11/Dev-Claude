import type { LabTest } from '../../types';
import { StatusBadge } from './StatusBadge';

interface TestResultRowProps {
  test: LabTest;
  onEdit?: () => void;
}

export function TestResultRow({ test, onEdit }: TestResultRowProps) {
  const min = test.referenceMin;
  const max = test.referenceMax;
  const hasRange = min !== null && max !== null;

  let barPercent = 50;
  if (hasRange && max! > min!) {
    barPercent = Math.max(0, Math.min(100, ((test.value - min!) / (max! - min!)) * 100));
  }

  return (
    <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={onEdit}>
      <td className="py-3 px-4">
        <div className="font-medium text-sm text-slate-800">{test.testName}</div>
        {test.originalName !== test.testName && (
          <div className="text-xs text-slate-400">{test.originalName}</div>
        )}
      </td>
      <td className="py-3 px-4 text-sm font-mono">
        {test.value} <span className="text-slate-400">{test.unit}</span>
      </td>
      <td className="py-3 px-4 text-sm text-slate-500">
        {hasRange ? `${min} - ${max}` : '-'}
      </td>
      <td className="py-3 px-4">
        {hasRange && (
          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                test.status === 'normal' ? 'bg-success-500' : test.status === 'high' ? 'bg-danger-500' : 'bg-warning-500'
              }`}
              style={{ width: `${barPercent}%` }}
            />
          </div>
        )}
      </td>
      <td className="py-3 px-4">
        <StatusBadge status={test.status} />
      </td>
    </tr>
  );
}
