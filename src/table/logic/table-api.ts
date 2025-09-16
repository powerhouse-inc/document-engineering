import type { RefObject } from 'react'
import type { TableState } from '../components/table-provider/table-reducer.js'
import type { CellContext, ObjectSetTableConfig, SortDirection } from '../table/types.js'
import { getNextSelectedCell } from '../table/utils.js'
import { SelectionManager } from './selection-manager.js'
import type { ConfirmationOptions, PrivateTableApiBase, SortingInfo } from './types.js'
import { confirm } from '../../ui/components/confirm/confirm.js'
import { deepEqual } from '../../scalars/lib/deep-equal.js'
import { isEmpty } from '../../scalars/lib/is-empty.js'
import { TableEventManager } from '../events/index.js'

class TableApi<TData> implements PrivateTableApiBase<TData> {
  public readonly selection: SelectionManager<TData>
  public readonly eventManager: TableEventManager<TData>

  constructor(
    private readonly tableRef: RefObject<HTMLTableElement>,
    private readonly configRef: RefObject<ObjectSetTableConfig<TData>>,
    private readonly stateRef: RefObject<TableState<TData>>
  ) {
    this.selection = new SelectionManager<TData>(this)
    this.eventManager = new TableEventManager<TData>()

    // Set the table element reference when available
    if (this.tableRef.current) {
      this.eventManager.setElement(this.tableRef.current)
    }
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
   * Updates the event manager's element reference
   * Called when the table element becomes available
   */
  updateEventManagerElement(): void {
    if (this.tableRef.current) {
      this.eventManager.setElement(this.tableRef.current)
    }
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
    const config = this._getConfig()
    if (!!config.onAdd && row === config.data.length) {
      // this is actually an insertion row, so we can ignore if the column is editable or not
      return !!config.columns[column].renderCellEditor
    }

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

  thereAreErrors(): boolean {
    const errors = this._getState().selectedRowErrors
    return Array.isArray(errors) && errors.length > 0
  }

  async getErrors(row: number, checkValidity = true): Promise<string[]> {
    const rowFormRefs = this._getState().dataFormReferences[row]
    // ensure the form refs exists in case it is an early render, an empty or non editable row
    if (!Array.isArray(rowFormRefs) || rowFormRefs.length === 0) return []

    // if there are cells being edited, we need to trigger the validity check
    if (checkValidity) {
      await Promise.all(
        rowFormRefs.map(async (ref) => {
          if (ref?.current) {
            await ref.current.trigger()
          }
        })
      )
    }

    const errors = this._getState()
      .dataFormReferences[row]?.map((ref) => {
        const errors = ref?.current?.formState.errors
        if (errors) {
          const errorValues = Object.values(errors)
          if (errorValues.length > 0) {
            return errorValues[0]?.message
          }
        }
      })
      .filter(Boolean) as string[]

    // update the state if needed
    const currentErrors = this._getState().selectedRowErrors
    const previousErrors = currentErrors ?? []

    if (!deepEqual(previousErrors, errors)) {
      // Trigger validation error change event for the currently selected cell
      const selectedCell = this._getState().selectedCellIndex
      if (selectedCell) {
        const columnDef = this._getConfig().columns[selectedCell.column]
        const formRef = this._getState().dataFormReferences[selectedCell.row]?.[selectedCell.column]
        let currentValue: unknown = undefined

        if (formRef) {
          const formData = formRef.current?.getValues()
          currentValue = formData?.[columnDef.field] as unknown
        }

        this.eventManager.triggerValidationErrorChange({
          cell: selectedCell,
          rowIndex: selectedCell.row,
          rowData: this._getState().data[selectedCell.row]?.data,
          columnDef,
          previousErrors,
          currentErrors: errors,
          value: currentValue,
          validationContext: {
            hasErrors: errors.length > 0,
            errorCount: errors.length,
          },
        })
      }

      this._getState().dispatch?.({
        type: 'SET_SELECTED_ROW_ERRORS',
        payload: { errors: errors.length > 0 ? errors : null },
      })
    }

    return errors
  }

  /**
   * Enters cell edit mode for the given cell
   *
   * @param row - The row index of the cell to enter edit mode
   * @param column - The column index of the cell to enter edit mode
   */
  enterCellEditMode(row: number, column: number) {
    if (!this.canEditCell(row, column)) throw new Error('Cell is not editable')

    if (this.thereAreErrors()) return

    // restore the form value
    const formRef = this._getState().dataFormReferences[row][column]
    const columnDef = this._getConfig().columns[column]
    const stateData = this._getState().data
    const isAddingRow = row === this._getState().data.length

    let currentValue: unknown = undefined
    // if stateData[row] is undefined is probably because we're inserting a new row
    // or because the row is empty, so we don't need to restore the value at all
    if (formRef && stateData[row]) {
      currentValue = columnDef.valueGetter?.(stateData[row]?.data, this._createCellContext(row, column))
      formRef.current?.setValue(columnDef.field, currentValue)
    }

    // Trigger editing start event
    this.eventManager.triggerEditingStart({
      cell: { row, column },
      rowIndex: row,
      rowData: stateData[row]?.data,
      columnDef,
      currentValue,
      isAddingRow,
    })

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
    // exit edit mode
    const selectedCell = this._getState().selectedCellIndex ?? {
      row: 0,
      column: 0,
    }

    const columnDef = this._getConfig().columns[selectedCell.column]
    const formRef = this._getState().dataFormReferences[selectedCell.row][selectedCell.column]
    let finalValue: unknown = undefined

    // Get current form value for event reporting
    if (formRef) {
      const formData = formRef.current?.getValues()
      finalValue = formData?.[columnDef.field] as unknown
    }

    const errors = await this.getErrors(selectedCell.row)
    if (errors.length > 0 && save) {
      // Trigger validation error event
      this.eventManager.triggerValidationError({
        cell: selectedCell,
        rowIndex: selectedCell.row,
        rowData: this._getState().data[selectedCell.row]?.data,
        columnDef,
        errors,
        value: finalValue,
        validationContext: {
          hasErrors: true,
          errorCount: errors.length,
        },
      })
      return // we can't exit edit mode if there are errors
    } else if (this._getState().selectedRowErrors) {
      this._getState().dispatch?.({
        type: 'SET_SELECTED_ROW_ERRORS',
        payload: { errors: null },
      })
    }

    if (save) {
      const isAddingRow = selectedCell.row === this._getState().data.length

      if (formRef) {
        const isValid = await formRef.current?.trigger()
        if (!isValid) {
          // Additional validation failed, trigger validation error
          const validationErrors = await this.getErrors(selectedCell.row, false)
          this.eventManager.triggerValidationError({
            cell: selectedCell,
            rowIndex: selectedCell.row,
            rowData: this._getState().data[selectedCell.row]?.data,
            columnDef,
            errors: validationErrors,
            value: finalValue,
            validationContext: {
              hasErrors: true,
              errorCount: validationErrors.length,
            },
          })
          return
        }

        // Validation success
        this.eventManager.triggerValidationSuccess({
          cell: selectedCell,
          rowIndex: selectedCell.row,
          rowData: this._getState().data[selectedCell.row]?.data,
          columnDef,
          value: finalValue,
          validationContext: {
            hasErrors: false,
            errorCount: 0,
          },
        })

        const formData = formRef.current?.getValues()
        formRef.current?.reset()
        const value = formData?.[columnDef.field] as unknown

        let oldValue: unknown = undefined
        if (!isAddingRow && this._getState().data[selectedCell.row]) {
          oldValue = columnDef.valueGetter?.(
            this._getState().data[selectedCell.row].data,
            this._createCellContext(this._getState().data[selectedCell.row].__index, selectedCell.column)
          )
        }

        if (isAddingRow) {
          // if the value is empty we need to prevent calling the onAdd callback
          if (isEmpty(value)) {
            this.selection.selectCell(selectedCell.row, selectedCell.column)
            // Trigger exit event (cancelled)
            this.eventManager.triggerEditingExit({
              cell: selectedCell,
              rowIndex: selectedCell.row,
              rowData: undefined, // No row data for new row
              columnDef,
              saved: false,
              finalValue: value,
            })
            return
          }

          await this._getConfig().onAdd?.({ [columnDef.field]: value })

          // Trigger save event for new row
          this.eventManager.triggerEditingSave({
            cell: selectedCell,
            rowIndex: selectedCell.row,
            rowData: undefined, // No row data for new row yet
            columnDef,
            oldValue: undefined,
            newValue: value,
            isAddingRow: true,
          })
        } else {
          // if the value did not change, we don't need to save it
          if (value === oldValue) {
            this.selection.selectCell(selectedCell.row, selectedCell.column)
            // Trigger exit event (no changes)
            this.eventManager.triggerEditingExit({
              cell: selectedCell,
              rowIndex: selectedCell.row,
              rowData: this._getState().data[selectedCell.row]?.data,
              columnDef,
              saved: false,
              finalValue: value,
            })
            return
          }

          // the value changed, so we need to save it
          columnDef.onSave?.(
            value,
            this._createCellContext(this._getState().data[selectedCell.row].__index, selectedCell.column)
          )

          // Trigger save event for existing row
          this.eventManager.triggerEditingSave({
            cell: selectedCell,
            rowIndex: selectedCell.row,
            rowData: this._getState().data[selectedCell.row]?.data,
            columnDef,
            oldValue,
            newValue: value,
            isAddingRow: false,
          })
        }
      }

      // the actual save is done in the form onSubmit callback
      // so we just asume that the save was done and we can move to the next cell
      const nextCell = getNextSelectedCell({
        direction: 'down',
        currentCell: selectedCell,
        rowCount: isAddingRow ? this._getState().data.length + 2 : this._getState().data.length,
        columnCount: this._getConfig().columns.length,
        moveToNextRow: true,
      })
      this.selection.selectCell(nextCell.row, nextCell.column)
    } else {
      if (formRef) {
        formRef.current?.reset()
      }

      this._getState().dispatch?.({
        type: 'SELECT_CELL',
        payload: { row: selectedCell.row, column: selectedCell.column },
      })
    }

    // Always trigger exit event at the end
    this.eventManager.triggerEditingExit({
      cell: selectedCell,
      rowIndex: selectedCell.row,
      rowData: this._getState().data[selectedCell.row]?.data,
      columnDef,
      saved: save,
      finalValue,
    })
  }

  /**
   * Sorts the rows by the given column index and direction
   *
   * @param columnIndex - The index of the column to sort
   * @param direction - The direction to sort the rows. Null if the sorting should be removed
   */
  async sortRows(columnIndex: number, direction: SortDirection | null) {
    if (this.isEditing()) {
      await this.exitCellEditMode(true)
      this.selection.clear()
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

  // deletion
  /**
   * Checks if the table can be deleted
   *
   * @returns `true` if the table can be deleted, `false` otherwise
   */
  canDelete(): boolean {
    return (
      typeof this._getConfig().onDelete === 'function' && this._getState().data.length > this._getConfig().minRowCount!
    )
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

    const canDeleteThatMany = actualRows.length <= this._getState().data.length - (this._getConfig().minRowCount ?? 0)
    if (!canDeleteThatMany) {
      if (confirmationOptions.askConfirmation) {
        await confirm({
          title: 'Delete entries',
          description: `You can not delete that many entries. The minimum number of entries is ${this._getConfig().minRowCount}.`,
        })
      }
      return
    }

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
    return (
      typeof this._getConfig().onAdd === 'function' && this._getState().data.length < this._getConfig().maxRowCount!
    )
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
