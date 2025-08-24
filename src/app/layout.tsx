import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { ReactNode } from 'react';
import { Header } from '@/components/shared';

const nunito = Nunito({
  subsets: ['cyrillic'],
  variable: '--font-nunito',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Pizza | Главная',
  description: 'next',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={nunito.className}>
        <Header />
        <main className="min-h-screen ">{children}</main>
      </body>
    </html>
  );
}
