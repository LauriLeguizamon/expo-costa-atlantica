#!/usr/bin/env node

/**
 * fixPaths.js
 * A Node.js script to rewrite absolute paths in HTML files
 * so that they point to /app/ instead of /.
 */

const fs = require("fs");
const path = require("path");

// Adjust this if your build folder is named differently
const DIST_DIR = path.join(__dirname, "./../dist");

// The search/replace pairs. You can add more if needed.
const REPLACEMENTS = [
  { from: /"\/_expo\//g, to: '"/app/_expo/' },
  // Example: If you have other absolute paths to fix, add them here:
  // { from: /"\/static\//g, to: '"/app/static/' },
];

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // Apply each search/replace
  for (const { from, to } of REPLACEMENTS) {
    content = content.replace(from, to);
  }

  fs.writeFileSync(filePath, content, "utf8");
  console.log(`Fixed paths in: ${filePath}`);
}

function walkDirectory(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recursively process subdirectories
      walkDirectory(fullPath);
    } else if (fullPath.endsWith(".html")) {
      // Fix paths in all .html files
      fixFile(fullPath);
    }
  }
}

// Start processing from the DIST_DIR
console.log(`Fixing paths in directory: ${DIST_DIR}`);
walkDirectory(DIST_DIR);
console.log("Path fix complete!");
