# GitHub Pages Setup Guide

This guide explains how to configure GitHub Pages to serve the C6 Bank XLSX Categorizer application from the `docs` folder.

## Prerequisites

- Repository with the production build files in the `docs` folder
- Admin access to the GitHub repository
- The application has been built using `npm run build`

## Step-by-Step Configuration

### 1. Build the Application

First, ensure you have the latest production build:

```bash
# Navigate to your project directory
cd ai-made-c6bank-csv-creditcard-report

# Install dependencies (if not already done)
npm install

# Build the application for production
npm run build
```

This will create a `docs` folder with all the static files needed for deployment.

### 2. Commit and Push the docs Folder

The `docs` folder needs to be committed to your repository:

```bash
# Add the docs folder to git
git add docs/

# Commit the build files
git commit -m "Add production build for GitHub Pages"

# Push to the main branch
git push origin main
```

### 3. Configure GitHub Pages

1. **Navigate to Repository Settings**
   - Go to your repository on GitHub: `https://github.com/FelipeCZ/ai-made-c6bank-csv-creditcard-report`
   - Click on the **Settings** tab (located in the top navigation bar)

2. **Access Pages Settings**
   - Scroll down in the left sidebar and click on **Pages**

3. **Configure Source**
   - Under **Source**, select **Deploy from a branch**
   - For **Branch**, select **main** (or **master** if that's your default branch)
   - For **Folder**, select **/ (root)** and then change it to **docs**
   - Click **Save**

4. **Wait for Deployment**
   - GitHub will automatically start building and deploying your site
   - This process usually takes 1-5 minutes
   - You'll see a green checkmark when deployment is complete

### 4. Access Your Live Site

Once deployment is complete, your site will be available at:

```
https://felipecz.github.io/ai-made-c6bank-csv-creditcard-report/
```

## Updating the Site

To update your GitHub Pages site with new changes:

1. Make your code changes
2. Run `npm run build` to create a new production build
3. Commit and push the updated `docs` folder:
   ```bash
   git add docs/
   git commit -m "Update production build"
   git push origin main
   ```
4. GitHub Pages will automatically redeploy your site

## Troubleshooting

### Site Not Loading

- **Check the repository name**: Ensure the base path in `vite.config.ts` matches your repository name exactly
- **Verify docs folder**: Make sure the `docs` folder contains an `index.html` file
- **Check GitHub Pages status**: Go to Settings > Pages to see if there are any deployment errors

### Assets Not Loading

- **Base path configuration**: Ensure `base: '/ai-made-c6bank-csv-creditcard-report/'` is set correctly in `vite.config.ts`
- **Relative paths**: All asset paths should be relative to the base path

### 404 Errors

- **Case sensitivity**: GitHub Pages is case-sensitive, ensure all file names match exactly
- **File extensions**: Make sure all files have the correct extensions (.html, .js, .css, etc.)

### Build Errors

If `npm run build` fails:

1. **Check TypeScript errors**: Run `npm run lint` to identify any code issues
2. **Dependencies**: Ensure all dependencies are installed with `npm install`
3. **Node version**: Verify you're using Node.js version 16 or higher

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `docs` folder with your domain name
2. Configure your domain's DNS to point to GitHub Pages
3. Update the GitHub Pages settings to use your custom domain

## Security Considerations

- **HTTPS**: GitHub Pages automatically provides HTTPS for `.github.io` domains
- **Local storage**: This application stores data locally in the browser using IndexedDB
- **No server**: This is a client-side only application, no server-side data processing occurs

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [Custom Domain Setup](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
