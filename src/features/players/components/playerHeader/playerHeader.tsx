import { Image, Text } from '@mantine/core'
import type { PlayerRow } from '../../playersQuery'
import { playerPhotoUrl } from '../../playerCard'
import classes from './playerHeader.module.css'

type PlayerHeaderProps = {
  player: PlayerRow
}

export function PlayerHeader({ player }: PlayerHeaderProps) {
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
        <Text size="lg">{player.first_name}</Text>
        <Text fz={32} fw={700} tt="uppercase" lh={1.1}>
          {player.last_name}
        </Text>
      </div>
    </div>
  )
}
