#!/bin/bash
set -e

echo "==> Switching Prisma provider: sqlite → postgresql"
sed -i "s/provider = \"sqlite\"/provider = \"postgresql\"/" prisma/schema.prisma
echo "==> schema.prisma after switch:"
grep "provider" prisma/schema.prisma

echo "==> Running prisma generate"
npx prisma generate

echo "==> Building Next.js"
npm run build

echo "==> Copying static assets"
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public

echo "==> Build complete"
