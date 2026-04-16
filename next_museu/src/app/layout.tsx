import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';
import { ReactNode } from 'react';
import { getClientDictionary } from '../lib/get-dictionary';
import { Providers } from '../service/providers'; // Use o provedor unificado
import './globals.css';

export const metadata: Metadata = {
  title: 'Museu Municipal - Birigui',
  description: 'Tour Virtual 360',
};

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const lora = Lora({ subsets: ['latin'], variable: '--font-lora' });

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Pegamos o locale e o dicionário de tradução
  const { locale, dictionary } = await getClientDictionary();

  return (
    <html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${lora.variable} font-sans scroll-smooth`}
        suppressHydrationWarning
      >
        {/* Agora passamos locale e dictionary para os Providers */}
        <Providers locale={locale} dictionary={dictionary}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
