import type { ColumnAlignment, ColumnType } from '../../types.js'

const defaultColumnAlignment = (columnType: ColumnType): ColumnAlignment => {
  switch (columnType) {
    case 'number':
      return 'right'

    case 'text':
    case 'boolean':
    default:
      return 'left'
  }
}

export { defaultColumnAlignment }
