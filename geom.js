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
    let dx = handle.x - anchor.x;
    let dy = handle.y - anchor.y;
    if (dx < 0) {
      dx = -dx;
      dy = -dy;
    }
    return { x: anchor.x - dx, y: anchor.y - dy };
  }

  function fillet(prev, corner, next, radius) {
    const ab = dist(prev, corner) || 1;
    const cb = dist(next, corner) || 1;
    const cut = Math.min(ab, cb) * 0.45;
    return {
      p1: {
        x: corner.x + ((prev.x - corner.x) * cut) / ab,
        y: corner.y + ((prev.y - corner.y) * cut) / ab,
      },
      p2: {
        x: corner.x + ((next.x - corner.x) * cut) / cb,
        y: corner.y + ((next.y - corner.y) * cut) / cb,
      },
      cut: cut,
      asked: radius,
    };
  }

  return { dist, linePoint, quadPoint, cubicPoint, closedHandle, fillet };
});
