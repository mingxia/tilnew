import { BookOpen, Feather, GraduationCap, Heart, House, Map, Music2, Sparkles } from 'lucide-react';
import type { Project } from '@/lib/project-map/types';
import type { OrganicSlot } from './project-map';

const icons = { book: BookOpen, feather: Feather, school: GraduationCap, heart: Heart, home: House, map: Map, music: Music2, sparkles: Sparkles };
const statusLabels = { done: '已完成', active: '进行中', idea: '想做' };

export function ProjectMapCell({ project, slot, index }: { project: Project; slot: OrganicSlot; index: number }) {
  const Icon = icons[project.icon];
  const href = project.href ?? `/projects/${project.slug}`;
  return (
    <a href={href} role="listitem" className={`project-map-cell status-${project.status}`} aria-label={`${project.title}，${statusLabels[project.status]}，进入项目详情`} style={{ animationDelay: `${index * 35}ms` }}>
      <path className="project-cell-shape" d={slot.path} />
      <foreignObject x={slot.x} y={slot.y} width={slot.width} height={slot.height} className="project-cell-foreign">
        <div className={`project-cell-inner size-${slot.size} align-${slot.align ?? 'start'}`}>
          <Icon aria-hidden="true" />
          <div className="project-cell-copy">
            <strong>{project.title}</strong>
            {project.description && <span>{project.description}</span>}
          </div>
          <span className="project-cell-year">{project.year}</span>
        </div>
      </foreignObject>
    </a>
  );
}
