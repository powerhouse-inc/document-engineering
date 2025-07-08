import * as ProgressPrimitive from '@radix-ui/react-progress'
import React from 'react'
import { cn } from '../../../lib/utils.js'

const ProgressBar = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    animationDuration?: number
  }
>(({ className, value, animationDuration = 500, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    data-slot="progress-bar"
    className={cn('relative w-full h-3 overflow-hidden rounded bg-gray-100', className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      data-slot="progress-bar-indicator"
      className="w-full h-full bg-blue-900"
      style={{
        transform: `translateX(-${100 - (value ?? 0)}%)`,
        transition: `transform ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      }}
    />
  </ProgressPrimitive.Root>
))

ProgressBar.displayName = 'ProgressBar'

export { ProgressBar }
