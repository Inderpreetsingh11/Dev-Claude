import { useState } from 'react';
import type { LabTest, TestStatus } from '../../types';
import { CATEGORIES } from '../../types';

interface TestFormProps {
  initial?: LabTest;
  onSave: (test: LabTest) => void;
  onCancel: () => void;
}

function computeStatus(value: number, min: number | null, max: number | null): TestStatus {
  if (min !== null && value < min) return 'low';
  if (max !== null && value > max) return 'high';
  return 'normal';
}

export function TestForm({ initial, onSave, onCancel }: TestFormProps) {
  const [testName, setTestName] = useState(initial?.testName ?? '');
  const [value, setValue] = useState(initial?.value?.toString() ?? '');
  const [unit, setUnit] = useState(initial?.unit ?? '');
  const [refMin, setRefMin] = useState(initial?.referenceMin?.toString() ?? '');
  const [refMax, setRefMax] = useState(initial?.referenceMax?.toString() ?? '');
  const [category, setCategory] = useState(initial?.category ?? 'Other');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim() || !value) return;
    const numValue = parseFloat(value);
    const numMin = refMin ? parseFloat(refMin) : null;
    const numMax = refMax ? parseFloat(refMax) : null;
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      testName: testName.trim(),
      originalName: initial?.originalName ?? testName.trim(),
      value: numValue,
      unit: unit.trim(),
      referenceMin: numMin,
      referenceMax: numMax,
      category,
      status: computeStatus(numValue, numMin, numMax),
    });
  };

  const inputClass = 'w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 text-sm';

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl">
      <div className="col-span-2">
        <input type="text" value={testName} onChange={(e) => setTestName(e.target.value)} placeholder="Test Name" className={inputClass} />
      </div>
      <div>
        <input type="number" step="any" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Value" className={inputClass} />
      </div>
      <div>
        <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Unit (e.g. mg/dL)" className={inputClass} />
      </div>
      <div>
        <input type="number" step="any" value={refMin} onChange={(e) => setRefMin(e.target.value)} placeholder="Ref Min" className={inputClass} />
      </div>
      <div>
        <input type="number" step="any" value={refMax} onChange={(e) => setRefMax(e.target.value)} placeholder="Ref Max" className={inputClass} />
      </div>
      <div className="col-span-2">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="col-span-2 flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100 rounded-lg">
          Cancel
        </button>
        <button type="submit" className="px-3 py-1.5 text-sm bg-medical-600 text-white rounded-lg hover:bg-medical-700">
          {initial ? 'Update' : 'Add Test'}
        </button>
      </div>
    </form>
  );
}
