import { useGlobalTableKeyEvents } from '../hooks/useGlobalTableKeyEvents.js'
import type { DataType } from '../types.js'
import { useInternalTableState } from './table-provider/table-provider.js'
import { RenderRow } from './rows/render-row.js'

const TableBody = <T extends DataType>() => {
  const { config } = useInternalTableState<T>()

  // add global key events to the table
  useGlobalTableKeyEvents()

  return (
    <tbody className="text-sm leading-5 text-gray-900">
      {config.data.map((data, index) => (
        <RenderRow key={JSON.stringify({ data, _reactKeyIndex: index })} item={data} rowIndex={index} />
      ))}

      {config.data.length < (config.minRowCount ?? 0) &&
        Array.from({ length: (config.minRowCount ?? 0) - config.data.length }).map((_, index) => (
          <RenderRow key={index} item={{}} rowIndex={index + config.data.length} emptyRow />
        ))}
    </tbody>
  )
}

export { TableBody }
