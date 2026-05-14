const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "..", "dist", "ts", "src", "index.d.ts");
const cts = path.join(__dirname, "..", "dist", "ts", "src", "index.d.cts");
const mts = path.join(__dirname, "..", "dist", "ts", "src", "index.d.mts");

fs.copyFileSync(src, cts);
fs.copyFileSync(src, mts);
