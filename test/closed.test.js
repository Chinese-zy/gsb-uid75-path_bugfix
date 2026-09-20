const assert = require("assert");
const geom = require("../geom");

const anchor = { x: 620, y: 150 };

let back = geom.closedHandle(anchor, { x: 500, y: 150 });
assert.deepStrictEqual(back, { x: 740, y: 150 });

back = geom.closedHandle(anchor, { x: 700, y: 110 });
assert.deepStrictEqual(back, { x: 540, y: 190 });

const handles = [
  { x: 500, y: 150 },
  { x: 619.9, y: 150 },
  { x: 620.1, y: 150 },
  { x: 620, y: 40 },
  { x: 480, y: 60 },
];
for (const h of handles) {
  const b = geom.closedHandle(anchor, h);
  assert.ok(Math.abs((h.x + b.x) / 2 - anchor.x) < 1e-9, "midpoint x");
  assert.ok(Math.abs((h.y + b.y) / 2 - anchor.y) < 1e-9, "midpoint y");
  const startTan = { x: h.x - anchor.x, y: h.y - anchor.y };
  const endTan = { x: anchor.x - b.x, y: anchor.y - b.y };
  assert.ok(Math.abs(startTan.x - endTan.x) < 1e-9, "tangent x");
  assert.ok(Math.abs(startTan.y - endTan.y) < 1e-9, "tangent y");
}

const eps = 1e-4;
const left = geom.closedHandle(anchor, { x: anchor.x - eps, y: 150 });
const right = geom.closedHandle(anchor, { x: anchor.x + eps, y: 150 });
assert.ok(
  Math.hypot(left.x - right.x, left.y - right.y) < 1e-2,
  "back handle must not flip when crossing the anchor vertical"
);

console.log("ok");
