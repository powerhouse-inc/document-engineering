import { FormGroup, FormLabel } from '../../../../scalars/components/fragments/index.js'
import { SplittedInputDiff } from '../input/splitted-input-diff.js'
import type { WithDifference } from '../../../../scalars/components/types.js'
import type { SelectProps } from './types.js'
import type { JSX } from 'react'

interface SelectDiffProps extends Omit<WithDifference<string>, 'diffMode'> {
  value: string
  label: SelectProps['label']
  required: SelectProps['required']
  baseIcon?: JSX.Element | null
  icon?: JSX.Element | null
}

const SelectDiff = ({ value = '', label, required, viewMode, baseValue = '', baseIcon, icon }: SelectDiffProps) => {
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
        baseIcon={baseIcon}
        icon={icon}
      />
    </FormGroup>
  )
}

export { SelectDiff }
