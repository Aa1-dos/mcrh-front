const fs = require('fs');
const path = require('path');
const pkgPath = path.join(__dirname, 'node_modules', '@fortawesome', 'fontawesome-svg-core', 'index.js');
if (fs.existsSync(pkgPath)) {
  let content = fs.readFileSync(pkgPath, 'utf8');
  content = content.replace(
    /require\(['"]@fortawesome\/fontawesome-svg-core\/package\.json['"]\)/g,
    '{ version: "7.0.0" }'
  );
  fs.writeFileSync(pkgPath, content, 'utf8');
  console.log('FontAwesome package.json require patched!');
}
