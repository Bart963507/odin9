import { DonutChart } from '@mantine/charts'
import { SimpleGrid, Stack, Text } from '@mantine/core'
import type { GameResultStat } from '../../teamStatistics'
import classes from './outcomeBreakdown.module.css'

type OutcomeBreakdownProps = {
  outcomes: GameResultStat[]
  played: number
}

export function OutcomeBreakdown({ outcomes, played }: OutcomeBreakdownProps) {
  const percentage = (count: number) =>
    played > 0
      ? `${((count / played) * 100).toLocaleString('nl-NL', { maximumFractionDigits: 1 })}%`
      : '0%'

  return (
    <SimpleGrid cols={3} spacing="xs">
      {outcomes.map(({ result, count }) => (
        <Stack key={result.key} gap={2} align="center">
          <div className={classes.outcomeChart}>
            <DonutChart
              data={[
                { name: result.label, value: count, color: result.color },
                {
                  name: 'Overige',
                  value: played > 0 ? played - count : 1,
                  color: 'gray.2',
                },
              ]}
              size={92}
              thickness={7}
              startAngle={90}
              endAngle={-270}
              withTooltip={played > 0}
              aria-label={`${result.label}: ${percentage(count)}`}
            />
            <Stack
              gap={0}
              align="center"
              justify="center"
              className={classes.outcomeLabel}
              aria-hidden="true"
            >
              <Text size="sm" fw={700} c={result.color}>
                {result.abbreviation}
              </Text>
              <Text size="xs" fw={700} c={result.color}>
                {percentage(count)}
              </Text>
            </Stack>
          </div>
        </Stack>
      ))}
    </SimpleGrid>
  )
}
