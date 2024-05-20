import { writeFileSync } from "fs";
import { join } from "path";
import { exec } from "child_process";

const htaccessContent = `
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
`;

// Path to the .htaccess file in the dist folder
const htaccessPath = join("dist", ".htaccess");

// Write the .htaccess file with the specified content
writeFileSync(htaccessPath, htaccessContent, "utf8");

console.log("Created .htaccess file");

// Run the gh-pages command to deploy
exec("gh-pages -d dist", (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(stdout);
});
