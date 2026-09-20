const assert = require("assert");
const geom = require("../geom");

// 页面上写死的闭合锚点
const anchor = { x: 620, y: 150 };

// 手柄在锚点左侧：背柄必须镜像到右侧，与手柄隔着锚点成对
assert.deepStrictEqual(geom.closedHandle(anchor, { x: 500, y: 150 }), { x: 740, y: 150 });

// 斜向也一样：锚点是手柄和背柄的中点
assert.deepStrictEqual(geom.closedHandle(anchor, { x: 660, y: 190 }), { x: 580, y: 110 });

// 拖到竖直极值附近（dx 过 0）不许翻到同侧：左右各偏 0.5，背柄连续且始终在对侧
const left = geom.closedHandle(anchor, { x: 619.5, y: 60 });
const right = geom.closedHandle(anchor, { x: 620.5, y: 60 });
assert.ok(left.y > anchor.y && right.y > anchor.y, "背柄必须一直在手柄对侧");
assert.ok(Math.abs(left.x - right.x) <= 1 + 1e-9, "dx 过 0 时背柄要连续");
assert.deepStrictEqual(geom.closedHandle(anchor, { x: 620, y: 60 }), { x: 620, y: 240 });

console.log("ok");
