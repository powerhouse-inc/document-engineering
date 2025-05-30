import type { CellContext, ObjectSetTableConfig } from '../types.js'
import type { TableState } from '../subcomponents/table-provider/table-reducer.js'

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

  selectCell(rowIndex: number, columnIndex: number): void

  clearCellSelection(): void
  clear(): void
}

export interface TableApiBase {
  // properties
  selection: TableSelectionManager

  // methods
  getHTMLTable(): HTMLTableElement | null

  // cell editing
  canEditCell(row: number, column: number): boolean
  isEditing(): boolean
  isEditingCell(row: number, column: number): boolean
  enterCellEditMode(row: number, column: number): void
  exitCellEditMode(save?: boolean): void
}

export interface PrivateTableApiBase<TData> extends TableApiBase {
  _getConfig(): ObjectSetTableConfig<TData>
  _getState(): TableState<TData>
  _createCellContext(row: number, column: number): CellContext<TData>
}
