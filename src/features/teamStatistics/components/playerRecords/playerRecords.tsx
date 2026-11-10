import { Card, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import type { PlayerStatsRow } from '#/features/statsTable/statsQuery'
import {
  formatMarketValue,
  marketValue,
} from '#/features/players/components/marketValueSection/marketValue'
import { getPlayerLeaders, playerLeaderStats } from '../../teamStatistics'
import classes from './playerRecords.module.css'

type PlayerRecordsProps = {
  players: PlayerStatsRow[]
}

export function PlayerRecords({ players }: PlayerRecordsProps) {
  const playerMarketValues = players.map((player) => ({
    player,
    value: marketValue(player).total,
  }))
  const highestMarketValue = playerMarketValues.reduce(
    (highest, entry) => Math.max(highest, entry.value),
    0,
  )
  const marketValueLeaders = playerMarketValues.filter(
    (entry) => entry.value === highestMarketValue,
  )

  return (
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
                  {leaders.map((player) => (
                    <Link
                      key={player.id}
                      to="/players/$playerId"
                      params={{ playerId: String(player.player_id) }}
                      className={classes.leaderLink}
                    >
                      {player.first_name} {player.last_name}
                    </Link>
                  ))}
                </Text>
              ) : (
                <Text c="dimmed">Nog geen registraties</Text>
              )}
            </Card>
          )
        })}
        <Card p="md" className={classes.leaderCard}>
          <Text size="sm" c="dimmed">
            Hoogste marktwaarde: {formatMarketValue(highestMarketValue)}
          </Text>
          {marketValueLeaders.length > 0 ? (
            <Text size="xl" fw={700} className={classes.leaderNames}>
              {marketValueLeaders.map(({ player }) => (
                <Link
                  key={player.id}
                  to="/players/$playerId"
                  params={{ playerId: String(player.player_id) }}
                  className={classes.leaderLink}
                >
                  {player.first_name} {player.last_name}
                </Link>
              ))}
            </Text>
          ) : (
            <Text c="dimmed">Nog geen registraties</Text>
          )}
        </Card>
      </SimpleGrid>
    </Stack>
  )
}
