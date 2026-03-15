#!/bin/bash

# ZeroScale-API Git Setup & Push Script
# This script helps you properly set up git and push to GitHub

echo "🚀 Setting up Git for ZeroScale-API..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
fi

# Add all files to git
echo "📁 Adding all files to Git..."
git add .

# Check for any uncommitted changes
if git diff --cached --quiet; then
    echo "📝 Committing changes..."
    
    # Create a comprehensive commit message
    COMMIT_MESSAGE="🚀 Complete ZeroScale-API Platform Update

🎨 Features Added:
- Advanced 3D Analytics Dashboard with Three.js
- Glassmorphism UI with Framer Motion animations
- Real-time performance monitoring and analytics
- Interactive charts and data visualization
- Responsive design with mobile support

📚 Documentation:
- Complete setup & deployment guide
- Step-by-step instructions for all components
- API reference with examples
- SDK usage documentation

🛠️ Technical Improvements:
- Enhanced TypeScript configuration
- Redis caching with intelligent invalidation
- Advanced filtering and pagination
- Comprehensive error handling
- Production-ready CI/CD pipeline

📦 New Components:
- React demo application with authentication
- Node.js client library with examples
- Official JavaScript SDK for easy integration
- Webhook system for real-time events

🚀 Deployment Ready:
- AWS serverless deployment configuration
- Docker containerization support
- Environment-specific deployment scripts
- Production monitoring and health checks

This update transforms ZeroScale-API into a complete, enterprise-grade platform that developers can immediately use and deploy."

    git commit -m "$COMMIT_MESSAGE"
    echo "✅ Changes committed successfully"
else
    echo "ℹ️ No changes to commit"
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Adding GitHub remote..."
    
    # Prompt for GitHub repository URL
    read -p "Enter your GitHub repository URL (e.g., https://github.com/yourusername/zeroscale-api.git): " GITHUB_URL
    
    if [ -n "$GITHUB_URL" ]; then
        echo "❌ Error: GitHub URL is required"
        exit 1
    fi
    
    # Add remote origin
    git remote add origin "$GITHUB_URL"
    echo "✅ Remote origin added: $GITHUB_URL"
else
    echo "ℹ️ Remote origin already exists"
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."

# Try to push to main branch
if git push origin main 2>/dev/null; then
    echo "✅ Successfully pushed to main branch!"
else
    echo "❌ Failed to push to main branch"
    echo "🔧 Trying to push to current branch..."
    
    # Push to current branch as fallback
    if git push origin HEAD 2>/dev/null; then
        echo "✅ Successfully pushed to current branch!"
    else
        echo "❌ Failed to push. Please check your Git configuration and permissions."
        echo "💡 Troubleshooting:"
        echo "   1. Make sure you have SSH keys configured or use GitHub token"
        echo "   2. Check if you have write access to the repository"
        echo "   3. Verify your GitHub credentials"
        exit 1
    fi
fi

echo ""
echo "🎉 Git setup and push completed!"
echo ""
echo "📋 Next steps:"
echo "1. Visit your GitHub repository to verify files are uploaded"
echo "2. Check GitHub Actions for CI/CD pipeline status"
echo "3. Deploy to staging/production using serverless framework"
echo ""
echo "🔗 Repository: $(git remote get-url origin)"
echo "📊 Current branch: $(git branch --show-current)"

# Optional: Set up GitHub Pages for documentation
read -p "Do you want to set up GitHub Pages for documentation? (y/n): " SETUP_PAGES

if [ "$SETUP_PAGES" = "y" ]; then
    echo "📚 Setting up GitHub Pages..."
    
    # Create gh-pages branch if it doesn't exist
    git checkout -b gh-pages 2>/dev/null || git checkout gh-pages
    
    # Build documentation for GitHub Pages
    npm run build
    
    # Copy built files to root
    cp -r dist/* ./
    
    # Add and commit documentation
    git add .
    git commit -m "📚 Add GitHub Pages documentation"
    
    # Push to gh-pages
    git push origin gh-pages
    
    echo "✅ GitHub Pages set up at: https://$(git config --get remote.origin.url | sed 's/.*github.com[:\/].*/\1.github.io/')/tree/gh-pages'"
    
    # Return to main branch
    git checkout main
fi

echo "🎯 ZeroScale-API Git setup completed successfully!"
