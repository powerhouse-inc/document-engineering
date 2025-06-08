import type { RefObject } from 'react'
import type { TableState } from '../subcomponents/table-provider/table-reducer.js'
import type { CellContext, ObjectSetTableConfig, SortDirection } from '../types.js'
import { getNextSelectedCell } from '../utils.js'
import { SelectionManager } from './selection-manager.js'
import type { PrivateTableApiBase, SortingInfo } from './types.js'

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
      row: this._getState().data[row],
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

    this._getState().dispatch?.({
      type: 'ENTER_CELL_EDIT_MODE',
      payload: { row, column },
    })
  }

  /**
   * Exits cell edit mode
   *
   * @param save - Whether to save the changes made in the cell
   */
  exitCellEditMode(save = true) {
    // TODO: before exiting, check if the ${value} edited is valid

    // exit edit mode
    const selectedCell = this._getState().selectedCellIndex ?? {
      row: 0,
      column: 0,
    }
    this.selection.selectCell(selectedCell.row, selectedCell.column)

    if (save) {
      const value = this._getConfig().columns[selectedCell.column]?.valueGetter?.(
        this._getState().data[selectedCell.row],
        this._createCellContext(selectedCell.row, selectedCell.column)
      )
      this._getConfig().columns[selectedCell.column]?.onSave?.(
        `${value?.toString() ?? ''} edited`,
        this._createCellContext(selectedCell.row, selectedCell.column)
      )

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
    if (direction === null) {
      this._getState().dispatch?.({
        type: 'SORT_COLUMN',
        payload: { columnIndex, direction: 'asc', tableConfig: this._getConfig() },
      })
    }
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
}

export { TableApi }
