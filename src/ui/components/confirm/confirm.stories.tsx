import type { Meta, StoryObj } from '@storybook/react'
import { confirm, type ConfirmOptions } from './confirm.js'
import { Button } from '../button/button.js'

/**
 * A confirmation dialog component that provides a simple way to ask users for confirmation
 * before performing an action. Built on top of react-confirm library and uses AlertDialog internally.
 *
 * Usage:
 *
 * ```tsx
 * import { confirm } from '@powerhousedao/document-engineering/ui'
 *
 * const handleDelete = async () => {
 *   const result = await confirm({
 *     title: 'Delete Item',
 *     description: 'Are you sure you want to delete this item? This action cannot be undone.',
 *     confirmLabel: 'Delete',
 *     cancelLabel: 'Cancel',
 *     variant: 'destructive'
 *   })
 *
 *   if (result) {
 *     // User confirmed - proceed with deletion
 *   }
 * }
 * ```
 */
const meta: Meta<typeof confirm> = {
  title: 'Feedback/Confirm',
  parameters: {
    layout: 'centered',
    chromatic: {
      disableSnapshot: true,
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      description: 'The title of the confirmation dialog',
      control: 'text',
    },
    description: {
      description: 'The description/message shown in the dialog',
      control: 'text',
    },
    confirmLabel: {
      description: 'The label for the confirm button',
      control: 'text',
    },
    cancelLabel: {
      description: 'The label for the cancel button',
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<{
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'destructive' | 'default'
}>

const ConfirmDemo = (options: ConfirmOptions) => {
  const handleConfirm = () => {
    void confirm(options).then((result) => {
      console.log(result ? 'User confirmed!' : 'User cancelled!')
    })
  }

  return <Button onClick={handleConfirm}>Show Confirm Dialog</Button>
}

export const Default: Story = {
  render: (args) => <ConfirmDemo {...args} />,
  args: {
    title: 'Confirm Action',
    description: 'Are you sure you want to perform this action?',
    confirmLabel: 'Continue',
    cancelLabel: 'Cancel',
    variant: 'default',
  },
}
