import React from 'react';
import Link from 'next/link';
import { PackageX, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 shadow-inner">
        <PackageX className="w-10 h-10" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">404 - Page Not Found</h1>
      <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md">
        The page or product you are looking for does not exist, has been removed, or is invalid.
      </p>
      <div className="mt-8">
        <Link href="/products">
          <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Products Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}