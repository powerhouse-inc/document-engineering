import type { DiffMode, InputBaseProps, WithDifference } from '../../../../scalars/components/types.js'
import type { IconName } from '../../icon/index.js'

interface UrlInputWithDifference extends Omit<WithDifference<string>, 'diffMode'> {
  diffMode?: Extract<DiffMode, 'sentences'>
}

type PlatformIcon = IconName | React.ReactElement

interface UrlInputProps
  extends UrlInputWithDifference,
    InputBaseProps<string>,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'pattern' | 'value' | 'defaultValue' | 'name' | 'maxLength'> {
  showWarnings?: boolean
  platformIcons?: Record<string, PlatformIcon>
}

export type { UrlInputProps, PlatformIcon, UrlInputWithDifference }
