const fs = require("fs");
const path = require("path");

function createWebConfig() {
  const buildDir = path.join(__dirname, "../dist");

  // Create .htaccess file for Apache servers
  const htaccessContent = `
# Enable URL rewriting
RewriteEngine On

# If the request is not for a real file or directory
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Rewrite all other requests to the index.html
RewriteRule ^app/.* /app/index.html [L]

# Set proper MIME types
AddType text/css .css
AddType application/javascript .js
AddType application/json .json
AddType image/svg+xml .svg
AddType image/png .png
AddType image/jpeg .jpg .jpeg
AddType font/woff .woff
AddType font/woff2 .woff2

# Enable CORS
<IfModule mod_headers.c>
  Header set Access-Control-Allow-Origin "*"
</IfModule>
`;

  fs.writeFileSync(path.join(buildDir, ".htaccess"), htaccessContent);
  console.log("✅ Created .htaccess file for web server configuration");

  // Create a web.config file for IIS servers
  const webConfigContent = `<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url="^app/(.*)" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/app/index.html" />
        </rule>
      </rules>
    </rewrite>
    <staticContent>
      <mimeMap fileExtension=".json" mimeType="application/json" />
      <mimeMap fileExtension=".woff" mimeType="font/woff" />
      <mimeMap fileExtension=".woff2" mimeType="font/woff2" />
    </staticContent>
    <httpProtocol>
      <customHeaders>
        <add name="Access-Control-Allow-Origin" value="*" />
      </customHeaders>
    </httpProtocol>
  </system.webServer>
</configuration>`;

  fs.writeFileSync(path.join(buildDir, "web.config"), webConfigContent);
  console.log("✅ Created web.config file for IIS server configuration");
}

createWebConfig();
