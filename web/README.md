# LLD Playbook - Next.js Web App

Modern web application for browsing and learning Low-Level Design patterns and problems.

## Features

- ✅ **44 Real Problems** - Complete catalog of LLD problems
- ✅ **Smart Filtering** - Filter by difficulty (Easy/Medium/Hard)
- ✅ **Search** - Find problems by title, description, or topics
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Dark Theme** - Beautiful dark UI with gradient accents
- ✅ **Fast Performance** - Built with Next.js 14 and React Server Components
- ✅ **Static Export** - Can be deployed anywhere

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
web/
├── app/                # Next.js App Router pages
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   ├── globals.css     # Global styles
│   └── problems/       # Problems pages
│       ├── page.tsx    # Problems listing
│       └── [id]/       # Individual problem pages
│           └── page.tsx
├── components/         # Reusable components
│   ├── Navigation.tsx  # Top navigation
│   └── ProblemCard.tsx # Problem card component
├── lib/                # Utilities and data
│   └── problems.ts     # Problems data and utilities
└── public/             # Static assets
```

## Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js
6. Click "Deploy"

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Configuration

The app is configured in `vercel.json`:
- Framework: Next.js
- Output: `.next` directory
- Build command: `npm run build`

## Environment Variables

Create a `.env.local` file for local development:

```bash
cp .env.local.example .env.local
```

No environment variables are required for basic functionality.

## Customization

### Adding New Problems

Edit `lib/problems.ts`:

```typescript
export const problems: Problem[] = [
  // ...existing problems
  {
    id: "newproblem",
    title: "New Problem",
    difficulty: "Medium",
    category: "System",
    description: "Description here",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["Topic 1", "Topic 2"]
  }
];
```

### Styling

- Global styles: `app/globals.css`
- Tailwind config: `tailwind.config.ts`
- Color scheme: Modify CSS variables in `globals.css`

### Components

All reusable components are in the `components/` directory:
- `Navigation.tsx` - Top navigation bar
- `ProblemCard.tsx` - Problem card for listings

## Performance

- **Server Components** - Most components are RSC for better performance
- **Static Generation** - All problem pages are pre-rendered
- **Code Splitting** - Automatic code splitting by Next.js
- **Image Optimization** - Next.js automatic image optimization

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

Part of the LLD Playbook project.

## Links

- **Main Repository**: [github.com/dlkr18/lld-playbook](https://github.com/dlkr18/lld-playbook)
- **Documentation**: [dlkr18.github.io/lld-playbook](https://dlkr18.github.io/lld-playbook)
- **Deployed App**: Will be available after deployment

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review the main LLD Playbook README
