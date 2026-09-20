const http = require("http");
const fs = require("fs");
const path = require("path");
const { Bezier } = require("bezier-js");

const root = __dirname;
const port = 8755;
const openQuad = [
  { x: 36, y: 150 },
  { x: 110, y: 28 },
  { x: 196, y: 156 },
];

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
};

const server = http.createServer((req, res) => {
  if (req.url === "/api/quad") {
    const curve = new Bezier(openQuad[0], openQuad[1], openQuad[2]);
    const pts = [];
    for (let i = 0; i <= 8; i++) pts.push(curve.get(i / 8));
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ points: openQuad, samples: pts }));
    return;
  }
  const raw = req.url === "/" ? "index.html" : req.url.split("?")[0].replace(/^\/+/, "");
  const file = path.join(root, raw);
  if (file !== root && !file.startsWith(root + path.sep)) {
    res.writeHead(404);
    res.end();
    return;
  }
  fs.readFile(file, (err, buf) => {
    if (err) {
      res.writeHead(404);
      res.end();
      return;
    }
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "text/plain" });
    res.end(buf);
  });
});

server.listen(port, "127.0.0.1");
