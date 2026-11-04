import type { PlayerStatsRow } from '#/features/statsTable/statsQuery'
import type { GameRow } from './gamesQuery'

export type GameResult = 'win' | 'draw' | 'loss'

export type PlayedGame = {
  id: number
  date: string
  goalsFor: number
  goalsAgainst: number
  result: GameResult
}

export type TeamStatistics = {
  gamesPlayed: number
  wins: number
  draws: number
  losses: number
  points: number
  goalsFor: number
  goalsAgainst: number
  recentForm: PlayedGame[]
}

export function getPlayedGames(rows: GameRow[]): PlayedGame[] {
  return rows
    .map((row) => {
      const goalsFor = Number(row.goals_odin)
      const goalsAgainst = Number(row.goals_opponent)

      if (
        !Number.isFinite(goalsFor) ||
        !Number.isFinite(goalsAgainst) ||
        row.goals_odin === null ||
        row.goals_opponent === null ||
        row.goals_odin === '' ||
        row.goals_opponent === ''
      ) {
        return null
      }

      return {
        id: Number(row.id),
        date: row.date,
        goalsFor,
        goalsAgainst,
        result:
          goalsFor > goalsAgainst
            ? 'win'
            : goalsFor === goalsAgainst
              ? 'draw'
              : 'loss',
      } satisfies PlayedGame
    })
    .filter((game): game is PlayedGame => game !== null)
    .sort(
      (left, right) =>
        left.date.localeCompare(right.date) || left.id - right.id,
    )
}

export function calculateTeamStatistics(games: PlayedGame[]): TeamStatistics {
  const wins = games.filter((game) => game.result === 'win').length
  const draws = games.filter((game) => game.result === 'draw').length
  const losses = games.filter((game) => game.result === 'loss').length

  return {
    gamesPlayed: games.length,
    wins,
    draws,
    losses,
    points: wins * 3 + draws,
    goalsFor: games.reduce((total, game) => total + game.goalsFor, 0),
    goalsAgainst: games.reduce((total, game) => total + game.goalsAgainst, 0),
    recentForm: games.slice(-5),
  }
}

export const playerLeaderStats = [
  { key: 'games_played', label: 'Wedstrijden', singularLabel: 'wedstrijd' },
  { key: 'goals', label: 'Doelpunten', singularLabel: 'doelpunt' },
  { key: 'assists', label: 'Assists', singularLabel: 'assist' },
  {
    key: 'own_goals',
    label: 'Eigen doelpunten',
    singularLabel: 'eigen doelpunt',
  },
  { key: 'yellow_cards', label: 'Gele kaarten', singularLabel: 'gele kaart' },
  { key: 'red_cards', label: 'Rode kaarten', singularLabel: 'rode kaart' },
  {
    key: 'throwins_failed',
    label: 'Mislukte inworpen',
    singularLabel: 'mislukte inworp',
  },
  { key: 'injuries', label: 'Blessures', singularLabel: 'blessure' },
  {
    key: 'clean_sheets',
    label: 'Propere lakens',
    singularLabel: 'proper laken',
  },
] as const satisfies readonly {
  key: keyof PlayerStatsRow
  label: string
  singularLabel: string
}[]

export function getPlayerLeaders(
  players: PlayerStatsRow[],
  key: (typeof playerLeaderStats)[number]['key'],
): PlayerStatsRow[] {
  if (players.length === 0) return []

  const highestValue = Math.max(...players.map((player) => player[key]))
  return players.filter((player) => player[key] === highestValue)
}
