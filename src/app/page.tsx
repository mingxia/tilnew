'use client';

import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { DappledLight, Starfield, Fireflies, AmbientSound } from '@/components/effects/VisualEffects';
import { Header } from '@/components/Header';
import { MarkdownContent } from '@/components/MarkdownContent';

function HomeContent() {
  const [markdownContent, setMarkdownContent] = useState('');

  useEffect(() => {
    fetch('/content/home.md')
      .then((res) => res.text())
      .then((text) => setMarkdownContent(text))
      .catch((err) => console.error('Failed to load markdown:', err));
  }, []);

  return (
    <>
      {/* 核心视觉效果 */}
      <DappledLight />

      {/* 夜间效果 */}
      <Starfield />
      <Fireflies />

      {/* 环境音效 */}
      <AmbientSound />

      {/* 导航栏 */}
      <Header />

      {/* 主内容 */}
      <main className="relative z-10 min-h-screen px-6 py-12 md:px-12 lg:px-24 max-w-4xl mx-auto pt-32">
        <div className="markdown-content">
          {markdownContent ? (
            <MarkdownContent content={markdownContent} />
          ) : (
            <p className="text-center opacity-50">加载中...</p>
          )}
        </div>

        {/* 底部信息 */}
        <footer className="mt-16 pt-8 border-t border-current/20 text-sm opacity-50 text-center">
          <p>© {new Date().getFullYear()} 名下 · 数字·白日梦</p>
        </footer>
      </main>
    </>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <HomeContent />
    </ThemeProvider>
  );
}
