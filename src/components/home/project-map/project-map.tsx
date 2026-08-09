import type { Project } from '@/lib/project-map/types';
import { ProjectMapCell } from './project-map-cell';

export function ProjectMap({ projects }: { projects: Project[] }) {
  return <div className="project-map-shell" role="list" aria-label="名下的项目地图">
    {projects.map((project, index) => <ProjectMapCell key={project.id} project={project} index={index} />)}
  </div>;
}
