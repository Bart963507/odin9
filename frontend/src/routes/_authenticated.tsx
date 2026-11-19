import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { AppShell, Container } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { NavLinks } from '#/components/navLinks'
import { AppHeader } from '#/components/appHeader/appHeader'
import { readValidAuthToken } from '#/features/auth/authToken'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    if (readValidAuthToken() === null) {
      throw redirect({ to: '/login', search: { redirect: location.pathname } })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
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
