import { FormGroup } from '../../../../scalars/components/fragments/form-group/index.js'
import { FormLabel } from '../../../../scalars/components/fragments/form-label/index.js'
import { SplittedInputDiff } from '../input/splitted-input-diff.js'
import type { UrlInputProps, UrlInputWithDifference } from './types.js'

interface UrlInputDiffProps extends UrlInputWithDifference {
  value: string
  label: UrlInputProps['label']
  required: UrlInputProps['required']
  platformIcons: UrlInputProps['platformIcons']
}

const UrlInputDiff = ({
  value = '',
  label,
  required,
  viewMode,
  baseValue = '',
  platformIcons,
  ...props
}: UrlInputDiffProps) => {
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
        asLink={true}
        platformIcons={platformIcons}
        {...props}
      />
    </FormGroup>
  )
}

export { UrlInputDiff }
