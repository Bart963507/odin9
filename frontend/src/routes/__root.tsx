import { Outlet, createRootRoute } from '@tanstack/react-router'
import { MantineProvider } from '@mantine/core'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { UnauthorizedError } from '#/features/auth/authErrors'
import { clearAuthToken } from '#/features/auth/authToken'
import { theme } from '#/theme'

import '@mantine/core/styles.css'
import '@mantine/charts/styles.css'

const FIVE_MINUTES_IN_MS = 5 * 60 * 1000
const MAX_QUERY_RETRIES = 3

const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: returnToLoginWhenUnauthorized }),
  defaultOptions: {
    queries: {
      staleTime: FIVE_MINUTES_IN_MS,
      refetchOnWindowFocus: false,
      retry: retryUnlessUnauthorized,
    },
  },
})

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Outlet />
      </MantineProvider>
    </QueryClientProvider>
  )
}

function returnToLoginWhenUnauthorized(error: Error) {
  if (error instanceof UnauthorizedError) {
    clearAuthToken()
    window.location.reload()
  }
}

function retryUnlessUnauthorized(failureCount: number, error: Error): boolean {
  return (
    !(error instanceof UnauthorizedError) && failureCount < MAX_QUERY_RETRIES
  )
}
