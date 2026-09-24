'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="w-20 h-20 rounded-3xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-6 shadow-inner">
        <AlertTriangle className="w-10 h-10" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Application Error</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md">
        An unexpected error occurred in the application. Please try resetting the state.
      </p>
      <div className="mt-6 flex gap-3">
        <Button variant="primary" onClick={() => reset()} leftIcon={<RefreshCw className="w-4 h-4" />}>
          Try Again
        </Button>
      </div>
    </div>
  );
}