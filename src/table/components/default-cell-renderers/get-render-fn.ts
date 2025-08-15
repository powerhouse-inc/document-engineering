import type { ColumnType, RenderCellFn } from '../../table/types.js'
import { renderBooleanCell } from './boolean-render.js'
import { renderDateCell } from './date-render.js'
import { renderDateTimeCell } from './datetime-render.js'
import { renderNumberCell } from './number-render.js'
import { renderTextCell } from './text-render.js'
import { renderTimeCell } from './time-render.js'
import { renderUrlCell } from './url-render.js'
import { renderPhidCell } from './phid-render.js'
import { renderOidCell } from './oid-render.js'
import { renderAidCell } from './aid-render.js'

const getRenderFn = <T>(type: ColumnType | undefined): RenderCellFn<T> => {
  switch (type) {
    case 'string':
      return renderTextCell
    case 'number':
      return renderNumberCell
    case 'boolean':
      return renderBooleanCell
    case 'date':
      return renderDateCell
    case 'datetime':
      return renderDateTimeCell
    case 'time':
      return renderTimeCell
    case 'url':
      return renderUrlCell
    case 'phid':
      return renderPhidCell
    case 'oid':
      return renderOidCell
    case 'aid':
      return renderAidCell
    case undefined:
      return renderTextCell
    default:
      return renderTextCell
  }
}

export { getRenderFn }
