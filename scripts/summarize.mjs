import { readdirSync, statSync, readFileSync } from 'fs';
import { join, sep } from 'path';

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const pkg = JSON.parse(readFileSync('package.json','utf8'));
const files = [];
try { files.push(...walk('app')); } catch {}
try { files.push(...walk('pages')); } catch {}

const pages = files.filter(f => /[\/\\]page\.(tsx|ts|js|jsx)$/.test(f));
const apis  = files.filter(f => /[\/\\]route\.(ts|js)$/.test(f));
const layouts = files.filter(f => /[\/\\]layout\.(tsx|ts|js|jsx)$/.test(f));

console.log(JSON.stringify({
  name: pkg.name,
  next: (pkg.dependencies?.next || pkg.devDependencies?.next || null),
  pages,
  apis,
  layouts
}, null, 2));
