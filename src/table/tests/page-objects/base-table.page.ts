import { type RenderResult, screen } from '@testing-library/react'

/**
 * Base page object class for table interactions
 * Provides common methods to query and interact with the table component
 */
export class BaseTablePage {
  protected container: HTMLElement
  protected renderResult: RenderResult

  constructor(renderResult: RenderResult) {
    this.container = renderResult.container
    this.renderResult = renderResult
  }

  /**
   * Gets the main table element
   */
  getTable(): HTMLElement {
    return screen.getByRole('table')
  }

  /**
   * Gets the table header element
   */
  getTableHeader(): HTMLElement {
    return this.getTable().querySelector('thead') as HTMLElement
  }

  /**
   * Gets the table body element
   */
  getTableBody(): HTMLElement {
    return this.getTable().querySelector('tbody') as HTMLElement
  }

  /**
   * Gets all table rows (excluding header)
   */
  getTableRows(): HTMLElement[] {
    const tbody = this.getTableBody()
    return Array.from(tbody.querySelectorAll('tr'))
  }

  /**
   * Gets all header rows
   */
  getHeaderRows(): HTMLElement[] {
    const thead = this.getTableHeader()
    return Array.from(thead.querySelectorAll('tr'))
  }

  /**
   * Gets a specific row by index (0-based)
   */
  getRowByIndex(index: number): HTMLElement | null {
    const rows = this.getTableRows()
    return rows[index] || null
  }

  /**
   * Gets all cells in a specific row
   */
  getCellsInRow(row: HTMLElement): HTMLElement[] {
    return Array.from(row.querySelectorAll('td, th'))
  }

  /**
   * Gets a specific cell by row and column index (0-based)
   */
  getCellByIndex(rowIndex: number, columnIndex: number): HTMLElement | null {
    const row = this.getRowByIndex(rowIndex)
    if (!row) return null

    const cells = this.getCellsInRow(row)
    return cells[columnIndex] || null
  }

  /**
   * Gets all header cells
   */
  getHeaderCells(): HTMLElement[] {
    const headerRows = this.getHeaderRows()
    if (headerRows.length === 0) return []

    return this.getCellsInRow(headerRows[0])
  }

  /**
   * Gets a specific header cell by index (0-based)
   */
  getHeaderCellByIndex(index: number): HTMLElement | null {
    const headerCells = this.getHeaderCells()
    return headerCells[index] || null
  }

  /**
   * Gets the text content of a cell
   */
  getCellText(rowIndex: number, columnIndex: number): string {
    const cell = this.getCellByIndex(rowIndex, columnIndex)
    return cell ? (cell.textContent || '').trim() : ''
  }

  /**
   * Gets the text content of a header cell
   */
  getHeaderCellText(columnIndex: number): string {
    const headerCell = this.getHeaderCellByIndex(columnIndex)
    return headerCell ? (headerCell.textContent || '').trim() : ''
  }

  /**
   * Gets the number of rows in the table (excluding header)
   */
  getRowCount(): number {
    return this.getTableRows().length
  }

  /**
   * Gets the number of columns in the table
   */
  getColumnCount(): number {
    const headerCells = this.getHeaderCells()
    return headerCells.length
  }

  /**
   * Checks if the table is present in the DOM
   */
  isTablePresent(): boolean {
    try {
      this.getTable()
      return true
    } catch {
      return false
    }
  }

  /**
   * Gets all column headers as an array of strings
   */
  getColumnHeaders(): string[] {
    return this.getHeaderCells().map((cell) => (cell.textContent || '').trim())
  }

  /**
   * Finds a row that contains specific text
   */
  findRowByText(text: string): HTMLElement | null {
    const rows = this.getTableRows()
    return rows.find((row) => (row.textContent || '').includes(text)) ?? null
  }

  /**
   * Gets all text content from a specific row
   */
  getRowText(rowIndex: number): string[] {
    const row = this.getRowByIndex(rowIndex)
    if (!row) return []

    return this.getCellsInRow(row).map((cell) => (cell.textContent || '').trim())
  }
}
