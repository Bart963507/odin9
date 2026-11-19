import { SimpleGrid, Stack, Text } from '@mantine/core'
import type { Player } from '#/features/players/playersQuery'
import type { PlayerStats } from '#/features/statsTable/statsQuery'
import type { GameEvent } from '#/features/events/eventsQuery'
import type { Appearance } from '#/features/appearances/appearancesQuery'
import { PlayerHeader } from './components/playerHeader/playerHeader'
import { MarketValueSection } from './components/marketValueSection/marketValueSection'
import { StatTiles } from './components/statTiles/statTiles'
import { ProfileSection } from './components/profileSection/profileSection'
import { ProfileRows } from './components/profileRows/profileRows'
import type { ProfileRow } from './components/profileRows/profileRows'

type PlayerProfileProps = {
  player: Player
  stats: PlayerStats | undefined
  events: GameEvent[]
  appearances: Appearance[]
}

export function PlayerProfile({
  player,
  stats,
  events,
  appearances,
}: PlayerProfileProps) {
  return (
    <Stack gap="lg">
      <PlayerHeader player={player} />
      {stats ? (
        <>
          <MarketValueSection
            stats={stats}
            events={events}
            appearances={appearances}
          />
          <StatTiles stats={stats} />
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            <ProfileSection title="Spelersprofiel">
              <ProfileRows rows={profileRows(stats)} />
            </ProfileSection>
            <ProfileSection title="Discipline">
              <ProfileRows rows={disciplineRows(stats)} />
            </ProfileSection>
          </SimpleGrid>
        </>
      ) : (
        <Text c="dimmed">Nog geen statistieken</Text>
      )}
    </Stack>
  )
}

function profileRows(stats: PlayerStats): ProfileRow[] {
  return [
    { key: 'gamesPlayed', label: 'Wedstrijden', value: stats.gamesPlayed },
    { key: 'goals', label: 'Doelpunten', value: stats.goals },
    { key: 'assists', label: 'Assists', value: stats.assists },
    {
      key: 'goalsPerGame',
      label: 'Doelpunten per wedstrijd',
      value: perGame(stats.goals, stats.gamesPlayed),
    },
    { key: 'cleanSheets', label: 'Propere lakens', value: stats.cleanSheets },
  ]
}

function disciplineRows(stats: PlayerStats): ProfileRow[] {
  return [
    { key: 'yellowCards', label: 'Gele kaarten', value: stats.yellowCards },
    { key: 'redCards', label: 'Rode kaarten', value: stats.redCards },
    { key: 'ownGoals', label: 'Eigen doelpunten', value: stats.ownGoals },
    {
      key: 'throwinsFailed',
      label: 'Mislukte inworpen',
      value: stats.throwinsFailed,
    },
    { key: 'injuries', label: 'Blessures', value: stats.injuries },
  ]
}

function perGame(count: number, games: number): string {
  if (!games) {
    return '–'
  }

  return (count / games).toLocaleString('nl-NL', { maximumFractionDigits: 2 })
}
