import type { ColumnDef, DataType, TableCellIndex } from '../../types.js'

interface TableState<T extends DataType = DataType> {
  dispatch?: React.Dispatch<TableAction<T>>

  columns: ColumnDef[]
  data: T[]
  allowRowSelection: boolean
  showRowNumbers: boolean
  selectedRowIndexes: number[]
  lastSelectedRowIndex: number | null

  selectedCellIndex: TableCellIndex | null
  isCellEditMode: boolean
}

type TableAction<T extends DataType = DataType> =
  | {
      type: 'SET_DISPATCH'
      payload: React.Dispatch<TableAction<T>>
    }
  | {
      type: 'SET_COLUMNS'
      payload: ColumnDef[]
    }
  | {
      type: 'SET_DATA'
      payload: T[]
    }
  | {
      type: 'UPDATE_COLUMN'
      payload: {
        index: number
        column: Partial<ColumnDef>
      }
    }
  // Row selection
  | {
      type: 'TOGGLE_SELECTED_ROW'
      payload: { index: number; clearOtherSelections?: boolean }
    }
  | {
      type: 'TOGGLE_SELECT_ALL_ROWS'
    }
  | {
      type: 'SELECT_ALL_ROWS'
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

const tableReducer = <T extends DataType>(state: TableState<T>, action: TableAction<T>): TableState<T> => {
  switch (action.type) {
    case 'SET_DISPATCH':
      return {
        ...state,
        dispatch: action.payload,
      }
    case 'SET_COLUMNS':
      return {
        ...state,
        columns: action.payload,
      }
    case 'SET_DATA':
      return {
        ...state,
        data: action.payload,
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
    case 'TOGGLE_SELECT_ALL_ROWS':
      return {
        ...state,
        selectedCellIndex: null,
        lastSelectedRowIndex: null,
        selectedRowIndexes:
          state.selectedRowIndexes.length === state.data.length
            ? []
            : Array.from({ length: state.data.length }, (_, index) => index),
      }
    case 'SELECT_ALL_ROWS': {
      // if all the rows are already selected, do nothing
      if (state.selectedRowIndexes.length === state.data.length) {
        return { ...state }
      }
      return {
        ...state,
        selectedCellIndex: null,
        lastSelectedRowIndex: null,
        selectedRowIndexes: Array.from({ length: state.data.length }, (_, index) => index),
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
      if (!state.columns[action.payload.column].editable) {
        throw new Error('Cell is not editable')
      }
      return {
        ...state,
        selectedCellIndex: action.payload,
        isCellEditMode: true,
      }
    }
    default:
      return state
  }
}

export { tableReducer }
export type { TableAction, TableState }
