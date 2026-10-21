import { createFileRoute } from '@tanstack/react-router'
import { Alert, Loader } from '@mantine/core'
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
    <div>
      <StatsTable rows={rows} />
    </div>
  )
}
