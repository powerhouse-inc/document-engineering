'use client'

import { forwardRef } from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { cn } from '../../../scalars/lib/utils.js'
import { buttonVariants } from '../button/button.js'
import type { VariantProps } from 'class-variance-authority'

const AlertDialog = ({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Root>) => {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

const AlertDialogTrigger = forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Trigger>,
  React.ComponentProps<typeof AlertDialogPrimitive.Trigger>
>(({ ...props }, ref) => {
  return <AlertDialogPrimitive.Trigger ref={ref} data-slot="alert-dialog-trigger" {...props} />
})
AlertDialogTrigger.displayName = 'AlertDialogTrigger'

const AlertDialogPortal = ({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) => {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
}

const AlertDialogOverlay = forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentProps<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Overlay
      ref={ref}
      data-slot="alert-dialog-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
        className
      )}
      {...props}
    />
  )
})
AlertDialogOverlay.displayName = 'AlertDialogOverlay'

const AlertDialogContent = forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentProps<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={ref}
        data-slot="alert-dialog-content"
        className={cn(
          'bg-white dark:bg-charcoal-900 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border border-gray-300 dark:border-charcoal-700 p-6 shadow-lg duration-200 sm:max-w-lg',
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
})
AlertDialogContent.displayName = 'AlertDialogContent'

const AlertDialogHeader = forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="alert-dialog-header"
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  )
})
AlertDialogHeader.displayName = 'AlertDialogHeader'

const AlertDialogFooter = forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="alert-dialog-footer"
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  )
})
AlertDialogFooter.displayName = 'AlertDialogFooter'

const AlertDialogTitle = forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentProps<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Title
      ref={ref}
      data-slot="alert-dialog-title"
      className={cn('text-lg font-semibold text-gray-900 dark:text-gray-50', className)}
      {...props}
    />
  )
})
AlertDialogTitle.displayName = 'AlertDialogTitle'

const AlertDialogDescription = forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentProps<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Description
      ref={ref}
      data-slot="alert-dialog-description"
      className={cn('text-gray-600 dark:text-gray-400 text-sm', className)}
      {...props}
    />
  )
})
AlertDialogDescription.displayName = 'AlertDialogDescription'

const AlertDialogAction = forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentProps<typeof AlertDialogPrimitive.Action> & {
    variant?: VariantProps<typeof buttonVariants>['variant']
  }
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Action
      ref={ref}
      className={cn(buttonVariants({ variant: props.variant ?? 'default' }), className)}
      {...props}
    />
  )
})
AlertDialogAction.displayName = 'AlertDialogAction'

const AlertDialogCancel = forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentProps<typeof AlertDialogPrimitive.Cancel> & {
    variant?: VariantProps<typeof buttonVariants>['variant']
  }
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Cancel
      ref={ref}
      className={cn(buttonVariants({ variant: props.variant ?? 'outline' }), className)}
      {...props}
    />
  )
})
AlertDialogCancel.displayName = 'AlertDialogCancel'

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
