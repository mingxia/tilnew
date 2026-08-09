'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { ProjectMap } from '@/components/home/project-map/project-map';
import { projects } from '@/lib/project-map/projects';

function HomeContent() {
  return (
    <>
      <main className="project-map-page">
        <section aria-label="项目地图">
          <ProjectMap projects={projects} />
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
