import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Header } from '@/components/shared';

export const metadata: Metadata = {
  title: 'Pizza | Главная',
  description: 'Pizza',
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main className="min-h-screen ">
      <Header />
      {children}
    </main>
  );
}
