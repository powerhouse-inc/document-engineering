import { forwardRef, type PropsWithChildren } from 'react'
import { Icon, type IconName } from '../../../components/icon/index.js'
import { cn } from '../../../../scalars/lib/utils.js'
import type { InputBaseProps } from '../../../../scalars/components/types.js'
import { Button } from '../../../../scalars/components/fragments/button/index.js'
import { Popover, PopoverContent, PopoverTrigger } from '../../../../scalars/components/fragments/popover/index.js'
import { Input } from '../../data-entry/input/input.js'

export interface BasePickerFieldProps extends PropsWithChildren {
  id?: string
  name: string
  disabled?: boolean
  required?: boolean
  iconName: IconName
  placeholder?: string
  value?: string
  defaultValue?: string
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void
  inputProps?: Omit<
    InputBaseProps<string> & {
      onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
    },
    'name' | 'onChange' | 'value' | 'defaultValue' | 'onBlur'
  >
  className?: string
  children: React.ReactNode
}

const BasePickerField = forwardRef<HTMLInputElement, BasePickerFieldProps>(
  (
    {
      id,
      name,
      disabled,
      required,
      iconName,
      placeholder,
      children,
      value,
      defaultValue,
      isOpen,
      setIsOpen,
      onInputChange,
      handleBlur,
      inputProps,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex flex-col space-y-2">
        <div
          ref={ref}
          className={cn(
            'flex w-full rounded-md text-sm',
            'focus-within:ring-ring dark:ring-charcoal-300 ring-gray-900 focus-within:ring-1 focus-within:ring-offset-0',
            'dark:border-charcoal-700 dark:bg-charcoal-900 border border-gray-300 bg-white',
            // focus
            'focus:[&_.input-field]:bg-transparent',
            'dark:focus-within:hover:bg-charcoal-900 focus-within:hover:cursor-default focus-within:hover:bg-white',
            disabled &&
              'dark:bg-charcoal-900 dark:hover:bg-charcoal-900 cursor-not-allowed bg-white hover:bg-transparent',
            'base-picker__input',
            className
          )}
        >
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                disabled={disabled}
                className={cn(
                  'pl-3 pr-2',
                  'z-1',
                  'focus:text-selected-foreground focus:bg-none',
                  'button-ghost',
                  disabled && 'cursor-not-allowed hover:bg-transparent',
                  'focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-gray-900'
                )}
                onClick={() => {
                  if (!disabled) {
                    setIsOpen(isOpen)
                  }
                }}
              >
                <Icon size={16} name={iconName} className="hover:none text-gray-700 dark:text-gray-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className={cn(
                'relative w-[275px]',
                'border-gray-300 bg-white dark:border-gray-900 dark:bg-slate-600',
                'rounded-lg',
                'shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08),0px_3px_10px_0px_rgba(0,0,0,0.10)]',
                'mt-[14px]',
                'dark:shadow-[1px_4px_15.3px_0px_#141921]',
                '-translate-y-1',
                'base-picker__popover',
                className
              )}
            >
              {children}
            </PopoverContent>
          </Popover>
          <Input
            id={id}
            name={name}
            value={value}
            onChange={onInputChange}
            onBlur={handleBlur}
            defaultValue={defaultValue}
            className={cn(
              'w-full rounded-l-none border-none text-right placeholder:text-right',
              // focus
              'input-field',
              'focus:bg-white focus-visible:ring-0 focus-visible:ring-offset-0'
            )}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            {...inputProps}
            {...props}
          />
        </div>
      </div>
    )
  }
)

BasePickerField.displayName = 'BasePickerField'

export { BasePickerField }
