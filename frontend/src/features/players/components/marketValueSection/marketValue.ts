import type { PlayerStats } from '#/features/statsTable/statsQuery'
import type { EventType, GameEvent } from '#/features/events/eventsQuery'
import type { Appearance } from '#/features/appearances/appearancesQuery'

const BASE_VALUE = 50_000
const MIN_VALUE = 10_000

const MARKET_VALUE_WEIGHTS = [
  { key: 'gamesPlayed', label: 'Wedstrijden', weight: 25_000 },
  { key: 'goals', label: 'Doelpunten', weight: 100_000 },
  { key: 'assists', label: 'Assists', weight: 60_000 },
  { key: 'ownGoals', label: 'Eigen doelpunten', weight: -50_000 },
  { key: 'yellowCards', label: 'Gele kaarten', weight: -10_000 },
  { key: 'redCards', label: 'Rode kaarten', weight: -40_000 },
  { key: 'throwinsFailed', label: 'Mislukte inworpen', weight: -5_000 },
  { key: 'injuries', label: 'Blessures', weight: -30_000 },
  { key: 'cleanSheets', label: 'Propere lakens', weight: 100_000 },
] as const satisfies {
  key: keyof PlayerStats
  label: string
  weight: number
}[]

export type MarketValueItem = {
  key: string
  label: string
  amount: number
}

export type MarketValue = {
  total: number
  breakdown: MarketValueItem[]
}

export function marketValue(stats: PlayerStats): MarketValue {
  const breakdown = MARKET_VALUE_WEIGHTS.map(({ key, label, weight }) => ({
    key,
    label,
    amount: stats[key] * weight,
  })).filter((item) => item.amount !== 0)

  const sum = breakdown.reduce((total, item) => total + item.amount, BASE_VALUE)

  return { total: Math.max(sum, MIN_VALUE), breakdown }
}

const STAT_BY_EVENT_TYPE: Record<EventType, keyof PlayerStats> = {
  goal: 'goals',
  assist: 'assists',
  own_goal: 'ownGoals',
  yellow_card: 'yellowCards',
  red_card: 'redCards',
  injury: 'injuries',
  clean_sheet: 'cleanSheets',
  throwin_failed: 'throwinsFailed',
}

export type MarketValuePoint = {
  game: number
  label: string
  value: number
}

export function marketValueHistory(
  stats: PlayerStats,
  events: GameEvent[],
  appearances: Appearance[],
  seasonGames: number,
): MarketValuePoint[] {
  const amountByGame = marketValueAmountByGame(
    stats.playerId,
    events,
    appearances,
  )

  const points: MarketValuePoint[] = []
  const currentValue = marketValue(stats).total
  let runningTotal = 0
  for (let game = 0; game <= seasonGames; game++) {
    runningTotal += amountByGame.get(game) ?? 0
    points.push({
      game,
      label: game === 0 ? 'Start' : `W${game}`,
      value:
        game === seasonGames
          ? currentValue
          : Math.max(BASE_VALUE + runningTotal, MIN_VALUE),
    })
  }

  return points
}

function marketValueAmountByGame(
  playerId: number,
  events: GameEvent[],
  appearances: Appearance[],
): Map<number, number> {
  const weights = new Map<keyof PlayerStats, number>(
    MARKET_VALUE_WEIGHTS.map(({ key, weight }) => [key, weight]),
  )
  const amountByGame = new Map<number, number>()

  function addStatToGame(gameId: number, stat: keyof PlayerStats) {
    amountByGame.set(
      gameId,
      (amountByGame.get(gameId) ?? 0) + (weights.get(stat) ?? 0),
    )
  }

  for (const appearance of appearances) {
    if (appearance.playerId === playerId) {
      addStatToGame(appearance.gameId, 'gamesPlayed')
    }
  }
  for (const event of events) {
    if (event.playerId === playerId) {
      addStatToGame(event.gameId, STAT_BY_EVENT_TYPE[event.type])
    }
  }

  return amountByGame
}

export function seasonGameCount(
  appearances: Appearance[],
  events: GameEvent[],
): number {
  return Math.max(
    0,
    ...appearances.map((appearance) => appearance.gameId),
    ...events.map((event) => event.gameId),
  )
}

export function formatMarketValue(amount: number): string {
  const sign = amount < 0 ? '-' : ''
  const abs = Math.abs(amount)

  if (abs >= 1_000_000) {
    const millions = (abs / 1_000_000).toLocaleString('nl-NL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    return `${sign}${millions} mln €`
  }

  const thousands = (abs / 1_000).toLocaleString('nl-NL', {
    maximumFractionDigits: 0,
  })
  return `${sign}${thousands} k €`
}
