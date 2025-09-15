// We are creating JSON file "icon-set.json" in the following format:
// {
//    "iconName1": { "src": "data:...", "keywords": ["arrow", "left"], "name": "Arrow left" }
//    "iconName2": { "src": "data:...", "keywords": ["arrow", "right"], "name": "Arrow right" }
// }
// etc.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function combineIconsFromFolder(inputDir, folderName, outputDir) {
    const icons = {};
    const folderPath = join(inputDir, folderName);

    try {
        const files = readdirSync(folderPath).filter(file => file.endsWith('.svg'));
        files.forEach(file => {
            const filePath = join(folderPath, file);
            try {
                let data = readFileSync(filePath, 'utf8');

                data = data.replace(/#640000/gi, 'currentColor').replace(/rgb\(100,\s*0,\s*0\)/gi, 'currentColor').replace(/maroon/gi, '#80000000');

                writeFileSync(filePath, data, 'utf8');

                icons[file.replace(/\.svg$/i, '')] = {
                    // to save space do not add the prefix `data:image/svg+xml;base64,`
                    // it will be added when the icon is used
                    src: Buffer.from(data).toString('base64'),
                    words: [],
                    name: file
                        .replace(/\.svg$/i, '')
                        .replace(/-/g, ' ')
                        .replace(/\b\w/g, l => l.toUpperCase()),
                };
            } catch (err) {
                console.error(`Error reading or parsing ${file} from ${folderName}:`, err);
            }
        });

        const outputFile = join(outputDir, `icon-set-${folderName}.json`);
        writeFileSync(outputFile, JSON.stringify(icons, null, 2), 'utf8');
        console.log(`Combined ${Object.keys(icons).length} icons from folder '${folderName}' into ${outputFile}`);
    } catch (err) {
        console.error(`Error processing folder ${folderName}:`, err);
    }
}

function combineIconsFromAllFolders(baseDir, outputDir) {
    try {
        const items = readdirSync(baseDir);
        const folders = items.filter(item => {
            const itemPath = join(baseDir, item);
            return statSync(itemPath).isDirectory();
        });

        if (folders.length === 0) {
            console.log('No folders found in the current directory');
            return;
        }

        console.log(`Found ${folders.length} folders: ${folders.join(', ')}`);

        folders.forEach(folder => {
            combineIconsFromFolder(baseDir, folder, outputDir);
        });
    } catch (err) {
        console.error('Error scanning directories:', err);
    }
}

// Scan current directory for folders and create icon-set-<foldername>.json for each
combineIconsFromAllFolders('./', '../public/');
