import { SimpleGrid, Stack, Text } from '@mantine/core'
import type { PlayerRow } from './playersQuery'
import type { StatsRow } from '#/features/statsTable/statsQuery'
import type { EventRow } from '#/features/events/eventsQuery'
import { PlayerHeader } from './components/playerHeader/playerHeader'
import { MarketValueSection } from './components/marketValueSection/marketValueSection'
import { StatTiles } from './components/statTiles/statTiles'
import { ProfileSection } from './components/profileSection/profileSection'
import { ProfileRows } from './components/profileRows/profileRows'
import type { ProfileRow } from './components/profileRows/profileRows'

type PlayerProfileProps = {
  player: PlayerRow
  stats: StatsRow | undefined
  allStats: StatsRow[]
  events: EventRow[]
}

export function PlayerProfile({
  player,
  stats,
  allStats,
  events,
}: PlayerProfileProps) {
  return (
    <Stack gap="lg">
      <PlayerHeader player={player} />
      {stats ? (
        <>
          <MarketValueSection
            stats={stats}
            allStats={allStats}
            events={events}
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

function profileRows(stats: StatsRow): ProfileRow[] {
  return [
    { key: 'games_played', label: 'Wedstrijden', value: stats.games_played },
    { key: 'goals', label: 'Doelpunten', value: stats.goals },
    { key: 'assists', label: 'Assists', value: stats.assists },
    {
      key: 'goals_per_game',
      label: 'Doelpunten per wedstrijd',
      value: perGame(stats.goals, stats.games_played),
    },
  ]
}

function disciplineRows(stats: StatsRow): ProfileRow[] {
  return [
    { key: 'yellow_cards', label: 'Gele kaarten', value: stats.yellow_cards },
    { key: 'red_cards', label: 'Rode kaarten', value: stats.red_cards },
    { key: 'own_goals', label: 'Eigen doelpunten', value: stats.own_goals },
    {
      key: 'throwins_failed',
      label: 'Mislukte ingooien',
      value: stats.throwins_failed,
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
