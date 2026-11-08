import { createFileRoute } from '@tanstack/react-router'
import { Alert, Loader, Stack, Title } from '@mantine/core'
import { usePlayerStats } from '#/features/statsTable/statsQuery'
import { StatsTable } from '#/features/statsTable/statsTable'

export const Route = createFileRoute('/')({
  component: Home,
  pendingComponent: () => <Loader />,
  errorComponent: ({ error }) => (
    <Alert color="red" title="Statistieken konden niet worden geladen">
      {String(error)}
    </Alert>
  ),
})

function Home() {
  const rows = usePlayerStats()

  return (
    <Stack gap="md">
      <Title order={1}>Statistieken</Title>
      <StatsTable rows={rows} />
    </Stack>
  )
}
