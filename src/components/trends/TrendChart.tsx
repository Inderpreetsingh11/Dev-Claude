import { useMemo } from 'react';
import type { LabReport } from '../../types';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface TrendChartProps {
  reports: LabReport[];
  markerName: string;
}

interface DataPoint {
  date: string;
  value: number;
  refMin: number | null;
  refMax: number | null;
  labName: string;
  status: string;
}

export function TrendChart({ reports, markerName }: TrendChartProps) {
  const data = useMemo(() => {
    const points: DataPoint[] = [];
    for (const report of reports) {
      for (const test of report.tests) {
        if (test.testName === markerName) {
          points.push({
            date: report.reportDate,
            value: test.value,
            refMin: test.referenceMin,
            refMax: test.referenceMax,
            labName: report.labName,
            status: test.status,
          });
        }
      }
    }
    return points.sort((a, b) => a.date.localeCompare(b.date));
  }, [reports, markerName]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        No data for this marker
      </div>
    );
  }

  const latestWithRef = [...data].reverse().find((d) => d.refMin !== null && d.refMax !== null);
  const refMin = latestWithRef?.refMin ?? null;
  const refMax = latestWithRef?.refMax ?? null;

  const allValues = data.map((d) => d.value);
  const yMin = Math.min(...allValues, refMin ?? Infinity) * 0.85;
  const yMax = Math.max(...allValues, refMax ?? -Infinity) * 1.15;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">{markerName} Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            tickLine={false}
          />
          <YAxis
            domain={[yMin, yMax]}
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as DataPoint;
              return (
                <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-sm">
                  <div className="font-medium">{d.date}</div>
                  <div className="text-medical-600 font-semibold">{d.value}</div>
                  <div className="text-slate-400">{d.labName}</div>
                  <div className={`text-xs font-medium mt-1 ${
                    d.status === 'normal' ? 'text-success-600' : d.status === 'high' ? 'text-danger-600' : 'text-warning-600'
                  }`}>
                    {d.status.toUpperCase()}
                  </div>
                </div>
              );
            }}
          />

          {refMin !== null && refMax !== null && (
            <Area
              type="monotone"
              dataKey={() => refMax}
              stroke="none"
              fill="#dcfce7"
              fillOpacity={0.5}
              baseValue={refMin}
              isAnimationActive={false}
            />
          )}

          {refMin !== null && (
            <ReferenceLine y={refMin} stroke="#86efac" strokeDasharray="4 4" label={{ value: 'Min', position: 'insideLeft', fontSize: 10, fill: '#86efac' }} />
          )}
          {refMax !== null && (
            <ReferenceLine y={refMax} stroke="#86efac" strokeDasharray="4 4" label={{ value: 'Max', position: 'insideLeft', fontSize: 10, fill: '#86efac' }} />
          )}

          <Line
            type="monotone"
            dataKey="value"
            stroke="#14b8a6"
            strokeWidth={2.5}
            dot={{ r: 5, fill: '#14b8a6', stroke: '#fff', strokeWidth: 2 }}
            activeDot={{ r: 7, fill: '#0d9488' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      {data.length === 1 && (
        <p className="text-xs text-slate-400 text-center mt-2">
          Add more reports to see trends over time
        </p>
      )}
    </div>
  );
}
