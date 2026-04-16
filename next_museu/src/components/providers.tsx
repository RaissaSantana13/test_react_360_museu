'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode, useEffect, useState } from 'react';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // useEffect só roda no cliente, garantindo que o componente montou
  useEffect(() => {
    setMounted(true);
  }, []);

  // Se ainda não montou, renderizamos apenas os filhos (ou um fragmento vazio)
  // para evitar que o script do ThemeProvider seja lido pelo React durante a hidratação
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      themes={['light', 'dark', 'theme-museu', 'theme-birigui', 'system']}
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster position="top-center" richColors />
    </ThemeProvider>
  );
}
