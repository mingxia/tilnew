'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Project } from '@/lib/project-map/types';
import { ProjectMapCell, ProjectMapLabel } from './project-map-cell';

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

// A hand-drawn partition of one 1200 × 720 rectangle. Neighbouring paths reuse
// the same Bézier edges; the white stroke reveals the cut instead of card gaps.
// The SVG deliberately stretches with the viewport so the pieces stay tall and
// immersive instead of becoming a short, letterboxed strip on wide screens.
const ORGANIC_LAYOUT_13: OrganicSlot[] = [
  { id: 'slot-01', path: 'M0 0H370C354 72 397 145 352 226C260 249 176 213 0 254Z', area: 87000, x: 34, y: 34, width: 295, height: 178, size: 'large' },
  { id: 'slot-02', path: 'M370 0H754C736 72 786 158 735 288C620 310 493 250 352 226C397 145 354 72 370 0Z', area: 97000, x: 414, y: 35, width: 292, height: 205, size: 'large', align: 'center' },
  { id: 'slot-03', path: 'M754 0H1200V215C1070 198 983 261 874 246C812 237 777 269 735 288C786 158 736 72 754 0Z', area: 105000, x: 807, y: 35, width: 335, height: 169, size: 'large' },

  { id: 'slot-04', path: 'M0 254C176 213 260 249 352 226C366 310 330 365 286 421C188 389 103 438 0 402Z', area: 61000, x: 28, y: 277, width: 265, height: 105, size: 'medium', align: 'end' },
  { id: 'slot-05', path: 'M352 226C493 250 620 310 735 288C720 351 735 397 681 451C568 421 431 461 286 421C330 365 366 310 352 226Z', area: 78000, x: 359, y: 291, width: 324, height: 120, size: 'medium', align: 'center' },
  { id: 'slot-06', path: 'M735 288C777 269 812 237 874 246C921 303 918 370 891 424C826 449 751 446 681 451C735 397 720 351 735 288Z', area: 39000, x: 749, y: 288, width: 141, height: 112, size: 'small', align: 'center' },
  { id: 'slot-07', path: 'M874 246C983 261 1070 198 1200 215V421C1093 392 1005 455 891 424C918 370 921 303 874 246Z', area: 67000, x: 934, y: 266, width: 225, height: 116, size: 'medium', align: 'end' },

  { id: 'slot-08', path: 'M0 402C103 438 188 389 286 421C311 488 279 559 224 720H0Z', area: 80000, x: 31, y: 452, width: 205, height: 210, size: 'large', align: 'end' },
  { id: 'slot-09', path: 'M286 421C431 461 568 421 681 451C654 512 594 553 526 565C427 534 347 578 279 570C296 509 311 469 286 421Z', area: 63000, x: 326, y: 467, width: 292, height: 69, size: 'medium', align: 'center' },
  { id: 'slot-10', path: 'M681 451C751 446 826 449 891 424C939 477 920 538 885 584C770 563 660 607 526 565C594 553 654 512 681 451Z', area: 59000, x: 657, y: 478, width: 222, height: 73, size: 'small', align: 'center' },
  { id: 'slot-11', path: 'M891 424C1005 455 1093 392 1200 421V572C1083 594 985 555 885 584C920 538 939 477 891 424Z', area: 59000, x: 951, y: 455, width: 207, height: 90, size: 'medium', align: 'center' },
  { id: 'slot-12', path: 'M224 720C252 638 263 598 279 570C347 578 427 534 526 565C548 615 519 673 494 720Z', area: 63000, x: 284, y: 601, width: 207, height: 77, size: 'small', align: 'center' },
  { id: 'slot-13', path: 'M494 720C519 673 548 615 526 565C660 607 770 563 885 584C985 555 1083 594 1200 572V720Z', area: 50000, x: 624, y: 616, width: 430, height: 62, size: 'small', align: 'center' },
];

function assignProjects(projects: Project[]) {
  const slots = ORGANIC_LAYOUT_13.slice(0, Math.min(projects.length, ORGANIC_LAYOUT_13.length));
  const rankedSlots = [...slots].sort((a, b) => b.area - a.area);
  const rankedProjects = [...projects].sort((a, b) => b.weight - a.weight || a.year - b.year);
  const assignment = new Map(rankedSlots.map((slot, index) => [slot.id, rankedProjects[index]]));
  return slots.map((slot) => ({ slot, project: assignment.get(slot.id)! }));
}

export function ProjectMap({ projects }: { projects: Project[] }) {
  const cells = assignProjects(projects);
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
      <svg className="project-map-svg" viewBox="0 0 1200 720" role="list" aria-label="名下的项目地图" preserveAspectRatio="none">
        <defs><clipPath id="project-map-outline"><rect width="1200" height="720" rx="36" /></clipPath></defs>
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
          <div className="project-preview-meta"><span>{selectedProject.year}</span><span>·</span><span>{selectedProject.status === 'done' ? '已完成' : selectedProject.status === 'active' ? '进行中' : '想做'}</span></div>
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
