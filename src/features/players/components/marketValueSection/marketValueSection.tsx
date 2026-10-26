import { Group, Text } from '@mantine/core'
import { AreaChart } from '@mantine/charts'
import type { StatsRow } from '#/features/statsTable/statsQuery'
import type { EventRow } from '#/features/events/eventsQuery'
import {
  formatMarketValue,
  marketValue,
  marketValueHistory,
  seasonGameCount,
} from './marketValue'
import { ProfileSection } from '../profileSection/profileSection'
import classes from './marketValueSection.module.css'

type MarketValueSectionProps = {
  stats: StatsRow
  allStats: StatsRow[]
  events: EventRow[]
}

export function MarketValueSection({
  stats,
  allStats,
  events,
}: MarketValueSectionProps) {
  const value = marketValue(stats)
  const history = marketValueHistory(
    stats,
    events,
    seasonGameCount(allStats, events),
  )
  const highest = history.reduce((max, point) =>
    point.value > max.value ? point : max,
  )

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
            {formatMarketValue(highest.value)}
          </Text>
          <Text size="xs" c="dimmed" ta="right">
            {highest.game === 0
              ? 'Seizoensstart'
              : `Na wedstrijd ${highest.game}`}
          </Text>
        </div>
      </Group>
      <AreaChart
        h={240}
        data={history}
        dataKey="label"
        series={[{ name: 'value', label: 'Marktwaarde', color: 'blue.7' }]}
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
