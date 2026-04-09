import { useState } from 'react';
import type { LabReport, LabTest } from '../../types';
import { TestResultRow } from '../tests/TestResultRow';
import { TestForm } from '../tests/TestForm';
import { Calendar, Building2, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReportDetailProps {
  report: LabReport;
  onUpdate: (report: LabReport) => void;
  onDelete: () => void;
}

export function ReportDetail({ report, onUpdate, onDelete }: ReportDetailProps) {
  const [expanded, setExpanded] = useState(false);
  const [editingTest, setEditingTest] = useState<LabTest | null>(null);
  const [addingTest, setAddingTest] = useState(false);

  const abnormalCount = report.tests.filter((t) => t.status !== 'normal').length;

  const handleTestSave = (test: LabTest) => {
    const exists = report.tests.find((t) => t.id === test.id);
    const tests = exists ? report.tests.map((t) => (t.id === test.id ? test : t)) : [...report.tests, test];
    onUpdate({ ...report, tests });
    setEditingTest(null);
    setAddingTest(false);
  };

  const handleTestDelete = (testId: string) => {
    onUpdate({ ...report, tests: report.tests.filter((t) => t.id !== testId) });
  };

  return (
    <motion.div layout className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="w-4 h-4" />
              {report.reportDate}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-slate-700">{report.labName || 'Unknown Lab'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right text-sm">
            <div className="text-slate-500">{report.tests.length} tests</div>
            {abnormalCount > 0 && (
              <div className="text-danger-500 font-medium">{abnormalCount} abnormal</div>
            )}
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full ${report.source === 'ai-extracted' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
            {report.source === 'ai-extracted' ? 'AI' : 'Manual'}
          </span>
          {expanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs text-slate-400 uppercase tracking-wider">
                      <th className="text-left py-2 px-4 font-medium">Test</th>
                      <th className="text-left py-2 px-4 font-medium">Value</th>
                      <th className="text-left py-2 px-4 font-medium">Reference</th>
                      <th className="text-left py-2 px-4 font-medium">Range</th>
                      <th className="text-left py-2 px-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.tests.map((test) => (
                      <TestResultRow
                        key={test.id}
                        test={test}
                        onEdit={() => setEditingTest(test)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {editingTest && (
                <div className="p-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Edit Test</span>
                    <button
                      onClick={() => { handleTestDelete(editingTest.id); setEditingTest(null); }}
                      className="text-xs text-danger-500 hover:text-danger-600 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                  <TestForm initial={editingTest} onSave={handleTestSave} onCancel={() => setEditingTest(null)} />
                </div>
              )}

              {addingTest && (
                <div className="p-4 border-t border-slate-100">
                  <TestForm onSave={handleTestSave} onCancel={() => setAddingTest(false)} />
                </div>
              )}

              <div className="p-3 border-t border-slate-100 flex justify-between">
                <button
                  onClick={() => { setAddingTest(true); setEditingTest(null); }}
                  className="flex items-center gap-1.5 text-sm text-medical-600 hover:text-medical-700"
                >
                  <Plus className="w-4 h-4" /> Add Test
                </button>
                <div className="flex gap-2">
                  <button onClick={onDelete} className="flex items-center gap-1.5 text-sm text-danger-500 hover:text-danger-600">
                    <Trash2 className="w-4 h-4" /> Delete Report
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
