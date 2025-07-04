import { Icon } from '../../../components/icon/index.js'
import type React from 'react'
import { CommandItem } from '../../../../scalars/components/fragments/command/index.js'
import { renderIcon } from './render-icon.js'
import { cn } from '../../../../scalars/lib/utils.js'
import type { SelectProps } from './types.js'

interface FavoriteOptionsProps {
  options: SelectProps['options']
  selectedValues: string[]
  multiple?: boolean
  selectionIcon: 'auto' | 'checkmark'
  selectionIconPosition: 'left' | 'right'
  hasAnyIcon: boolean
  toggleOption: (value: string) => void
  tabIndex?: number
  className?: string
}

export const CommandListItem: React.FC<FavoriteOptionsProps> = ({
  options = [],
  selectedValues,
  multiple,
  selectionIcon,
  selectionIconPosition,
  hasAnyIcon,
  toggleOption,
  tabIndex,
  className,
}) => {
  return (
    <>
      {options.map((opt) => {
        const isSelected = selectedValues.includes(opt.value)
        return (
          <CommandItem
            tabIndex={tabIndex}
            key={`favorite-${opt.value}`}
            value={opt.label}
            onSelect={() => {
              if (!opt.disabled) {
                toggleOption(opt.value)
              }
            }}
            disabled={opt.disabled}
            className={cn(
              'cursor-pointer',
              'data-[selected=true]:bg-gray-100 dark:data-[selected=true]:bg-gray-900',
              opt.disabled && '!pointer-events-auto cursor-not-allowed hover:bg-transparent dark:hover:bg-transparent',
              className
            )}
            role="option"
            aria-selected={isSelected}
          >
            {selectionIcon === 'auto' &&
              (multiple ? (
                <div
                  className={cn(
                    'flex size-4 items-center justify-center rounded-md border',
                    'border-gray-700 dark:border-gray-400',
                    isSelected && 'bg-gray-900 text-slate-50 dark:bg-gray-400 dark:text-black'
                  )}
                >
                  {isSelected && <Icon name="Checkmark" size={16} />}
                </div>
              ) : (
                <div
                  className={cn(
                    'relative size-4 rounded-full border',
                    isSelected ? 'border-gray-900 dark:border-gray-400' : 'border-gray-800 dark:border-gray-400',
                    'bg-transparent dark:bg-transparent'
                  )}
                >
                  {isSelected && (
                    <div className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-900 dark:bg-gray-400" />
                  )}
                </div>
              ))}
            {selectionIcon === 'checkmark' && !(selectionIconPosition === 'right' && hasAnyIcon) && (
              <div className="size-4">
                {selectionIconPosition === 'left' && isSelected && (
                  <Icon name="Checkmark" size={16} className="text-gray-900 dark:text-gray-50" />
                )}
              </div>
            )}
            {renderIcon(opt.icon, 'text-gray-700 dark:text-gray-400')}
            <span
              className={cn(
                'flex-1 truncate text-[14px] font-normal leading-4',
                'text-gray-700 dark:text-gray-500',
                opt.disabled && 'text-gray-600 dark:text-gray-600'
              )}
            >
              {opt.label}
            </span>
            {selectionIcon === 'checkmark' && selectionIconPosition === 'right' && (
              <div className="size-4">
                {isSelected && <Icon name="Checkmark" size={16} className="text-gray-900 dark:text-gray-50" />}
              </div>
            )}
          </CommandItem>
        )
      })}
    </>
  )
}
