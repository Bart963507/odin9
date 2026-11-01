import { createFileRoute } from '@tanstack/react-router'
import {
  Alert,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
  PlayerRole,
  playersQueryOptions,
} from '#/features/players/playersQuery'
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
  const [search, setSearch] = useState('')
  const sortedPlayers = [...players].sort((a, b) =>
    a.last_name.localeCompare(b.last_name),
  )
  const normalizedSearch = search.trim().toLowerCase()
  const filteredPlayers = sortedPlayers.filter(
    (player) =>
      player.first_name.toLowerCase().includes(normalizedSearch) ||
      player.last_name.toLowerCase().includes(normalizedSearch),
  )

  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Title order={1}>Spelers</Title>
        <Group align="center" gap="xs" wrap="nowrap">
          <Text component="label" htmlFor="player-search" size="sm" fw={500}>
            Zoek speler
          </Text>
          <TextInput
            id="player-search"
            placeholder="Voor- of achternaam"
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            w={{ base: 200, sm: 260 }}
          />
        </Group>
      </Stack>
      {filteredPlayers.length > 0 ? (
        <Stack gap="xl">
          {Object.values(PlayerRole).map((role) => {
            const rolePlayers = filteredPlayers.filter(
              (player) => player.role === role,
            )

            return rolePlayers.length > 0 ? (
              <PlayerRoleSection key={role} role={role} players={rolePlayers} />
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
