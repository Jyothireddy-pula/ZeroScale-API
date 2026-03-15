#!/bin/bash

# Make all scripts executable
echo "🔧 Making Git scripts executable..."

# Navigate to scripts directory
cd "$(dirname "$0")"

# Make all shell scripts executable
chmod +x *.sh

echo "✅ Scripts made executable:"
echo "  📜 git-setup.sh - Complete Git setup and push"
echo "  ⚡ quick-push.sh - Quick Git push for updates"
echo "  🔧 make-executable.sh - This script"

echo ""
echo "🎯 Usage examples:"
echo "  ./git-setup.sh              # Full Git setup and push"
echo "  ./quick-push.sh              # Quick push changes"
echo ""
echo "🚀 All scripts are now ready to use!"
