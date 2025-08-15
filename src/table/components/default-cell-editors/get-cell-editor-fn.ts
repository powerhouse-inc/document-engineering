import type { ColumnType, DataType, RenderCellEditorFn } from '../../table/types.js'
import { buildBooleanCellEditor } from './boolean-editor.js'
import { buildNumberCellEditor } from './number-editor.js'
import { buildStringCellEditor } from './string-editor.js'
import { buildUrlCellEditor } from './url-editor.js'

export const getCellEditorFn = <T extends DataType = DataType>(type?: ColumnType): RenderCellEditorFn<T, unknown> => {
  switch (type) {
    case 'string':
      return buildStringCellEditor({})
    case 'number':
      return buildNumberCellEditor({})
    case 'boolean':
      return buildBooleanCellEditor({})
    case 'url':
      return buildUrlCellEditor({})
    case undefined:
      return buildStringCellEditor({})
    default:
      return buildStringCellEditor({})
  }
}
