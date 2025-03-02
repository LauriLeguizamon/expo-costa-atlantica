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

  // Fix paths more comprehensively
  content = content.replace(/src="\/_expo\//g, 'src="/app/_expo/');
  content = content.replace(/href="\/_expo\//g, 'href="/app/_expo/');
  content = content.replace(/src="\//g, 'src="/app/');
  content = content.replace(/href="\//g, 'href="/app/');
  content = content.replace(/href="\/app\/app\//g, 'href="/app/'); // Fix double app paths

  // Fix manifest.json reference
  content = content.replace(/"\/manifest.json"/g, '"/app/manifest.json"');

  // Fix static asset paths with a more specific regex
  content = content.replace(/"(\/_expo\/[^"]+)"/g, '"/app$1"');

  // Fix CSS links explicitly
  content = content.replace(
    /href="\/_expo\/static\/css\//g,
    'href="/app/_expo/static/css/'
  );

  fs.writeFileSync(indexPath, content);
  console.log("✅ Fixed paths in index.html");

  // Fix manifest.json if it exists
  const manifestPath = path.join(buildDir, "manifest.json");
  if (fs.existsSync(manifestPath)) {
    let manifest = fs.readFileSync(manifestPath, "utf8");
    manifest = manifest.replace(/"start_url": "\//g, '"start_url": "/app/');
    fs.writeFileSync(manifestPath, manifest);
    console.log("✅ Fixed paths in manifest.json");
  }

  // Also fix all CSS files to have correct asset paths
  const cssDir = path.join(buildDir, "_expo/static/css");
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs
      .readdirSync(cssDir)
      .filter((file) => file.endsWith(".css"));
    cssFiles.forEach((cssFile) => {
      const cssPath = path.join(cssDir, cssFile);
      let cssContent = fs.readFileSync(cssPath, "utf8");

      // Fix url() references in CSS
      cssContent = cssContent.replace(/url\(\/_expo\//g, "url(/app/_expo/");
      cssContent = cssContent.replace(/url\("\/_expo\//g, 'url("/app/_expo/');
      cssContent = cssContent.replace(/url\('\/_expo\//g, "url('/app/_expo/");
      cssContent = cssContent.replace(/url\(\//g, "url(/app/");

      fs.writeFileSync(cssPath, cssContent);
      console.log(`✅ Fixed paths in CSS file: ${cssFile}`);
    });
  }
}

fixHtmlPaths();
