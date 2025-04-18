#!/bin/bash

# Path to your frontend directory
DIR="./frontend"

echo "🚮 Removing node_modules and package-lock.json..."
rm -rf "$DIR/node_modules" "$DIR/package-lock.json"

echo "📂 Entering $DIR..."
cd "$DIR" || { echo "❌ Directory not found: $DIR"; exit 1; }

echo "📦 Installing dependencies..."
npm install

echo "🚀 Starting dev server on host..."
npm run dev -- --host
