import type { Meta, StoryObj } from '@storybook/react'
import { EventsExample } from './events.js'

const meta = {
  title: 'Data Display/Object Set Table/Examples/Events',
  component: EventsExample,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof EventsExample>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
