import type { ColumnType, RenderCellFn } from '../../table/types.js'
import { renderBooleanCell } from './boolean-render.js'
import { renderCountryCell } from './country-render.js'
import { renderDateCell } from './date-render.js'
import { renderDateTimeCell } from './datetime-render.js'
import { renderNumberCell } from './number-render.js'
import { renderTextCell } from './text-render.js'
import { renderTimeCell } from './time-render.js'
import { renderUrlCell } from './url-render.js'
import { renderPhidCell } from './phid-render.js'
import { renderOidCell } from './oid-render.js'
import { renderAidCell } from './aid-render.js'
import { renderEmailCell } from './email-render.js'
import { renderEnumCell } from './enum-render.js'
import { renderCurrencyCell } from './currency-render.js'
import { renderAmountCell } from './amount-render.js'

const getRenderFn = <T>(type: ColumnType | undefined): RenderCellFn<T> => {
  switch (type) {
    case 'string':
      return renderTextCell
    case 'number':
      return renderNumberCell
    case 'boolean':
      return renderBooleanCell
    case 'country':
      return renderCountryCell
    case 'date':
      return renderDateCell
    case 'datetime':
      return renderDateTimeCell
    case 'time':
      return renderTimeCell
    case 'url':
      return renderUrlCell
    case 'phid':
      return renderPhidCell
    case 'oid':
      return renderOidCell
    case 'aid':
      return renderAidCell
    case 'email':
      return renderEmailCell
    case 'enum':
      return renderEnumCell
    case 'currency':
      return renderCurrencyCell
    case 'amount':
      return renderAmountCell
    case undefined:
      return renderTextCell
    default:
      return renderTextCell
  }
}

export { getRenderFn }
