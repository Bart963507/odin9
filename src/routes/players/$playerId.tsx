import { createFileRoute } from '@tanstack/react-router'
import { Alert, Loader, Text, Title } from '@mantine/core'
import { useSuspenseQuery } from '@tanstack/react-query'
import { playersQueryOptions } from '#/features/players/playersQuery'

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
  const { data: players } = useSuspenseQuery(playersQueryOptions)
  const player = players.find((p) => p.id === Number(playerId))

  if (!player) {
    return <Text>Speler niet gevonden</Text>
  }

  return (
    <Title>
      {player.first_name} {player.last_name}
    </Title>
  )
}
