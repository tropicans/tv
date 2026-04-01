#!/bin/sh
set -e

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Seeding database (Skipped)..."
# npx tsx prisma/seed.ts || echo "Seed skipped or already applied"

echo "Starting server..."
npx tsx src/index.ts