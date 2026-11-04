import { DonutChart } from '@mantine/charts'
import { Card, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import type { PlayerStatsRow } from '#/features/statsTable/statsQuery'
import {
  calculateTeamStatistics,
  getPlayedGames,
  getPlayerLeaders,
  playerLeaderStats,
} from './teamStatistics'
import type { GameRow } from './gamesQuery'
import classes from './teamStatisticsDashboard.module.css'

type TeamStatisticsDashboardProps = {
  games: GameRow[]
  players: PlayerStatsRow[]
}

const RESULT_LABELS = {
  win: 'Winst',
  draw: 'Gelijkspel',
  loss: 'Verlies',
} as const

const RESULT_COLORS = {
  win: 'green.6',
  draw: 'gray.5',
  loss: 'red.6',
} as const

export function TeamStatisticsDashboard({
  games,
  players,
}: TeamStatisticsDashboardProps) {
  const statistics = calculateTeamStatistics(getPlayedGames(games))
  const played = statistics.gamesPlayed
  const percentage = (count: number) =>
    played > 0
      ? `${((count / played) * 100).toLocaleString('nl-NL', { maximumFractionDigits: 1 })}%`
      : '0%'
  const average = (total: number) =>
    played > 0
      ? (total / played).toLocaleString('nl-NL', { maximumFractionDigits: 2 })
      : '0'

  const outcomeStats = [
    { key: 'win', label: 'Winst%', count: statistics.wins },
    { key: 'draw', label: 'Gelijkspel%', count: statistics.draws },
    { key: 'loss', label: 'Verlies%', count: statistics.losses },
  ] as const

  const averages = [
    { label: 'Punten per wedstrijd', value: average(statistics.points) },
    { label: 'Doelpunten per wedstrijd', value: average(statistics.goalsFor) },
    {
      label: 'Tegendoelpunten per wedstrijd',
      value: average(statistics.goalsAgainst),
    },
  ]

  return (
    <Stack gap="lg">
      <Title order={1}>Teamstatistieken</Title>

      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        {outcomeStats.map((stat) => (
          <Card key={stat.key} p="md">
            <Text size="sm" c="dimmed">
              {stat.label}
            </Text>
            <Group align="baseline" gap="xs">
              <Text fz={30} fw={700} c={RESULT_COLORS[stat.key]}>
                {percentage(stat.count)}
              </Text>
              <Text size="sm" c="dimmed">
                {stat.count} van {played} wedstrijden
              </Text>
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Card p="md">
          <Stack gap="md">
            <Title order={2} size="h3">
              Wedstrijdresultaten
            </Title>
            {played > 0 ? (
              <>
                <DonutChart
                  data={outcomeStats.map((stat) => ({
                    name: RESULT_LABELS[stat.key],
                    value: stat.count,
                    color: RESULT_COLORS[stat.key],
                  }))}
                  size={190}
                  thickness={28}
                  withTooltip
                  mx="auto"
                />
                <SimpleGrid cols={3} spacing="xs">
                  {outcomeStats.map((stat) => (
                    <Stack key={stat.key} gap={2} align="center">
                      <Text size="sm" c="dimmed">
                        {RESULT_LABELS[stat.key]}
                      </Text>
                      <Text fw={700} c={RESULT_COLORS[stat.key]}>
                        {stat.count}
                      </Text>
                    </Stack>
                  ))}
                </SimpleGrid>
              </>
            ) : (
              <Text c="dimmed">Nog geen gespeelde wedstrijden.</Text>
            )}
          </Stack>
        </Card>

        <Card p="md">
          <Stack gap="md">
            <Group justify="space-between" align="start">
              <Title order={2} size="h3">
                Huidige vorm
              </Title>
              <Text size="sm" c="dimmed">
                Laatste vijf wedstrijden
              </Text>
            </Group>
            <Group gap="sm" className={classes.form} aria-label="Recente vorm">
              {Array.from({ length: 5 }, (_, index) => {
                const game =
                  statistics.recentForm.at(
                    index - (5 - statistics.recentForm.length),
                  ) ?? null

                return (
                  <span
                    key={game?.id ?? `empty-${index}`}
                    className={`${classes.formBall} ${game ? classes[game.result] : classes.unplayed}`}
                    role="img"
                    aria-label={
                      game
                        ? `${RESULT_LABELS[game.result]} ${game.goalsFor}-${game.goalsAgainst}`
                        : 'Nog geen wedstrijd'
                    }
                    title={
                      game
                        ? `${RESULT_LABELS[game.result]} ${game.goalsFor}-${game.goalsAgainst}`
                        : 'Nog geen wedstrijd'
                    }
                  />
                )
              })}
            </Group>
            <Text size="sm" c="dimmed">
              {statistics.wins} gewonnen, {statistics.draws} gelijk en{' '}
              {statistics.losses} verloren uit {played} gespeelde wedstrijden.
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 3 }}>
              {averages.map((stat) => (
                <Stack key={stat.label} gap={2}>
                  <Text fz={24} fw={700}>
                    {stat.value}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {stat.label}
                  </Text>
                </Stack>
              ))}
            </SimpleGrid>
          </Stack>
        </Card>
      </SimpleGrid>

      <Stack gap="sm">
        <Title order={2} size="h3">
          Spelerrecords
        </Title>
        <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }}>
          {playerLeaderStats.map((stat) => {
            const leaders = getPlayerLeaders(players, stat.key)
            const leaderValue = leaders.length > 0 ? leaders[0][stat.key] : 0

            return (
              <Card key={stat.key} p="md" className={classes.leaderCard}>
                <Text size="sm" c="dimmed">
                  Meeste {stat.label.toLowerCase()}
                </Text>
                {leaderValue > 0 ? (
                  <Text fw={700} className={classes.leaderNames}>
                    {leaders
                      .map(
                        (player) => `${player.first_name} ${player.last_name}`,
                      )
                      .join(', ')}
                  </Text>
                ) : (
                  <Text c="dimmed">Nog geen registraties</Text>
                )}
                <Text size="sm" c="dimmed">
                  {leaderValue}{' '}
                  {leaderValue === 1
                    ? stat.singularLabel
                    : stat.label.toLowerCase()}
                </Text>
              </Card>
            )
          })}
        </SimpleGrid>
      </Stack>
    </Stack>
  )
}
