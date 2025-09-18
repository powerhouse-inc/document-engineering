import type { UseFormReturn } from 'react-hook-form'
import type { ColumnDef, DataType, TableCellIndex } from './types.js'
import { createRef } from 'react'

/**
 * Get the title of a column.
 *
 * @param column - The column to get the title of.
 * @returns The title of the column.
 *
 * @example
 * ```ts
 * const title = getColumnTitle({ field: "name" }) // "Name"
 * const title = getColumnTitle({ field: "address.city" }) // "City"
 * const title = getColumnTitle({ field: "address.code", title: "Country" }) // "Country"
 * ```
 */
export const getColumnTitle = <T extends DataType = DataType>(column: ColumnDef<T>) => {
  if (column.title) {
    return column.title
  }

  // Handle dot notation by taking only the last part
  const fieldName = column.field.split('.').pop() ?? column.field

  // this is a humanized version of the field name handling camelCase, snake_case and kebab-case
  // Handle different cases by inserting spaces
  const humanized = fieldName
    // Insert space before uppercase letters that follow lowercase or numbers
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    // Replace underscores and hyphens with spaces
    .replace(/[_-]/g, ' ')
    // Capitalize the first letter
    .replace(/^\w/, (c) => c.toUpperCase())

  return humanized
}

/**
 * Get the value of a column from a data object using dot notation.
 *
 * @param value - The data object.
 * @param field - The field to get the value of. It can be a dot notation string.
 * @returns The value of the field or undefined if the field is not found.
 *
 * @example
 * ```ts
 * const value = {
 *  name: "John",
 *  address: {
 *    city: "San Francisco",
 *  }
 * }
 *
 * getColumnValue(value, "name") // "John"
 * getColumnValue(value, "address.city") // "San Francisco"
 * getColumnValue(value, "address.country") // undefined
 * getColumnValue(value, "address") // { city: "San Francisco" }
 * ```
 */
export const getColumnValue = (value: DataType, field: string): unknown => {
  const keys = field.split('.')
  let current: unknown = value
  for (const key of keys) {
    if (typeof current !== 'object' || current === null || !(key in current)) {
      return undefined
    }
    current = (current as Record<string, unknown>)[key]
  }
  return current
}

export type NextSelectedCellDirection = 'right' | 'left' | 'down' | 'up'

interface GetNextSelectedCellOptions {
  /**
   * The direction to move the selected cell.
   */
  direction: NextSelectedCellDirection
  /**
   * The current cell.
   */
  currentCell: TableCellIndex | null
  /**
   * The number of rows in the table.
   */
  rowCount: number
  /**
   * The number of columns in the table.
   */
  columnCount: number
  /**
   * Whether to move to the next row when the current cell is at the last column.
   */
  moveToNextRow?: boolean
  /**
   * Optional columns array to handle hidden columns. If provided, navigation will skip hidden columns.
   */
  columns?: Array<{ hidden?: boolean }>
}

/**
 * Get the next selected cell based on the direction and the current cell.
 *
 * @param options - The options for the next selected cell.
 * @returns The next selected cell.
 *
 * @example
 * ```ts
 * const nextCell = getNextSelectedCell({ direction: "right", currentCell: { row: 0, column: 0 }, rowCount: 3, columnCount: 3 });
 * ```
 */
export const getNextSelectedCell = (options: GetNextSelectedCellOptions): TableCellIndex => {
  const { direction, currentCell, rowCount, columnCount, moveToNextRow = false, columns } = options

  if (!currentCell) {
    // if there is no current cell, we're going to select the first visible cell
    if (columns) {
      for (let i = 0; i < columns.length; i++) {
        if (!columns[i].hidden) return { row: 0, column: i }
      }
    }
    return { row: 0, column: 0 }
  }

  const { row, column } = currentCell

  const getNextVisibleColumn = (startIndex: number, direction: 'left' | 'right'): number => {
    if (!columns) return startIndex

    if (direction === 'right') {
      for (let i = startIndex + 1; i < columns.length; i++) {
        if (!columns[i].hidden) return i
      }
    } else {
      for (let i = startIndex - 1; i >= 0; i--) {
        if (!columns[i].hidden) return i
      }
    }
    return startIndex
  }

  const getFirstVisibleColumn = (): number => {
    if (!columns) return 0
    for (let i = 0; i < columns.length; i++) {
      if (!columns[i].hidden) return i
    }
    return 0
  }

  const getLastVisibleColumn = (): number => {
    if (!columns) return columnCount - 1
    for (let i = columns.length - 1; i >= 0; i--) {
      if (!columns[i].hidden) return i
    }
    return columnCount - 1
  }

  switch (direction) {
    case 'right': {
      const nextVisibleColumn = getNextVisibleColumn(column, 'right')
      if (nextVisibleColumn !== column) {
        return { row, column: nextVisibleColumn }
      } else {
        if (moveToNextRow) {
          return { row: (row + 1) % rowCount, column: getFirstVisibleColumn() }
        } else {
          return { row, column: getLastVisibleColumn() }
        }
      }
    }
    case 'left': {
      const prevVisibleColumn = getNextVisibleColumn(column, 'left')
      if (prevVisibleColumn !== column) {
        return { row, column: prevVisibleColumn }
      } else {
        if (moveToNextRow) {
          return {
            row: row === 0 ? rowCount - 1 : row - 1,
            column: getLastVisibleColumn(),
          }
        } else {
          return { row, column: getFirstVisibleColumn() }
        }
      }
    }
    case 'down':
      if (row < rowCount - 1) {
        return { row: row + 1, column }
      } else {
        if (moveToNextRow) {
          return { row: 0, column }
        } else {
          return { row, column }
        }
      }
    case 'up':
      if (row > 0) {
        return { row: row - 1, column }
      } else {
        if (moveToNextRow) {
          return { row: rowCount - 1, column }
        } else {
          return { row, column }
        }
      }
    default:
      return currentCell
  }
}

/**
 * Get the direction from a key.
 *
 * @param key - The key to get the direction from.
 * @returns The direction.
 */
export const getDirectionFromKey = (key: string): NextSelectedCellDirection => {
  switch (key) {
    case 'ArrowRight':
    case 'Tab':
      return 'right'
    case 'ArrowLeft':
      return 'left'
    case 'ArrowDown':
      return 'down'
    case 'ArrowUp':
      return 'up'
    default:
      return 'right'
  }
}

/**
 * Check if two cells are equal.
 *
 * @param cell1 - The first cell.
 * @param cell2 - The second cell.
 * @returns True if the cells are equal, false otherwise.
 */
export const isCellEqual = (cell1: TableCellIndex | null, cell2: TableCellIndex | null) => {
  if (!cell1 || !cell2) {
    return false
  }
  return cell1.row === cell2.row && cell1.column === cell2.column
}

/**
 * Create form references for the for of the editable cells in the table.
 *
 * @param rowCount - The number of rows in the table.
 * @param columnDefs - The column definitions.
 * @returns The form references.
 */
export const createFormReferences = <T extends DataType = DataType>(
  rowCount: number,
  columnDefs: Array<ColumnDef<T>>
): Array<Array<React.RefObject<UseFormReturn> | null>> => {
  if (rowCount === 0 || columnDefs.length === 0) {
    return []
  }

  const formReferences: Array<Array<React.RefObject<UseFormReturn> | null>> = []

  for (let row = 0; row < rowCount; row++) {
    const refs: Array<React.RefObject<UseFormReturn> | null> = []
    columnDefs.forEach(() => {
      refs.push(createRef<UseFormReturn>())
    })
    formReferences.push(refs)
  }

  return formReferences
}
