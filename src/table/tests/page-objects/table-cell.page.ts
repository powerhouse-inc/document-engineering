import { BaseTablePage } from './base-table.page.js'
import type { RenderResult } from '@testing-library/react'

/**
 * Page object for cell-specific interactions
 * Extends BaseTablePage with cell-focused methods
 */
export class TableCellPage extends BaseTablePage {
  constructor(renderResult: RenderResult) {
    super(renderResult)
  }

  /**
   * Gets the value of a specific cell
   */
  getCellValue(rowIndex: number, columnIndex: number): string {
    return this.getCellText(rowIndex, columnIndex)
  }

  /**
   * Checks if a cell is editable (has input or contenteditable)
   */
  isCellEditable(rowIndex: number, columnIndex: number): boolean {
    const cell = this.getCellByIndex(rowIndex, columnIndex)
    if (!cell) return false

    // Check for input elements
    const hasInput = cell.querySelector('input, textarea, select') !== null
    // Check for contenteditable attribute
    const isContentEditable = cell.getAttribute('contenteditable') === 'true'

    return hasInput || isContentEditable
  }

  /**
   * Gets the input element within a cell (if editable)
   */
  getCellInput(
    rowIndex: number,
    columnIndex: number
  ): HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null {
    const cell = this.getCellByIndex(rowIndex, columnIndex)
    if (!cell) return null

    return cell.querySelector('input, textarea, select')
  }

  /**
   * Checks if a cell is currently in edit mode
   */
  isCellInEditMode(rowIndex: number, columnIndex: number): boolean {
    const cell = this.getCellByIndex(rowIndex, columnIndex)
    if (!cell) return false

    // First check if the cell is editable at all
    if (!this.isCellEditable(rowIndex, columnIndex)) {
      return false
    }

    // Look for the form structure and check if the editor div is visible
    const form = cell.querySelector('form')
    if (!form) return false

    // Find the editor div (the one that should be visible in edit mode)
    const editorDiv = form.querySelector('div:not([class*="hidden"])')
    if (!editorDiv) return false

    // Check if this div contains an input and is not hidden
    const input = editorDiv.querySelector('input, textarea, select')
    if (!input) return false

    // Check if the editor div is actually visible (not hidden by CSS)
    const editorStyles = window.getComputedStyle(editorDiv)
    return editorStyles.display !== 'none' && editorStyles.visibility !== 'hidden'
  }

  /**
   * Gets the data type of a cell based on its content or input type
   */
  getCellDataType(rowIndex: number, columnIndex: number): string {
    const input = this.getCellInput(rowIndex, columnIndex)
    if (input) {
      return input.type || input.tagName.toLowerCase()
    }

    const cell = this.getCellByIndex(rowIndex, columnIndex)
    if (!cell) return 'unknown'

    // Try to infer type from content
    const text = (cell.textContent || '').trim()

    if (text === 'true' || text === 'false') return 'boolean'
    if (!isNaN(Number(text)) && text !== '') return 'number'
    if (text.includes('@')) return 'email'
    if (text.startsWith('http')) return 'url'

    return 'string'
  }

  /**
   * Checks if a cell contains a specific value
   */
  cellContains(rowIndex: number, columnIndex: number, value: string): boolean {
    const cellValue = this.getCellValue(rowIndex, columnIndex)
    return cellValue.includes(value)
  }

  /**
   * Gets all cells in a specific column
   */
  getColumnCells(columnIndex: number): string[] {
    const rowCount = this.getRowCount()
    const columnCells: string[] = []

    for (let i = 0; i < rowCount; i++) {
      columnCells.push(this.getCellValue(i, columnIndex))
    }

    return columnCells
  }

  /**
   * Checks if a cell is empty
   */
  isCellEmpty(rowIndex: number, columnIndex: number): boolean {
    const value = this.getCellValue(rowIndex, columnIndex)
    return value === ''
  }

  /**
   * Gets the CSS classes of a cell
   */
  getCellClasses(rowIndex: number, columnIndex: number): string[] {
    const cell = this.getCellByIndex(rowIndex, columnIndex)
    if (!cell) return []

    return Array.from(cell.classList)
  }

  /**
   * Checks if a cell has a specific CSS class
   */
  cellHasClass(rowIndex: number, columnIndex: number, className: string): boolean {
    const classes = this.getCellClasses(rowIndex, columnIndex)
    return classes.includes(className)
  }

  /**
   * Checks if a cell is currently selected
   */
  isCellSelected(rowIndex: number, columnIndex: number): boolean {
    const cell = this.getCellByIndex(rowIndex, columnIndex)
    if (!cell) return false

    // Check for selection border classes in the inner div
    const innerDiv = cell.querySelector('div[class*="border-"]')
    if (!innerDiv) return false

    const classes = Array.from(innerDiv.classList)
    return classes.some(
      (cls) => cls.includes('border-blue-900') || cls.includes('border-gray-400') || cls.includes('border-red-900')
    )
  }

  /**
   * Gets the border color of a selected cell
   */
  getCellBorderColor(rowIndex: number, columnIndex: number): string {
    const cell = this.getCellByIndex(rowIndex, columnIndex)
    if (!cell) return 'none'

    const innerDiv = cell.querySelector('div[class*="border-"]')
    if (!innerDiv) return 'none'

    const classes = Array.from(innerDiv.classList)

    if (classes.some((cls) => cls.includes('border-blue-900'))) return 'blue'
    if (classes.some((cls) => cls.includes('border-gray-400'))) return 'gray'
    if (classes.some((cls) => cls.includes('border-red-900'))) return 'red'

    return 'none'
  }
}
