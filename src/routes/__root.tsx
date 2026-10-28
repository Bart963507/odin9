import { Outlet, createRootRoute } from '@tanstack/react-router'
import { AppShell, Container, MantineProvider } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NavLinks } from '#/components/navLinks'
import { AppHeader } from '#/components/appHeader/appHeader'
import { theme } from '#/theme'

import '@mantine/core/styles.css'
import '@mantine/charts/styles.css'

const queryClient = new QueryClient()

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Layout />
      </MantineProvider>
    </QueryClientProvider>
  )
}

function Layout() {
  const [opened, { toggle, close }] = useDisclosure()

  return (
    <AppShell
      header={{ height: 68 }}
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <AppHeader navOpened={opened} onToggleNav={toggle} />
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavLinks variant="navbar" onNavigate={close} />
      </AppShell.Navbar>

      <AppShell.Main bg="gray.0">
        <Container size="xl" px={0} py="md">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}
