import { Outlet, createRootRoute } from '@tanstack/react-router'
import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import '@mantine/core/styles.css'
import '../styles.css'

const queryClient = new QueryClient()

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <Outlet />
      </MantineProvider>
    </QueryClientProvider>
  )
}
