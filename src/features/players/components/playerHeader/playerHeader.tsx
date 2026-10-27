import { Image, Text } from '@mantine/core'
import type { PlayerRow } from '../../playersQuery'
import { playerPhotoUrl } from '../../playerCard'
import classes from './playerHeader.module.css'

type PlayerHeaderProps = {
  player: PlayerRow
}

type PlayerHeaderColumn = {
  key: 'role' | 'position'
  label: string
  value: string
}

const DEFAULT_SHIRT_COLOR = '#da0b00'
const SHIRT_NUMBER_ONE_COLOR = '#3491bd'

export function PlayerHeader({ player }: PlayerHeaderProps) {
  const columns = mapColumns(player)
  const shirtColor =
    player.number === '1' ? SHIRT_NUMBER_ONE_COLOR : DEFAULT_SHIRT_COLOR

  return (
    <div className={classes.banner}>
      <Image
        src={playerPhotoUrl(player)}
        fallbackSrc={`${import.meta.env.BASE_URL}player.png`}
        alt=""
        fit="contain"
        className={classes.photo}
      />
      <div className={classes.bannerText}>
        <div className={classes.name}>
          <Text size="lg">{player.first_name}</Text>
          <Text fz={32} fw={700} tt="uppercase" lh={1.1}>
            {player.last_name}
          </Text>
        </div>
        <div className={classes.details}>
          {columns.map((column) => (
            <div key={column.key} className={classes.metadata}>
              <Text size="xs">{column.label}</Text>
              <Text size="sm" fw={600} className={classes.metaValue}>
                {column.value || '—'}
              </Text>
            </div>
          ))}
          {player.number !== null && (
            <span
              className={classes.shirtNumber}
              role="img"
              aria-label={`Shirt number ${player.number}`}
              style={{ backgroundColor: shirtColor }}
            >
              <span aria-hidden="true">{player.number}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function mapColumns(row: PlayerRow): PlayerHeaderColumn[] {
  return [
    { key: 'role', label: 'Rol', value: row.role },
    { key: 'position', label: 'Positie', value: row.position },
  ]
}
