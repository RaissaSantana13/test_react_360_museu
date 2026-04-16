'use client';

import { ThemeProvider } from 'next-themes'; // Provedor de Temas
import { ReactNode, useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { DictionaryType, LocaleType } from '../../type/type';
import { SettingsProvider } from '../context/settings-context';
import AuthProvider from './auth-providers';
import { I18nProvider } from './i18n-providers';
import { ResourceProvider } from './resource-providers';

interface ProvidersProps {
  children: ReactNode;
  locale: LocaleType;
  dictionary: DictionaryType;
}

export function Providers({ locale, dictionary, children }: ProvidersProps) {
  // Estado para evitar erro de hidratação do React 19 com o ThemeProvider
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SettingsProvider locale={locale}>
      <I18nProvider dictionary={dictionary}>
        <ResourceProvider>
          <AuthProvider>
            {}
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              themes={[
                'light',
                'dark',
                'theme-museu',
                'theme-birigui',
                'system',
              ]}
              enableSystem
              disableTransitionOnChange
            >
              {children}
              {mounted && <Toaster position="top-center" richColors />}
            </ThemeProvider>
          </AuthProvider>
        </ResourceProvider>
      </I18nProvider>
    </SettingsProvider>
  );
}
