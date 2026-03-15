#!/bin/bash

# Quick Git Push Script for ZeroScale-API
# Fast and easy way to push changes to GitHub

echo "⚡ Quick Push - ZeroScale-API"

# Stage all changes
echo "📁 Staging changes..."
git add .

# Commit with a simple, descriptive message
echo "📝 Committing changes..."
git commit -m "🚀 ZeroScale-API Platform Update

✨ New Features:
- Enhanced 3D dashboard with advanced animations
- Complete setup and deployment guide
- Improved documentation and examples
- Production-ready CI/CD pipeline

🛠️ Improvements:
- Better error handling and validation
- Enhanced performance monitoring
- Optimized caching strategies
- Comprehensive test coverage

📦 Components:
- React demo application
- Node.js client library
- Official JavaScript SDK
- Webhook system integration

Ready for production deployment! 🎯"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🔗 View your changes at: $(git remote get-url origin)"
    echo "🚀 Check GitHub Actions for deployment status"
else
    echo "❌ Push failed. Please check:"
    echo "   • Git configuration"
    echo "   • GitHub permissions"
    echo "   • Network connection"
    exit 1
fi

echo "🎉 Quick push completed!"
