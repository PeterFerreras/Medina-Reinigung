import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CleanOps',
  description: 'Operations platform for cleaning businesses.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
