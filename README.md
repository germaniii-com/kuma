```
      ★ ～ KUMA ～ ★
     ╱ᐠ｡‿｡ᐟ╲
    │  ᵔ ᵔ  │
     ╲  ⌄  ╱
      ╰───╯
```

# kuma.germaniii.com

Keyboard Utility and Manager Application

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

### Configuring the port

The production (nginx) image listens on port `80` by default. Set the `PORT`
environment variable to listen on a different port:

```sh
docker run -e PORT=8080 -p 8080:8080 kuma.germaniii.com:prod
```

Or in `docker-compose.yml`:

```yaml
services:
  kuma:
    image: ghcr.io/germaniii-com/kuma:latest
    environment:
      - PORT=8080
    ports:
      - 8080:8080
```

Note: `expose` only documents a port for the Docker network; use `ports` to
publish it to the host. The published port must match `PORT`.

## CI/CD

- **`.gitea/workflows/`** — Gitea Actions: build validation, container validation, deploy
- **`.github/workflows/docker-build.yml`** — GitHub Actions equivalent for `ghcr.io` publishing
