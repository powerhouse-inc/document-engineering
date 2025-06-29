import type { CellContext, ObjectSetTableConfig, SortDirection } from '../types.js'
import type { TableState } from '../subcomponents/table-provider/table-reducer.js'

export interface SortingInfo {
  columnIndex: number
  direction: SortDirection
}

export interface TableSelectionManager {
  canSelectRows(): boolean
  canSelectCells(): boolean
  haveSelectedCells(): boolean

  selectRow(rowIndex: number): void
  toggleRow(rowIndex: number): void
  selectFromLastActiveRow(rowIndex: number): void
  selectAllRows(): void
  toggleSelectAll(): void
  selectRange(from: number, to: number): void
  getSelectedRowIndexes(): number[]

  selectCell(rowIndex: number, columnIndex: number): void

  clearCellSelection(): void
  clear(): void
}

export interface TableApiBase {
  // properties
  selection: TableSelectionManager

  // methods
  getHTMLTable(): HTMLTableElement | null
  getTotalRowsCount(): number

  // cell editing
  isEditable(): boolean
  canEditCell(row: number, column: number): boolean
  isEditing(): boolean
  isEditingCell(row: number, column: number): boolean
  enterCellEditMode(row: number, column: number): void
  exitCellEditMode(save?: boolean): Promise<void>

  // deletion
  canDelete(): boolean
  deleteRows(rows: number[]): Promise<void>

  // sorting
  sortRows(columnIndex: number, direction: SortDirection | null): void
  getCurrentSortInfo(): SortingInfo | null
}

export interface PrivateTableApiBase<TData> extends TableApiBase {
  _getConfig(): ObjectSetTableConfig<TData>
  _getState(): TableState<TData>
  _createCellContext(row: number, column: number): CellContext<TData>
}
