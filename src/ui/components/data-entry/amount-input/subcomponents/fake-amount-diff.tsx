import { cn } from '../../../../../scalars/lib/utils.js'
import type { DiffMode, WithDifference } from '../../../../../scalars/components/types.js'
import { type Change, diffSentences, diffWords } from 'diff'
import { useMemo } from 'react'
import type { AmountValue } from '../types.js'
import { Icon } from '../../../icon/index.js'
import type { Currency } from '../../currency-code-picker/types.js'

interface SelectDiffProps extends WithDifference<AmountValue> {
  value?: AmountValue
  className?: string
  childrenClassName?: string
  currencyPosition?: 'left' | 'right'
  options?: Currency[]
  symbolPosition?: 'left' | 'right'
  includeCurrencySymbols?: boolean
  diffMode?: DiffMode
}

const AmountDiff = ({
  baseValue,
  value,
  viewMode,
  className,
  childrenClassName,
  currencyPosition = 'left',
  options,
  symbolPosition,
  includeCurrencySymbols,
  diffMode = 'words',
}: SelectDiffProps) => {
  const currentValue = useMemo(() => {
    if (typeof value === 'object') {
      return value.value?.toString() ?? ''
    }
    return value?.toString() ?? ''
  }, [value])
  const currentBaseValue = useMemo(() => {
    if (typeof baseValue === 'object') {
      return baseValue.value?.toString() ?? ''
    }
    return baseValue?.toString() ?? ''
  }, [baseValue])

  const diffAmount = useMemo(() => {
    return diffMode === 'words'
      ? diffWords(currentBaseValue, currentValue)
      : diffSentences(currentBaseValue, currentValue)
  }, [currentBaseValue, currentValue, diffMode])

  const currentUnit = useMemo(() => {
    if (typeof value === 'object') {
      return value.unit ?? ''
    }
    return ''
  }, [value])

  const currentBaseUnit = useMemo(() => {
    if (typeof baseValue === 'object') {
      return baseValue.unit ?? ''
    }
    return ''
  }, [baseValue])

  const diffUnit = useMemo(() => {
    return diffMode === 'words' ? diffWords(currentBaseUnit, currentUnit) : diffSentences(currentBaseUnit, currentUnit)
  }, [currentBaseUnit, currentUnit, diffMode])

  // Render individual diff parts
  const renderDiffPart = (part: Change, index: number) => {
    const key = `${part.value}-${index}`

    // Handle added content
    if (part.added) {
      if (viewMode === 'addition' || viewMode === 'mixed') {
        return (
          <span key={key} className={cn('bg-green-600/30', childrenClassName)}>
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
          <span key={key} className={cn('bg-red-600/30', childrenClassName)}>
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

  // Render all diff parts for a specific diff
  const renderDiffContent = (diff: Change[]) => {
    return diff.map(renderDiffPart).filter(Boolean)
  }

  const amountContent = renderDiffContent(diffAmount)
  const unitContent = renderDiffContent(diffUnit)

  const showUnit = typeof value === 'object' && 'unit' in value

  // Get the same className as unit to pass to symbol as its not part of value
  const symbolClassName = viewMode === 'addition' ? 'bg-green-600/30' : 'bg-red-600/30'

  const actualSymbol = viewMode === 'addition' ? currentUnit : currentBaseUnit
  const symbol = useMemo(() => {
    return options?.find((option) => option.ticker === actualSymbol)?.symbol
  }, [options, actualSymbol])

  const showSymbolLeft = includeCurrencySymbols && symbolPosition === 'left'
  const showSymbolRight = includeCurrencySymbols && symbolPosition === 'right'
  return (
    <div className={cn('flex w-full items-center gap-2', className)}>
      {showUnit && currencyPosition === 'left' && (
        <div className="flex flex-row items-center justify-end shrink-0">
          <div className="flex flex-row items-center justify-end gap-2">
            <span>
              {showSymbolLeft && <span className={cn(symbolClassName, 'pr-1')}>{symbol}</span>}
              {unitContent}
              {showSymbolRight && <span className={cn(symbolClassName, 'pl-1')}>{symbol}</span>}
            </span>
            <Icon size={16} name="ChevronDown" className="text-gray-700 dark:text-gray-300" />
            <div className="h-[36px] w-px bg-gray-300" />
          </div>
        </div>
      )}
      <div className="flex flex-1 truncate [&>span]:w-full [&>span]:truncate">{amountContent}</div>
      {showUnit && currencyPosition === 'right' && (
        <div className="flex flex-row items-center justify-end shrink-0">
          <div className="flex flex-row items-center justify-end gap-2">
            <div className="h-[36px] w-px bg-gray-300" />
            <span>
              {showSymbolLeft && <span className={cn(symbolClassName, 'pr-1')}>{symbol}</span>}
              {unitContent}
              {showSymbolRight && <span className={cn(symbolClassName, 'pl-1')}>{symbol}</span>}
            </span>
            <Icon size={16} name="ChevronDown" className="text-gray-700 dark:text-gray-300" />
          </div>
        </div>
      )}
    </div>
  )
}
AmountDiff.displayName = 'AmountDiff'
export { AmountDiff }
