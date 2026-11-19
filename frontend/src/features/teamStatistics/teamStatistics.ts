import type { MantineColor } from '@mantine/core'
import type { PlayerStatsWithName } from '#/features/statsTable/statsQuery'
import type { Game } from './gamesQuery'

export type GameResultKey = 'win' | 'draw' | 'loss'

export type GameResult = {
  key: GameResultKey
  label: string
  abbreviation: string
  color: MantineColor
}

export const gameResults = {
  win: { key: 'win', label: 'Winst', abbreviation: 'W', color: 'green.6' },
  draw: {
    key: 'draw',
    label: 'Gelijkspel',
    abbreviation: 'G',
    color: 'gray.5',
  },
  loss: { key: 'loss', label: 'Verlies', abbreviation: 'V', color: 'red.6' },
} satisfies Record<GameResultKey, GameResult>

export type GameResultStat = {
  result: GameResult
  count: number
}

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

export function getPlayedGames(games: Game[]): PlayedGame[] {
  return games
    .map((game): PlayedGame | null => {
      const goalsFor = game.goalsOdin
      const goalsAgainst = game.goalsOpponent

      if (goalsFor === null || goalsAgainst === null) {
        return null
      }

      return {
        id: game.id,
        date: game.date,
        goalsFor,
        goalsAgainst,
        result:
          goalsFor > goalsAgainst
            ? gameResults.win
            : goalsFor === goalsAgainst
              ? gameResults.draw
              : gameResults.loss,
      } satisfies PlayedGame
    })
    .filter((game): game is PlayedGame => game !== null)
    .sort(
      (left, right) =>
        left.date.localeCompare(right.date) || left.id - right.id,
    )
}

export function calculateTeamStatistics(games: PlayedGame[]): TeamStatistics {
  const wins = games.filter((game) => game.result.key === 'win').length
  const draws = games.filter((game) => game.result.key === 'draw').length
  const losses = games.filter((game) => game.result.key === 'loss').length

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
  { key: 'gamesPlayed', label: 'Wedstrijden', singularLabel: 'Wedstrijd' },
  { key: 'goals', label: 'Doelpunten', singularLabel: 'Doelpunt' },
  { key: 'assists', label: 'Assists', singularLabel: 'Assist' },
  {
    key: 'ownGoals',
    label: 'Eigen doelpunten',
    singularLabel: 'Eigen doelpunt',
  },
  { key: 'yellowCards', label: 'Gele kaarten', singularLabel: 'Gele kaart' },
  { key: 'redCards', label: 'Rode kaarten', singularLabel: 'Rode kaart' },
  {
    key: 'throwinsFailed',
    label: 'Mislukte inworpen',
    singularLabel: 'Mislukte inworp',
  },
  { key: 'injuries', label: 'Blessures', singularLabel: 'Blessure' },
  {
    key: 'cleanSheets',
    label: 'Propere lakens',
    singularLabel: 'Proper laken',
  },
] as const satisfies readonly {
  key: keyof PlayerStatsWithName
  label: string
  singularLabel: string
}[]

export function getPlayerLeaders(
  players: PlayerStatsWithName[],
  key: (typeof playerLeaderStats)[number]['key'],
): PlayerStatsWithName[] {
  if (players.length === 0) return []

  const highestValue = Math.max(...players.map((player) => player[key]))
  return players.filter((player) => player[key] === highestValue)
}
