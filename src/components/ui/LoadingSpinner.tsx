import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <Loader2 className="w-8 h-8 text-medical-500 animate-spin" />
      {message && <p className="text-sm text-slate-500">{message}</p>}
    </div>
  );
}
