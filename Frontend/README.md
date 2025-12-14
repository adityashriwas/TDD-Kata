# Frontend (Next.js + Tailwind + shadcn-style + Axios)

This app consumes your existing Backend API without any backend changes. It uses:

- Next.js App Router
- Tailwind CSS and minimal shadcn-style UI components
- Axios with `withCredentials` for cookie-based auth

## Setup

1. Create `.env.local` from example and set the backend URL and frontend URL:

```
cp .env.local.example .env.local
```

Edit values as needed:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:4000
```

2. Install and run:

```
npm install
npm run dev
```

Visit http://localhost:4000

## Notes

- Auth cookies are HTTP-only and set by the Backend. Axios is configured with `withCredentials: true` so cookies are sent automatically.
- Admin-only routes are guarded client-side using the `/api/v1/user/profile` response. If you want hard redirects, consider implementing a custom session cookie on the frontend domain so middleware can inspect it.
- Backend create/update sweet endpoints expect an image via `multipart/form-data`.
- The backend's `createSweet` may require `createdBy`; the controller currently doesn't send it. If you see a validation error, you'll need to adjust the backend or populate `createdBy` server-side.

## Using shadcn

This repo includes small, headless UI components in `components/ui`. If you want the full shadcn/ui system, you can initialize it and replace these components:

```
npx shadcn@latest init
npx shadcn@latest add button input label textarea select card
```

Then adjust imports (e.g., `@/components/ui/button`).
