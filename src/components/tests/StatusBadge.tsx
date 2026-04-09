import type { TestStatus } from '../../types';

const styles: Record<TestStatus, string> = {
  normal: 'bg-success-100 text-success-600',
  high: 'bg-danger-100 text-danger-600',
  low: 'bg-warning-100 text-warning-600',
};

const labels: Record<TestStatus, string> = {
  normal: 'Normal',
  high: 'High',
  low: 'Low',
};

export function StatusBadge({ status }: { status: TestStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
