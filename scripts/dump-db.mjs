import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync, readFileSync } from 'fs';

const envPath = new URL('../.env', import.meta.url);
const envVars = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .map((line) => {
      const idx = line.indexOf('=');
      return [line.slice(0, idx), line.slice(idx + 1)];
    })
);

const url = envVars.VITE_SUPABASE_URL;
const key = envVars.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(url, key);

const outDir = new URL('../db-dump/', import.meta.url).pathname;
mkdirSync(outDir, { recursive: true });

const tables = [
  { name: 'subjects', select: '*' },
  { name: 'tags', select: '*' },
  { name: 'post_tags', select: '*' },
  { name: 'posts', select: '*, post_tags(tags(*))' },
];

for (const { name, select } of tables) {
  const { data, error } = await supabase.from(name).select(select);
  if (error) {
    console.error(`Failed to dump "${name}":`, error.message);
    continue;
  }
  const path = `${outDir}${name}.json`;
  writeFileSync(path, JSON.stringify(data, null, 2));
  console.log(`Dumped ${data.length} row(s) from "${name}" -> ${path}`);
}
