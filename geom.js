(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Geom = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function linePoint(a, b, t) {
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  }

  function quadPoint(a, c, b, t) {
    const u = 1 - t;
    return {
      x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
      y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
    };
  }

  function cubicPoint(a, c1, c2, b, t) {
    const u = 1 - t;
    return {
      x: u * u * u * a.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * b.x,
      y: u * u * u * a.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * b.y,
    };
  }

  function closedHandle(anchor, handle) {
    return { x: 2 * anchor.x - handle.x, y: 2 * anchor.y - handle.y };
  }

  function fillet(prev, corner, next, radius) {
    const ab = dist(prev, corner) || 1;
    const cb = dist(next, corner) || 1;
    const ux = (prev.x - corner.x) / ab;
    const uy = (prev.y - corner.y) / ab;
    const vx = (next.x - corner.x) / cb;
    const vy = (next.y - corner.y) / cb;
    const cos = Math.min(1, Math.max(-1, ux * vx + uy * vy));
    const half = Math.acos(cos) / 2;
    const cut = Math.min(radius / Math.tan(half), ab, cb);
    return {
      p1: {
        x: corner.x + ux * cut,
        y: corner.y + uy * cut,
      },
      p2: {
        x: corner.x + vx * cut,
        y: corner.y + vy * cut,
      },
      cut: cut,
      asked: radius,
    };
  }

  return { dist, linePoint, quadPoint, cubicPoint, closedHandle, fillet };
});
