import type { PrivateTableApiBase, TableSelectionManager } from './types.js'

class SelectionManager<TData> implements TableSelectionManager {
  constructor(private api: PrivateTableApiBase<TData>) {}

  /**
   * Checks if the table allows row selection
   */
  canSelectRows() {
    return this.api._getConfig().allowRowSelection ?? true
  }

  /**
   * Checks if the table allows cell selection
   */
  canSelectCells() {
    return this.api._getConfig().allowRowSelection ?? true
  }

  /**
   * Checks if the table has any selected cells
   */
  haveSelectedCells() {
    return this.api._getState().selectedCellIndex !== null
  }

  /**
   * Selects a single row in the table. Only one row can be selected at a time.
   *
   * @param rowIndex - The index of the row to select
   */
  selectRow(rowIndex: number) {
    if (!this.canSelectRows()) return

    this.api._getState().dispatch?.({
      type: 'TOGGLE_SELECTED_ROW',
      payload: { index: rowIndex, clearOtherSelections: true },
    })
  }

  /**
   * Toggles the selection of a row in the table.
   *
   * @param rowIndex - The index of the row to toggle
   */
  toggleRow(rowIndex: number) {
    if (!this.canSelectRows()) return

    this.api._getState().dispatch?.({
      type: 'TOGGLE_SELECTED_ROW',
      payload: { index: rowIndex },
    })
  }

  /**
   * Selects a range of rows from the last active row to the given row index.
   *
   * @param rowIndex - The index of the row to select from
   */
  selectFromLastActiveRow(rowIndex: number) {
    if (!this.canSelectRows()) return

    const state = this.api._getState()
    const lastSelectedIndex = state.lastSelectedRowIndex

    // If there's no last selected row, just select the current row
    if (lastSelectedIndex === null) {
      this.selectRow(rowIndex)
      return
    }

    this.api._getState().dispatch?.({
      type: 'SELECT_ROW_RANGE',
      payload: { from: lastSelectedIndex, to: rowIndex },
    })
  }

  /**
   * Selects all rows in the table.
   */
  selectAllRows() {
    if (!this.canSelectRows()) return

    this.api._getState().dispatch?.({
      type: 'SELECT_ALL_ROWS',
      payload: { totalRows: this.api.getTotalRowsCount() },
    })
  }

  /**
   * Toggles the selection of all rows in the table.
   */
  toggleSelectAll() {
    if (!this.canSelectRows()) return

    this.api._getState().dispatch?.({
      type: 'TOGGLE_SELECT_ALL_ROWS',
      payload: { totalRows: this.api.getTotalRowsCount() },
    })
  }

  /**
   * Selects a range of rows from the given index to the given index.
   *
   * @param from - The index of the first row to select
   * @param to - The index of the last row to select
   */
  selectRange(from: number, to: number) {
    if (!this.canSelectRows()) return

    this.api._getState().dispatch?.({
      type: 'SELECT_ROW_RANGE',
      payload: { from, to },
    })
  }

  /**
   * Returns the indexes of the selected rows
   */
  getSelectedRowIndexes(): number[] {
    return this.api._getState().selectedRowIndexes
  }

  /**
   * Selects a cell in the table.
   *
   * @param rowIndex - The index of the row to select
   * @param columnIndex - The index of the column to select
   */
  selectCell(rowIndex: number, columnIndex: number) {
    if (!this.canSelectCells()) return

    this.api._getState().dispatch?.({
      type: 'SELECT_CELL',
      payload: { row: rowIndex, column: columnIndex },
    })
  }

  /**
   * Clears the selection of the current cell
   */
  clearCellSelection() {
    this.api._getState().dispatch?.({ type: 'SELECT_CELL', payload: null })
  }

  /**
   * Clears the selection of the table
   */
  clear() {
    this.api._getState().dispatch?.({ type: 'SELECT_CELL', payload: null })
  }
}

export { SelectionManager }
