import { FormGroup, FormLabel } from '../../../../scalars/components/fragments/index.js'
import { SplittedInputDiff } from '../input/splitted-input-diff.js'
import type { WithDifference } from '../../../../scalars/components/types.js'
import type { PasswordInputProps } from './types.js'

interface PasswordInputDiffProps extends Omit<WithDifference<string>, 'diffMode'> {
  value: string
  label: PasswordInputProps['label']
  required: PasswordInputProps['required']
}

const PasswordInputDiff = ({ value = '', label, required, viewMode, baseValue = '' }: PasswordInputDiffProps) => {
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
        data-testid="password-input-diff"
      />
    </FormGroup>
  )
}

export { PasswordInputDiff }
