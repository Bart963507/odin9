import { MultiSelect, Stack } from '@mantine/core'
import { LineChart } from '@mantine/charts'
import { useState } from 'react'
import type { EventRow } from '#/features/events/eventsQuery'
import { formatGoals } from '#/features/coenDillen/coenDillenIndex'
import type { CoenDillenRankingRow } from '#/features/coenDillen/coenDillenIndex'
import {
  coenDillenChartData,
  playerSeriesKey,
} from '#/features/coenDillen/components/coenDillenChart/coenDillenChartData'
import classes from './coenDillenChart.module.css'

type CoenDillenChartProps = {
  players: CoenDillenRankingRow[]
  events: EventRow[]
  currentRound: number
}

const DEFAULT_SELECTION = 5

const PLAYER_COLORS = [
  'navy.7',
  'blue.5',
  'teal.6',
  'orange.6',
  'grape.6',
  'yellow.7',
  'cyan.7',
  'lime.7',
]

export function CoenDillenChart({
  players,
  events,
  currentRound,
}: CoenDillenChartProps) {
  const [selected, setSelected] = useState(() =>
    [...players]
      .sort((a, b) => b.goals - a.goals)
      .slice(0, DEFAULT_SELECTION)
      .map((player) => String(player.playerId)),
  )
  const selectedPlayers = players.filter((player) =>
    selected.includes(String(player.playerId)),
  )
  const data = coenDillenChartData(
    selectedPlayers.map((player) => player.playerId),
    events,
    currentRound,
  )

  return (
    <Stack gap="md">
      <MultiSelect
        label="Spelers"
        placeholder="Kies spelers"
        data={players.map((player) => ({
          value: String(player.playerId),
          label: player.name,
        }))}
        value={selected}
        onChange={setSelected}
        searchable
        clearable
        className={classes.select}
      />
      <LineChart
        h={320}
        data={data}
        dataKey="label"
        series={[
          {
            name: 'dillen',
            label: 'Coen Dillen',
            color: 'red.7',
            strokeDasharray: '6 4',
          },
          ...selectedPlayers.map((player, index) => ({
            name: playerSeriesKey(player.playerId),
            label: player.name,
            color: PLAYER_COLORS[index % PLAYER_COLORS.length],
          })),
        ]}
        curveType="linear"
        gridAxis="y"
        strokeWidth={2}
        withLegend
        withDots={false}
        valueFormatter={formatGoals}
      />
    </Stack>
  )
}
