import type { ColumnType, RenderCellFn } from '../../types.js'
import { renderBooleanCell } from './boolean-render.js'
import { renderNumberCell } from './number-render.js'
import { renderTextCell } from './text-render.js'

const getRenderFn = <T>(type: ColumnType | undefined): RenderCellFn<T> => {
  switch (type) {
    case 'string':
      return renderTextCell
    case 'number':
      return renderNumberCell
    case 'boolean':
      return renderBooleanCell
    case undefined:
      return renderTextCell
    default:
      return renderTextCell
  }
}

export { getRenderFn }
