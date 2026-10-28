import { PlayerRole } from '#/features/players/playersQuery'
import classes from './shirtNumber.module.css'

type ShirtNumberProps = {
  number: string
  role: PlayerRole
  inverted?: boolean
}

export function ShirtNumber({
  number,
  role,
  inverted = false,
}: ShirtNumberProps) {
  return (
    <span
      className={classes.shirt}
      data-goalkeeper={role === PlayerRole.Goalkeeper || undefined}
      data-inverted={inverted || undefined}
      role="img"
      aria-label={`Shirt number ${number}`}
    >
      <span aria-hidden="true">{number}</span>
    </span>
  )
}
