import { DonutChart } from '@mantine/charts'
import type { GameResultStat } from '../../teamStatistics'
import { gameResults } from '../../teamStatistics'

type MatchOutcomeDonutProps = {
  outcomes: GameResultStat[]
}

export function MatchOutcomeDonut({ outcomes }: MatchOutcomeDonutProps) {
  return (
    <DonutChart
      data={outcomes.map(({ result, count }) => ({
        name: result.label,
        value: count,
        color: result.color,
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
          const radius = (Number(innerRadius) + Number(outerRadius)) / 2
          const angle = (-Number(midAngle) * Math.PI) / 180
          const x = Number(cx) + radius * Math.cos(angle)
          const y = Number(cy) + radius * Math.sin(angle)
          const isDraw = payload?.name === gameResults.draw.label

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
  )
}
