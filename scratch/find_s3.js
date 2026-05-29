import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const searchDir = 'C:\\Users\\DELL\\Desktop\\SmartTrip_AI_Planner\\backend';

function searchFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        searchFiles(fullPath);
      }
    } else {
      if (file.endsWith('.js')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.toLowerCase().includes('s3') || content.toLowerCase().includes('aws')) {
          console.log(`Found match in: ${fullPath}`);
        }
      }
    }
  }
}

searchFiles(searchDir);
