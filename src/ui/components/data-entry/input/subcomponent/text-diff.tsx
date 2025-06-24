import { cn } from '../../../../../scalars/lib/utils.js'
import type { WithDifference } from '../../../../../scalars/components/types.js'
import { type Change, diffSentences, diffWords } from 'diff'
import { useMemo } from 'react'

interface TextDiffProps extends WithDifference<string> {
  value: string
  className?: string
  childrenClassName?: string
  asLink?: boolean
  icon?: JSX.Element | null
}

export const TextDiff = ({
  baseValue,
  value,
  viewMode,
  diffMode = 'words',
  className,
  childrenClassName,
  asLink = false,
  icon,
}: TextDiffProps) => {
  const diff = useMemo(() => {
    const base = baseValue ?? ''
    return diffMode === 'words' ? diffWords(base, value) : diffSentences(base, value)
  }, [baseValue, value, diffMode])

  const { hasAdditions, hasRemovals } = useMemo(() => {
    return {
      hasAdditions: diff.some((part) => part.added),
      hasRemovals: diff.some((part) => part.removed),
    }
  }, [diff])

  // Check if current viewMode has relevant content to show
  const hasRelevantContent = useMemo(() => {
    if (!viewMode) return false

    switch (viewMode) {
      case 'addition':
        return hasAdditions
      case 'removal':
        return hasRemovals
      case 'mixed':
      case 'edition':
        return hasAdditions || hasRemovals
      default:
        return false
    }
  }, [viewMode, hasAdditions, hasRemovals])

  // Get background color for sentence-level diffs
  const getSentenceBackgroundColor = () => {
    if (diffMode !== 'sentences' || !hasRelevantContent) {
      return undefined
    }

    if (!viewMode) return undefined

    switch (viewMode) {
      case 'addition':
        return 'bg-green-600/30'
      case 'removal':
        return 'bg-red-600/30'
      case 'mixed':
      case 'edition':
      default:
        return undefined
    }
  }

  // Render individual diff parts
  const renderDiffPart = (part: Change, index: number) => {
    const key = `${part.value}-${index}`

    // Handle added content
    if (part.added) {
      if (viewMode === 'addition' || viewMode === 'mixed') {
        return (
          <span
            key={key}
            className={cn((diffMode === 'words' || viewMode === 'mixed') && 'bg-green-600/30', childrenClassName)}
          >
            {part.value}
          </span>
        )
      }
      return null
    }

    // Handle removed content
    if (part.removed) {
      if (viewMode === 'removal' || viewMode === 'mixed') {
        return (
          <span
            key={key}
            className={cn((diffMode === 'words' || viewMode === 'mixed') && 'bg-red-600/30', childrenClassName)}
          >
            {part.value}
          </span>
        )
      }
      return null
    }

    // Handle unchanged content - always render this
    return (
      <span key={key} className={cn(childrenClassName)}>
        {part.value}
      </span>
    )
  }

  // Render all diff parts
  const renderDiffContent = () => {
    return diff.map(renderDiffPart).filter(Boolean)
  }

  const bgColor = getSentenceBackgroundColor()
  const content = renderDiffContent()

  if (asLink && diffMode === 'sentences') {
    return (
      <div className={cn('flex flex-1 items-center gap-2 truncate leading-[18px]', bgColor, className)}>
        {hasRelevantContent && icon && icon}
        <a
          href={viewMode === 'removal' ? baseValue : value}
          target="_blank"
          rel="noopener noreferrer"
          className={cn('truncate text-blue-900 hover:underline focus-visible:outline-none')}
        >
          {content}
        </a>
      </div>
    )
  }

  if (icon && diffMode === 'sentences') {
    return (
      <div
        className={cn('flex flex-1 items-center gap-2 truncate [&>span]:truncate leading-[18px]', bgColor, className)}
      >
        {hasRelevantContent && icon}
        {content}
      </div>
    )
  }

  return <span className={cn('leading-[18px] text-gray-700', bgColor, className)}>{content}</span>
}
