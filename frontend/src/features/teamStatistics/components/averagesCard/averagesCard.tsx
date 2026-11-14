import { Card, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import classes from './averagesCard.module.css'

type AveragesCardProps = {
  gamesPlayed: number
  points: number
  goalsFor: number
  goalsAgainst: number
  failedThrowins: number
}

export function AveragesCard({
  gamesPlayed,
  points,
  goalsFor,
  goalsAgainst,
  failedThrowins,
}: AveragesCardProps) {
  const average = (total: number) =>
    gamesPlayed > 0
      ? (total / gamesPlayed).toLocaleString('nl-NL', {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })
      : '0,0'

  const averages = [
    {
      label: 'Punten per wedstrijd',
      total: points,
      calculation: `${points} P`,
    },
    {
      label: 'Doelpunten per wedstrijd',
      total: goalsFor,
      calculation: `${goalsFor} DPV`,
    },
    {
      label: 'Tegendoelpunten per wedstrijd',
      total: goalsAgainst,
      calculation: `${goalsAgainst} DPT`,
    },
    {
      label: 'Mislukte inworpen per wedstrijd',
      total: failedThrowins,
      calculation: `${failedThrowins} MI`,
    },
  ]

  return (
    <Card p="md" className={classes.card}>
      <Stack gap="md">
        <Title order={2} size="h3">
          Gemiddelden
        </Title>
        <SimpleGrid cols={{ base: 2, sm: 2 }}>
          {averages.map((stat) => (
            <Stack key={stat.label} gap={2}>
              <Text size="sm" c="dimmed">
                {stat.label}
              </Text>
              <Text fz={24} fw={700}>
                {average(stat.total)}{' '}
                <Text span fz="15" fw={400} c="dimmed">
                  ({stat.calculation})
                </Text>
              </Text>
            </Stack>
          ))}
        </SimpleGrid>
      </Stack>
    </Card>
  )
}
