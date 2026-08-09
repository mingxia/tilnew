export type ProjectStatus = 'done' | 'active' | 'idea';

export type ProjectIcon = 'book' | 'sparkles' | 'home' | 'music' | 'school' | 'map' | 'feather' | 'heart';

export interface Project {
  id: string;
  slug: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  weight: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  year: number;
  icon: ProjectIcon;
  href?: string;
}

export interface Point { x: number; y: number }

export interface ProjectMapCell {
  id: string;
  path: string;
  polygon: Point[];
  centroid: Point;
  bounds: { width: number; height: number };
  area: number;
}

export interface LayoutOptions {
  projects: Project[];
  width: number;
  height: number;
  gap: number;
  seed: string;
  direction: 'horizontal' | 'vertical';
}
