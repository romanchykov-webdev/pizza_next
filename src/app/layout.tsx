import { Nunito } from 'next/font/google';
import './globals.css';
import { ReactNode } from 'react';

const nunito = Nunito({
  subsets: ['cyrillic'],
  variable: '--font-nunito',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={nunito.className}>{children}</body>
    </html>
  );
}
