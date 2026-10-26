import { Text } from '@mantine/core'
import { Fragment } from 'react'
import type { ReactNode } from 'react'
import classes from './profileRows.module.css'

export type ProfileRow = {
  key: string
  label: string
  value: ReactNode
}

type ProfileRowsProps = {
  rows: ProfileRow[]
}

export function ProfileRows({ rows }: ProfileRowsProps) {
  return (
    <div className={classes.rows}>
      {rows.map((row) => (
        <Fragment key={row.key}>
          <Text size="sm" className={classes.label}>
            {row.label}
          </Text>
          <Text size="sm" className={classes.value}>
            {row.value}
          </Text>
        </Fragment>
      ))}
    </div>
  )
}
