'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { generateProjectMapLayout } from '@/lib/project-map/layout';
import { PROJECT_MAP_SEED } from '@/lib/project-map/projects';
import type { Project } from '@/lib/project-map/types';
import { ProjectMapCell } from './project-map-cell';

export function ProjectMap({ projects }: { projects: Project[] }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const observer = new ResizeObserver(([entry]) => setSize({ width: Math.round(entry.contentRect.width), height: Math.round(entry.contentRect.height) }));
    observer.observe(shell);
    return () => observer.disconnect();
  }, []);
  const mobile = size.width > 0 && size.width < 640;
  const cells = useMemo(() => generateProjectMapLayout({ projects, ...size, gap: 8, seed: PROJECT_MAP_SEED, direction: mobile ? 'vertical' : 'horizontal' }), [projects, size, mobile]);
  const projectsById = useMemo(() => new Map(projects.map((project) => [project.id, project])), [projects]);
  return <div ref={shellRef} className="project-map-shell">
    {size.width > 0 && <svg viewBox={`0 0 ${size.width} ${size.height}`} role="img" aria-labelledby="map-svg-title map-svg-desc">
      <title id="map-svg-title">名下的项目地图</title>
      <desc id="map-svg-desc">项目沿时间方向排列，颜色代表状态，面积代表它在个人经历中的分量。</desc>
      {cells.map((cell, index) => <ProjectMapCell key={cell.id} cell={cell} project={projectsById.get(cell.id)!} index={index} mobile={mobile} />)}
    </svg>}
  </div>;
}
