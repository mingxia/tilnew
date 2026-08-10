import { polygonArea, polygonCentroid } from './geometry';
import { roundedPolygonPath } from './smooth-path';
import type { LayoutOptions, Point, Project, ProjectMapCell } from './types';

type Rect = { x: number; y: number; width: number; height: number };
type ProjectRect = { project: Project; rect: Rect };

function sumWeights(projects: Project[]) {
  return projects.reduce((sum, project) => sum + project.weight, 0);
}

/**
 * Split an ordered set into a deterministic, weight-proportional treemap.
 * Every split divides the available area by the exact sum of each side's
 * weights, so a project's final area is always directly proportional to its
 * configured weight.
 */
function partitionProjects(projects: Project[], rect: Rect, splitVertically: boolean): ProjectRect[] {
  if (projects.length === 1) return [{ project: projects[0], rect }];

  const totalWeight = sumWeights(projects);
  let leftWeight: number = projects[0].weight;
  let splitIndex = 1;
  for (let index = 2; index < projects.length; index += 1) {
    const nextWeight = leftWeight + projects[index - 1].weight;
    if (Math.abs(totalWeight / 2 - nextWeight) <= Math.abs(totalWeight / 2 - leftWeight)) {
      leftWeight = nextWeight;
      splitIndex = index;
    } else {
      break;
    }
  }

  const ratio = leftWeight / totalWeight;
  const firstRect = splitVertically
    ? { ...rect, width: rect.width * ratio }
    : { ...rect, height: rect.height * ratio };
  const secondRect = splitVertically
    ? { x: rect.x + firstRect.width, y: rect.y, width: rect.width - firstRect.width, height: rect.height }
    : { x: rect.x, y: rect.y + firstRect.height, width: rect.width, height: rect.height - firstRect.height };

  return [
    ...partitionProjects(projects.slice(0, splitIndex), firstRect, !splitVertically),
    ...partitionProjects(projects.slice(splitIndex), secondRect, !splitVertically),
  ];
}

export function generateProjectMapLayout(options: LayoutOptions): ProjectMapCell[] {
  const { width, height, direction } = options;
  if (!width || !height || !options.projects.length) return [];

  const projects = [...options.projects].sort((a, b) => a.year - b.year || a.id.localeCompare(b.id));
  const projectRects = partitionProjects(projects, { x: 0, y: 0, width, height }, direction === 'horizontal');

  return projectRects.map(({ project, rect }) => {
    const polygon: Point[] = [
      { x: rect.x, y: rect.y },
      { x: rect.x + rect.width, y: rect.y },
      { x: rect.x + rect.width, y: rect.y + rect.height },
      { x: rect.x, y: rect.y + rect.height },
    ];
    const bounds = { width: rect.width, height: rect.height };
    const radius = Math.max(10, Math.min(36, Math.min(bounds.width, bounds.height) * 0.1));

    return {
      id: project.id,
      polygon,
      path: roundedPolygonPath(polygon, radius),
      centroid: polygonCentroid(polygon),
      bounds,
      area: polygonArea(polygon),
    };
  });
}
