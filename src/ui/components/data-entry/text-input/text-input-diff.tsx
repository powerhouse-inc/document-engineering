import { FormGroup } from '../../../../scalars/components/fragments/form-group/index.js'
import { FormLabel } from '../../../../scalars/components/fragments/form-label/index.js'
import type { WithDifference } from '../../../../scalars/components/types.js'
import { SplittedInputDiff } from '../input/splitted-input-diff.js'
interface TextInputDiffProps extends WithDifference<string>, React.HTMLAttributes<HTMLDivElement> {
  value: string
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
  return (
    <FormGroup>
      {label && (
        <FormLabel disabled={true} required={required}>
          {label}
        </FormLabel>
      )}
      <SplittedInputDiff value={value} baseValue={baseValue} diffMode={diffMode} viewMode={viewMode} {...props} />
    </FormGroup>
  )
}

export default TextInputDiff
