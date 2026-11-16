import { Card, createTheme } from '@mantine/core'
import type { MantineColorsTuple } from '@mantine/core'

const red: MantineColorsTuple = [
  '#fdeaec',
  '#f8d0d3',
  '#f0a1a7',
  '#e86f78',
  '#e04551',
  '#d82a37',
  '#cd1a28',
  '#c1121f',
  '#9c0b12',
  '#780000',
]

const navy: MantineColorsTuple = [
  '#e6f0f6',
  '#c9dbe7',
  '#97b9cf',
  '#5f93b4',
  '#33739c',
  '#185f8b',
  '#0b4a72',
  '#003049',
  '#00263b',
  '#001b2b',
]

const blue: MantineColorsTuple = [
  '#edf4f9',
  '#d9e8f1',
  '#b5d1e3',
  '#8db7d4',
  '#77a9c8',
  '#669bbc',
  '#5189ad',
  '#3f7698',
  '#326180',
  '#244a63',
]

export const theme = createTheme({
  colors: { red, navy, blue },
  primaryColor: 'red',
  primaryShade: 7,
  defaultRadius: 'md',
  components: {
    Card: Card.extend({
      defaultProps: { withBorder: true },
    }),
  },
})
