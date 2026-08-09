import { BookOpen, Feather, GraduationCap, Heart, House, Map, Music2, Sparkles } from 'lucide-react';
import type { Project } from '@/lib/project-map/types';

const icons = { book: BookOpen, feather: Feather, school: GraduationCap, heart: Heart, home: House, map: Map, music: Music2, sparkles: Sparkles };
const statusLabels = { done: '已完成', active: '进行中', idea: '想做' };

export function ProjectMapCell({ project, index }: { project: Project; index: number }) {
  const Icon = icons[project.icon];
  const href = project.href ?? `/projects/${project.slug}`;
  return <a href={href} role="listitem" className={`project-map-cell status-${project.status}`} aria-label={`${project.title}，${statusLabels[project.status]}，进入项目详情`} style={{ animationDelay: `${index * 35}ms` }}>
    <div className="project-card-topline"><span>{project.year}</span><span>{statusLabels[project.status]}</span></div>
    <Icon aria-hidden="true" />
    <div className="project-cell-content">
      <strong>{project.title}</strong>
      {project.description && <span>{project.description}</span>}
    </div>
    <span className="project-card-arrow" aria-hidden="true">↗</span>
  </a>;
}
