import { CircleFlag } from 'react-circle-flags'
import { cn } from '../../../scalars/lib/index.js'
import { formatPhoneNumber, parsePhoneValue } from '../../../ui/components/data-entry/phone-number-input/utils.js'
import type { CellContext, DataType } from '../../table/types.js'

const getPhoneNumberInfo = (phone: string) => {
  if (phone === '') return { formattedPhone: '', countryCode: '' }

  const parsedValue = parsePhoneValue(phone)
  if (parsedValue) {
    const selectValueParts = parsedValue.selectValue.split('-')
    const callingCode = selectValueParts[0]
    const countryCode = selectValueParts[1]
    const formattedValue = formatPhoneNumber(callingCode, parsedValue.inputValue)

    return {
      formattedPhone: formattedValue,
      countryCode: countryCode.toLowerCase(),
    }
  }

  return { formattedPhone: phone, countryCode: '' }
}

const renderPhoneCell = <T extends DataType = DataType>(value: unknown, context: CellContext<T>) => {
  const phoneValue = typeof value === 'string' ? value : (value?.toString() ?? '')
  const { formattedPhone, countryCode } = getPhoneNumberInfo(phoneValue)

  return (
    <div
      className={cn('flex items-center gap-2', {
        'justify-end': context.column.align === 'right',
        'justify-center': context.column.align === 'center',
        'justify-start': context.column.align === 'left' || !context.column.align,
      })}
    >
      {countryCode !== '' && <CircleFlag countryCode={countryCode} height={16} className="size-4 flex-shrink-0" />}
      <span>{formattedPhone}</span>
    </div>
  )
}

export { renderPhoneCell }
