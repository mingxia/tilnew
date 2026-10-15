import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '小帮办｜电脑上的麻烦事，交给我们',
  description: 'PDF 合并拆分、图片格式转换、文档整理和资料查找。小事几元起，先确认价格，交付验收后付款。小帮办，让数字小事变简单。',
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
