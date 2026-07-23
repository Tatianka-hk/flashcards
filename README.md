# Flashcards

A Nuxt 3 application for creating, organizing, and studying flashcards. The app supports user accounts, nested folders, manual card editing, AI-generated flashcards from text, and a simple learning mode.

## Features

- Email/password registration and login with JWT session cookies
- Flashcard generation from pasted text
- Folder-based organization with nested folders
- Create, edit, delete, move, and copy cards
- Study mode for practicing saved cards
- Multiple UI languages via `@nuxtjs/i18n`
- MongoDB persistence with Mongoose

## Tech Stack

- Nuxt 3
- Vue 3
- TypeScript
- Tailwind CSS
- MongoDB / Mongoose
- JSON Web Tokens
- Playwright

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local `.env` file:

```env
MONGODB_URL=
MONGODB_DB=
JWT_SECRET=
JWT_EXPIRES_IN=7d
PASSWORD_SALT=
TOGETHER_API_KEY=
VITE_BACKEND_URL=
VITE_USAGE_KEY=
```

Run the development server:

```bash
npm run dev
```

Open the app at:

```text
http://localhost:3000
```

## Scripts

```bash
npm run dev       # Start local development
npm run build     # Build for production
npm run preview   # Preview production build
npm run generate  # Generate static output
```

## Project Structure

```text
pages/          Nuxt pages and routes
components/     App-specific Vue components
ui/             Shared UI components
server/api/     Nitro API routes
server/models/  Mongoose models
server/utils/   Server helpers for auth, DB, and flashcard generation
middleware/     Route protection middleware
i18n/locales/   Translation files
apis/           Client API wrappers
types/          Shared TypeScript types
tests/          Playwright tests
```

## Authentication

After login, the server signs a JWT and stores it in an HTTP-only `session` cookie. Protected API routes read the cookie, verify the token, and attach the user id to the request context.

For local development, keep `JWT_SECRET` stable in `.env`; changing it will invalidate existing sessions.

## License

Private project.
