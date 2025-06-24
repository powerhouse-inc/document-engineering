import type { SelectOption } from './types.js'
import { Icon } from '../../../components/icon/index.js'
import { cn } from '../../../../scalars/lib/utils.js'

export const renderIcon = (IconComponent: SelectOption['icon'], className?: string) => {
  if (typeof IconComponent === 'string') {
    return <Icon name={IconComponent} size={16} className={className} />
  }
  return IconComponent && <IconComponent className={cn('size-4', className)} />
}
