const assert = require("assert");
const geom = require("../geom");

const R = 16;

function expectOnEdge(p, corner, end, d) {
  const ex = end.x - corner.x;
  const ey = end.y - corner.y;
  const px = p.x - corner.x;
  const py = p.y - corner.y;
  assert.ok(Math.abs(ex * py - ey * px) < 1e-9, "切点要落在边上");
  assert.ok(Math.abs(Math.hypot(px, py) - d) < 1e-9, "切点到角的距离");
}

// 直角：切距正好等于半径
const rightAngle = geom.fillet({ x: 0, y: 50 }, { x: 0, y: 0 }, { x: 50, y: 0 }, R);
assert.ok(Math.abs(rightAngle.cut - R) < 1e-9, "直角切距 == 半径");
expectOnEdge(rightAngle.p1, { x: 0, y: 0 }, { x: 0, y: 50 }, R);
expectOnEdge(rightAngle.p2, { x: 0, y: 0 }, { x: 50, y: 0 }, R);

// 60° 角：切距 = R / tan(30°) = R*sqrt(3)
const sixty = geom.fillet({ x: 50, y: 0 }, { x: 0, y: 0 }, { x: 25, y: 25 * Math.sqrt(3) }, R);
assert.ok(Math.abs(sixty.cut - R * Math.sqrt(3)) < 1e-9, "60° 切距 == R*sqrt(3)");

// 页面上写死的尖角：半径 16 时切距约 12.835，而不是旧算法的 8.298（按边长 45%）
const sharpCorner = { x: 40, y: 400 };
const sharp = geom.fillet({ x: 40, y: 250 }, sharpCorner, { x: 58, y: 404 }, R);
assert.ok(Math.abs(sharp.cut - 12.834745701854022) < 1e-9, "尖角切距按半径和夹角算");
expectOnEdge(sharp.p1, sharpCorner, { x: 40, y: 250 }, sharp.cut);
expectOnEdge(sharp.p2, sharpCorner, { x: 58, y: 404 }, sharp.cut);

// 页面上写死的钝角：半径 16 时切距约 1.584，而不是旧算法的 68.837
const bluntCorner = { x: 280, y: 330 };
const blunt = geom.fillet({ x: 120, y: 330 }, bluntCorner, { x: 430, y: 360 }, R);
assert.ok(Math.abs(blunt.cut - 1.5843122174845592) < 1e-9, "钝角切距按半径和夹角算");
expectOnEdge(blunt.p1, bluntCorner, { x: 120, y: 330 }, blunt.cut);
expectOnEdge(blunt.p2, bluntCorner, { x: 430, y: 360 }, blunt.cut);

// 边不够长时切距被边长截住；三点共线（180°）时不切
assert.strictEqual(geom.fillet({ x: 0, y: 5 }, { x: 0, y: 0 }, { x: 5, y: 0 }, R).cut, 5);
assert.ok(geom.fillet({ x: -10, y: 0 }, { x: 0, y: 0 }, { x: 10, y: 0 }, R).cut < 1e-9);

console.log("ok");
