import type { InputBaseProps, WithDifference } from '../../../../scalars/components/types.js'
import type { IconName } from '../../icon/index.js'

type UrlInputWithDifference = Omit<WithDifference<string>, 'diffMode'>

type PlatformIcon = IconName | React.ReactElement

interface UrlInputProps
  extends UrlInputWithDifference,
    InputBaseProps<string>,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'pattern' | 'value' | 'defaultValue' | 'name' | 'maxLength'> {
  showWarnings?: boolean
  platformIcons?: Record<string, PlatformIcon>
}

export type { UrlInputProps, PlatformIcon, UrlInputWithDifference }
