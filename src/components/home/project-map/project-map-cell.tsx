import { BookOpen, Feather, GraduationCap, Heart, House, Map, Music2, Sparkles } from 'lucide-react';
import type { Project, ProjectMapCell as Cell } from '@/lib/project-map/types';

const icons = { book: BookOpen, feather: Feather, school: GraduationCap, heart: Heart, home: House, map: Map, music: Music2, sparkles: Sparkles };
const statusLabels = { done: '已完成', active: '进行中', idea: '想做' };

export function ProjectMapCell({ project, cell, index, mobile }: { project: Project; cell: Cell; index: number; mobile: boolean }) {
  const Icon = icons[project.icon];
  const minSide = Math.min(cell.bounds.width, cell.bounds.height);
  const density = mobile ? (minSide > 115 ? 'medium' : minSide > 62 ? 'small' : 'tiny') : (minSide > 210 ? 'large' : minSide > 125 ? 'medium' : minSide > 70 ? 'small' : 'tiny');
  const href = project.href ?? `/projects/${project.slug}`;
  return <a href={href} className={`project-map-cell status-${project.status}`} aria-label={`${project.title}，${statusLabels[project.status]}，进入项目详情`} style={{ animationDelay: `${index * 28}ms` }}>
    <path d={cell.path} vectorEffect="non-scaling-stroke" />
    <foreignObject x={cell.centroid.x - cell.bounds.width * 0.32} y={cell.centroid.y - cell.bounds.height * 0.3} width={cell.bounds.width * 0.64} height={cell.bounds.height * 0.6} pointerEvents="none">
      <div className={`project-cell-content density-${density}`}>
        <Icon aria-hidden="true" />
        {density !== 'tiny' && <strong>{project.title}</strong>}
        {(density === 'large' || density === 'medium') && !mobile && project.description && <span>{project.description}</span>}
        {density === 'large' && !mobile && <small>{project.year} · {statusLabels[project.status]}</small>}
      </div>
    </foreignObject>
    <title>{project.title} · {statusLabels[project.status]}</title>
  </a>;
}
