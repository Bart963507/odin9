import { Card, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import type { PlayerStatsRow } from '#/features/statsTable/statsQuery'
import {
  calculateTeamStatistics,
  gameResults,
  getPlayedGames,
} from './teamStatistics'
import type { GameResultStat } from './teamStatistics'
import type { GameRow } from './gamesQuery'
import { AveragesCard } from './components/averagesCard/averagesCard'
import { MatchOutcomeDonut } from './components/matchOutcomeDonut/matchOutcomeDonut'
import { OutcomeBreakdown } from './components/outcomeBreakdown/outcomeBreakdown'
import { PlayerRecords } from './components/playerRecords/playerRecords'
import { RecentFormCard } from './components/recentFormCard/recentFormCard'

type TeamStatisticsDashboardProps = {
  games: GameRow[]
  players: PlayerStatsRow[]
}

export function TeamStatisticsDashboard({
  games,
  players,
}: TeamStatisticsDashboardProps) {
  const statistics = calculateTeamStatistics(getPlayedGames(games))
  const played = statistics.gamesPlayed
  const failedThrowins = players.reduce(
    (total, player) => total + player.throwins_failed,
    0,
  )
  const outcomeStats: GameResultStat[] = [
    { result: gameResults.win, count: statistics.wins },
    { result: gameResults.draw, count: statistics.draws },
    { result: gameResults.loss, count: statistics.losses },
  ]

  return (
    <Stack gap="lg">
      <Title order={1}>Teamstatistieken</Title>

      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Card p="md">
          <Stack gap="md">
            <Title order={2} size="h3">
              Wedstrijdresultaten
            </Title>
            <Group align="center" justify="center" gap="md" wrap="wrap">
              <Stack gap={0} align="center">
                <Text fz={48} fw={700} lh={1}>
                  {played}
                </Text>
                <Text>Wedstrijden</Text>
              </Stack>
              {played > 0 ? (
                <MatchOutcomeDonut outcomes={outcomeStats} />
              ) : (
                <Text c="dimmed">Nog geen gespeelde wedstrijden.</Text>
              )}
            </Group>
            <OutcomeBreakdown outcomes={outcomeStats} played={played} />
          </Stack>
        </Card>

        <Stack gap="md" h={{ base: 'auto', sm: '100%' }}>
          <RecentFormCard games={statistics.recentForm} />
          <AveragesCard
            gamesPlayed={played}
            points={statistics.points}
            goalsFor={statistics.goalsFor}
            goalsAgainst={statistics.goalsAgainst}
            failedThrowins={failedThrowins}
          />
        </Stack>
      </SimpleGrid>

      <PlayerRecords players={players} />
    </Stack>
  )
}
