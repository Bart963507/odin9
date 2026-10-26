import { createFileRoute } from '@tanstack/react-router'
import { Alert, Loader, Text } from '@mantine/core'
import { useSuspenseQueries } from '@tanstack/react-query'
import { playersQueryOptions } from '#/features/players/playersQuery'
import { statsQueryOptions } from '#/features/statsTable/statsQuery'
import { eventsQueryOptions } from '#/features/events/eventsQuery'
import { PlayerProfile } from '#/features/players/playerProfile'

export const Route = createFileRoute('/players/$playerId')({
  component: PlayerPage,
  pendingComponent: () => <Loader />,
  errorComponent: ({ error }) => (
    <Alert color="red" title="Speler kon niet worden geladen">
      {String(error)}
    </Alert>
  ),
})

function PlayerPage() {
  const { playerId } = Route.useParams()
  const [{ data: players }, { data: stats }, { data: events }] =
    useSuspenseQueries({
      queries: [playersQueryOptions, statsQueryOptions, eventsQueryOptions],
    })
  const player = players.find((p) => p.id === Number(playerId))

  if (!player) {
    return <Text>Speler niet gevonden</Text>
  }

  return (
    <PlayerProfile
      player={player}
      stats={stats.find((row) => row.player_id === player.id)}
      allStats={stats}
      events={events}
    />
  )
}
