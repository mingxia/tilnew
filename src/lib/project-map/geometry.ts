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

/**
 * Replace visually sharp tips with a short edge. Besides softening acute
 * corners, this guarantees that a triangular cell is rendered with at least
 * four sides. The cut is deliberately capped so the weighted area remains
 * effectively unchanged.
 */
export function bevelSharpCorners(
  points: Point[],
  maxAngle = Math.PI / 3,
  maxCut = 24,
): Point[] {
  if (points.length < 3) return points;

  const corners = points.map((point, index) => {
    const previous = points[(index + points.length - 1) % points.length];
    const next = points[(index + 1) % points.length];
    const previousLength = Math.hypot(previous.x - point.x, previous.y - point.y);
    const nextLength = Math.hypot(next.x - point.x, next.y - point.y);
    const dot = (previous.x - point.x) * (next.x - point.x)
      + (previous.y - point.y) * (next.y - point.y);
    const lengthProduct = previousLength * nextLength;
    const cosine = lengthProduct
      ? Math.max(-1, Math.min(1, dot / lengthProduct))
      : 1;
    return { angle: Math.acos(cosine), previous, point, next, previousLength, nextLength };
  });
  const sharpestCorner = corners.reduce(
    (sharpest, corner, index) => corner.angle < corners[sharpest].angle ? index : sharpest,
    0,
  );

  return corners.flatMap((corner, index) => {
    const shouldBevel = corner.angle < maxAngle || (points.length === 3 && index === sharpestCorner);
    if (!shouldBevel || !corner.previousLength || !corner.nextLength) return [corner.point];

    const cut = Math.min(maxCut, corner.previousLength * 0.12, corner.nextLength * 0.12);
    return [
      {
        x: corner.point.x + ((corner.previous.x - corner.point.x) / corner.previousLength) * cut,
        y: corner.point.y + ((corner.previous.y - corner.point.y) / corner.previousLength) * cut,
      },
      {
        x: corner.point.x + ((corner.next.x - corner.point.x) / corner.nextLength) * cut,
        y: corner.point.y + ((corner.next.y - corner.point.y) / corner.nextLength) * cut,
      },
    ];
  });
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
