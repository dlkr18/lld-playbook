# Quick Start - Deploy in 5 Minutes

## 🚀 Fastest Way to Deploy

### 1. Open Vercel
Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub

### 2. Import Repository
- Click "Import Git Repository"
- Select: **dlkr18/lld-playbook**
- Click "Import"

### 3. Configure
Set **one setting**:
- Root Directory: `web` ← **Important!**

Everything else is auto-detected:
- ✅ Framework: Next.js
- ✅ Build Command: `npm run build`
- ✅ Output: `.next`
- ✅ Install: `npm install`

### 4. Deploy
- Click "Deploy"
- Wait ~2 minutes ⏱️
- **Done!** Your app is live 🎉

## 📱 Your Live URL

You'll get: `https://lld-playbook-[random].vercel.app`

Example: `https://lld-playbook-abc123.vercel.app`

## ✅ Test Your Deployment

Visit these pages:
1. **Home**: `/`
2. **Problems**: `/problems`
3. **Parking Lot**: `/problems/parkinglot`
4. **Amazon**: `/problems/amazon`

## 🎨 Customize Domain (Optional)

### Free Subdomain
Change from `lld-playbook-abc123.vercel.app` to `lld-playbook.vercel.app`:

1. Go to Project Settings
2. Domains → Add Domain
3. Enter: `lld-playbook` (first-come-first-served)
4. Done!

### Custom Domain
Use your own domain:

1. Project Settings → Domains
2. Add: `yourdomain.com`
3. Update DNS as shown
4. SSL auto-configured ✅

## 🔧 Local Development

```bash
cd web
npm install
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

## 📊 View Analytics

After deployment:
- Go to your project in Vercel
- Click "Analytics" tab
- See real-time visitors, page views, performance

## 🐛 Troubleshooting

### Build Fails?
```bash
# Test locally first
cd web
npm run build

# Should complete successfully
```

### Can't find project?
- Make sure you pushed to `master` branch
- Refresh Vercel's import page
- Try manual import with GitHub URL

### Wrong content showing?
- Check you set Root Directory: `web`
- Redeploy from Vercel dashboard

## 📞 Need Help?

- Vercel Discord: [discord.gg/vercel](https://discord.gg/vercel)
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- GitHub Issues: Open an issue in the repo

## 🎯 What's Next?

After deployment:
1. Share your URL on LinkedIn
2. Add to your portfolio
3. Tweet about it
4. Send to friends
5. Use for interview prep

## 💡 Pro Tips

1. **Automatic Deployments**
   - Every push to `master` auto-deploys
   - PRs get preview URLs

2. **Free Analytics**
   - Track visitors
   - Monitor performance
   - See popular pages

3. **Zero Config**
   - No server management
   - Auto-scaling
   - Global CDN

4. **Fast Rollback**
   - One-click rollback
   - Keep all versions
   - Instant restore

## 🎉 That's It!

Your LLD Playbook web app is now live and accessible worldwide!

Enjoy! 🚀
