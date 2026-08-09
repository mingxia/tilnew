import type { CSSProperties } from 'react';
import type { Project } from '@/lib/project-map/types';
import { ProjectMapCell } from './project-map-cell';

interface ProjectRect {
  project: Project;
  x: number;
  y: number;
  width: number;
  height: number;
}

function splitProjects(projects: Project[], x = 0, y = 0, width = 100, height = 100): ProjectRect[] {
  if (projects.length === 0) return [];
  if (projects.length === 1) return [{ project: projects[0], x, y, width, height }];

  const totalWeight = projects.reduce((sum, project) => sum + project.weight, 0);
  let splitIndex = 1;
  let firstWeight = projects[0].weight;

  while (
    splitIndex < projects.length - 1
    && firstWeight + projects[splitIndex].weight <= totalWeight / 2
  ) {
    firstWeight += projects[splitIndex].weight;
    splitIndex += 1;
  }

  const ratio = firstWeight / totalWeight;
  const first = projects.slice(0, splitIndex);
  const second = projects.slice(splitIndex);

  if (width >= height) {
    const firstWidth = width * ratio;
    return [
      ...splitProjects(first, x, y, firstWidth, height),
      ...splitProjects(second, x + firstWidth, y, width - firstWidth, height),
    ];
  }

  const firstHeight = height * ratio;
  return [
    ...splitProjects(first, x, y, width, firstHeight),
    ...splitProjects(second, x, y + firstHeight, width, height - firstHeight),
  ];
}

export function ProjectMap({ projects }: { projects: Project[] }) {
  const layout = splitProjects(projects);

  return <div className="project-map-shell" role="list" aria-label="名下的项目地图">
    {layout.map(({ project, x, y, width, height }, index) => (
      <ProjectMapCell
        key={project.id}
        project={project}
        index={index}
        style={{
          '--card-x': `${x}%`,
          '--card-y': `${y}%`,
          '--card-width': `${width}%`,
          '--card-height': `${height}%`,
        } as CSSProperties}
      />
    ))}
  </div>;
}
