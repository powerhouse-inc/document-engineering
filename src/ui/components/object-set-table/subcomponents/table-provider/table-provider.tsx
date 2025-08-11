import { type Context, createContext, type ReactNode, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import type { DataType, ObjectSetTableConfig } from '../../types.js'
import { tableReducer, type TableState } from './table-reducer.js'
import { createPublicTableApi } from '../../logic/public-table-api.js'
import type { PrivateTableApiBase, TableApiBase } from '../../logic/types.js'
import { TableApi } from '../../logic/table-api.js'
import { createFormReferences } from '../../utils.js'

interface TableContextValue<T extends DataType = DataType> {
  config: ObjectSetTableConfig<T>
  state: TableState<T>
  api: PrivateTableApiBase<T>
  publicApi: TableApiBase
}

const TableContext = createContext<TableContextValue<DataType> | null>(null)

interface TableProviderProps<T extends DataType = DataType> {
  children: ReactNode
  /**
   * Augmented table config adding default values for missing properties
   */
  config: ObjectSetTableConfig<T>
  /**
   * Ref to the table element
   */
  tableRef: React.RefObject<HTMLTableElement>
}

const TableProvider = <T extends DataType = DataType>({ children, config, tableRef }: TableProviderProps<T>) => {
  const [state, dispatch] = useReducer(tableReducer<T>, {
    columns: config.columns,
    defaultData: [...config.data],
    dataFormReferences: createFormReferences(config.data.length + 1, config.columns),
    data: config.data.map((item, index) => ({ data: item, __index: index })),
    allowRowSelection: config.allowRowSelection ?? true,
    showRowNumbers: config.showRowNumbers ?? true,
    selectedRowIndexes: [],
    lastSelectedRowIndex: null,
    selectedCellIndex: null,
    isCellEditMode: false,
    sortState: null,
    selectedRowErrors: null,
  })

  useEffect(() => {
    dispatch({
      type: 'SET_DATA',
      payload: config.data,
    })
  }, [config.data])

  useEffect(() => {
    dispatch({ type: 'SET_DISPATCH', payload: dispatch })
  }, [dispatch])

  const stateRef = useRef(state)
  const configRef = useRef(config)
  useEffect(() => {
    stateRef.current = state
    configRef.current = config
  }, [state, config])

  const [api, publicApi] = useMemo(() => {
    const internalApi = new TableApi<T>(tableRef, configRef, stateRef)
    const publicApi = createPublicTableApi(internalApi)

    if (config.apiRef) {
      config.apiRef.current = publicApi
    }

    return [internalApi, publicApi]
  }, [config.apiRef, tableRef])

  return (
    <TableContext.Provider
      value={
        {
          config,
          state,
          api,
          publicApi,
        } as TableContextValue<DataType>
      }
    >
      {children}
    </TableContext.Provider>
  )
}

const useInternalTableState = <T extends DataType = DataType>() => {
  const context = useContext<TableContextValue<T> | null>(TableContext as Context<TableContextValue<T> | null>)
  if (!context) {
    throw new Error('useTable must be used within a TableProvider')
  }
  return context
}

export { TableProvider, useInternalTableState }
