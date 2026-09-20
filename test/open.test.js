const assert = require("assert");
const { Bezier } = require("bezier-js");
const geom = require("../geom");

const a = { x: 0, y: 0 };
const c = { x: 10, y: 30 };
const b = { x: 40, y: 0 };
const curve = new Bezier(a, c, b);
const mid = curve.get(0.5);
const got = geom.quadPoint(a, c, b, 0.5);
assert.ok(Math.abs(mid.x - got.x) < 1e-6, "x");
assert.ok(Math.abs(mid.y - got.y) < 1e-6, "y");

const line = geom.linePoint({ x: 0, y: 0 }, { x: 10, y: 0 }, 0.5);
assert.strictEqual(line.x, 5);
assert.strictEqual(line.y, 0);

console.log("ok");
