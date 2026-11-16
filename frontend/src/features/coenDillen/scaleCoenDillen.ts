// Coen Dillen's goals per round in 1956/57 (43 goals in 34 rounds).
const DILLEN_GOALS_PER_ROUND = [
  1, 0, 0, 0, 0, 2, 1, 1, 0, 0, 4, 0, 1, 0, 2, 2, 1, 0, 3, 4, 2, 2, 1, 2, 2, 1,
  3, 0, 0, 2, 0, 2, 2, 2,
]
const DILLEN_ROUNDS = DILLEN_GOALS_PER_ROUND.length

export const SEASON_GAMES = 25

const OUR_ROUNDS_PER_DILLEN_ROUND = SEASON_GAMES / DILLEN_ROUNDS

const DILLEN_GOALS_AFTER_ROUND = DILLEN_GOALS_PER_ROUND.reduce(
  (totals, goals) => [...totals, totals[totals.length - 1] + goals],
  [0],
)

export function scaledDillenGoalsAfterRound(round: number): number {
  return (
    dillenGoalsAtFractionalRound(round / OUR_ROUNDS_PER_DILLEN_ROUND) *
    OUR_ROUNDS_PER_DILLEN_ROUND
  )
}

function dillenGoalsAtFractionalRound(dillenRound: number): number {
  const clamped = Math.min(Math.max(dillenRound, 0), DILLEN_ROUNDS)
  const before = Math.floor(clamped)
  const after = Math.min(before + 1, DILLEN_ROUNDS)
  const fraction = clamped - before

  return (
    DILLEN_GOALS_AFTER_ROUND[before] +
    (DILLEN_GOALS_AFTER_ROUND[after] - DILLEN_GOALS_AFTER_ROUND[before]) *
      fraction
  )
}
