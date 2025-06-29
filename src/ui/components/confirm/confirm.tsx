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
import type { VariantProps } from 'class-variance-authority'
import type { buttonVariants } from '../button/button.js'

export interface ConfirmOptions {
  title: string
  description: string
  confirmLabel?: string
  confirmVariant?: VariantProps<typeof buttonVariants>['variant']
  cancelLabel?: string
  cancelVariant?: VariantProps<typeof buttonVariants>['variant']
}

const ConfirmDialog = ({
  show,
  proceed,
  title,
  description,
  confirmLabel = 'Continue',
  cancelLabel = 'Cancel',
  confirmVariant = 'default',
  cancelVariant = 'secondary',
}: ConfirmDialogProps<ConfirmOptions, boolean>) => {
  return (
    <AlertDialog open={show}>
      <AlertDialogContent className={show ? 'animate-in' : 'animate-out'}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            variant={cancelVariant}
            onClick={() => {
              proceed(false)
            }}
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            variant={confirmVariant}
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
