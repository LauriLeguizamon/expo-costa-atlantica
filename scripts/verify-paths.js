const fs = require("fs");
const path = require("path");

// Check if the build has been properly configured for the /app/ path
function verifyBuildPaths() {
  const buildDir = path.join(__dirname, "../dist");

  if (!fs.existsSync(buildDir)) {
    console.error('Build directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  // Check index.html for proper path references
  const indexPath = path.join(buildDir, "index.html");
  if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, "utf-8");

    // Check for proper asset paths
    if (!indexContent.includes('href="/app/')) {
      console.warn(
        "Warning: index.html may not have proper /app/ path references."
      );
    } else {
      console.log("✅ index.html has proper /app/ path references.");
    }
  }

  console.log("Path verification complete.");
}

verifyBuildPaths();
