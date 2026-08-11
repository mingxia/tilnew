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

type LabelCandidate = Point & { distance: number; max: number; half: number };

function pointToSegmentDistance(point: Point, start: Point, end: Point) {
  let x = start.x;
  let y = start.y;
  const dx = end.x - x;
  const dy = end.y - y;

  if (dx || dy) {
    const t = Math.max(0, Math.min(1, ((point.x - x) * dx + (point.y - y) * dy) / (dx * dx + dy * dy)));
    x += dx * t;
    y += dy * t;
  }
  return Math.hypot(point.x - x, point.y - y);
}

function signedDistanceToPolygon(point: Point, polygon: Point[]) {
  let inside = false;
  let distance = Number.POSITIVE_INFINITY;

  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index, index += 1) {
    const start = polygon[index];
    const end = polygon[previous];
    if ((start.y > point.y) !== (end.y > point.y)
      && point.x < ((end.x - start.x) * (point.y - start.y)) / (end.y - start.y) + start.x) {
      inside = !inside;
    }
    distance = Math.min(distance, pointToSegmentDistance(point, start, end));
  }
  return (inside ? 1 : -1) * distance;
}

function labelCandidate(x: number, y: number, half: number, polygon: Point[]): LabelCandidate {
  const distance = signedDistanceToPolygon({ x, y }, polygon);
  return { x, y, half, distance, max: distance + half * Math.SQRT2 };
}

/**
 * Find the polygon's visual centre (the pole of inaccessibility), rather than
 * averaging its vertices. The returned point maximises its clearance from all
 * edges, which makes it a stable, natural anchor for labels in irregular cells.
 */
export function polygonLabelPoint(polygon: Point[], precision = 0.5): Point {
  if (!polygon.length) return { x: 0, y: 0 };
  const xs = polygon.map((point) => point.x);
  const ys = polygon.map((point) => point.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const width = Math.max(...xs) - minX;
  const height = Math.max(...ys) - minY;
  const cellSize = Math.min(width, height);
  if (!cellSize) return polygon[0];

  const queue: LabelCandidate[] = [];
  const half = cellSize / 2;
  for (let x = minX; x < minX + width; x += cellSize) {
    for (let y = minY; y < minY + height; y += cellSize) {
      queue.push(labelCandidate(x + half, y + half, half, polygon));
    }
  }

  const centroid = polygonCentroid(polygon);
  let best = labelCandidate(centroid.x, centroid.y, 0, polygon);
  const boundsCentre = labelCandidate(minX + width / 2, minY + height / 2, 0, polygon);
  if (boundsCentre.distance > best.distance) best = boundsCentre;

  while (queue.length) {
    queue.sort((a, b) => a.max - b.max);
    const candidate = queue.pop()!;
    if (candidate.distance > best.distance) best = candidate;
    if (candidate.max - best.distance <= precision) continue;

    const nextHalf = candidate.half / 2;
    queue.push(
      labelCandidate(candidate.x - nextHalf, candidate.y - nextHalf, nextHalf, polygon),
      labelCandidate(candidate.x + nextHalf, candidate.y - nextHalf, nextHalf, polygon),
      labelCandidate(candidate.x - nextHalf, candidate.y + nextHalf, nextHalf, polygon),
      labelCandidate(candidate.x + nextHalf, candidate.y + nextHalf, nextHalf, polygon),
    );
  }

  return { x: best.x, y: best.y };
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
