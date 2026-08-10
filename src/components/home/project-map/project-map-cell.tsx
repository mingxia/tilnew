import { BookOpen, Feather, GraduationCap, Heart, House, Map, Music2, Sparkles } from 'lucide-react';
import type { Project } from '@/lib/project-map/types';
import type { OrganicSlot } from './project-map';

const icons = { book: BookOpen, feather: Feather, school: GraduationCap, heart: Heart, home: House, map: Map, music: Music2, sparkles: Sparkles };
const statusLabels = { done: '已完成', active: '进行中', idea: '想做' };

type ProjectMapCellProps = {
  project: Project;
  slot: OrganicSlot;
  index: number;
  active: boolean;
  onActiveChange: (active: boolean) => void;
  onSelect: () => void;
};

export function ProjectMapCell({ project, slot, index, active, onActiveChange, onSelect }: ProjectMapCellProps) {
  return (
    <a
      href={project.href ?? `/projects/${project.slug}`}
      role="listitem"
      className={`project-map-cell status-${project.status}${active ? ' is-active' : ''}`}
      aria-label={`${project.title}，${statusLabels[project.status]}，查看项目简介`}
      style={{ animationDelay: `${index * 35}ms` }}
      onPointerEnter={() => onActiveChange(true)}
      onPointerLeave={() => onActiveChange(false)}
      onFocus={() => onActiveChange(true)}
      onBlur={() => onActiveChange(false)}
      onClick={(event) => {
        event.preventDefault();
        onSelect();
      }}
    >
      <path className="project-cell-shape" d={slot.path} />
    </a>
  );
}

export function ProjectMapLabel({ project, slot, active }: { project: Project; slot: OrganicSlot; active: boolean }) {
  const Icon = icons[project.icon];
  const showDescription = slot.size === 'large' || slot.size === 'medium';
  const showMeta = slot.size === 'large';
  const style = {
    left: `${(slot.x / 1200) * 100}%`,
    top: `${(slot.y / 720) * 100}%`,
    width: `${(slot.width / 1200) * 100}%`,
    height: `${(slot.height / 720) * 100}%`,
  };

  return (
    <div className={`project-cell-label${active ? ' is-active' : ''}`} style={style}>
      <div className={`project-cell-inner size-${slot.size} align-${slot.align ?? 'start'}`}>
        <Icon />
        <div className="project-cell-copy">
          <strong>{project.title}</strong>
          {showDescription && project.description && <span>{project.description}</span>}
        </div>
        {showMeta && <span className="project-cell-year">{project.year}</span>}
      </div>
    </div>
  );
}
