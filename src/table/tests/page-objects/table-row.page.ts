import { BaseTablePage } from './base-table.page.js'
import type { RenderResult } from '@testing-library/react'

/**
 * Page object for row-specific interactions
 * Extends BaseTablePage with row-focused methods
 */
export class TableRowPage extends BaseTablePage {
  constructor(renderResult: RenderResult) {
    super(renderResult)
  }

  /**
   * Checks if a row is selected
   */
  isRowSelected(rowIndex: number): boolean {
    const row = this.getRowByIndex(rowIndex)
    if (!row) return false

    // Check for selection indicators based on actual table implementation
    const hasSelectedAttribute = row.getAttribute('data-selected') === 'true'
    const hasSelectedClass = row.classList.contains('bg-blue-50')

    return hasSelectedAttribute || hasSelectedClass
  }

  /**
   * Gets the row number (if showRowNumbers is enabled)
   */
  getRowNumber(rowIndex: number): string {
    const row = this.getRowByIndex(rowIndex)
    if (!row) return ''

    // First cell is typically the row number
    const firstCell = this.getCellsInRow(row)[0]
    return firstCell.textContent?.trim() ?? ''
  }

  /**
   * Gets all data from a specific row as an array of strings
   */
  getRowData(rowIndex: number): string[] {
    return this.getRowText(rowIndex)
  }

  /**
   * Gets the row data as a key-value object (requires column headers)
   */
  getRowDataAsObject(rowIndex: number): Record<string, string> {
    const headers = this.getColumnHeaders()
    const rowData = this.getRowData(rowIndex)

    const result: Record<string, string> = {}
    headers.forEach((header, index) => {
      result[header] = rowData[index] ?? ''
    })

    return result
  }

  /**
   * Finds the index of a row that contains specific text
   */
  findRowIndexByText(text: string): number {
    const rows = this.getTableRows()
    return rows.findIndex((row) => row.textContent?.includes(text))
  }

  /**
   * Checks if a row contains specific text
   */
  rowContains(rowIndex: number, text: string): boolean {
    const row = this.getRowByIndex(rowIndex)
    if (!row) return false

    return row.textContent?.includes(text) ?? false
  }

  /**
   * Gets the CSS classes of a row
   */
  getRowClasses(rowIndex: number): string[] {
    const row = this.getRowByIndex(rowIndex)
    if (!row) return []

    return Array.from(row.classList)
  }

  /**
   * Checks if a row has a specific CSS class
   */
  rowHasClass(rowIndex: number, className: string): boolean {
    const classes = this.getRowClasses(rowIndex)
    return classes.includes(className)
  }

  /**
   * Checks if a row is hovered (has hover styles)
   */
  isRowHovered(rowIndex: number): boolean {
    const classes = this.getRowClasses(rowIndex)
    return classes.some((cls) => cls.includes('hover') || cls.includes('group'))
  }

  /**
   * Gets the row actions (if any) for a specific row
   */
  getRowActions(rowIndex: number): HTMLElement[] {
    const row = this.getRowByIndex(rowIndex)
    if (!row) return []

    // Look for action buttons or menus
    return Array.from(row.querySelectorAll('button, [role="button"], .action, .row-actions button'))
  }

  /**
   * Checks if a row has actions available
   */
  hasRowActions(rowIndex: number): boolean {
    return this.getRowActions(rowIndex).length > 0
  }

  /**
   * Gets the height of a row in pixels
   */
  getRowHeight(rowIndex: number): number {
    const row = this.getRowByIndex(rowIndex)
    if (!row) return 0

    return row.getBoundingClientRect().height
  }

  /**
   * Checks if a row is visible in the viewport
   */
  isRowVisible(rowIndex: number): boolean {
    const row = this.getRowByIndex(rowIndex)
    if (!row) return false

    const rect = row.getBoundingClientRect()
    return rect.top >= 0 && rect.bottom <= window.innerHeight
  }
}
