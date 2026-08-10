'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUp, Circle, Clock3, Grid2X2 } from 'lucide-react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { MarkdownContent } from '@/components/MarkdownContent';
import { projects } from '@/lib/project-map/projects';

interface DynamicContentProps {
  markdownContent: string;
  slug: string;
}

export default function DynamicContent({ markdownContent, slug }: DynamicContentProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const project = projects.find((item) => item.slug === slug);
  const headings = useMemo(() => Array.from(markdownContent.matchAll(/^##\s+(.+)$/gm), (match) => ({
    title: match[1].trim(),
    id: match[1].toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, ''),
  })), [markdownContent]);
  const title = markdownContent.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? project?.title ?? slug;
  const characterCount = markdownContent.replace(/[#>*_`\-\[\]()]/g, '').replace(/\s/g, '').length;
  const readingMinutes = Math.max(1, Math.ceil(characterCount / 500));

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setReadingProgress(scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0);
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <ThemeProvider>
      <div className="article-progress" aria-hidden="true"><span style={{ width: `${readingProgress}%` }} /></div>
      <header className="article-header">
        <Link href="/" className="article-back"><ArrowLeft /> <span>PROJECT MAP</span></Link>
        <div className="article-brand"><span>BYTEDAY</span><b>/</b><span>ARCHIVE</span></div>
        <div className="article-index"><Grid2X2 /><span>{String(projects.findIndex((item) => item.slug === slug) + 1).padStart(2, '0')} / {projects.length}</span></div>
      </header>

      <main className="article-page">
        <aside className="article-rail" aria-label="文章信息">
          <div className="article-rail-sticky">
            <p className="article-kicker">PROJECT FILE</p>
            <p className="article-rail-title">{project?.title ?? title}</p>
            <dl>
              <div><dt>YEAR</dt><dd>{project?.year ?? '—'}</dd></div>
              <div><dt>STATUS</dt><dd><Circle /> {project?.status === 'done' ? 'ARCHIVED' : 'IN PROGRESS'}</dd></div>
              <div><dt>READ</dt><dd>{readingMinutes} MIN</dd></div>
            </dl>
            {headings.length > 0 && <nav className="article-toc" aria-label="本文目录">
              <p>ON THIS PAGE</p>
              {headings.map((heading, index) => <a key={`${heading.id}-${index}`} href={`#${heading.id}`}><span>{String(index + 1).padStart(2, '0')}</span>{heading.title}</a>)}
            </nav>}
          </div>
        </aside>

        <section className="article-document">
          <div className="article-document-topbar"><span><i /> DOCUMENT / {slug.toUpperCase()}</span><span><Clock3 /> {readingMinutes} MIN READ</span></div>
          <div className="article-title-block">
            <p>{project?.description ?? '白日梦项目档案'}</p>
            <h1>{title}</h1>
            <div><span>{project?.year ?? 'ARCHIVE'}</span><span>BY MINGXIA</span><span>{characterCount.toLocaleString('zh-CN')} 字</span></div>
          </div>
          <article className="article-body"><MarkdownContent content={markdownContent.replace(/^#\s+.+$/m, '')} /></article>
          <footer className="article-footer">
            <div><span>END OF FILE</span><b>{slug.toUpperCase()} / {project?.year ?? '—'}</b></div>
            <Link href="/"><ArrowLeft /> 返回项目地图</Link>
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>TOP <ArrowUp /></button>
          </footer>
        </section>
      </main>
    </ThemeProvider>
  );
}
