const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('Hello! Please enter text. Type "exit" or press Ctrl+C to quit.');

rl.on('line', (input) => {
    if (input.trim().toLowerCase() === 'exit') {
        rl.close();
    } else {
        writeStream.write(input + '\n');
    }
});

rl.on('close', () => {
    console.log('Goodbye!');
    writeStream.end(() => process.exit(0));
});

process.on('SIGINT', () => {
    rl.close();
});
