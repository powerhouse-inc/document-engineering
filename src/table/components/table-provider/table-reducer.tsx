import type {
  ColumnDef,
  DataType,
  IndexedData,
  ObjectSetTableConfig,
  SortDirection,
  SortState,
  TableCellIndex,
} from '../../table/types.js'
import type { UseFormReturn } from 'react-hook-form'
import { createFormReferences } from '../../table/utils.js'
import { sortData } from '../../lib/sort-utils.js'
import type { SortChangeEvent, SortClearEvent } from '../../events/types.js'

/**
 * Interface for event manager methods used in sorting actions
 */
interface SortEventManager<TData> {
  triggerSortChange(payload: Omit<SortChangeEvent<TData>, 'timestamp'>): void
  triggerSortClear(payload: Omit<SortClearEvent<TData>, 'timestamp'>): void
}

interface TableState<T extends DataType = DataType> {
  dispatch?: React.Dispatch<TableAction<T>>

  defaultData: T[]

  columns: Array<ColumnDef<T>>
  data: Array<IndexedData<T>>
  dataFormReferences: Array<Array<React.RefObject<UseFormReturn | null> | null>>
  allowRowSelection: boolean
  showRowNumbers: boolean
  selectedRowIndexes: number[]
  lastSelectedRowIndex: number | null
  selectedRowErrors: string[] | null

  selectedCellIndex: TableCellIndex | null
  isCellEditMode: boolean

  sortState: SortState | null
}

type TableAction<T extends DataType = DataType> =
  | {
      type: 'SET_DISPATCH'
      payload: React.Dispatch<TableAction<T>>
    }
  | {
      type: 'SET_COLUMNS'
      payload: Array<ColumnDef<T>>
    }
  | {
      type: 'SET_DATA'
      payload: T[]
      tableConfig?: ObjectSetTableConfig<T>
    }
  | {
      type: 'UPDATE_COLUMN'
      payload: {
        index: number
        column: Partial<ColumnDef<T>>
      }
    }
  // Row selection
  | {
      type: 'TOGGLE_SELECTED_ROW'
      payload: { index: number; clearOtherSelections?: boolean }
    }
  | {
      type: 'TOGGLE_SELECT_ALL_ROWS'
      payload: {
        totalRows?: number
      }
    }
  | {
      type: 'SELECT_ALL_ROWS'
      payload: {
        totalRows?: number
      }
    }
  | {
      type: 'SELECT_ROW_RANGE'
      payload: {
        from: number
        to: number
      }
    }
  // Cell selection
  | {
      type: 'SELECT_CELL'
      payload: TableCellIndex | null
    }
  | {
      type: 'ENTER_CELL_EDIT_MODE'
      payload: TableCellIndex
    }
  | {
      type: 'SET_SELECTED_ROW_ERRORS'
      payload: {
        errors: string[] | null
      }
    }
  // sorting
  | {
      type: 'SORT_COLUMN'
      payload: {
        columnIndex: number
        direction: SortDirection | null
        tableConfig: ObjectSetTableConfig<T>
        eventManager: SortEventManager<T>
      }
    }

const tableReducer = <T extends DataType = DataType>(state: TableState<T>, action: TableAction<T>): TableState<T> => {
  switch (action.type) {
    case 'SET_DISPATCH':
      return {
        ...state,
        dispatch: action.payload,
      }
    case 'SET_COLUMNS': {
      return {
        ...state,
        columns: action.payload,
        dataFormReferences: createFormReferences(state.data.length + 1, action.payload),
      }
    }
    case 'SET_DATA': {
      const indexedData = action.payload.map((data, index) => ({ data, __index: index }))

      // If we have an active sort state and tableConfig, sort the new data accordingly
      let finalData = indexedData
      if (state.sortState && action.tableConfig) {
        const sortColumn = state.columns[state.sortState.columnIndex]
        finalData = sortData(indexedData, state.sortState, sortColumn, action.tableConfig)
      }

      return {
        ...state,
        data: finalData,
        defaultData: action.payload,
        dataFormReferences: createFormReferences(action.payload.length + 1, state.columns),
      }
    }
    case 'UPDATE_COLUMN':
      return {
        ...state,
        columns: state.columns.map((column, index) =>
          index === action.payload.index ? { ...column, ...action.payload.column } : column
        ),
      }
    case 'TOGGLE_SELECTED_ROW': {
      if (action.payload.clearOtherSelections) {
        // if clear other selections is enabled, we just toggle the current row
        return {
          ...state,
          selectedCellIndex: null,
          lastSelectedRowIndex: action.payload.index,
          selectedRowIndexes: state.selectedRowIndexes.includes(action.payload.index) ? [] : [action.payload.index],
        }
      }

      // if clear other selections is not enabled, we toggle the current row
      // and keep the other rows selection as it is
      return {
        ...state,
        selectedCellIndex: null,
        lastSelectedRowIndex: action.payload.index,
        selectedRowIndexes: state.selectedRowIndexes.includes(action.payload.index)
          ? [...state.selectedRowIndexes.filter((index) => index !== action.payload.index)]
          : [...state.selectedRowIndexes, action.payload.index],
      }
    }
    case 'TOGGLE_SELECT_ALL_ROWS': {
      const totalRows = action.payload.totalRows ?? state.data.length
      return {
        ...state,
        selectedCellIndex: null,
        lastSelectedRowIndex: null,
        selectedRowIndexes:
          state.selectedRowIndexes.length === totalRows ? [] : Array.from({ length: totalRows }, (_, index) => index),
      }
    }
    case 'SELECT_ALL_ROWS': {
      const totalRows = action.payload.totalRows ?? state.data.length
      // if all the rows are already selected, do nothing
      if (state.selectedRowIndexes.length === totalRows) {
        return { ...state }
      }
      return {
        ...state,
        selectedCellIndex: null,
        lastSelectedRowIndex: null,
        selectedRowIndexes: Array.from({ length: totalRows }, (_, index) => index),
      }
    }
    case 'SELECT_ROW_RANGE': {
      const { from, to } = action.payload

      // we're selecting a range of rows
      const selectedRowIndexesSet = new Set(state.selectedRowIndexes)
      const [start, end] = [from, to].sort((a, b) => a - b)

      Array.from({ length: end - start + 1 }, (_, index) => index + start).forEach((index) =>
        selectedRowIndexesSet.add(index)
      )

      return {
        ...state,
        selectedCellIndex: null,
        selectedRowIndexes: [...selectedRowIndexesSet],
        lastSelectedRowIndex: to,
      }
    }
    case 'SELECT_CELL': {
      // TODO: check first if there is not other cell in edit mode
      return {
        ...state,
        selectedCellIndex: action.payload,
        // if the user try to select a range, we're going to select from the row that has the selected cell
        lastSelectedRowIndex: action.payload?.row ?? null,
        selectedRowIndexes: [], // clear row selection
        isCellEditMode: false,
      }
    }
    case 'ENTER_CELL_EDIT_MODE': {
      return {
        ...state,
        selectedCellIndex: action.payload,
        isCellEditMode: true,
      }
    }
    case 'SET_SELECTED_ROW_ERRORS': {
      return {
        ...state,
        selectedRowErrors: action.payload.errors,
      }
    }
    case 'SORT_COLUMN': {
      const column = state.columns[action.payload.columnIndex]
      const sortDirection = action.payload.direction
      const previousSortState = state.sortState

      // Create indexed data from defaultData
      const indexedData = [...state.defaultData].map((data, index) => ({ data, __index: index }))

      // Create sortState (null if direction is null)
      const sortState: SortState | null =
        sortDirection === null
          ? null
          : {
              columnIndex: action.payload.columnIndex,
              direction: sortDirection,
            }

      // Use the sort utility function
      const sortedData = sortData(indexedData, sortState, column, action.payload.tableConfig)

      action.payload.eventManager.triggerSortChange({
        columnIndex: action.payload.columnIndex,
        columnDef: column,
        previousDirection: previousSortState?.direction ?? null,
        newDirection: sortDirection,
        previousColumnIndex: previousSortState?.columnIndex ?? null,
        sortState,
        dataCount: state.defaultData.length,
      })

      // Trigger sort clear event if sorting is being cleared
      if (sortDirection === null && previousSortState !== null) {
        action.payload.eventManager.triggerSortClear({
          columnIndex: action.payload.columnIndex,
          columnDef: column,
          previousSortState,
          dataCount: state.defaultData.length,
        })
      }

      // Call onSort callback if provided
      if (column.onSort) {
        column.onSort({
          tableConfig: action.payload.tableConfig,
          columnDef: column,
          data: sortedData.map((item) => item.data),
          sortState,
        })
      }

      return {
        ...state,
        data: sortedData,
        sortState,
      }
    }
    default:
      return state
  }
}

export { tableReducer }
export type { TableAction, TableState }
