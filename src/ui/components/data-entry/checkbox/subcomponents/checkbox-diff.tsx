import type { WithDifference } from '../../../../../scalars/components/types.js'
import { useId, useMemo } from 'react'
import { CheckboxBase } from '../checkbox-base.js'

import { FormLabel } from '../../../../../scalars/components/fragments/form-label/index.js'
import { cn } from '../../../../../scalars/lib/utils.js'

interface CheckboxDiffProps extends Omit<WithDifference<boolean>, 'diffMode'> {
  value?: boolean
  label?: React.ReactNode
  disabled?: boolean
  required?: boolean
  baseValue?: boolean
  name?: string
}
const CheckboxDiff = ({
  value,
  label,
  required,
  disabled,
  baseValue = false,
  viewMode = 'edition',
  name,
}: CheckboxDiffProps) => {
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
    <div className="flex flex-row items-center gap-2">
      <CheckboxBase id={id} name={name} checked={value} disabled={disabled} required={required} />

      <FormLabel
        htmlFor={id}
        required={required}
        disabled={disabled}
        inline={true}
        className={cn(
          hasDifference.hasDiff &&
            (viewMode === 'addition' || viewMode === 'mixed') &&
            hasDifference.type === 'addition'
            ? 'bg-green-600/30'
            : hasDifference.hasDiff &&
                (viewMode === 'removal' || viewMode === 'mixed') &&
                hasDifference.type === 'removal'
              ? 'bg-red-600/30'
              : undefined
        )}
      >
        {label}
      </FormLabel>
    </div>
  )
}
CheckboxDiff.displayName = 'CheckboxDiff'

export { CheckboxDiff }
