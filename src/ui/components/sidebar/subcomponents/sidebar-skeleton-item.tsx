'use client'

import { cn } from '../../../../scalars/lib/index.js'

interface SidebarSkeletonItemProps {
  depth: number
  textWidth: string
  style?: React.CSSProperties
}

export const SidebarSkeletonItem = ({ depth, textWidth, style }: SidebarSkeletonItemProps) => {
  const paddingLeft = depth * 24

  return (
    <div style={style} className="flex items-center px-2">
      <div className="flex h-8 w-full items-center gap-2 px-2 py-1" style={{ paddingLeft: paddingLeft + 8 }}>
        {/* Chevron icon skeleton */}
        <div className="min-w-4 w-4 h-4 flex items-center justify-center">
          <div className="min-w-4 w-4 h-4 rounded bg-gray-200 dark:bg-gray-600 animate-pulse" />
        </div>

        {/* Text content skeleton */}
        <div className={cn('h-4 rounded-sm bg-gray-200 dark:bg-gray-600 animate-pulse', textWidth)} />
      </div>
    </div>
  )
}
