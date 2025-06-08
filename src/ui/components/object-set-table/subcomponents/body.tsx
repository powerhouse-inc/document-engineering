import { useGlobalTableKeyEvents } from '../hooks/useGlobalTableKeyEvents.js'
import type { DataType } from '../types.js'
import { useInternalTableState } from './table-provider/table-provider.js'
import { RenderRow } from './rows/render-row.js'

const TableBody = <T extends DataType>() => {
  const {
    config,
    state: { data },
  } = useInternalTableState<T>()

  // add global key events to the table
  useGlobalTableKeyEvents()

  return (
    <tbody className="text-sm leading-5 text-gray-900">
      {data.map((data, index) => (
        // TODO: replace key with unique key (maybe generated with object-hash package)
        <RenderRow key={index} item={data} rowIndex={index} />
      ))}

      {data.length < (config.minRowCount ?? 0) &&
        Array.from({ length: (config.minRowCount ?? 0) - data.length }).map((_, index) => (
          <RenderRow key={index} item={{}} rowIndex={index + data.length} emptyRow />
        ))}
    </tbody>
  )
}

export { TableBody }
