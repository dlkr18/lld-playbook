# Deployment Guide - LLD Playbook Web App

## Quick Deploy to Vercel (Recommended)

### Method 1: Deploy from GitHub (Easiest)

1. **Push to GitHub**
   ```bash
   cd /Users/likhith.r/lld-playbook
   git add web/
   git commit -m "Add Next.js web application"
   git push origin master
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository: `dlkr18/lld-playbook`
   - Vercel will auto-detect Next.js

3. **Configure**
   - Root Directory: `web`
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Your app will be live in ~2 minutes!
   - URL: `https://lld-playbook-*.vercel.app`

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to web directory
cd web

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Custom Domain (Optional)

### Add Custom Domain in Vercel

1. Go to your project in Vercel
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `lld-playbook.yourdomain.com`)
4. Configure DNS as instructed
5. SSL certificate is automatic!

## Environment Variables

Currently, no environment variables are required. If you add any in the future:

1. Go to Vercel Dashboard
2. Project Settings → Environment Variables
3. Add variables:
   - `NEXT_PUBLIC_API_URL`
   - etc.

## Performance Optimizations

The app is already optimized with:
- ✅ Static Generation for all pages
- ✅ Code splitting
- ✅ Image optimization
- ✅ Font optimization
- ✅ CSS optimization

## Monitoring

After deployment, monitor your app:

1. **Analytics** (Vercel built-in)
   - Visit your project dashboard
   - View real-time analytics
   - Track page views, load times

2. **Speed Insights**
   - Automatic Core Web Vitals tracking
   - Performance monitoring

3. **Error Tracking**
   - Real-time error reporting
   - Stack traces and debugging info

## Deployment Checklist

- [ ] Push code to GitHub
- [ ] Connect repository to Vercel
- [ ] Configure root directory (`web`)
- [ ] Deploy
- [ ] Test production URL
- [ ] (Optional) Add custom domain
- [ ] (Optional) Configure analytics

## Troubleshooting

### Build Fails

```bash
# Locally test the build
cd web
npm run build
```

### Port Conflicts

```bash
# Run on different port
npm run dev -- -p 3001
```

### Clear Cache

```bash
# Remove .next and node_modules
rm -rf .next node_modules
npm install
npm run build
```

## CI/CD

Vercel automatically:
- ✅ Builds on every push to `master`
- ✅ Creates preview deployments for PRs
- ✅ Rolls back on failure
- ✅ Provides deployment comments in PRs

## Cost

- **Free Tier**: Perfect for this project
- **Includes**:
  - Unlimited deployments
  - 100GB bandwidth/month
  - Serverless functions
  - SSL certificates
  - Analytics

## Alternative Deployment Options

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd web
netlify deploy --prod
```

### Self-Hosted (Docker)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t lld-playbook-web .
docker run -p 3000:3000 lld-playbook-web
```

### AWS Amplify

1. Connect GitHub repository
2. Configure build settings
3. Deploy

## Post-Deployment

1. **Test all pages**
   - Home page
   - Problems listing
   - Individual problem pages
   - Navigation

2. **Check performance**
   - Use Lighthouse
   - Test on mobile
   - Check load times

3. **Update README**
   - Add live URL to main README
   - Update documentation links

4. **Share**
   - Add to portfolio
   - Share on LinkedIn
   - Tweet about it!

## Support

For deployment issues:
- Vercel Discord: discord.gg/vercel
- Vercel Docs: vercel.com/docs
- GitHub Issues: github.com/dlkr18/lld-playbook/issues
