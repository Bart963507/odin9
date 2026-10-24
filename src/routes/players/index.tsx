import { createFileRoute } from '@tanstack/react-router'
import { Alert, Loader, SimpleGrid, Title } from '@mantine/core'
import { useSuspenseQuery } from '@tanstack/react-query'
import { playersQueryOptions } from '#/features/players/playersQuery'
import { PlayerCard } from '#/features/players/playerCard'

export const Route = createFileRoute('/players/')({
  component: Players,
  pendingComponent: () => <Loader />,
  errorComponent: ({ error }) => (
    <Alert color="red" title="Spelers konden niet worden geladen">
      {String(error)}
    </Alert>
  ),
})

function Players() {
  const { data: players } = useSuspenseQuery(playersQueryOptions)
  const sortedPlayers = [...players].sort((a, b) =>
    a.last_name.localeCompare(b.last_name),
  )

  return (
    <>
      <Title mb="lg">Spelers</Title>
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, lg: 4 }}>
        {sortedPlayers.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </SimpleGrid>
    </>
  )
}
