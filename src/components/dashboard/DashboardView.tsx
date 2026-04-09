import { useMemo } from 'react';
import type { LabReport, FamilyMember, LabTest } from '../../types';
import { HealthSummaryCard } from './HealthSummaryCard';
import { Calendar, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardViewProps {
  member: FamilyMember;
  reports: LabReport[];
}

export function DashboardView({ member, reports }: DashboardViewProps) {
  const latestReport = reports[0];

  const stats = useMemo(() => {
    const allTests = reports.flatMap((r) => r.tests);
    const abnormal = allTests.filter((t) => t.status !== 'normal');
    return {
      totalReports: reports.length,
      totalTests: allTests.length,
      abnormalCount: abnormal.length,
      normalPercent: allTests.length > 0 ? Math.round(((allTests.length - abnormal.length) / allTests.length) * 100) : 100,
    };
  }, [reports]);

  const latestTestsByCategory = useMemo(() => {
    if (!latestReport) return {};
    const grouped: Record<string, Array<LabTest & { reportDate: string }>> = {};
    for (const test of latestReport.tests) {
      const cat = test.category || 'Other';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push({ ...test, reportDate: latestReport.reportDate });
    }
    return grouped;
  }, [latestReport]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl"
          style={{ backgroundColor: member.avatarColor }}
        >
          {member.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{member.name}</h2>
          <p className="text-sm text-slate-400">{member.relationship}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Reports', value: stats.totalReports, icon: FileText, color: 'text-blue-500' },
          { label: 'Tests Tracked', value: stats.totalTests, icon: Calendar, color: 'text-medical-500' },
          { label: 'Abnormal', value: stats.abnormalCount, icon: AlertTriangle, color: 'text-danger-500' },
          { label: 'Normal %', value: `${stats.normalPercent}%`, icon: CheckCircle, color: 'text-success-500' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-slate-100 p-4"
          >
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
            <div className="text-xs text-slate-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {latestReport && (
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Latest Report — {latestReport.reportDate}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(latestTestsByCategory).map(([category, tests]) => (
              <HealthSummaryCard key={category} category={category} tests={tests} />
            ))}
          </div>
        </div>
      )}

      {reports.length > 1 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Recent Reports
          </h3>
          <div className="space-y-2">
            {reports.slice(0, 5).map((r) => {
              const abnormal = r.tests.filter((t) => t.status !== 'normal').length;
              return (
                <div key={r.id} className="flex items-center justify-between bg-white rounded-xl border border-slate-100 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="text-sm font-medium text-slate-700">{r.reportDate}</span>
                      <span className="text-sm text-slate-400 ml-2">{r.labName}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-400">{r.tests.length} tests</span>
                    {abnormal > 0 && (
                      <span className="text-danger-500 font-medium">{abnormal} abnormal</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
