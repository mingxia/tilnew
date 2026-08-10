'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateProjectMapLayout } from '@/lib/project-map/layout';
import { PROJECT_MAP_SEED } from '@/lib/project-map/projects';
import type { Project } from '@/lib/project-map/types';
import { ProjectMapCell, ProjectMapLabel } from './project-map-cell';
import { ProjectMapLegend } from './project-map-legend';

export type OrganicSlot = {
  id: string;
  path: string;
  area: number;
  x: number;
  y: number;
  width: number;
  height: number;
  size: 'large' | 'medium' | 'small' | 'tiny';
  align?: 'start' | 'center' | 'end';
};

const statusLabels = {
  done: '已完成',
  ongoing: '进行中',
  paused: '已暂停',
  planned: '计划中',
} satisfies Record<Project['status'], string>;

function assignProjects(projects: Project[]) {
  const projectsById = new Map(projects.map((project) => [project.id, project]));
  return generateProjectMapLayout({
    projects,
    width: 1200,
    height: 720,
    gap: 0,
    seed: PROJECT_MAP_SEED,
    direction: 'horizontal',
  }).map((cell) => {
    const xs = cell.polygon.map((point) => point.x);
    const ys = cell.polygon.map((point) => point.y);
    const left = Math.min(...xs);
    const top = Math.min(...ys);
    const inset = Math.min(24, Math.max(10, Math.min(cell.bounds.width, cell.bounds.height) * 0.09));
    const shortestSide = Math.min(cell.bounds.width, cell.bounds.height);
    const size: OrganicSlot['size'] = cell.area >= 70000 && shortestSide >= 150
      ? 'large'
      : cell.area >= 40000 && shortestSide >= 100
        ? 'medium'
        : cell.area >= 22000 && shortestSide >= 64
          ? 'small'
          : 'tiny';
    const slot: OrganicSlot = {
      id: cell.id,
      path: cell.path,
      area: cell.area,
      x: left + inset,
      y: top + inset,
      width: Math.max(0, cell.bounds.width - inset * 2),
      height: Math.max(0, cell.bounds.height - inset * 2),
      size,
      align: 'center',
    };
    return { slot, project: projectsById.get(cell.id)! };
  });
}

export function ProjectMap({ projects }: { projects: Project[] }) {
  const cells = useMemo(() => assignProjects(projects), [projects]);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const activeProject = hoveredProject ?? selectedProject?.id ?? null;

  useEffect(() => {
    if (!selectedProject) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedProject(null);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [selectedProject]);

  return (
    <div className="project-map-shell">
      <ProjectMapLegend />
      <svg className="project-map-svg" viewBox="0 0 1200 720" role="list" aria-label="名下的项目地图" preserveAspectRatio="none">
        <defs><clipPath id="project-map-outline"><rect width="1200" height="720" /></clipPath></defs>
        <g clipPath="url(#project-map-outline)">
          {cells.map(({ project, slot }, index) => (
            <ProjectMapCell
              key={project.id}
              project={project}
              slot={slot}
              index={index}
              active={activeProject === project.id}
              onActiveChange={(active) => setHoveredProject(active ? project.id : null)}
              onSelect={() => setSelectedProject(project)}
            />
          ))}
        </g>
      </svg>
      <div className="project-map-labels" aria-hidden="true">
        {cells.map(({ project, slot }) => (
          <ProjectMapLabel key={project.id} project={project} slot={slot} active={activeProject === project.id} />
        ))}
      </div>
      {selectedProject && (
        <aside className="project-preview" role="dialog" aria-modal="false" aria-labelledby="project-preview-title">
          <Button className="project-preview-close" variant="ghost" size="icon-sm" onClick={() => setSelectedProject(null)} aria-label="关闭项目简介"><X /></Button>
          <div className="project-preview-meta"><span>{selectedProject.year}</span><span>·</span><span>{statusLabels[selectedProject.status]}</span></div>
          <h2 id="project-preview-title">{selectedProject.title}</h2>
          <p>{selectedProject.details ?? selectedProject.description}</p>
          <Button className="project-preview-open" asChild>
            <a href={selectedProject.href ?? `/projects/${selectedProject.slug}`} target={selectedProject.href?.startsWith('http') ? '_blank' : undefined} rel={selectedProject.href?.startsWith('http') ? 'noreferrer' : undefined}>
              {selectedProject.href?.startsWith('http') ? '在新窗口打开' : '在本站打开'} <ArrowUpRight />
            </a>
          </Button>
        </aside>
      )}
    </div>
  );
}
