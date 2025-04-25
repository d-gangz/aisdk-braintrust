# AI Playground Template

A Next.js template focused on experimenting with the [Vercel AI SDK](https://sdk.vercel.ai/docs/introduction) and leveraging [Braintrust](https://www.braintrust.dev/docs/start) for LLM tracing and evaluation. Ideal for rapid prototyping, prompt/model iteration, and robust AI app development with production-ready best practices.

## Tech Stack

### Frontend
- **Framework:** [Next.js 15](https://nextjs.org)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)

### Backend
- **Database:** [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **API:** Next.js Server Actions
- **AI SDK:** [Vercel AI SDK](https://sdk.vercel.ai/docs/introduction)
- **Tracing/Eval:** [Braintrust](https://www.braintrust.dev/docs/start)

## Key Features

- Rapid prototyping with Vercel AI SDK (multi-provider LLMs, tool calling, streaming, etc.)
- Built-in tracing, monitoring, and evaluation with Braintrust
- Modern, responsive UI components with shadcn/ui
- Type-safe database operations with Drizzle ORM
- Secure authentication with Clerk
- Server-side rendering and API routes with Next.js
- Payment processing with Stripe
- User behavior analytics with PostHog
- Production-ready build setup

## Project Structure

- `actions` - Server actions for data mutations
- `app` - Next.js app router pages and layouts
- `components` - Reusable UI components
- `db` - Database schemas and configuration
- `lib` - Utility functions and hooks
- `public` - Static assets
- `types` - TypeScript type definitions

## Getting Started

1. Create your environment file:
```bash
cp .env.example .env.local
```

2. Install dependencies:
```bash
bun install
```

3. Run the development server:
```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development Workflow

- Use Vercel AI SDK for LLM integration, prompt engineering, and tool calling ([docs](https://sdk.vercel.ai/docs/introduction))
- Use Braintrust for tracing, monitoring, and evaluating LLM interactions ([docs](https://www.braintrust.dev/docs/start))
- Use server components for data fetching
- Use client components for interactive UI elements
- Implement server actions for data mutations
- Follow the type-safe approach with TypeScript

## Learn More

- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs/introduction)
- [Braintrust Documentation](https://www.braintrust.dev/docs/start)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## Deploy on Vercel

Deploy your project with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ai-playground-template)
