const fs = require('fs');
const path = require('path');
const { promises: fsPromises } = require('fs');

async function copyDir() {
    const src = path.join(__dirname, 'files');
    const dest = path.join(__dirname, 'files-copy');
    
    try {
        await fsPromises.rm(dest, { recursive: true, force: true });
        await fsPromises.mkdir(dest, { recursive: true });
        
        const files = await fsPromises.readdir(src, { withFileTypes: true });
        
        for (const file of files) {
            const srcPath = path.join(src, file.name);
            const destPath = path.join(dest, file.name);
            
            if (file.isDirectory()) {
                await copyDirRecursive(srcPath, destPath);
            } else {
                await fsPromises.copyFile(srcPath, destPath);
            }
        }
    } catch (err) {
        console.error('Error copying directory:', err);
    }
}

async function copyDirRecursive(src, dest) {
    await fsPromises.mkdir(dest, { recursive: true });
    const files = await fsPromises.readdir(src, { withFileTypes: true });
    
    for (const file of files) {
        const srcPath = path.join(src, file.name);
        const destPath = path.join(dest, file.name);
        
        if (file.isDirectory()) {
            await copyDirRecursive(srcPath, destPath);
        } else {
            await fsPromises.copyFile(srcPath, destPath);
        }
    }
}

copyDir();
