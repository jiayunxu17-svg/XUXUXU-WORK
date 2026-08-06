const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        getFiles(path.join(dir, file), fileList);
      }
    } else {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const allFiles = getFiles('src');
console.log('--- Checking image imports and src references in src/ ---');
allFiles.filter(f => f.endsWith('.tsx') || f.endsWith('.ts')).forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const imports = content.match(/import\s+[\s\S]*?from\s+['"][^'"]+\.(jpg|png|webp|svg)['"]/g) || [];
  imports.forEach(i => console.log(f, 'IMPORT:', i.replace(/\n/g, ' ')));

  const strMatches = content.match(/['"](\/[^'"]+\.(jpg|png|webp|svg))['"]/g) || [];
  strMatches.forEach(s => console.log(f, 'STRING PATH:', s));
});
