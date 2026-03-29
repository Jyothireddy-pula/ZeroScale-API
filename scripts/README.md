# Git Scripts for ZeroScale-API

This directory contains helpful Git automation scripts for managing your ZeroScale-API project.

## 📜 Available Scripts

### 🚀 git-setup.sh
**Complete Git setup and push script**

**Features:**
- Initializes Git repository if not already done
- Adds all files to Git
- Creates comprehensive commit messages
- Sets up GitHub remote origin
- Pushes to GitHub with error handling
- Optional GitHub Pages setup for documentation
- Detailed troubleshooting and next steps

**Usage:**
```bash
# Make executable and run
chmod +x scripts/git-setup.sh
./scripts/git-setup.sh
```

**What it does:**
1. Checks if Git is initialized
2. Adds all files to staging area
3. Creates detailed commit message
4. Sets up GitHub remote if needed
5. Pushes to main branch (or current branch)
6. Optionally sets up GitHub Pages
7. Provides troubleshooting guidance

### ⚡ quick-push.sh
**Fast push script for quick updates**

**Features:**
- Stages all changes with `git add .`
- Creates descriptive commit message
- Pushes to GitHub immediately
- Simple error handling and feedback
- Shows repository URL and next steps

**Usage:**
```bash
# Make executable and run
chmod +x scripts/quick-push.sh
./scripts/quick-push.sh
```

**Best for:**
- Quick updates during development
- Pushing small changes
- Rapid iteration cycles
- Automated commit messages

## 🔧 Git Configuration

### Before Running Scripts

1. **Install Git** (if not already installed)
   ```bash
   # Ubuntu/Debian
   sudo apt-get install git
   
   # macOS
   brew install git
   
   # Windows
   # Download from git-scm.com
   ```

2. **Configure Git Identity**
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

3. **Set up SSH Keys** (Recommended)
   ```bash
   # Generate SSH key
   ssh-keygen -t rsa -b 4096 -C "your.email@example.com"
   
   # Add to GitHub account
   # Copy ~/.ssh/id_rsa.pub and add to GitHub > Settings > SSH and GPG keys
   ```

4. **Or use Personal Access Token**
   ```bash
   # Create token at GitHub > Settings > Developer settings > Personal access tokens
   # Use token when pushing: git push https://token@github.com/username/repo.git main
   ```

## 🎯 Git Workflow Integration

### Automated Workflow
```bash
# 1. Make changes to your code
# 2. Run quick-push script
./scripts/quick-push.sh

# 3. GitHub Actions automatically:
#    - Runs tests
#    - Builds project
#    - Deploys to staging
#    - Deploys to production
```

### Manual Workflow
```bash
# 1. Stage specific files
git add src/dashboard/App.jsx

# 2. Commit with custom message
git commit -m "Add advanced 3D dashboard features"

# 3. Push to specific branch
git push origin feature/new-dashboard
```

## 🚨 Troubleshooting

### Common Issues & Solutions

**"Permission denied (publickey)"**
```bash
# Check SSH key setup
ssh -T git@github.com

# Or use HTTPS with token
git remote set-url origin https://token@github.com/username/repo.git
```

**"fatal: remote origin already exists"**
```bash
# Remove existing remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/username/repo.git
```

**"Nothing to commit"**
```bash
# Check status
git status

# Add files if needed
git add .

# Check for untracked files
git add -A
```

## 📊 Git Best Practices

### Commit Message Format
```
🚀 [Type] Brief description

Examples:
🚀 [feat] Add 3D dashboard with Three.js
🚀 [fix] Resolve authentication token expiration
🚀 [docs] Update API documentation
🚀 [refactor] Optimize database queries
🚀 [test] Add integration tests for webhooks
```

### Branch Strategy
```
main          - Production-ready code
develop        - Development features
staging        - Pre-production testing
feature/*      - New features
hotfix/*       - Critical bug fixes
release/*      - Release preparation
```

### Tagging Releases
```bash
# Create annotated tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push tags
git push origin --tags
```

## 🎉 Success Indicators

Your scripts will show:
- ✅ Green checkmarks for successful operations
- ❌ Red indicators for failures
- 🔧 Blue wrench for configuration steps
- 📤 Blue arrow for push operations
- ℹ️ Blue info for guidance messages

---

**These scripts make Git management for ZeroScale-API effortless and professional!** 🚀
