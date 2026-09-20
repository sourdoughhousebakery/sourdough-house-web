const fs = require('node:fs');

// Split the source compound path without altering its Bezier control points.
function pathParts(source) {
  const d = source.match(/\sd="([^"]+)"/)[1];
  const tokens = [...d.matchAll(/[MmLlCcHhVvZz]|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?/g)];
  const counts = { m: 2, l: 2, c: 6, h: 1, v: 1 };
  const parts = [];
  let x = 0, y = 0, sx = 0, sy = 0, i = 0, command, part;
  function point(px, py) {
    part.minX = Math.min(part.minX, px); part.maxX = Math.max(part.maxX, px);
    part.minY = Math.min(part.minY, py); part.maxY = Math.max(part.maxY, py);
  }
  while (i < tokens.length) {
    const token = tokens[i];
    if (/^[a-z]$/i.test(token[0])) {
      command = token[0]; i++;
      if (command.toLowerCase() === 'z') {
        x = sx; y = sy;
        part.raw += d.slice(part.restStart, token.index + 1);
        parts.push(part); part = null;
        continue;
      }
    }
    const kind = command.toLowerCase();
    const count = counts[kind];
    if (!count) throw new Error(`Unsupported command ${command}`);
    const last = tokens[i + count - 1];
    const values = tokens.slice(i, i + count).map(t => Number(t[0]));
    const relative = command === kind;
    const ox = relative ? x : 0, oy = relative ? y : 0;
    if (kind === 'm') {
      x = values[0] + ox; y = values[1] + oy; sx = x; sy = y;
      part = { id: parts.length, raw: `M ${x} ${y}`, start: [x, y], segments: [], restStart: last.index + last[0].length,
        minX: x, maxX: x, minY: y, maxY: y };
      command = relative ? 'l' : 'L';
    } else if (kind === 'c') {
      const [x1, y1, x2, y2, x3, y3] = values.map((n, j) => n + (j % 2 ? oy : ox));
      part.segments.push({ command: 'C', values: [x1, y1, x2, y2, x3, y3] });
      for (let k = 1; k <= 20; k++) {
        const t = k / 20, u = 1 - t;
        point(u*u*u*x + 3*u*u*t*x1 + 3*u*t*t*x2 + t*t*t*x3,
          u*u*u*y + 3*u*u*t*y1 + 3*u*t*t*y2 + t*t*t*y3);
      }
      x = x3; y = y3;
    } else {
      if (kind === 'l') { x = ox + values[0]; y = oy + values[1]; }
      if (kind === 'h') x = ox + values[0];
      if (kind === 'v') y = oy + values[0];
      part.segments.push({ command: 'L', values: [x, y] });
      point(x, y);
    }
    i += count;
  }
  if (part) throw new Error('Unclosed contour');
  return parts;
}

module.exports = { pathParts };
if (require.main === module) {
  const parts = pathParts(fs.readFileSync('public/brand/logo-dragonfly.svg', 'utf8'));
  const summary = p => ({ id: p.id, length: p.raw.length,
    box: [p.minX, p.minY, p.maxX, p.maxY].map(n => Number(n.toFixed(2))) });
  console.log(JSON.stringify({ count: parts.length,
    largest: parts.filter(p => p.raw.length > 1800).map(summary),
    center: parts.filter(p => p.minX >= 89 && p.maxX <= 120).map(summary) }, null, 2));
}
