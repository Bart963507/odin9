# odin9

A stats dashboard for players. Players come from the odin9 API; match statistics are still read from a published Google Sheet (as CSV) and shown in a table.

The repo has two parts:

- [`frontend/`](frontend): the React app, deployed to GitHub Pages
- [`backend/`](backend): the FastAPI API and Postgres database, deployed to Railway

## Getting started

```bash
cd frontend
npm install
npm run dev       # dev server on http://localhost:3000
```

The players come from the API at `VITE_API_URL`, which `frontend/.env.development` sets to `http://localhost:8000`. Run the backend next to the dev server (see [Backend](#backend)).

Build and preview a production bundle (from `frontend/`):

```bash
npm run build
npm run preview
```

## Tech stack

| Tool                                                                                                                                           | Purpose                                     |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)                                                                 | UI and type safety                          |
| [Vite](https://vite.dev/)                                                                                                                      | Dev server and bundler                      |
| [TanStack Router](https://tanstack.com/router)                                                                                                 | Type-safe, file-based routing               |
| [TanStack Query](https://tanstack.com/query)                                                                                                   | Data fetching, caching and suspense queries |
| [Mantine](https://mantine.dev/) (`@mantine/core`, `@mantine/hooks`)                                                                            | UI components and styling                   |
| [PapaParse](https://www.papaparse.com/)                                                                                                        | Parsing the sheet's CSV responses           |
| [ESLint](https://eslint.org/) ([`@tanstack/eslint-config`](https://tanstack.com/config/latest/docs/eslint)) + [Prettier](https://prettier.io/) | Linting and formatting                      |

## API endpoints

Every endpoint is defined in [`frontend/src/config/apiConfig.ts`](frontend/src/config/apiConfig.ts). Feature code imports the URL from `apiConfig` instead of hardcoding it.

Players come from the odin9 API. The other data still comes from tabs of one published Google Sheet, so those endpoints are built from the tab's `gid`:

```ts
export const apiConfig = {
  players: `${import.meta.env.VITE_API_URL}/players`,
  stats: sheetCsvUrl(462371454),
} as const;
```

Each API query calls `fetch` itself and checks the response with a Zod schema; sheet tabs are fetched with `fetchCsv` (`frontend/src/lib/fetchCsv.ts`).

To add a new endpoint, add an entry to `apiConfig`.

## Routing

Routes are files in `frontend/src/routes`. The Vite plugin regenerates `frontend/src/routeTree.gen.ts` when you add or change a route. You can also generate it yourself (from `frontend/`):

```bash
npm run generate-routes
```

`frontend/src/routes/__root.tsx` is the root layout. It sets up the `QueryClientProvider` and `MantineProvider` and renders child routes through `<Outlet />`. Use `Link` from `@tanstack/react-router` to navigate between routes.

## Data fetching

Each feature defines its queries with TanStack Query's `queryOptions` and reads them in components with `useSuspenseQueries`. See `frontend/src/features/statsTable/statsQuery.ts` for an example that combines the stats and players queries.

## Linting and formatting

From `frontend/`:

```bash
npm run lint      # eslint
npm run format    # prettier --write + eslint --fix
npm run check     # prettier --check
```

## Backend

The API lives in [`backend/`](backend): FastAPI, SQLAlchemy and Alembic on Postgres. Reads are public and rate limited to 120 requests per minute per IP.

Run it locally (needs Docker and [uv](https://docs.astral.sh/uv/)):

```bash
cd backend
docker compose up -d                       # Postgres on localhost:5433
cp .env.example .env
uv run alembic upgrade head
uv run fastapi dev                         # http://localhost:8000/docs
```

After changing a model, create a migration with `uv run alembic revision --autogenerate -m "..."`, read the generated file, then run `uv run alembic upgrade head`.

## Deployment

- **Frontend:** every push to `main` that changes `frontend/` builds and deploys to GitHub Pages. The build reads the repository variable `API_URL` (the Railway API domain, without a trailing slash) as `VITE_API_URL`, and fails when it isn't set.
- **Backend:** Railway deploys `backend/` from `main` once CI passes, and runs `alembic upgrade head` before starting the new version.
