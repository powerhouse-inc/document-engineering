import type { RefObject } from 'react'
import type { TableState } from '../subcomponents/table-provider/table-reducer.js'
import type { CellContext, ObjectSetTableConfig, SortDirection } from '../types.js'
import { getNextSelectedCell } from '../utils.js'
import { SelectionManager } from './selection-manager.js'
import type { ConfirmationOptions, PrivateTableApiBase, SortingInfo } from './types.js'
import { confirm } from '../../confirm/index.js'

class TableApi<TData> implements PrivateTableApiBase<TData> {
  public readonly selection: SelectionManager<TData>

  constructor(
    private readonly tableRef: RefObject<HTMLTableElement>,
    private readonly configRef: RefObject<ObjectSetTableConfig<TData>>,
    private readonly stateRef: RefObject<TableState<TData>>
  ) {
    this.selection = new SelectionManager<TData>(this)
  }

  _getConfig(): ObjectSetTableConfig<TData> {
    return this.configRef.current!
  }

  _getState(): TableState<TData> {
    return this.stateRef.current!
  }

  _createCellContext(row: number, column: number): CellContext<TData> {
    return {
      row: this._getState().data[row].data,
      column: this._getConfig().columns[column],
      rowIndex: row,
      columnIndex: column,
      tableConfig: this._getConfig(),
    }
  }

  /**
   * Returns the HTML table element
   *
   * @returns The HTML table element
   */
  getHTMLTable(): HTMLTableElement | null {
    return this.tableRef.current
  }

  /**
   * Returns the total number of rows in the table, including the empty rows
   *
   * @returns The total number of rows in the table
   */
  getTotalRowsCount(): number {
    const state = this._getState()
    const minRowCount = this._getConfig().minRowCount ?? 0

    if (state.data.length >= minRowCount) {
      return state.data.length
    }

    return this._getState().data.length + ((this._getConfig().minRowCount ?? 0) - this._getState().data.length)
  }

  // cell editing
  /**
   * Checks if the cell at the given row and column can be edited
   *
   * @param row - The row index of the cell to check
   * @param column - The column index of the cell to check
   * @returns `true` if the cell can be edited, `false` otherwise
   */
  canEditCell(row: number, column: number): boolean {
    return this._getConfig().columns[column].editable ?? false
  }

  /**
   * Checks if the table is currently in cell edit mode
   *
   * @returns `true` if the table is in cell edit mode, `false` otherwise
   */
  isEditing() {
    return this._getState().isCellEditMode
  }

  /**
   * Checks if at least one column is editable
   *
   * @returns `true` if the table is editable, `false` otherwise
   */
  isEditable() {
    return this._getConfig().columns.some((column) => column.editable)
  }

  /**
   * Checks if the table is currently in cell edit mode for the given cell
   *
   * @param row - The row index of the cell to check
   * @param column - The column index of the cell to check
   * @returns `true` if the table is in cell edit mode for the given cell, `false` otherwise
   */
  isEditingCell(row: number, column: number) {
    return (
      this._getState().isCellEditMode &&
      this._getState().selectedCellIndex?.row === row &&
      this._getState().selectedCellIndex?.column === column
    )
  }

  /**
   * Enters cell edit mode for the given cell
   *
   * @param row - The row index of the cell to enter edit mode
   * @param column - The column index of the cell to enter edit mode
   */
  enterCellEditMode(row: number, column: number) {
    if (!this.canEditCell(row, column)) throw new Error('Cell is not editable')

    // restore the form value
    const formRef = this._getState().dataFormReferences[row][column]
    const columnDef = this._getConfig().columns[column]
    const stateData = this._getState().data
    // if stateData[row] is undefined is probably because we're inserting a new row
    // or because the row is empty, so we don't need to restore the value at all
    if (formRef && stateData[row]) {
      const originalValue = columnDef.valueGetter?.(stateData[row]?.data, this._createCellContext(row, column))
      formRef.current?.setValue(columnDef.field, originalValue)
    }

    this._getState().dispatch?.({
      type: 'ENTER_CELL_EDIT_MODE',
      payload: { row, column },
    })

    // restore focus to the field one the edit mode is entered
    setTimeout(() => {
      formRef?.current?.setFocus(columnDef.field)
    }, 30)
  }

  /**
   * Exits cell edit mode
   *
   * @param save - Whether to save the changes made in the cell
   */
  async exitCellEditMode(save = true) {
    // TODO: before exiting, check if the ${value} edited is valid

    // exit edit mode
    const selectedCell = this._getState().selectedCellIndex ?? {
      row: 0,
      column: 0,
    }
    this.selection.selectCell(selectedCell.row, selectedCell.column)

    if (save) {
      const formRef = this._getState().dataFormReferences[selectedCell.row][selectedCell.column]
      if (formRef) {
        const columnDef = this._getConfig().columns[selectedCell.column]

        const isValid = await formRef.current?.trigger()
        if (!isValid) {
          return
        }

        const formData = formRef.current?.getValues()
        const value = formData?.[columnDef.field] as unknown

        if (selectedCell.row === this._getState().data.length) {
          await this._getConfig().onAdd?.({ [columnDef.field]: value })
          return
        }

        // TODO: save only if the value changed
        columnDef.onSave?.(value, this._createCellContext(selectedCell.row, selectedCell.column))
      }

      // the actual save is done in the form onSubmit callback
      // so we just asume that the save was done and we can move to the next cell
      const nextCell = getNextSelectedCell({
        direction: 'down',
        currentCell: selectedCell,
        rowCount: this._getState().data.length,
        columnCount: this._getConfig().columns.length,
        moveToNextRow: true,
      })
      this.selection.selectCell(nextCell.row, nextCell.column)
    }
  }

  /**
   * Sorts the rows by the given column index and direction
   *
   * @param columnIndex - The index of the column to sort
   * @param direction - The direction to sort the rows. Null if the sorting should be removed
   */
  sortRows(columnIndex: number, direction: SortDirection | null) {
    this._getState().dispatch?.({
      type: 'SORT_COLUMN',
      payload: { columnIndex, direction, tableConfig: this._getConfig() },
    })
  }

  /**
   * Returns the sorting information.
   *
   * @returns The sorting information. `null` if no sorting is applied.
   *
   * @example
   * ```tsx
   * const sortingInfo = apiRef.current?.getCurrentSortInfo()
   * console.log(sortingInfo) // { columnIndex: 0, direction: 'asc' }
   * ```
   */
  getCurrentSortInfo(): SortingInfo | null {
    return this._getState().sortState
  }

  // deletion
  /**
   * Checks if the table can be deleted
   *
   * @returns `true` if the table can be deleted, `false` otherwise
   */
  canDelete(): boolean {
    return typeof this._getConfig().onDelete === 'function'
  }

  /**
   * Deletes the rows at the given indexes
   *
   * @param rows - The indexes of the rows to delete
   * @param confirmationOptions - The confirmation options. If `askConfirmation` is `true`, the confirmation dialog will be shown.
   *
   * @example
   * ```tsx
   * api.deleteRows([1, 2], {
   *   askConfirmation: true,
   *   title: 'Delete Accounts',
   *   description: 'Are you sure you want to delete 2 accounts?',
   * })
   * ```
   */
  async deleteRows(
    rows: number[],
    confirmationOptions: ConfirmationOptions = { askConfirmation: true }
  ): Promise<void> {
    if (!this.canDelete()) return

    const actualRows = rows.filter((rowIndex) => rowIndex < this._getState().data.length)
    const rowsData = actualRows.map((row) => this._getState().data[row].data)

    let confirmed = true
    if (confirmationOptions.askConfirmation) {
      const count = actualRows.length
      confirmed = await confirm({
        title: confirmationOptions.title ?? 'Delete entries',
        description:
          confirmationOptions.description ??
          `Are you sure you want to delete ${count} selected ${count === 1 ? 'entry' : 'entries'}?`,
        confirmLabel: 'Continue',
        confirmVariant: 'default',
        cancelLabel: 'Cancel',
        cancelVariant: 'secondary',
      })
    }

    if (confirmed) {
      await this._getConfig().onDelete?.(rowsData)
      this.selection.clear()
    }
  }

  // insertion
  /**
   * Checks if the table can be added
   *
   * @returns `true` if the table can be added, `false` otherwise
   */
  canAdd(): boolean {
    return typeof this._getConfig().onAdd === 'function'
  }

  /**
   * Checks if the table is currently in adding mode
   *
   * @returns `true` if the table is in adding mode, `false` otherwise
   */
  isAdding(): boolean {
    const editingRow = this._getState().selectedCellIndex?.row
    const rowCount = this._getState().data.length
    return this.isEditing() && editingRow === rowCount
  }
}

export { TableApi }
