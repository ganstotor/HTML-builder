const fs = require('fs/promises');
const path = require('path');

const secretFolderPath = path.join(__dirname, 'secret-folder');

async function displayFileInfo() {
  try {
    const files = await fs.readdir(secretFolderPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(secretFolderPath, file.name);
        const stats = await fs.stat(filePath);
        const fileExtension = path.extname(file.name).slice(1);
        const fileSize = stats.size / 1024;
        console.log(`${file.name} - ${fileExtension} - ${fileSize}kb`);
      }
    }
  } catch (error) {
    console.error('Error reading directory:', error);
  }
}

displayFileInfo();
