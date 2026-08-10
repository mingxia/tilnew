import { bevelSharpCorners, clipHalfPlane, polygonArea, polygonCentroid } from './geometry';
import { seededUnit } from './seed';
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
  const { width, height, direction, seed } = options;
  if (!width || !height || !options.projects.length) return [];

  const projects = [...options.projects].sort((a, b) => a.year - b.year || a.id.localeCompare(b.id));
  const years = projects.map((project) => project.year);
  const minYear = Math.min(...years);
  const yearSpan = Math.max(1, Math.max(...years) - minYear);
  const sites = projects.map((project, index) => {
    const time = (project.year - minYear) / yearSpan;
    const jitter = seededUnit(`${seed}:${project.id}`);
    const cross = (index + 0.5 + (jitter - 0.5) * 0.7) / projects.length;
    return direction === 'horizontal'
      ? { x: width * (0.1 + time * 0.8 + (jitter - 0.5) * 0.09), y: height * (0.08 + (cross % 0.84)), power: 0 }
      : { x: width * (0.08 + (cross % 0.84)), y: height * (0.1 + time * 0.8 + (jitter - 0.5) * 0.09), power: 0 };
  });
  const visualWeights = projects.map((project) => project.weight);
  const weightSum = visualWeights.reduce((sum, weight) => sum + weight, 0);
  let polygons: Point[][] = [];
  for (let iteration = 0; iteration < 300; iteration += 1) {
    polygons = sites.map((site, index) => {
      let polygon: Point[] = [{ x: 0, y: 0 }, { x: width, y: 0 }, { x: width, y: height }, { x: 0, y: height }];
      sites.forEach((other, otherIndex) => {
        if (index === otherIndex) return;
        polygon = clipHalfPlane(polygon, 2 * (other.x - site.x), 2 * (other.y - site.y), other.x ** 2 + other.y ** 2 - site.x ** 2 - site.y ** 2 + site.power - other.power);
      });
      return polygon;
    });
    const gain = width * height * 0.03;
    sites.forEach((site, index) => {
      const target = (visualWeights[index] / weightSum) * width * height;
      const actual = Math.max(1, polygonArea(polygons[index]));
      site.power += ((target - actual) / (width * height)) * gain;
    });
  }
  return projects.map((project, index) => {
    // Power cells can naturally end in triangles or needle-like corners.
    // Bevel those tips only after the weighted solver has converged, so the
    // weight calculation itself is not disturbed by the visual constraint.
    const polygon = bevelSharpCorners(polygons[index]);
    const xs = polygon.map((point) => point.x);
    const ys = polygon.map((point) => point.y);
    const bounds = { width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys) };
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
