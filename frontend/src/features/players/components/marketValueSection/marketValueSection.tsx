import { Group, Text } from '@mantine/core'
import { AreaChart } from '@mantine/charts'
import type { PlayerStats } from '#/features/statsTable/statsQuery'
import type { GameEvent } from '#/features/events/eventsQuery'
import type { Appearance } from '#/features/appearances/appearancesQuery'
import {
  formatMarketValue,
  marketValue,
  marketValueHistory,
  seasonGameCount,
} from './marketValue'
import { ProfileSection } from '../profileSection/profileSection'
import classes from './marketValueSection.module.css'

type MarketValueSectionProps = {
  stats: PlayerStats
  events: GameEvent[]
  appearances: Appearance[]
}

export function MarketValueSection({
  stats,
  events,
  appearances,
}: MarketValueSectionProps) {
  const value = marketValue(stats)
  const history = marketValueHistory(
    stats,
    events,
    appearances,
    seasonGameCount(appearances, events),
  )
  const highest = history.reduce((max, point) =>
    point.value > max.value ? point : max,
  )
  const currentIsHighest =
    value.total > highest.value || value.total === highest.value
  const highestValue = Math.max(value.total, highest.value)

  return (
    <ProfileSection title="Marktwaarde">
      <Group justify="space-between" align="flex-start">
        <div>
          <Text size="sm">Actuele marktwaarde:</Text>
          <Text className={classes.marketValue}>
            {formatMarketValue(value.total)}
          </Text>
        </div>
        <div>
          <Text size="sm" ta="right">
            Hoogste marktwaarde:
          </Text>
          <Text fw={700} ta="right">
            {formatMarketValue(highestValue)}
          </Text>
          <Text size="xs" c="dimmed" ta="right">
            {currentIsHighest
              ? 'Actueel'
              : highest.game === 0
                ? 'Seizoensstart'
                : `Na wedstrijd ${highest.game}`}
          </Text>
        </div>
      </Group>
      <AreaChart
        h={240}
        data={history}
        dataKey="label"
        series={[{ name: 'value', label: 'Marktwaarde', color: 'navy.7' }]}
        curveType="linear"
        gridAxis="y"
        strokeWidth={2}
        fillOpacity={0.35}
        valueFormatter={formatMarketValue}
        yAxisProps={{ width: 80 }}
      />
    </ProfileSection>
  )
}
