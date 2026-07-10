# kuma.germaniii.com

Personal website — React 19 + Vite SPA.

## Development

```sh
npm install
npm run dev
```

Or with Docker:

```sh
docker compose up
```

The dev server runs at `http://localhost:5173`.

## Building

```sh
npm run build     # outputs to dist/
npm run preview   # preview the production build locally
```

## Linting & Formatting

```sh
npm run lint           # ESLint
npx prettier --check . # Prettier
```

## Docker

| Image | Dockerfile | Purpose |
|---|---|---|
| `kuma.germaniii.com:dev` | `Dockerfile` | Dev server (vite --host) |
| `kuma.germaniii.com:prod` | `Dockerfile.prod` | Production (nginx serving dist/) |

Build the production image:

```sh
docker build -f Dockerfile.prod -t kuma.germaniii.com:prod .
```

## CI/CD

- **`.gitea/workflows/`** — Gitea Actions: build validation, container validation, deploy
- **`.github/workflows/docker-build.yml`** — GitHub Actions equivalent for `ghcr.io` publishing
