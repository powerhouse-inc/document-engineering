import { FormGroup } from '../../../../scalars/components/fragments/form-group/index.js'
import { FormLabel } from '../../../../scalars/components/fragments/form-label/index.js'
import type { WithDifference } from '../../../../scalars/components/types.js'
import { SplittedInputDiff } from '../input/splitted-input-diff.js'
interface TextInputDiffProps extends WithDifference<string | number | bigint>, React.HTMLAttributes<HTMLDivElement> {
  value: string | number | bigint
  label?: React.ReactNode
  required?: boolean
}
const TextInputDiff = ({
  value,
  label,
  required,
  baseValue = '',
  viewMode = 'edition',
  diffMode = 'sentences',
  ...props
}: TextInputDiffProps) => {
  const valueString = typeof value === 'number' || typeof value === 'bigint' ? value.toString() : value
  const baseValueString =
    typeof baseValue === 'number' || typeof baseValue === 'bigint' ? baseValue.toString() : baseValue
  return (
    <FormGroup>
      {label && (
        <FormLabel disabled={true} required={required}>
          {label}
        </FormLabel>
      )}
      <SplittedInputDiff
        value={valueString}
        baseValue={baseValueString}
        diffMode={diffMode}
        viewMode={viewMode}
        {...props}
      />
    </FormGroup>
  )
}

export default TextInputDiff
