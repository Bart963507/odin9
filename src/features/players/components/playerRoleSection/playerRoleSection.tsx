import { SimpleGrid, Stack, Title } from '@mantine/core'
import { PlayerCard } from '#/features/players/playerCard'
import { PlayerRole } from '#/features/players/playersQuery'
import type { PlayerRow } from '#/features/players/playersQuery'

type PlayerRoleSectionProps = {
  role: PlayerRole
  players: PlayerRow[]
}

const ROLE_LABELS: Record<PlayerRole, string> = {
  [PlayerRole.Goalkeeper]: 'Doelmannen',
  [PlayerRole.Defender]: 'Verdedigers',
  [PlayerRole.Midfielder]: 'Middenvelders',
  [PlayerRole.Forward]: 'Aanvallers',
}

export function PlayerRoleSection({ role, players }: PlayerRoleSectionProps) {
  return (
    <Stack component="section" gap="sm">
      <Title order={3}>{ROLE_LABELS[role]}</Title>
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, lg: 4 }}>
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </SimpleGrid>
    </Stack>
  )
}
