import { useGlobalTableKeyEvents } from '../hooks/useGlobalTableKeyEvents.js'
import type { DataType } from '../types.js'
import { useInternalTableState } from './table-provider/table-provider.js'
import { RenderRow } from './rows/render-row.js'

const TableBody = <T extends DataType>() => {
  const { config, api } = useInternalTableState<T>()

  // add global key events to the table
  useGlobalTableKeyEvents()

  const canRenderInsertRow = api.canAdd()
  // if can insert rows and we need to add emprty rows, we need to substract 1 because the insert row will occupy one row
  const shouldRenderEmptyRows = canRenderInsertRow
    ? config.data.length < (config.minRowCount ?? 0) - 1
    : config.data.length < (config.minRowCount ?? 0)

  const emptyRowsCount = shouldRenderEmptyRows
    ? (config.minRowCount ?? 0) - config.data.length - (canRenderInsertRow ? 1 : 0)
    : 0

  return (
    <tbody className="text-sm leading-5 text-gray-900">
      {config.data.map((data, index) => (
        <RenderRow key={JSON.stringify({ data, _reactKeyIndex: index })} item={data} rowIndex={index} />
      ))}

      {canRenderInsertRow && <RenderRow item={{}} rowIndex={config.data.length} mode="inserting" />}

      {emptyRowsCount > 0 &&
        Array.from({ length: emptyRowsCount }).map((_, index) => (
          <RenderRow
            key={index}
            item={{}}
            rowIndex={index + config.data.length + (canRenderInsertRow ? 1 : 0)}
            mode="empty"
          />
        ))}
    </tbody>
  )
}

export { TableBody }
