import { createFileRoute } from '@tanstack/react-router'
import {
  Alert,
  Group,
  Loader,
  SimpleGrid,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
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
    <>
      <Group
        align="center"
        justify="space-between"
        gap="md"
        mb="md"
        wrap="wrap"
      >
        <Title mb={0}>Spelers</Title>
        <Group align="center" gap="md" justify="flex-end" wrap="wrap">
          <Group align="center" gap="xs" wrap="nowrap">
            <Text component="label" htmlFor="player-search" size="sm" fw={500}>
              Zoek speler
            </Text>
            <TextInput
              id="player-search"
              aria-label="Zoek speler"
              placeholder="Voor- of achternaam"
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              w={240}
            />
          </Group>
        </Group>
      </Group>
      {filteredPlayers.length > 0 ? (
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, lg: 4 }}>
          {filteredPlayers.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </SimpleGrid>
      ) : (
        <Text c="dimmed" role="status">
          Geen spelers gevonden.
        </Text>
      )}
    </>
  )
}
