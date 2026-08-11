export type ProjectStatus = 'ongoing' | 'paused' | 'done' | 'planned';

export type ProjectIcon =
  | 'book-copy'
  | 'book-open'
  | 'building-2'
  | 'drama'
  | 'graduation-cap'
  | 'heart-handshake'
  | 'images'
  | 'landmark'
  | 'library'
  | 'mail'
  | 'map'
  | 'museum'
  | 'music'
  | 'pen-line'
  | 'radio'
  | 'scroll-text'
  | 'sparkles';

export interface Project {
  id: string;
  slug: string;
  title: string;
  description?: string;
  details?: string;
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
  labelPoint: Point;
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
