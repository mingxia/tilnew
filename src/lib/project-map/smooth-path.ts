import type { Point } from './types';

export function roundedPolygonPath(points: Point[], radius: number) {
  if (points.length < 3) return '';
  const corners = points.map((point, index) => {
    const previous = points[(index + points.length - 1) % points.length];
    const next = points[(index + 1) % points.length];
    const previousLength = Math.hypot(point.x - previous.x, point.y - previous.y);
    const nextLength = Math.hypot(next.x - point.x, next.y - point.y);
    const amount = Math.min(radius, previousLength * 0.22, nextLength * 0.22);
    return {
      point,
      before: { x: point.x + ((previous.x - point.x) / previousLength) * amount, y: point.y + ((previous.y - point.y) / previousLength) * amount },
      after: { x: point.x + ((next.x - point.x) / nextLength) * amount, y: point.y + ((next.y - point.y) / nextLength) * amount },
    };
  });
  const first = corners[0];
  return [`M ${first.after.x.toFixed(2)} ${first.after.y.toFixed(2)}`,
    ...corners.slice(1).map((corner) => `L ${corner.before.x.toFixed(2)} ${corner.before.y.toFixed(2)} Q ${corner.point.x.toFixed(2)} ${corner.point.y.toFixed(2)} ${corner.after.x.toFixed(2)} ${corner.after.y.toFixed(2)}`),
    `L ${first.before.x.toFixed(2)} ${first.before.y.toFixed(2)} Q ${first.point.x.toFixed(2)} ${first.point.y.toFixed(2)} ${first.after.x.toFixed(2)} ${first.after.y.toFixed(2)} Z`,
  ].join(' ');
}
