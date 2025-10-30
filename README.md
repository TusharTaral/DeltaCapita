# Mobile PDF Upload, Mock Sign, and View

React + Webpack + TypeScript frontend with an Express (TypeScript) mock signing server. Mobile-first, secure defaults.

## Features

- Upload a PDF from your device (client-side validation, 10MB cap)
- Send to a mock server which "signs" the PDF using pdf-lib (adds stamp/watermark)
- View the signed PDF inline or open/download on mobile devices
- Security: Helmet headers, CORS restricted to localhost, size/type checks, in-memory processing, rate limiting, CSP meta in HTML

## Prerequisites

- Node.js >= 18

## Install

```bash
npm install
```

## Run (Development)

Run the API server (port 4000):

```bash
npm run server
```

In another terminal, run the frontend (port 3000):

```bash
npm start
```

Open http://localhost:3000

The dev server proxies `/api` to `http://localhost:4000`.

## Build (Production)

```bash
npm run build
```

Outputs to `dist/`. Serve `dist/` behind a secure web server that sets CSP, HSTS, and other headers at the edge.

## TypeScript

- Type checking: `npm run typecheck`
- Frontend uses Babel to compile `.ts/.tsx` via `@babel/preset-typescript`.
- Server runs via `ts-node --transpile-only` in development.

## Notes on Security

- The server only accepts `application/pdf` and caps size at 8MB.
- Files are processed in memory and never written to disk.
- Helmet provides common security headers; CORS restricted to the dev origin.
- Rate limiting reduces abuse potential.
- The frontend includes a conservative CSP meta; configure headers on your production host instead for best results.

## Folder Structure

- `src/` React app (upload UI and PDF viewer)
- `public/` HTML template
- `server/` Express mock signing API

## License

MIT
