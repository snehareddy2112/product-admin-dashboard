'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Sparkles, Lock, User, ArrowRight, ShieldCheck, KeyRound, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/products';

  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilypass');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace(callbackUrl);
    }
  }, [isAuthenticated, isAuthLoading, router, callbackUrl]);

  const validate = () => {
    const errs: { username?: string; password?: string } = {};
    if (!username.trim()) {
      errs.username = 'Username is required';
    }
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 4) {
      errs.password = 'Password must be at least 4 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login({ username, password });
      router.push(callbackUrl);
    } catch (err: unknown) {
      // Error toast is handled in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUseDemo = () => {
    setUsername('emilys');
    setPassword('emilypass');
    setErrors({});
    toast.info('Demo credentials populated: emilys / emilypass');
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/25 mb-1">
          <Sparkles className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-indigo-200 dark:to-slate-300 bg-clip-text text-transparent">
          Nexus Product Suite
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
          Sign in with your DummyJSON administrator account to access the dashboard.
        </p>
      </div>

      {/* Login Card */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            required
            placeholder="e.g. emilys"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={errors.username}
            leftIcon={<User className="w-4 h-4" />}
            autoComplete="username"
          />

          <Input
            label="Password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            leftIcon={<Lock className="w-4 h-4" />}
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2 font-semibold shadow-md shadow-indigo-500/20"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In to Dashboard
          </Button>
        </form>

        {/* Quick Demo Credentials Box */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-500" /> Demo Credentials
            </span>
            <button
              type="button"
              onClick={handleUseDemo}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
            >
              Auto-fill
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300 space-y-1 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Username:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">emilys</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Password:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">emilypass</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500 text-center">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>Secured via DummyJSON Auth Interceptor & Token Management</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-radial-[at_top_center] from-indigo-50/50 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 text-slate-900 dark:text-slate-100">
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}