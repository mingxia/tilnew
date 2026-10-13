import type { LayoutOptions, Point, Project, ProjectMapCell } from './types';

type Rect = { x: number; y: number; width: number; height: number };
type ProjectRect = { project: Project; rect: Rect };

function sumWeights(projects: Project[]) {
  return projects.reduce((sum, project) => sum + Math.max(1, project.weight), 0);
}

/** Deterministic, weight-proportional rectangular treemap.
 * Choose the split axis from the current rectangle to avoid needle-shaped tiles.
 */
function partitionProjects(projects: Project[], rect: Rect): ProjectRect[] {
  if (projects.length === 1) return [{ project: projects[0], rect }];
  const totalWeight = sumWeights(projects);
  let firstWeight = 0;
  let splitIndex = 1;
  let bestDifference = Infinity;
  for (let i = 1; i < projects.length; i += 1) {
    firstWeight += Math.max(1, projects[i - 1].weight);
    const difference = Math.abs(totalWeight / 2 - firstWeight);
    if (difference < bestDifference) {
      bestDifference = difference;
      splitIndex = i;
    }
  }

  const ratio = projects.slice(0, splitIndex).reduce((sum, p) => sum + Math.max(1, p.weight), 0) / totalWeight;
  const vertical = rect.width >= rect.height;
  const a: Rect = vertical
    ? { ...rect, width: rect.width * ratio }
    : { ...rect, height: rect.height * ratio };
  const b: Rect = vertical
    ? { x: rect.x + a.width, y: rect.y, width: rect.width - a.width, height: rect.height }
    : { x: rect.x, y: rect.y + a.height, width: rect.width, height: rect.height - a.height };
  return [
    ...partitionProjects(projects.slice(0, splitIndex), a),
    ...partitionProjects(projects.slice(splitIndex), b),
  ];
}

export function generateProjectMapLayout(options: LayoutOptions): ProjectMapCell[] {
  const { width, height, projects } = options;
  if (width <= 0 || height <= 0 || projects.length === 0) return [];
  // Important projects go first; tie-break by year and id for stable placement.
  const ordered = [...projects].sort((a, b) =>
    b.weight - a.weight || a.year - b.year || a.id.localeCompare(b.id)
  );
  return partitionProjects(ordered, { x: 0, y: 0, width, height }).map(({ project, rect }) => {
    const { x, y, width: w, height: h } = rect;
    const polygon: Point[] = [
      { x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h },
    ];
    return {
      id: project.id,
      polygon,
      path: `M ${x} ${y} H ${x + w} V ${y + h} H ${x} Z`,
      centroid: { x: x + w / 2, y: y + h / 2 },
      labelPoint: { x: x + w / 2, y: y + h / 2 },
      bounds: { width: w, height: h },
      area: w * h,
    };
  });
}
