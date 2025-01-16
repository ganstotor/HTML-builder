const fs = require('fs');
const path = require('path');
const { mkdir, readdir, readFile, writeFile, copyFile, stat } = require('fs/promises');

const projectDist = path.join(__dirname, 'project-dist');
const templateFile = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const outputHtml = path.join(projectDist, 'index.html');
const outputCss = path.join(projectDist, 'style.css');
const outputAssets = path.join(projectDist, 'assets');

async function buildPage() {
    await mkdir(projectDist, { recursive: true });
    await buildHtml();
    await mergeStyles();
    await copyAssets(assetsDir, outputAssets);
}

async function buildHtml() {
    let template = await readFile(templateFile, 'utf-8');
    const tags = template.match(/{{\w+}}/g) || [];
    
    for (const tag of tags) {
        const componentName = tag.replace(/{{|}}/g, '');
        const componentPath = path.join(componentsDir, `${componentName}.html`);
        
        try {
            const content = await readFile(componentPath, 'utf-8');
            template = template.replace(new RegExp(tag, 'g'), content);
        } catch {
            console.warn(`Component ${componentName}.html not found`);
        }
    }
    
    await writeFile(outputHtml, template);
}

async function mergeStyles() {
    const files = await readdir(stylesDir);
    const cssFiles = files.filter(file => path.extname(file) === '.css');
    const writeStream = fs.createWriteStream(outputCss);
    
    for (const file of cssFiles) {
        const filePath = path.join(stylesDir, file);
        const readStream = fs.createReadStream(filePath, 'utf-8');
        readStream.pipe(writeStream, { end: false });
    }
}

async function copyAssets(src, dest) {
    await mkdir(dest, { recursive: true });
    const items = await readdir(src);
    
    for (const item of items) {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        
        const fileStat = await stat(srcPath);
        if (fileStat.isDirectory()) {
            await copyAssets(srcPath, destPath);
        } else {
            await copyFile(srcPath, destPath);
        }
    }
}

buildPage().catch(console.error);
