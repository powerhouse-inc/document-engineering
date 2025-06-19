import { FormDescription } from '../../../../scalars/components/fragments/form-description/index.js'
import { FormGroup } from '../../../../scalars/components/fragments/form-group/form-group.js'
import { FormLabel } from '../../../../scalars/components/fragments/form-label/form-label.js'
import { FormMessageList } from '../../../../scalars/components/fragments/form-message/message-list.js'
import { forwardRef, useId } from 'react'
import type { InputBaseProps, WithDifference } from '../../../../scalars/components/types.js'
import type { InputNumberProps } from '../number-input/types.js'
import type { SelectFieldProps } from '../../../../scalars/components/fragments/select-field/index.js'
import { BasePickerField } from '../date-time-picker/base-picker.js'
import TimePickerContent from './subcomponents/time-picker-content.js'
import type { TimeFieldValue } from './type.js'
import { useTimePicker } from './use-time-picker.js'
import { handleKeyDown } from './utils.js'
import TextInputDiff from '../text-input/text-input-diff.js'

interface TimePickerProps
  extends InputBaseProps<TimeFieldValue>,
    Omit<InputNumberProps, 'value' | 'defaultValue'>,
    WithDifference<TimeFieldValue> {
  label?: string
  id?: string
  name: string
  value?: TimeFieldValue
  defaultValue?: TimeFieldValue
  placeholder?: string
  inputProps?: Omit<
    InputBaseProps<string> & {
      onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
    },
    'name' | 'onChange' | 'value' | 'defaultValue' | 'onBlur'
  >
  selectProps?: Omit<SelectFieldProps, 'name' | 'options' | 'selectionIcon'>
  timeFormat?: string
  timeIntervals?: number
  showTimezoneSelect?: boolean
  timeZone?: string
  includeContinent?: boolean
  className?: string
}

const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(
  (
    {
      label,
      id: propId,
      errors,
      name,
      placeholder,
      value,
      defaultValue,
      onChange,
      onBlur,
      description,
      warnings,
      required,
      disabled,
      inputProps,
      selectProps,
      timeFormat = 'hh:mm a',
      showTimezoneSelect,
      timeIntervals,
      timeZone,
      includeContinent,
      className,
      // diff props,
      viewMode = 'edition',
      baseValue,
    },
    ref
  ) => {
    const {
      selectedHour,
      setSelectedHour,
      selectedMinute,
      setSelectedMinute,
      selectedPeriod,
      setSelectedPeriod,
      hours,
      minutes,
      isOpen,
      setIsOpen,
      inputValue,
      handleInputChange,
      handleSave,
      handleCancel,
      timeZonesOptions,
      handleBlur,
      is12HourFormat,
      selectedTimeZone,
      setSelectedTimeZone,
      isDisableSelect,
    } = useTimePicker({
      value,
      defaultValue,
      onChange,
      onBlur,
      timeFormat,
      timeIntervals,
      timeZone,
      showTimezoneSelect,
      includeContinent,
    })
    const generatedId = useId()
    const id = propId ?? generatedId

    if (viewMode === 'edition') {
      return (
        <FormGroup>
          {label && (
            <FormLabel htmlFor={id} required={required} disabled={disabled} hasError={!!errors?.length}>
              {label}
            </FormLabel>
          )}
          <BasePickerField
            id={id}
            iconName="Clock"
            isOpen={isOpen}
            name={name}
            disabled={disabled}
            required={required}
            value={inputValue}
            setIsOpen={setIsOpen}
            onInputChange={handleInputChange}
            ref={ref}
            placeholder={placeholder}
            handleBlur={handleBlur}
            inputProps={{
              ...inputProps,
              onKeyDown: handleKeyDown,
            }}
            className={String.raw`
            [&.base-picker\\_\\_popover]:pr-3
            [&.base-picker\\_\\_popover]:pb-4
            [&.base-picker\\_\\_popover]:pl-4
            [&.base-picker\\_\\_popover]:pt-3
            ${className}
          `}
          >
            <TimePickerContent
              selectedHour={selectedHour}
              selectedMinute={selectedMinute}
              selectedPeriod={selectedPeriod}
              setSelectedHour={setSelectedHour}
              setSelectedMinute={setSelectedMinute}
              setSelectedPeriod={setSelectedPeriod}
              hours={hours}
              minutes={minutes}
              onSave={handleSave}
              onCancel={handleCancel}
              timeZonesOptions={timeZonesOptions}
              selectProps={selectProps}
              is12HourFormat={is12HourFormat}
              isDisableSelect={isDisableSelect}
              selectedTimeZone={selectedTimeZone as string}
              setSelectedTimeZone={setSelectedTimeZone}
              timeZone={timeZone}
            />
          </BasePickerField>
          {description && <FormDescription>{description}</FormDescription>}
          {warnings && <FormMessageList messages={warnings} type="warning" />}
          {errors && <FormMessageList messages={errors} type="error" />}
        </FormGroup>
      )
    }
    return (
      <TextInputDiff
        value={value ?? defaultValue ?? ''}
        viewMode={viewMode}
        diffMode="sentences"
        baseValue={baseValue ?? ''}
        label={label}
        required={required}
        data-testid="time-picker-diff"
      />
    )
  }
)

TimePicker.displayName = 'TimePicker'

export { TimePicker, type TimePickerProps }
