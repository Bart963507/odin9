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

const RESULT_ABBREVIATIONS = {
  win: 'W',
  draw: 'G',
  loss: 'V',
} as const

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
  const percentage = (count: number) =>
    played > 0
      ? `${((count / played) * 100).toLocaleString('nl-NL', { maximumFractionDigits: 1 })}%`
      : '0%'
  const average = (total: number) =>
    played > 0
      ? (total / played).toLocaleString('nl-NL', {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })
      : '0,0'

  const outcomeStats = [
    { key: 'win', count: statistics.wins },
    { key: 'draw', count: statistics.draws },
    { key: 'loss', count: statistics.losses },
  ] as const

  const averages = [
    {
      label: 'Punten per wedstrijd',
      value: average(statistics.points),
      calculation: `${statistics.points} P`,
    },
    {
      label: 'Doelpunten per wedstrijd',
      value: average(statistics.goalsFor),
      calculation: `${statistics.goalsFor} DPV`,
    },
    {
      label: 'Tegendoelpunten per wedstrijd',
      value: average(statistics.goalsAgainst),
      calculation: `${statistics.goalsAgainst} DPT`,
    },
    {
      label: 'Mislukte inworpen per wedstrijd',
      value: average(failedThrowins),
      calculation: `${failedThrowins} MI`,
    },
  ]
  const formSlots = Array.from(
    { length: 5 },
    (_, index) =>
      statistics.recentForm.at(index - (5 - statistics.recentForm.length)) ??
      null,
  )

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
                <DonutChart
                  data={outcomeStats.map((stat) => ({
                    name: RESULT_LABELS[stat.key],
                    value: stat.count,
                    color: RESULT_COLORS[stat.key],
                  }))}
                  size={190}
                  thickness={40}
                  startAngle={90}
                  endAngle={-270}
                  withLabelsLine={false}
                  withTooltip
                  pieProps={{
                    label: ({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      value,
                      payload,
                    }) => {
                      const radius =
                        (Number(innerRadius) + Number(outerRadius)) / 2
                      const angle = (-Number(midAngle) * Math.PI) / 180
                      const x = Number(cx) + radius * Math.cos(angle)
                      const y = Number(cy) + radius * Math.sin(angle)
                      const isDraw = payload?.name === RESULT_LABELS.draw

                      return (
                        <text
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={isDraw ? '#1f1f1f' : '#fff'}
                          fontSize={14}
                          fontWeight={700}
                        >
                          {value}
                        </text>
                      )
                    },
                  }}
                />
              ) : (
                <Text c="dimmed">Nog geen gespeelde wedstrijden.</Text>
              )}
            </Group>
            <SimpleGrid cols={3} spacing="xs">
              {outcomeStats.map((stat) => (
                <Stack key={stat.key} gap={2} align="center">
                  <div className={classes.outcomeChart}>
                    <DonutChart
                      data={[
                        {
                          name: RESULT_LABELS[stat.key],
                          value: stat.count,
                          color: RESULT_COLORS[stat.key],
                        },
                        {
                          name: 'Overige',
                          value: played > 0 ? played - stat.count : 1,
                          color: 'gray.2',
                        },
                      ]}
                      size={92}
                      thickness={7}
                      startAngle={90}
                      endAngle={-270}
                      withTooltip={played > 0}
                      aria-label={`${RESULT_LABELS[stat.key]}: ${percentage(stat.count)}`}
                    />
                    <Stack
                      gap={0}
                      align="center"
                      justify="center"
                      className={classes.outcomeLabel}
                      aria-hidden="true"
                    >
                      <Text size="sm" fw={700} c={RESULT_COLORS[stat.key]}>
                        {RESULT_ABBREVIATIONS[stat.key]}
                      </Text>
                      <Text size="xs" fw={700} c={RESULT_COLORS[stat.key]}>
                        {percentage(stat.count)}
                      </Text>
                    </Stack>
                  </div>
                </Stack>
              ))}
            </SimpleGrid>
          </Stack>
        </Card>

        <Stack gap="md" h={{ base: 'auto', sm: '100%' }}>
          <Card p="md" style={{ flex: '1 1 auto' }}>
            <Stack gap="md">
              <Title order={2} size="h3">
                Huidige vorm
              </Title>
              <Group
                gap="sm"
                className={classes.form}
                aria-label="Recente vorm"
              >
                {formSlots.map((game, index) => (
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
                  >
                    {/* {game ? RESULT_ABBREVIATIONS[game.result] : '-'} */}
                  </span>
                ))}
              </Group>
            </Stack>
          </Card>

          <Card p="md" style={{ flex: '1 1 auto' }}>
            <Stack gap="md">
              <Title order={2} size="h3">
                Gemiddelden
              </Title>
              <SimpleGrid cols={{ base: 2, sm: 2 }}>
                {averages.map((stat) => (
                  <Stack key={stat.label} gap={2}>
                    <Text size="sm" c="dimmed">
                      {stat.label}
                    </Text>
                    <Text fz={24} fw={700}>
                      {stat.value}{' '}
                      <Text span fz="15" fw={400} c="dimmed">
                        ({stat.calculation})
                      </Text>
                    </Text>
                  </Stack>
                ))}
              </SimpleGrid>
            </Stack>
          </Card>
        </Stack>
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
                  Meeste {stat.label.toLowerCase()}: {leaderValue}{' '}
                </Text>
                {leaderValue > 0 ? (
                  <Text size="xl" fw={700} className={classes.leaderNames}>
                    {leaders
                      .map(
                        (player) => `${player.first_name} ${player.last_name}`,
                      )
                      .join('\n')}
                  </Text>
                ) : (
                  <Text c="dimmed">Nog geen registraties</Text>
                )}
              </Card>
            )
          })}
        </SimpleGrid>
      </Stack>
    </Stack>
  )
}
