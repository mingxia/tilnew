import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '名下的白日梦',
  description: '意气书生苦读寒窗十年终究为读书读人读天下；风华剑客笑看江山万里一心愿看剑看云看苍生。',
  icons: {
    icon: '/assets/favicon.ico',
    shortcut: '/assets/favicon.ico',
    apple: '/assets/bytedayb.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/bytedayb.png" />
      </head>
      <body className="transition-colors duration-1000">
        {children}
      </body>
    </html>
  );
}
