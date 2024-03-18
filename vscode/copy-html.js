const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'src/media');
const outPath = path.join(__dirname, 'out/media');

fs.readdirSync(srcPath).forEach(file => {
    if (file.endsWith('.html')) {
        const sourceFile = path.join(srcPath, file);
        const destFile = path.join(outPath, file);
        fs.copyFileSync(sourceFile, destFile);
    }
});

console.log('HTML files copied successfully!');