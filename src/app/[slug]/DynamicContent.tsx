'use client';

import { useRouter } from 'next/navigation';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { DappledLight, Starfield, Fireflies, AmbientSound } from '@/components/effects/VisualEffects';
import { Header } from '@/components/Header';
import { MarkdownContent } from '@/components/MarkdownContent';

interface DynamicContentProps {
  markdownContent: string;
  slug: string;
}

export default function DynamicContent({ markdownContent, slug }: DynamicContentProps) {
  const router = useRouter();

  return (
    <ThemeProvider>
      {/* 光影效果 */}
      <DappledLight />
      <Starfield />
      <Fireflies />
      <AmbientSound />

      {/* 导航栏 */}
      <Header />

      {/* 主内容 */}
      <main className="relative z-10 min-h-screen px-6 py-12 md:px-12 lg:px-24 max-w-4xl mx-auto pt-32">
        <div className="markdown-content">
          <MarkdownContent content={markdownContent} />
        </div>

        {/* 返回首页 */}
        <div className="mt-16 pt-8 border-t border-current/20 text-center">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-current/10 hover:bg-current/20 transition-colors"
          >
            <span>←</span>
            <span>返回首页</span>
          </button>
        </div>
      </main>
    </ThemeProvider>
  );
}
