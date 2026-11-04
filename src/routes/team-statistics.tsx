import { createFileRoute } from '@tanstack/react-router'
import { Alert, Loader } from '@mantine/core'
import { useSuspenseQuery } from '@tanstack/react-query'
import { usePlayerStats } from '#/features/statsTable/statsQuery'
import { gamesQueryOptions } from '#/features/teamStatistics/gamesQuery'
import { TeamStatisticsDashboard } from '#/features/teamStatistics/teamStatisticsDashboard'

export const Route = createFileRoute('/team-statistics')({
  component: TeamStatisticsPage,
  pendingComponent: () => <Loader />,
  errorComponent: ({ error }) => (
    <Alert color="red" title="Teamstatistieken konden niet worden geladen">
      {String(error)}
    </Alert>
  ),
})

function TeamStatisticsPage() {
  const { data: games } = useSuspenseQuery(gamesQueryOptions)
  const players = usePlayerStats()

  return <TeamStatisticsDashboard games={games} players={players} />
}
