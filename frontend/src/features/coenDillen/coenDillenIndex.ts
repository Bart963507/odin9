import type { PlayerStatsWithName } from '#/features/statsTable/statsQuery'
import { scaledDillenGoalsAfterRound } from '#/features/coenDillen/scaleCoenDillen'

export type CoenDillenRankingRow = {
  playerId: number
  name: string
  goals: number
  index: number
}

export function coenDillenRanking(
  rows: PlayerStatsWithName[],
  round: number,
): CoenDillenRankingRow[] {
  return rows
    .map((row) => ({
      playerId: row.playerId,
      name: `${row.firstName} ${row.lastName}`,
      goals: row.goals,
      index: coenDillenIndex(row.goals, round),
    }))
    .sort((a, b) => b.index - a.index)
}

export function coenDillenIndex(goals: number, round: number): number {
  const target = scaledDillenGoalsAfterRound(round)

  return target > 0 ? (goals / target) * 100 : 0
}

export function formatGoals(goals: number): string {
  return goals.toLocaleString('nl-NL', { maximumFractionDigits: 1 })
}
