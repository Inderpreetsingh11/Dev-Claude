import { useState } from 'react';
import type { AppSettings } from '../types';
import { DEFAULT_SETTINGS } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { exportAllData, importData } from '../services/storage';
import { Download, Upload, RotateCcw } from 'lucide-react';

interface SettingsPageProps {
  onToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export function SettingsPage({ onToast }: SettingsPageProps) {
  const [settings, setSettings] = useLocalStorage<AppSettings>('medtrack:settings', DEFAULT_SETTINGS);
  const [ollamaUrl, setOllamaUrl] = useState(settings.ollamaUrl);
  const [modelName, setModelName] = useState(settings.modelName);

  const handleSaveSettings = () => {
    setSettings({ ollamaUrl: ollamaUrl.trim(), modelName: modelName.trim() });
    onToast('success', 'Settings saved');
  };

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medtrack-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onToast('success', 'Data exported');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          importData(reader.result as string);
          onToast('success', 'Data imported. Refresh the page to see changes.');
          setTimeout(() => window.location.reload(), 1500);
        } catch {
          onToast('error', 'Invalid backup file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleReset = () => {
    if (!confirm('This will delete ALL your data. Are you sure?')) return;
    localStorage.clear();
    window.location.reload();
  };

  const inputClass = 'w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500';

  return (
    <div className="space-y-8 max-w-lg">
      <h2 className="text-lg font-bold text-slate-800">Settings</h2>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">AI Configuration</h3>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Ollama URL</label>
          <input type="text" value={ollamaUrl} onChange={(e) => setOllamaUrl(e.target.value)} className={inputClass} />
          <p className="text-xs text-slate-400 mt-1">Default: /ollama (proxied to localhost:11434)</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Model Name</label>
          <input type="text" value={modelName} onChange={(e) => setModelName(e.target.value)} className={inputClass} />
          <p className="text-xs text-slate-400 mt-1">Default: gemma4</p>
        </div>
        <button onClick={handleSaveSettings} className="px-4 py-2 bg-medical-600 text-white rounded-lg text-sm hover:bg-medical-700 transition-colors">
          Save Settings
        </button>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Data Management</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition-colors"
          >
            <Download className="w-4 h-4" /> Export Data
          </button>
          <button
            onClick={handleImport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition-colors"
          >
            <Upload className="w-4 h-4" /> Import Data
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-danger-50 border border-danger-200 text-danger-600 rounded-lg text-sm hover:bg-danger-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Reset All Data
          </button>
        </div>
      </section>
    </div>
  );
}
