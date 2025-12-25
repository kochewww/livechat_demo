# Live Chat Demo

A real-time chat application built with Next.js, Supabase, and TypeScript. Features a modern, mobile-first UI inspired by Telegram.

## Features

- 🚀 **Real-time messaging** via Supabase Realtime
- 📱 **Mobile-first design** with responsive layout
- 🎨 **Modern UI** with gradient backgrounds and smooth animations
- 👥 **Multi-user support** - each browser tab gets a unique user
- ⚡ **Fast and lightweight** built with Next.js 16 and React 19

## Prerequisites

- Node.js 18+ 
- Yarn 4+ (or npm)

## Getting Started

> **Note**: This project includes demo Supabase credentials in `.env.local` for out-of-the-box setup. The app works immediately after cloning. For production use, replace with your own Supabase project credentials.

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd livechat_demo
```

### 2. Install dependencies

```bash
yarn install
# or
npm install
```

### 3. (Optional) Set up your own Supabase project

The project works out-of-the-box with demo credentials. To use your own Supabase project:

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run:

```sql
-- Create messages table
CREATE TABLE public.messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user text NOT NULL,
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access"
ON public.messages
FOR SELECT
USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert access"
ON public.messages
FOR INSERT
WITH CHECK (true);

-- Enable Realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Allow public delete access (for Clear button)
-- In Supabase Dashboard: Use expression "true" for USING clause
CREATE POLICY "Allow public delete access"
ON public.messages
FOR DELETE
USING (true);
```

3. Go to **Project Settings** → **API** and copy:
   - `Project URL`
   - `anon public` key

### 4. (Optional) Configure your own environment variables

If you want to use your own Supabase project, update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

> **Security Note**: The included `.env.local` contains demo Supabase credentials (anon/public keys). These are safe to expose as they're designed for client-side use. For production, use your own Supabase project and never commit service_role keys or other secrets.

### 5. Run the development server

```bash
yarn dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing Multi-User Chat

1. Open the chat in your browser
2. Click **"New User Tab"** button in the header
3. Send messages from different tabs to see real-time updates


## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime
- **Package Manager**: Yarn 4

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

The app will be live at `https://your-project.vercel.app`

## Development

### Code Style

- TypeScript strict mode enabled
- ESLint configured for Next.js
- Components follow single responsibility principle
- Custom hooks for business logic separation

### Key Features Implementation

- **Real-time updates**: Supabase Realtime subscriptions
- **Auto-scroll**: Automatically scrolls to latest message
- **Auto-resize textarea**: Grows with content (max 120px)
- **Session-based users**: Each tab gets unique username via sessionStorage
- **Error handling**: Graceful error states and user feedback

## License

MIT
