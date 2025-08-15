import type { ColumnType, DataType, RenderCellEditorFn } from '../../table/types.js'
import { buildBooleanCellEditor } from './boolean-editor.js'
import { buildCountryCellEditor } from './country-editor.js'
import { buildDateCellEditor } from './date-editor.js'
import { buildDateTimeCellEditor } from './datetime-editor.js'
import { buildNumberCellEditor } from './number-editor.js'
import { buildStringCellEditor } from './string-editor.js'
import { buildTimeCellEditor } from './time-editor.js'
import { buildUrlCellEditor } from './url-editor.js'
import { buildPhidCellEditor } from './phid-editor.js'
import { buildOidCellEditor } from './oid-editor.js'
import { buildAidCellEditor } from './aid-editor.js'
import { buildEmailCellEditor } from './email-editor.js'
import { buildEnumCellEditor } from './enum-editor.js'
import { buildCurrencyCellEditor } from './currency-editor.js'
import { buildAmountCellEditor } from './amount-editor.js'

export const getCellEditorFn = <T extends DataType = DataType>(type?: ColumnType): RenderCellEditorFn<T, unknown> => {
  switch (type) {
    case 'string':
      return buildStringCellEditor({})
    case 'number':
      return buildNumberCellEditor({})
    case 'boolean':
      return buildBooleanCellEditor({})
    case 'country':
      return buildCountryCellEditor({})
    case 'date':
      return buildDateCellEditor({})
    case 'datetime':
      return buildDateTimeCellEditor({})
    case 'time':
      return buildTimeCellEditor({})
    case 'url':
      return buildUrlCellEditor({})
    case 'phid':
      return buildPhidCellEditor({})
    case 'oid':
      return buildOidCellEditor({})
    case 'aid':
      return buildAidCellEditor({})
    case 'email':
      return buildEmailCellEditor({})
    case 'enum':
      return buildEnumCellEditor({})
    case 'currency':
      return buildCurrencyCellEditor({})
    case 'amount':
      return buildAmountCellEditor({})
    case undefined:
      return buildStringCellEditor({})
    default:
      return buildStringCellEditor({})
  }
}
