import type { Point } from './types';

export function polygonArea(points: Point[]) {
  return Math.abs(points.reduce((sum, point, index) => {
    const next = points[(index + 1) % points.length];
    return sum + point.x * next.y - next.x * point.y;
  }, 0)) / 2;
}

export function polygonCentroid(points: Point[]): Point {
  if (!points.length) return { x: 0, y: 0 };
  const total = points.reduce((sum, point) => ({ x: sum.x + point.x, y: sum.y + point.y }), { x: 0, y: 0 });
  return { x: total.x / points.length, y: total.y / points.length };
}

// Clip a convex polygon against ax + by <= c (Sutherland–Hodgman).
export function clipHalfPlane(polygon: Point[], a: number, b: number, c: number) {
  const output: Point[] = [];
  if (!polygon.length) return output;
  const inside = (point: Point) => a * point.x + b * point.y <= c + 0.0001;
  const intersection = (from: Point, to: Point) => {
    const denominator = a * (to.x - from.x) + b * (to.y - from.y);
    const t = denominator === 0 ? 0 : (c - a * from.x - b * from.y) / denominator;
    return { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t };
  };
  for (let index = 0; index < polygon.length; index += 1) {
    const current = polygon[index];
    const previous = polygon[(index + polygon.length - 1) % polygon.length];
    if (inside(current)) {
      if (!inside(previous)) output.push(intersection(previous, current));
      output.push(current);
    } else if (inside(previous)) output.push(intersection(previous, current));
  }
  return output;
}
