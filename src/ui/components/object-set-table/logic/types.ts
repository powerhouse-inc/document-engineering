import type { ObjectSetTableConfig } from '../types.js'
import type { TableState } from '../subcomponents/table-provider/table-reducer.js'

export interface ITableApi<TData> {
  _getConfig(): ObjectSetTableConfig<TData>
  _getState(): TableState<TData>
}
