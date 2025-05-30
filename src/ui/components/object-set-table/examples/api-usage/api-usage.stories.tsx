import type { Meta, StoryObj } from '@storybook/react'
import { ApiUsageExample } from './api-usage.js'

const meta = {
  title: 'Data Display/Object Set Table/2 - Examples/API Usage',
  component: ApiUsageExample,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
    docs: {
      source: {
        language: 'tsx',
        format: true,
        code: `

        `,
      },
    },
  },
} satisfies Meta<typeof ApiUsageExample>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
