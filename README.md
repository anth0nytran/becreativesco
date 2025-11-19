# BE CREATIVES CO. - Portfolio Website

A modern, futuristic portfolio website built with Next.js, featuring shader effects, smooth animations, and a professional design.

## Features

- 🎨 **Modern Design**: Dark theme with futuristic aesthetics
- ✨ **Smooth Animations**: Powered by Framer Motion
- 🎭 **Shader Effects**: Custom canvas-based shader background
- 📱 **Responsive**: Fully responsive design for all devices
- 🎯 **Lead Capture**: Built-in lead capture form with validation
- 🚀 **Vercel Ready**: Optimized for Vercel deployment

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is configured for Vercel deployment. Simply connect your repository to Vercel and deploy.

## Project Structure

```
├── app/
│   ├── page.tsx          # Home page
│   ├── portfolio/
│   │   └── page.tsx      # Portfolio page
│   ├── contact/
│   │   └── page.tsx      # Contact page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── Navigation.tsx    # Navigation component
│   ├── LeadCapture.tsx  # Lead capture form
│   └── ShaderBackground.tsx # Shader background effect
└── lib/
    └── utils.ts          # Utility functions
```

## License

MIT

