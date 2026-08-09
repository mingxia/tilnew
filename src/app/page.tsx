'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { Header } from '@/components/Header';
import { ProjectMap } from '@/components/home/project-map/project-map';
import { ProjectMapLegend } from '@/components/home/project-map/project-map-legend';
import { projects } from '@/lib/project-map/projects';

function HomeContent() {
  return (
    <>
      {/* 导航栏 */}
      <Header />

      {/* 主内容 */}
      <main className="project-map-page">
        <section aria-labelledby="project-map-title">
          <div className="project-map-intro">
            <div>
              <p className="project-map-eyebrow">PROJECT MAP · 2013—未来</p>
              <h1 id="project-map-title">我的项目地图</h1>
              <p className="project-map-subtitle">把想法、探索与实践，放在一张地图上，<br className="hidden sm:block" />持续更新，慢慢实现。</p>
            </div>
            <ProjectMapLegend />
          </div>
          <ProjectMap projects={projects} />
          <div className="project-map-direction" aria-hidden="true"><span>过去</span><i /><span>未来</span></div>
          <p className="project-map-closing">地图会变，方向不变。</p>
          <ul className="sr-only">{projects.map((project) => <li key={project.id}><a href={project.href ?? `/projects/${project.slug}`}>{project.title}，{project.year}</a></li>)}</ul>
        </section>
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
