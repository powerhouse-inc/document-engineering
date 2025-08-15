import type { ColumnAlignment, ColumnType } from '../../table/types.js'

const defaultColumnAlignment = (columnType: ColumnType): ColumnAlignment => {
  switch (columnType) {
    case 'number':
      return 'right'

    case 'string':
    case 'boolean':
    case 'url':
    default:
      return 'left'
  }
}

export { defaultColumnAlignment }
