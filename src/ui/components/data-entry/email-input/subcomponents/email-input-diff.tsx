import { FormGroup } from '../../../../../scalars/components/fragments/form-group/index.js'
import { FormLabel } from '../../../../../scalars/components/index.js'
import type { WithDifference } from '../../../../../scalars/components/types.js'
import { SplittedInputDiff } from '../../input/splitted-input-diff.js'
import type { EmailInputProps } from '../types.js'

interface EmailDiffProps extends Omit<WithDifference<string>, 'diffMode'> {
  value: string
  label: EmailInputProps['label']
  required: EmailInputProps['required']
}

const EmailInputDiff = ({ value = '', label, required, viewMode, baseValue = '' }: EmailDiffProps) => {
  return (
    <FormGroup>
      {label && (
        <FormLabel disabled={true} required={required}>
          {label}
        </FormLabel>
      )}
      <SplittedInputDiff
        baseValue={baseValue}
        value={value}
        viewMode={viewMode}
        diffMode="sentences"
        data-testid="email-input-diff"
      />
    </FormGroup>
  )
}

export { EmailInputDiff }
