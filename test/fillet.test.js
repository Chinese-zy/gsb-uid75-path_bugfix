const assert = require("assert");
const geom = require("../geom");

const sharp = [{ x: 40, y: 250 }, { x: 40, y: 400 }, { x: 58, y: 404 }];
const blunt = [{ x: 120, y: 330 }, { x: 280, y: 330 }, { x: 430, y: 360 }];

function cornerAngle(prev, corner, next) {
  const ux = (prev.x - corner.x) / geom.dist(prev, corner);
  const uy = (prev.y - corner.y) / geom.dist(prev, corner);
  const vx = (next.x - corner.x) / geom.dist(next, corner);
  const vy = (next.y - corner.y) / geom.dist(next, corner);
  const dot = Math.max(-1, Math.min(1, ux * vx + uy * vy));
  return Math.acos(dot);
}

function check(poly, radius) {
  const [prev, corner, next] = poly;
  const f = geom.fillet(prev, corner, next, radius);
  const ab = geom.dist(prev, corner);
  const cb = geom.dist(next, corner);
  const theta = cornerAngle(prev, corner, next);
  const want = Math.min(radius / Math.tan(theta / 2), ab, cb);
  assert.ok(Math.abs(f.cut - want) < 1e-9, "cut follows radius and angle");
  assert.ok(Math.abs(geom.dist(f.p1, corner) - f.cut) < 1e-9, "p1 on edge at cut");
  assert.ok(Math.abs(geom.dist(f.p2, corner) - f.cut) < 1e-9, "p2 on edge at cut");
  const cross1 =
    (corner.x - prev.x) * (f.p1.y - prev.y) - (corner.y - prev.y) * (f.p1.x - prev.x);
  const cross2 =
    (next.x - corner.x) * (f.p2.y - corner.y) - (next.y - corner.y) * (f.p2.x - corner.x);
  assert.ok(Math.abs(cross1) < 1e-6, "p1 collinear with prev-corner");
  assert.ok(Math.abs(cross2) < 1e-6, "p2 collinear with corner-next");
  if (radius / Math.tan(theta / 2) <= Math.min(ab, cb)) {
    assert.ok(Math.abs(f.radius - radius) < 1e-6, "effective radius matches asked");
    const dc = geom.dist(f.center, corner);
    assert.ok(Math.abs(dc - radius / Math.sin(theta / 2)) < 1e-6, "center distance");
  }
  return f;
}

const fs = check(sharp, 16);
const fb = check(blunt, 16);

assert.ok(Math.abs(fs.cut - 12.8349) < 1e-3, "sharp cut hugs radius 16");
assert.ok(Math.abs(fb.cut - 1.5843) < 1e-3, "blunt cut hugs radius 16");
assert.ok(Math.abs(fs.radius - 16) < 1e-9, "sharp effective radius");
assert.ok(Math.abs(fb.radius - 16) < 1e-9, "blunt effective radius");

const clamped = geom.fillet(sharp[0], sharp[1], sharp[2], 1e6);
assert.ok(Math.abs(clamped.cut - Math.hypot(18, 4)) < 1e-9, "clamps to short edge");
assert.ok(clamped.radius < 1000, "effective radius shrinks when clamped");

const straight = geom.fillet({ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 20, y: 0 }, 16);
assert.ok(straight.cut < 1e-9, "straight corner gets no cut");

const folded = geom.fillet({ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 0, y: 0 }, 16);
assert.ok(Number.isFinite(folded.cut), "folded corner stays finite");
assert.ok(Math.abs(folded.cut - 10) < 1e-9, "folded corner clamps to edge");

const zeroEdge = geom.fillet({ x: 5, y: 5 }, { x: 5, y: 5 }, { x: 9, y: 9 }, 8);
assert.strictEqual(zeroEdge.cut, 0);
assert.ok(Number.isFinite(zeroEdge.p1.x) && Number.isFinite(zeroEdge.p2.y));

console.log("ok");
