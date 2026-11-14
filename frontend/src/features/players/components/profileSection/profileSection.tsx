import { Paper, Stack } from '@mantine/core'
import type { ReactNode } from 'react'
import classes from './profileSection.module.css'

type ProfileSectionProps = {
  title: string
  children: ReactNode
}

export function ProfileSection({ title, children }: ProfileSectionProps) {
  return (
    <Paper withBorder className={classes.section}>
      <div className={classes.sectionHeader}>{title}</div>
      <Stack gap="md" className={classes.sectionBody}>
        {children}
      </Stack>
    </Paper>
  )
}
