import type { ColumnAlignment, ColumnType } from '../../table/types.js'

const defaultColumnAlignment = (columnType: ColumnType): ColumnAlignment => {
  switch (columnType) {
    case 'number':
    case 'amount':
      return 'right'

    case 'string':
    case 'boolean':
    case 'country':
    case 'enum':
    case 'currency':
    case 'date':
    case 'datetime':
    case 'time':
    case 'url':
    case 'email':
    case 'phid':
    case 'oid':
    case 'aid':
    case 'phone':
    default:
      return 'left'
  }
}

export { defaultColumnAlignment }
