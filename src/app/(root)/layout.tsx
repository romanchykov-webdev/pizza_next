import type { Metadata } from 'next';
import { Header } from '@/components/shared';

export const metadata: Metadata = {
  title: 'Pizza | Главная',
  description: 'Pizza',
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      {children}
      {modal ?? null}
    </main>
  );
}
