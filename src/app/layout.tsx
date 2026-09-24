import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { ProductStoreProvider } from '@/context/ProductStoreContext';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Nexus Product Admin Dashboard',
  description: 'Enterprise grade Product Management Dashboard built with Next.js, React, TypeScript, and Tailwind CSS.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
        <ThemeProvider>
          <AuthProvider>
            <ProductStoreProvider>
              {children}
              <Toaster
                richColors
                position="top-right"
                closeButton
                theme="system"
                toastOptions={{
                  style: {
                    borderRadius: '1rem',
                  },
                }}
              />
            </ProductStoreProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}