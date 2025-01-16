#!/bin/sh
set -e

echo "🚀 Running database migrations..."
npx drizzle-kit push

echo "✅ Database migrations completed"

# Start the main application
exec "$@" 