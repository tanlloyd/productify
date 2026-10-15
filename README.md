# Productify

Productify is a full-stack product showcase application where visitors can discover products and authenticated users can publish listings, manage their own products, and join product discussions.

## Live Demo

[View Productify on Render](https://productify-s51x.onrender.com)

> The free Render service may take up to a minute to respond after a period of inactivity.

## Key Features

- Browse product listings and view product details
- Sign up and sign in with Clerk
- Create, edit, and delete your own product listings
- Comment on products and delete your own comments
- Manage listings from a personal profile page
- Switch between multiple interface themes
- Responsive layouts for desktop and mobile screens

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router, TanStack Query, Axios |
| Styling | Tailwind CSS, DaisyUI, Lucide React |
| Backend | Node.js, Express, TypeScript |
| Authentication | Clerk |
| Database | PostgreSQL, Drizzle ORM |
| Deployment | Render Blueprint |

## Security

- Clerk middleware protects authenticated API routes.
- Product and comment ownership is checked on the server before updates or deletion.
- Credentials and connection strings are loaded from environment variables and are excluded from Git.

## Getting Started

### Prerequisites

- Node.js 22.12 or later
- PostgreSQL database
- Clerk application

### Installation

```bash
git clone https://github.com/tanlloyd/productify.git
cd productify
npm ci --prefix backend
npm ci --prefix frontend
```

Create the environment files described below, then apply the database schema:

```bash
npm run db:push --prefix backend
```

Start the backend and frontend in separate terminals:

```bash
npm run dev --prefix backend
```

```bash
npm run dev --prefix frontend
```

## Environment Variables

Create `backend/.env`:

```env
PORT=
DATABASE_URL=
NODE_ENV=development
FRONTEND_URL=
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

Create `frontend/.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=
VITE_API_URL=
```

## Available Scripts

### Backend

| Command | Purpose |
| --- | --- |
| `npm run dev --prefix backend` | Start the API in development mode |
| `npm run build --prefix backend` | Compile TypeScript into `backend/dist` |
| `npm run db:push --prefix backend` | Apply the Drizzle schema to PostgreSQL |

### Frontend

| Command | Purpose |
| --- | --- |
| `npm run dev --prefix frontend` | Start the Vite development server |
| `npm run build --prefix frontend` | Create a production build |
| `npm run lint --prefix frontend` | Run ESLint |
| `npm run preview --prefix frontend` | Preview the production build locally |

## Project Structure

```text
productify/
├── backend/
│   ├── src/controllers/   # Request handling and authorisation
│   ├── src/db/            # Drizzle schema and database queries
│   ├── src/routes/        # Express API routes
│   └── src/index.ts       # API entry point
├── frontend/
│   ├── src/components/    # Reusable UI components
│   ├── src/hooks/         # Authentication and server-state hooks
│   ├── src/lib/           # API client and request functions
│   └── src/pages/         # Application pages
└── render.yaml            # Render deployment configuration
```

## Deployment

The Render Blueprint provisions a Node.js web service and PostgreSQL database. During deployment, Render builds both applications, applies the database schema, and serves the React production build from Express. Render checks service health at `/api/health`.
