import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const translationsPath = path.join(root, 'src', 'game', 'translations');
const baseFile = path.join(translationsPath, 'pl.ts');

const content = fs.readFileSync(baseFile, 'utf8');
const marker = 'export const TRANSLATIONS_PL';
const markerIndex = content.indexOf(marker);
if (markerIndex === -1) {
  throw new Error('Cannot find TRANSLATIONS_PL in pl.ts');
}
const objectStart = content.indexOf('{', markerIndex);
if (objectStart === -1) {
  throw new Error('Cannot find object start for translations');
}
const dictionaryText = content.slice(objectStart);
const keyRegex = /^\s{2}([A-Za-z0-9_]+):/gm;
const keys = new Set();
let match;
while ((match = keyRegex.exec(dictionaryText))) {
  keys.add(match[1]);
}

const skipPrefixes = ['role_'];
const skipKeys = new Set();
for (const key of keys) {
  if (skipPrefixes.some(prefix => key.startsWith(prefix))) {
    skipKeys.add(key);
  }
}

const translationFiles = new Set([
  path.join(translationsPath, 'pl.ts'),
  path.join(translationsPath, 'cz.ts'),
  path.join(translationsPath, 'poNaszymu.ts')
]);

const allowedExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.json']);

function collectFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', 'build', 'icons', 'public'].includes(entry.name)) {
        continue;
      }
      files.push(...collectFiles(path.join(dir, entry.name)));
    } else {
      const ext = path.extname(entry.name);
      if (!allowedExtensions.has(ext)) continue;
      files.push(path.join(dir, entry.name));
    }
  }
  return files;
}

const filesToScan = collectFiles(root).filter(file => !translationFiles.has(file));

const usage = {};
for (const key of keys) {
  usage[key] = false;
}

for (const file of filesToScan) {
  const text = fs.readFileSync(file, 'utf8');
  for (const key of keys) {
    if (skipKeys.has(key)) continue;
    if (usage[key]) continue;
    if (text.includes(key)) {
      usage[key] = true;
    }
  }
}

const unused = Object.entries(usage)
  .filter(([key, used]) => !used && !skipKeys.has(key))
  .map(([key]) => key)
  .sort();

console.log(JSON.stringify({ count: unused.length, keys: unused }, null, 2));
