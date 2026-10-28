import { createFileRoute } from '@tanstack/react-router'
import { Alert, Loader, Stack, Text, Title } from '@mantine/core'
import { useSuspenseQuery } from '@tanstack/react-query'
import { PlayerRole, playersQueryOptions } from '#/features/players/playersQuery'
import { PlayerRoleSection } from '#/features/players/components/playerRoleSection/playerRoleSection'

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
    <Stack gap="md">
      <Title order={1}>Spelers</Title>
      {sortedPlayers.length > 0 ? (
        <Stack gap="xl">
          {Object.values(PlayerRole).map((role) => {
            const rolePlayers = sortedPlayers.filter(
              (player) => player.role === role,
            )

            return rolePlayers.length > 0 ? (
              <PlayerRoleSection
                key={role}
                role={role}
                players={rolePlayers}
              />
            ) : null
          })}
        </Stack>
      ) : (
        <Text c="dimmed" role="status">
          Geen spelers gevonden.
        </Text>
      )}
    </Stack>
  )
}
