import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@powerhousedao/design-system'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  confirm,
} from './index.js'

const meta: Meta<typeof AlertDialog> = {
  title: 'UI/Alert Dialog',
  component: AlertDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Manual usage with AlertDialog components
export const Manual: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Show Alert Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your data from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

// Programmatic usage with confirm function
export const Programmatic: Story = {
  render: () => (
    <div>
      <div className="space-y-4">
        <Button
          onClick={() => {
            void (async () => {
              const result = await confirm({
                title: 'Delete entries',
                description: 'Are you sure you want to delete 3 selected entries?',
                confirmLabel: 'Continue',
                cancelLabel: 'Cancel',
                variant: 'destructive',
              })
              // eslint-disable-next-line no-alert
              alert(result ? 'Confirmed!' : 'Cancelled')
            })()
          }}
        >
          Delete Entries (Destructive)
        </Button>

        <Button
          onClick={() => {
            void (async () => {
              const result = await confirm({
                title: 'Save changes',
                description: 'Are you sure you want to save these changes?',
                confirmLabel: 'Save',
                cancelLabel: 'Cancel',
              })
              // eslint-disable-next-line no-alert
              alert(result ? 'Saved!' : 'Cancelled')
            })()
          }}
        >
          Save Changes (Default)
        </Button>

        <Button
          onClick={() => {
            void (async () => {
              const result = await confirm({
                title: 'Reset form',
                description: 'This will clear all your progress. This action cannot be undone.',
                confirmLabel: 'Reset',
                cancelLabel: 'Keep editing',
                variant: 'destructive',
              })
              // eslint-disable-next-line no-alert
              alert(result ? 'Reset!' : 'Cancelled')
            })()
          }}
        >
          Reset Form
        </Button>
      </div>
    </div>
  ),
}

// Destructive variant example
export const DestructiveVariant: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete account</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete your account? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200">
            Delete Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}
