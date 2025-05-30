import { cn } from '../../../../../scalars/lib/utils.js'
import { FormGroup } from '../../../../../scalars/components/fragments/form-group/index.js'
import { FormLabel } from '../../../../../scalars/components/fragments/form-label/index.js'
import type { WithDifference } from '../../../../../scalars/components/types.js'
import { InputDiff } from '../../input/subcomponent/input-diff.js'
import { TextDiff } from '../../input/subcomponent/text-diff.js'

interface TextInputDiffProps extends WithDifference<string> {
  value: string
  label?: React.ReactNode
  required?: boolean
  ellipsis?: boolean
  multiline?: boolean
  rows?: number
}
const SplittedTextareaDiff = ({
  value,
  label,
  required,
  baseValue = '',
  viewMode = 'edition',
  diffMode,
  ellipsis = true,
  multiline = false,
  rows = 3,
}: TextInputDiffProps) => {
  return (
    <FormGroup>
      {label && (
        <FormLabel disabled={true} required={required}>
          {label}
        </FormLabel>
      )}

      <InputDiff ellipsis={ellipsis} multiline={multiline} rows={rows} hasPadding={true}>
        <TextDiff
          baseValue={baseValue}
          value={value}
          viewMode={viewMode}
          diffMode={diffMode}
          className={cn('min-h-9 flex-1')}
        />
      </InputDiff>
    </FormGroup>
  )
}

export default SplittedTextareaDiff
