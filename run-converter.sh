#!/bin/bash

# Absolute or relative path to your project root
PROJECT_DIR="/data/git/wado-calc-tao"
CONVERTER="$PROJECT_DIR/converter/convert.mjs"

echo "📂 Navigating to project directory: $PROJECT_DIR"
cd "$PROJECT_DIR" || {
  echo "❌ Failed to navigate to $PROJECT_DIR"
  exit 1
}

# Check if the converter script exists
if [[ ! -f "$CONVERTER" ]]; then
  echo "❌ Converter script not found at: $CONVERTER"
  exit 1
fi

echo "🔄 Running data converter..."
node "$CONVERTER"

echo "✅ Done."
