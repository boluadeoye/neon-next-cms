set -euo pipefail

echo "==== BASIC ===="
pwd
date -Is

echo
echo "==== VERSIONS ===="
node -v || true
npm -v || true
if [ -f package.json ]; then
  echo
  echo "package.json quick info:"
  node -e "const p=require('./package.json'); const info={ name:p.name, next:(p.dependencies?.next||p.devDependencies?.next||null), typescript:(p.devDependencies?.typescript||p.dependencies?.typescript||null)}; console.log(JSON.stringify(info,null,2));"
fi

echo
echo "==== GIT ===="
git rev-parse --abbrev-ref HEAD 2>/dev/null || true
git status -sb 2>/dev/null || true
git remote -v 2>/dev/null || true

echo
echo "==== TOP-LEVEL FILES ===="
ls -la

echo
echo "==== APP ROUTES (Next.js App Router) ===="
if [ -d app ]; then
  find app -type f \( -name 'page.*' -o -name 'route.*' -o -name 'layout.*' \) | sort
else
  echo "(no app/ dir found)"
fi

echo
echo "==== PAGES ROUTES (if any legacy pages/) ===="
if [ -d pages ]; then
  find pages -type f \( -name '*.tsx' -o -name '*.ts' -o -name '*.js' \) | sort
else
  echo "(no pages/ dir found)"
fi

echo
echo "==== COMPONENT/LIB DIRS ===="
find . -maxdepth 2 -type d \( -name 'components' -o -name 'lib' -o -name 'ui' -o -name 'styles' \) 2>/dev/null | sort

echo
echo "==== DEPENDENCIES (top-level names) ===="
if [ -f package.json ]; then
  node -e "const p=require('./package.json'); const d={...p.dependencies,...p.devDependencies}; console.log(Object.keys(d).sort().join('\n'));" || true
fi

echo
echo "==== ENV KEYS (.env*) — values masked ===="
for f in .env .env.local .env.development .env.production; do
  if [ -f "$f" ]; then
    echo "[$f]"
    grep -E '^[A-Za-z0-9_]+=' "$f" | sed 's/=.*$//' | sort -u
  fi
done

echo
echo "==== DB MIGRATIONS (last few files) ===="
for dir in migrations drizzle prisma; do
  if [ -d "$dir" ]; then
    echo "[$dir]"
    find "$dir" -type f \( -name '*.sql' -o -name '*.ts' -o -name '*.js' \) | sort | tail -n 12
  fi
done

echo
echo "==== COMMENTS SCHEMA HINT (grep) ===="
grep -RIn "comment" -- */* 2>/dev/null | head -n 40

echo
echo "==== NEXT CONFIG (first 120 lines) ===="
if [ -f next.config.js ]; then
  sed -n '1,120p' next.config.js
elif [ -f next.config.mjs ]; then
  sed -n '1,120p' next.config.mjs
else
  echo "(no next.config.* found)"
fi

echo
echo "==== VERCEL CONFIG (first 120 lines) ===="
if [ -f vercel.json ]; then
  sed -n '1,120p' vercel.json
else
  echo "(no vercel.json found)"
fi

echo
echo "==== ROUTE HANDLERS (API) ===="
if [ -d app ]; then
  find app -type f -name 'route.ts' -o -name 'route.js' | sort
fi

echo
echo "==== MANUAL/DOCS HINTS ===="
find . -maxdepth 2 -type f \( -iname 'manual.*' -o -iname 'readme.*' -o -iname 'docs*' \) 2>/dev/null | sort
