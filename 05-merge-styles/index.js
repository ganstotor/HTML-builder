const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bundle.css');

fs.mkdir(outputDir, { recursive: true }, (err) => {
    if (err) throw err;

    fs.readdir(stylesDir, (err, files) => {
        if (err) throw err;

        const cssFiles = files.filter(file => path.extname(file) === '.css');
        
        const writeStream = fs.createWriteStream(outputFile);
        
        cssFiles.forEach((file, index) => {
            const filePath = path.join(stylesDir, file);
            const readStream = fs.createReadStream(filePath, 'utf-8');
            
            readStream.on('data', chunk => writeStream.write(chunk + '\n'));
            
            readStream.on('error', err => console.error(`Error reading file ${file}:`, err));
        });
    });
});
