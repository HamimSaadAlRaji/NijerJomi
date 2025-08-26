#!/bin/bash

# Deployment script for NijerJomi
set -e

echo "🚀 Starting deployment process..."

# Step 1: Run pre-deployment checks
echo "📋 Running pre-deployment checks..."
npm run pre-deploy

if [ $? -ne 0 ]; then
    echo "❌ Pre-deployment checks failed. Aborting deployment."
    exit 1
fi

# Step 2: Build for production
echo "🔨 Building for production..."
npm run build

# Step 3: Optional - Deploy to your hosting service
echo "📤 Ready to deploy to hosting service..."

# Uncomment and customize based on your hosting provider:

# For Azure Static Web Apps:
# az staticwebapp upload --name your-app-name --resource-group your-resource-group --source ./dist

# For Netlify:
# netlify deploy --prod --dir=dist

# For Vercel:
# vercel deploy --prod

# For Firebase:
# firebase deploy

# For GitHub Pages:
# npm run deploy

echo "✅ Deployment preparation complete!"
echo "📋 Next steps:"
echo "   1. Test the application at the preview URL"
echo "   2. Deploy using your hosting provider's specific commands"
echo "   3. Verify the deployment works correctly"
echo "   4. Monitor for any issues post-deployment"
