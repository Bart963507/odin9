import { Paper, SimpleGrid, Text } from '@mantine/core'
import type { PlayerStats } from '#/features/statsTable/statsQuery'

type StatTilesProps = {
  stats: PlayerStats
}

export function StatTiles({ stats }: StatTilesProps) {
  const tiles = [
    { key: 'gamesPlayed', label: 'Wedstrijden', value: stats.gamesPlayed },
    { key: 'goals', label: 'Doelpunten', value: stats.goals },
    { key: 'assists', label: 'Assists', value: stats.assists },
    { key: 'contributions', label: 'G+A', value: stats.goals + stats.assists },
  ]

  return (
    <SimpleGrid cols={{ base: 2, sm: 4 }}>
      {tiles.map((tile) => (
        <Paper key={tile.key} withBorder p="md" ta="center">
          <Text fz={28} fw={700}>
            {tile.value}
          </Text>
          <Text size="sm" c="dimmed">
            {tile.label}
          </Text>
        </Paper>
      ))}
    </SimpleGrid>
  )
}
