import { useState, useCallback } from 'react';
import type { LabReport } from '../../types';
import { pdfToImages } from '../../services/pdfProcessor';
import { extractFromImages, normalizeMarkers, buildLabTests } from '../../services/labExtractor';
import { getNormalizationMap, getReports } from '../../services/storage';
import { Upload, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface ReportUploadProps {
  memberId: string;
  onReportExtracted: (report: LabReport) => void;
  ollamaConnected: boolean;
}

type UploadState = 'idle' | 'processing-pdf' | 'extracting' | 'normalizing' | 'done' | 'error';

export function ReportUpload({ memberId, onReportExtracted, ollamaConnected }: ReportUploadProps) {
  const [state, setState] = useState<UploadState>('idle');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setError('Please upload a PDF file');
        setState('error');
        return;
      }

      try {
        setState('processing-pdf');
        setStatus('Converting PDF pages to images...');
        const images = await pdfToImages(file, (page, total) => {
          setStatus(`Processing page ${page} of ${total}...`);
        });

        setState('extracting');
        const extracted = await extractFromImages(images, setStatus);

        setState('normalizing');
        const allReports = getReports();
        const existingNames = [...new Set(allReports.flatMap((r) => r.tests.map((t) => t.testName)))];
        const newNames = extracted.tests.map((t) => t.name);
        const normMap = await normalizeMarkers(newNames, existingNames, setStatus);

        const mergedMap = { ...getNormalizationMap(), ...normMap };
        const tests = buildLabTests(extracted.tests, mergedMap);

        const report: LabReport = {
          id: crypto.randomUUID(),
          memberId,
          labName: extracted.labName || 'Unknown Lab',
          reportDate: extracted.reportDate || new Date().toISOString().split('T')[0],
          uploadedAt: new Date().toISOString(),
          source: 'ai-extracted',
          tests,
        };

        onReportExtracted(report);
        setState('done');
        setStatus(`Extracted ${tests.length} tests successfully!`);

        setTimeout(() => setState('idle'), 3000);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Extraction failed');
        setState('error');
      }
    },
    [memberId, onReportExtracted],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      e.target.value = '';
    },
    [processFile],
  );

  if (!ollamaConnected) {
    return (
      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
        <AlertTriangle className="w-10 h-10 text-warning-500 mx-auto mb-3" />
        <p className="text-sm text-slate-500">
          Ollama is not connected. Start Ollama with the gemma4 model to enable AI extraction.
        </p>
      </div>
    );
  }

  return (
    <div>
      <label
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`block border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          dragOver ? 'border-medical-400 bg-medical-50' : 'border-slate-200 hover:border-medical-300 hover:bg-slate-50'
        } ${state !== 'idle' && state !== 'error' && state !== 'done' ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input type="file" accept=".pdf" onChange={handleFileInput} className="hidden" />

        {state === 'idle' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">Drop a PDF lab report here</p>
            <p className="text-xs text-slate-400 mt-1">or click to browse</p>
          </motion.div>
        )}

        {(state === 'processing-pdf' || state === 'extracting' || state === 'normalizing') && (
          <div>
            <Loader2 className="w-10 h-10 text-medical-500 mx-auto mb-3 animate-spin" />
            <p className="text-sm font-medium text-medical-600">{status}</p>
          </div>
        )}

        {state === 'done' && (
          <div>
            <CheckCircle className="w-10 h-10 text-success-500 mx-auto mb-3" />
            <p className="text-sm font-medium text-success-600">{status}</p>
          </div>
        )}

        {state === 'error' && (
          <div>
            <AlertTriangle className="w-10 h-10 text-danger-500 mx-auto mb-3" />
            <p className="text-sm font-medium text-danger-600">{error}</p>
            <button
              onClick={(e) => { e.preventDefault(); setState('idle'); setError(''); }}
              className="mt-2 text-xs text-medical-600 hover:underline"
            >
              Try again
            </button>
          </div>
        )}
      </label>
    </div>
  );
}
