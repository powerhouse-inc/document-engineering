import { cn } from '../../../../../scalars/lib/utils.js'
import type { ViewMode, WithDifference } from '../../../../../scalars/components/types.js'
import { useId, useMemo } from 'react'
import { ToggleBase } from '../toggle-base.js'

interface ToggleDiffProps
  extends Omit<WithDifference<boolean>, 'diffMode' | 'viewMode'>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: boolean
  label?: React.ReactNode
  optionalLabel?: React.ReactNode
  disabled?: boolean
  required?: boolean
  viewMode?: ViewMode
  baseValue?: boolean
  name?: string
  onChange?: (checked: boolean) => void
}
const ToggleDiff = ({
  value,
  label,
  optionalLabel,
  required,
  disabled,
  baseValue = false,
  viewMode = 'edition',
  onChange,
  name,
}: ToggleDiffProps) => {
  const generatedId = useId()
  const id = generatedId

  const hasDifference = useMemo(() => {
    if (baseValue === value) {
      return { hasDiff: false, type: 'neutral' as const }
    }
    if (!baseValue && value === true) {
      return { hasDiff: true, type: 'addition' as const }
    }
    return { hasDiff: true, type: 'removal' as const }
  }, [baseValue, value])

  return (
    <div className="flex flex-row items-center justify-end gap-2" data-testid="toggle-diff">
      <span
        className={cn(
          'text-gray-700',
          'font-inter text-sm font-semibold leading-[22px]',
          hasDifference.hasDiff && (viewMode === 'removal' || viewMode === 'mixed')
            ? hasDifference.type === 'removal'
              ? 'bg-red-600/30'
              : undefined
            : undefined
        )}
      >
        {optionalLabel}
      </span>
      <ToggleBase
        aria-labelledby={`${id}-label`}
        required={required}
        name={name}
        id={id}
        checked={value}
        onCheckedChange={onChange}
        disabled={disabled}
      />

      <span
        className={cn(
          'text-gray-700',
          'text-sm font-semibold leading-[22px]',
          hasDifference.hasDiff && (viewMode === 'addition' || viewMode === 'mixed')
            ? hasDifference.type === 'addition'
              ? 'bg-green-600/30'
              : undefined
            : undefined
        )}
      >
        {label}
      </span>
    </div>
  )
}

export default ToggleDiff
