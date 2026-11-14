import type { PlayerStatsRow } from '#/features/statsTable/statsQuery'
import { scaledDillenGoalsAfterRound } from '#/features/coenDillen/scaleCoenDillen'

export type CoenDillenRankingRow = {
  playerId: number
  name: string
  goals: number
  index: number
}

export function coenDillenRanking(
  rows: PlayerStatsRow[],
  round: number,
): CoenDillenRankingRow[] {
  return rows
    .map((row) => {
      const goals = Number(row.goals) || 0

      return {
        playerId: row.player_id,
        name: `${row.first_name} ${row.last_name}`,
        goals,
        index: coenDillenIndex(goals, round),
      }
    })
    .sort((a, b) => b.index - a.index)
}

export function coenDillenIndex(goals: number, round: number): number {
  const target = scaledDillenGoalsAfterRound(round)

  return target > 0 ? (goals / target) * 100 : 0
}

export function formatGoals(goals: number): string {
  return goals.toLocaleString('nl-NL', { maximumFractionDigits: 1 })
}
