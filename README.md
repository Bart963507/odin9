# odin9

A stats dashboard for players. Player and match statistics are read from a published Google Sheet (as CSV) and shown in a table.

## Getting started

```bash
npm install
npm run dev       # dev server on http://localhost:3000
```

Build and preview a production bundle:

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
| [PapaParse](https://www.papaparse.com/)                                                                                                        | Parsing the CSV responses                   |
| [ESLint](https://eslint.org/) ([`@tanstack/eslint-config`](https://tanstack.com/config/latest/docs/eslint)) + [Prettier](https://prettier.io/) | Linting and formatting                      |

## API endpoints

Every endpoint is defined in [`src/config/apiConfig.ts`](src/config/apiConfig.ts). Feature code imports the URL from `apiConfig` instead of hardcoding it.

The data comes from tabs of one published Google Sheet, so each endpoint is built from its tab's `gid`:

```ts
export const apiConfig = {
  players: sheetCsvUrl(0),
  stats: sheetCsvUrl(462371454),
} as const
```

To add a new endpoint, add an entry to `apiConfig`.

## Routing

Routes are files in `src/routes`. The Vite plugin regenerates `src/routeTree.gen.ts` when you add or change a route. You can also generate it yourself:

```bash
npm run generate-routes
```

`src/routes/__root.tsx` is the root layout. It sets up the `QueryClientProvider` and `MantineProvider` and renders child routes through `<Outlet />`. Use `Link` from `@tanstack/react-router` to navigate between routes.

## Data fetching

Each feature defines its queries with TanStack Query's `queryOptions` and reads them in components with `useSuspenseQueries`. See `src/features/statsTable/statsQuery.ts` for an example that combines the stats and players queries.

## Linting and formatting

```bash
npm run lint      # eslint
npm run format    # prettier --write + eslint --fix
npm run check     # prettier --check
```
