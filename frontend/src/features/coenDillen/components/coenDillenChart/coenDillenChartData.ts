import type { GameEvent } from '#/features/events/eventsQuery'
import {
  SEASON_GAMES,
  scaledDillenGoalsAfterRound,
} from '#/features/coenDillen/scaleCoenDillen'

export type CoenDillenChartRow = {
  label: string
  dillen: number
  [playerSeriesKey: string]: number | string | undefined
}

export function coenDillenChartData(
  playerIds: number[],
  events: GameEvent[],
  currentRound: number,
): CoenDillenChartRow[] {
  const playerTotals = playerIds.map(
    (id) => [id, cumulativeGoalsPerRound(events, id)] as const,
  )

  return Array.from({ length: SEASON_GAMES + 1 }, (_, round) => {
    const row: CoenDillenChartRow = {
      label: round === 0 ? 'Start' : `W${round}`,
      dillen: Math.round(scaledDillenGoalsAfterRound(round) * 10) / 10,
    }
    for (const [id, totals] of playerTotals) {
      row[playerSeriesKey(id)] =
        round <= currentRound ? totals[round] : undefined
    }

    return row
  })
}

function cumulativeGoalsPerRound(
  events: GameEvent[],
  playerId: number,
): number[] {
  const totals = Array<number>(SEASON_GAMES + 1).fill(0)
  for (const event of events) {
    if (event.type === 'goal' && event.playerId === playerId) {
      totals[event.gameId]++
    }
  }
  for (let round = 1; round <= SEASON_GAMES; round++) {
    totals[round] += totals[round - 1]
  }

  return totals
}

export function playerSeriesKey(playerId: number): string {
  return `player_${playerId}`
}
