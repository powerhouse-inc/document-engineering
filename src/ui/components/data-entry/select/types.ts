import type { IconName } from '../../../components/icon/index.js'
import type { DiffMode, InputBaseProps, WithDifference } from '../../../../scalars/components/types.js'
import type React from 'react'

interface SelectWithDifference extends Omit<WithDifference<string>, 'diffMode'> {
  diffMode?: Extract<DiffMode, 'sentences'>
}

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
  multiple?: boolean
  searchable?: boolean
  onChange?: (value: string | string[]) => void
  contentAlign?: 'start' | 'end' | 'center'
}

type SelectConfigProps =
  | (SelectBaseProps & {
      selectionIcon?: 'auto'
      selectionIconPosition?: 'left'
    })
  | (SelectBaseProps & {
      selectionIcon: 'checkmark'
      selectionIconPosition?: 'left' | 'right'
    })

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

export type { SelectBaseProps, SelectOption, SelectProps, SelectWithDifference }
