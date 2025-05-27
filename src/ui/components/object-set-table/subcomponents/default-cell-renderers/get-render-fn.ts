import type { CellType, RenderCellFn } from '../../types.js'
import { renderBooleanCell } from './boolean-render.js'
import { renderNumberCell } from './number-render.js'
import { renderTextCell } from './text-render.js'

const getRenderFn = <T>(type: CellType | undefined): RenderCellFn<T> => {
  switch (type) {
    case 'text':
      return renderTextCell
    case 'number':
      return renderNumberCell
    case 'boolean':
      return renderBooleanCell
    default:
      return renderTextCell
  }
}

export { getRenderFn }
