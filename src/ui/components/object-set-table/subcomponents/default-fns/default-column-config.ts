import type { CellType, ColumnAlignment } from '../../types.js'

const defaultColumnAlignment = (cellType: CellType): ColumnAlignment => {
  switch (cellType) {
    case 'number':
      return 'right'

    case 'text':
    case 'boolean':
    default:
      return 'left'
  }
}

export { defaultColumnAlignment }
