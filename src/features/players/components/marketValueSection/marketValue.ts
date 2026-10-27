import type { StatsRow } from '#/features/statsTable/statsQuery'
import type { EventRow, EventType } from '#/features/events/eventsQuery'

const BASE_VALUE = 50_000
const MIN_VALUE = 10_000

const MARKET_VALUE_WEIGHTS = [
  { key: 'games_played', label: 'Wedstrijden', weight: 25_000 },
  { key: 'goals', label: 'Doelpunten', weight: 100_000 },
  { key: 'assists', label: 'Assists', weight: 60_000 },
  { key: 'own_goals', label: 'Eigen doelpunten', weight: -50_000 },
  { key: 'yellow_cards', label: 'Gele kaarten', weight: -10_000 },
  { key: 'red_cards', label: 'Rode kaarten', weight: -40_000 },
  { key: 'throwins_failed', label: 'Mislukte inworpen', weight: -5_000 },
  { key: 'injuries', label: 'Blessures', weight: -30_000 },
  { key: 'clean_sheets', label: 'Propere lakens', weight: 100_000 },
] as const satisfies {
  key: keyof StatsRow
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

export function marketValue(stats: StatsRow): MarketValue {
  const breakdown = MARKET_VALUE_WEIGHTS.map(({ key, label, weight }) => ({
    key,
    label,
    amount: (Number(stats[key]) || 0) * weight,
  })).filter((item) => item.amount !== 0)

  const sum = breakdown.reduce((total, item) => total + item.amount, BASE_VALUE)

  return { total: Math.max(sum, MIN_VALUE), breakdown }
}

// Stats that are also recorded per game in the events sheet.
const EVENT_STATS: Record<EventType, keyof StatsRow> = {
  goal: 'goals',
  assist: 'assists',
  own_goal: 'own_goals',
  yellow_card: 'yellow_cards',
  red_card: 'red_cards',
  injury: 'injuries',
  clean_sheet: 'clean_sheets',
}

export type MarketValuePoint = {
  game: number
  label: string
  value: number
}

/**
 * Market value after every game. Event-based stats land on the game they
 * happened in; stats without events (games played, throw-ins)
 * have no game, so they are spread evenly over the season.
 */
export function marketValueHistory(
  stats: StatsRow,
  events: EventRow[],
  seasonGames: number,
): MarketValuePoint[] {
  const eventStats = new Set<keyof StatsRow>(Object.values(EVENT_STATS))
  const weights = new Map<keyof StatsRow, number>(
    MARKET_VALUE_WEIGHTS.map(({ key, weight }) => [key, weight]),
  )

  const spreadTotal = MARKET_VALUE_WEIGHTS.filter(
    ({ key }) => !eventStats.has(key),
  ).reduce(
    (total, { key, weight }) => total + (Number(stats[key]) || 0) * weight,
    0,
  )
  const spreadPerGame = seasonGames > 0 ? spreadTotal / seasonGames : 0

  const eventAmountByGame = new Map<number, number>()
  for (const event of events) {
    if (event.player_id !== stats.player_id) continue
    const weight = weights.get(EVENT_STATS[event.event]) ?? 0
    eventAmountByGame.set(
      event.game,
      (eventAmountByGame.get(event.game) ?? 0) + weight,
    )
  }

  const points: MarketValuePoint[] = []
  let eventTotal = 0
  for (let game = 0; game <= seasonGames; game++) {
    eventTotal += eventAmountByGame.get(game) ?? 0
    points.push({
      game,
      label: game === 0 ? 'Start' : `W${game}`,
      value: Math.max(
        BASE_VALUE + spreadPerGame * game + eventTotal,
        MIN_VALUE,
      ),
    })
  }

  return points
}

export function seasonGameCount(
  allStats: StatsRow[],
  events: EventRow[],
): number {
  return Math.max(
    0,
    ...allStats.map((row) => Number(row.games_played) || 0),
    ...events.map((event) => Number(event.game) || 0),
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
