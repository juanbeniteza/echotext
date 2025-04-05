# EchoText Quick Start Guide

This guide will help you get EchoText up and running quickly.

## Prerequisites

- Node.js (v18 or later)
- A Supabase account and project

## Setup

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd echotext
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy the `.env.local.example` file to `.env.local`:

```bash
cp .env.local.example .env.local
```

Then, edit `.env.local` and add your Supabase URL and anon key from your Supabase dashboard.

4. **Set up the Supabase database**

- Go to your Supabase project dashboard
- Navigate to SQL Editor
- Run the SQL commands from `supabase/schema.sql`

## Development

Start the development server:

```bash
npm run dev
```

Your app should now be running at [http://localhost:3000](http://localhost:3000).

## Features

- **Text Input**: Enter any text you want to display
- **Effect Selection**: Choose from shake, ripple, or jitter effects
- **Customization**: Change color, font, size, and spacing
- **Sharing**: Generate a unique, shareable link for your creation
- **Analytics**: Track view counts for shared links
- **Expiration**: Set optional expiration times for links

## Deployment

Deploy to Vercel:

```bash
npm run build
vercel deploy
```

## Database Structure

The application uses a single table in Supabase:

- `links` - Stores link IDs, text configurations, and view analytics

## Troubleshooting

- **API errors**: Make sure your Supabase URL and anon key are correct in `.env.local`
- **Database errors**: Verify that you've run the SQL setup script correctly
- **CSS not loading**: Ensure the effects.css file is properly imported in layout.tsx

## Support

For issues or questions, please open an issue on the GitHub repository. 