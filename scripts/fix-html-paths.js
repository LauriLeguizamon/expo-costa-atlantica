const fs = require("fs");
const path = require("path");

function fixHtmlPaths() {
  const buildDir = path.join(__dirname, "../dist");
  const indexPath = path.join(buildDir, "index.html");

  if (!fs.existsSync(indexPath)) {
    console.error("index.html not found. Run build first.");
    process.exit(1);
  }

  let content = fs.readFileSync(indexPath, "utf8");

  // Fix paths that don't have the /app/ prefix
  content = content.replace(/src="\//g, 'src="/app/');
  content = content.replace(/href="\//g, 'href="/app/');
  content = content.replace(/href="\/app\/app\//g, 'href="/app/'); // Fix double app paths

  // Fix manifest.json reference
  content = content.replace(/"\/manifest.json"/g, '"/app/manifest.json"');

  // Fix static asset paths
  content = content.replace(/"\/_expo\/static/g, '"/app/_expo/static');

  fs.writeFileSync(indexPath, content);
  console.log("✅ Fixed paths in index.html");

  // Also check and fix manifest.json if it exists
  const manifestPath = path.join(buildDir, "manifest.json");
  if (fs.existsSync(manifestPath)) {
    let manifest = fs.readFileSync(manifestPath, "utf8");
    manifest = manifest.replace(/"start_url": "\//g, '"start_url": "/app/');
    fs.writeFileSync(manifestPath, manifest);
    console.log("✅ Fixed paths in manifest.json");
  }
}

fixHtmlPaths();
