import { Box } from '@mantine/core'
import type { PlayedGame } from '../../teamStatistics'
import classes from './formBall.module.css'

type FormBallProps = {
  game: PlayedGame | null
}

export function FormBall({ game }: FormBallProps) {
  const label = game
    ? `${game.result.label} ${game.goalsFor}-${game.goalsAgainst}`
    : 'Nog geen wedstrijd'

  return (
    <Box
      component="span"
      bg={game?.result.color ?? 'gray.5'}
      className={classes.formBall}
      role="img"
      aria-label={label}
      title={label}
    />
  )
}
