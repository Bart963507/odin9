import { Card, Group, Stack, Title } from '@mantine/core'
import type { PlayedGame } from '../../teamStatistics'
import { FormBall } from '../formBall/formBall'
import classes from './recentFormCard.module.css'

type RecentFormCardProps = {
  games: PlayedGame[]
}

export function RecentFormCard({ games }: RecentFormCardProps) {
  const formSlots = Array.from(
    { length: 5 },
    (_, index) => games.at(index - (5 - games.length)) ?? null,
  )

  return (
    <Card p="md" className={classes.card}>
      <Stack gap="md">
        <Title order={2} size="h3">
          Huidige vorm
        </Title>
        <Group gap="sm" className={classes.form} aria-label="Recente vorm">
          {formSlots.map((game, index) => (
            <FormBall key={game?.id ?? `empty-${index}`} game={game} />
          ))}
        </Group>
      </Stack>
    </Card>
  )
}
