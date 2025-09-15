import type { IconName } from '../../../components/icon/index.js'
import type { InputBaseProps, WithDifference } from '../../../../scalars/components/types.js'
import type React from 'react'

interface SelectOption {
  icon?: IconName | React.ComponentType<{ className?: string }>
  value: string
  label: string
  disabled?: boolean
}

interface SelectBaseProps {
  options?: SelectOption[]
  favoriteOptions?: SelectOption[]
  placeholder?: string
  searchable?: boolean
  onChange?: (value: string | string[]) => void
  contentAlign?: 'start' | 'end' | 'center'
}

type SingleSelectProps = SelectBaseProps & {
  multiple?: false
  clearable?: boolean
}

type MultiSelectProps = SelectBaseProps & {
  multiple: true
  clearable?: never
}

type SelectCoreProps = SingleSelectProps | MultiSelectProps

type SelectConfigProps =
  | (SelectCoreProps & {
      selectionIcon?: 'auto'
      selectionIconPosition?: 'left'
    })
  | (SelectCoreProps & {
      selectionIcon: 'checkmark'
      selectionIconPosition?: 'left' | 'right'
    })

type SelectWithDifference = Omit<WithDifference<string | string[]>, 'diffMode'> & {
  baseIcon?: SelectOption['icon']
}

type SelectProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  keyof InputBaseProps<string | string[]> | keyof SelectConfigProps
> &
  InputBaseProps<string | string[]> &
  SelectConfigProps &
  SelectWithDifference & {
    className?: string
    contentClassName?: string
  }

export type { SelectBaseProps, SelectOption, SelectProps }
