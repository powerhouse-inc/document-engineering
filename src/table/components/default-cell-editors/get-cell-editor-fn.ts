import type { ColumnType, DataType, RenderCellEditorFn } from '../../table/types.js'
import { booleanCellEditorFactory } from './boolean-editor.js'
import { numberCellEditorFactory } from './number-editor.js'
import { stringCellEditorFactory } from './string-editor.js'

export const getCellEditorFn = <T extends DataType = DataType>(type?: ColumnType): RenderCellEditorFn<T, unknown> => {
  switch (type) {
    case 'string':
      return stringCellEditorFactory({})
    case 'number':
      return numberCellEditorFactory({})
    case 'boolean':
      return booleanCellEditorFactory({})
    case undefined:
      return stringCellEditorFactory({})
    default:
      return stringCellEditorFactory({})
  }
}
