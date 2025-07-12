import type { ColumnType, DataType, RenderCellEditorFn } from '../../types.js'
import { booleanCellEditor } from './boolean-editor.js'
import { numberCellEditor } from './number-editor.js'
import { textCellEditor } from './text-editor.js'

export const getCellEditorFn = <T extends DataType = DataType>(type?: ColumnType): RenderCellEditorFn<T, unknown> => {
  switch (type) {
    case 'text':
      return textCellEditor
    case 'number':
      return numberCellEditor
    case 'boolean':
      return booleanCellEditor
    case undefined:
      return textCellEditor
    default:
      return textCellEditor
  }
}
