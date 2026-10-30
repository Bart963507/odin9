import { Image, Text } from '@mantine/core'
import type { PlayerRow } from '../../playersQuery'
import { playerPhotoUrl } from '../../playerCard'
import { ShirtNumber } from '../shirtNumber/shirtNumber'
import classes from './playerHeader.module.css'

type PlayerHeaderProps = {
  player: PlayerRow
}

type PlayerHeaderColumn = {
  key: 'role' | 'position'
  label: string
  value: string
}

export function PlayerHeader({ player }: PlayerHeaderProps) {
  const columns = mapColumns(player)

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
            <ShirtNumber number={player.number} role={player.role} inverted />
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
