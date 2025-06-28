import { confirmable, type ConfirmDialogProps, createConfirmation } from 'react-confirm'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './alert-dialog.js'

export interface ConfirmOptions {
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'destructive' | 'default'
}

const ConfirmDialog = ({
  show,
  proceed,
  title,
  description,
  confirmLabel = 'Continue',
  cancelLabel = 'Cancel',
  variant = 'default',
}: ConfirmDialogProps<ConfirmOptions, boolean>) => {
  const getActionStyles = () => {
    if (variant === 'destructive') {
      return 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200'
    }
    return ''
  }

  return (
    <AlertDialog
      open={show}
      onOpenChange={(open) => {
        proceed(open)
      }}
    >
      <AlertDialogContent className={show ? 'animate-in' : 'animate-out'}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              proceed(false)
            }}
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            className={getActionStyles()}
            onClick={() => {
              proceed(true)
            }}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export const confirm = createConfirmation(confirmable(ConfirmDialog))
