import { cn } from '../../../../scalars/lib/utils.js'
import type { SortDirection } from '../types.js'

interface SortIndicatorProps {
  direction: SortDirection | null
}

const SortIndicator = ({ direction }: SortIndicatorProps) => {
  return (
    <svg
      className={cn(
        'text-gray-500 group-hover/header-cell:text-gray-600',
        direction === 'desc' && '[&_path:first-child]:stroke-gray-900',
        direction === 'asc' && '[&_path:last-child]:stroke-gray-900'
      )}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 10.6667L11.3333 13.3334M11.3333 13.3334L8.66666 10.6667M11.3333 13.3334V2.66675"
        stroke="currentcolor"
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 5.33341L4.66667 2.66675M4.66667 2.66675L7.33333 5.33341M4.66667 2.66675V13.3334"
        stroke="currentcolor"
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export { SortIndicator }
