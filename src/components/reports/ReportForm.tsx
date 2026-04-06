import { useState } from 'react';
import type { LabReport, LabTest } from '../../types';
import { TestForm } from '../tests/TestForm';
import { Modal } from '../ui/Modal';
import { Plus, X } from 'lucide-react';
import { StatusBadge } from '../tests/StatusBadge';

interface ReportFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (report: LabReport) => void;
  memberId: string;
}

export function ReportForm({ open, onClose, onSave, memberId }: ReportFormProps) {
  const [labName, setLabName] = useState('');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [tests, setTests] = useState<LabTest[]>([]);
  const [showTestForm, setShowTestForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDate || tests.length === 0) return;
    onSave({
      id: crypto.randomUUID(),
      memberId,
      labName: labName.trim() || 'Unknown Lab',
      reportDate,
      uploadedAt: new Date().toISOString(),
      source: 'manual',
      tests,
    });
    setLabName('');
    setReportDate(new Date().toISOString().split('T')[0]);
    setTests([]);
    onClose();
  };

  const removeTest = (id: string) => {
    setTests((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Report Manually">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Lab Name</label>
          <input
            type="text"
            value={labName}
            onChange={(e) => setLabName(e.target.value)}
            placeholder="e.g. Quest Diagnostics"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Report Date</label>
          <input
            type="date"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-700">Tests ({tests.length})</label>
            <button
              type="button"
              onClick={() => setShowTestForm(true)}
              className="flex items-center gap-1 text-sm text-medical-600 hover:text-medical-700"
            >
              <Plus className="w-4 h-4" /> Add Test
            </button>
          </div>

          {tests.length > 0 && (
            <div className="space-y-2 mb-3">
              {tests.map((t) => (
                <div key={t.id} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{t.testName}</span>
                    <span className="text-sm text-slate-400">
                      {t.value} {t.unit}
                    </span>
                    <StatusBadge status={t.status} />
                  </div>
                  <button type="button" onClick={() => removeTest(t.id)} className="p-1 hover:bg-slate-200 rounded">
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {showTestForm && (
            <TestForm
              onSave={(test) => {
                setTests((prev) => [...prev, test]);
                setShowTestForm(false);
              }}
              onCancel={() => setShowTestForm(false)}
            />
          )}
        </div>

        <button
          type="submit"
          disabled={tests.length === 0}
          className="mt-2 px-4 py-2.5 bg-medical-600 text-white rounded-lg font-medium hover:bg-medical-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Report
        </button>
      </form>
    </Modal>
  );
}
