import { BaseTablePage } from './base-table.page.js'
import type { RenderResult } from '@testing-library/react'

/**
 * Page object for header-specific interactions
 * Extends BaseTablePage with header-focused methods
 */
export class TableHeaderPage extends BaseTablePage {
  constructor(renderResult: RenderResult) {
    super(renderResult)
  }

  /**
   * Gets the title of a specific column
   */
  getColumnTitle(columnIndex: number): string {
    return this.getHeaderCellText(columnIndex)
  }

  /**
   * Gets all column titles
   */
  getColumnTitles(): string[] {
    return this.getColumnHeaders()
  }

  /**
   * Checks if a column is sortable
   */
  isColumnSortable(columnIndex: number): boolean {
    const headerCell = this.getHeaderCellByIndex(columnIndex)
    if (!headerCell) return false

    // Check for sort indicators or clickable elements
    const hasSortIcon = headerCell.querySelector('[data-testid*="sort"], .sort-icon, .sort-indicator') !== null
    const hasClickable = headerCell.querySelector('button, [role="button"], .sortable') !== null
    const hasSortClass = headerCell.classList.contains('sortable') || headerCell.classList.contains('cursor-pointer')

    return hasSortIcon || hasClickable || hasSortClass
  }

  /**
   * Gets the sort direction of a column (if sorted)
   */
  getColumnSortDirection(columnIndex: number): 'asc' | 'desc' | null {
    const headerCell = this.getHeaderCellByIndex(columnIndex)
    if (!headerCell) return null

    // Look for sort direction indicators
    const sortIcon = headerCell.querySelector('[data-testid*="sort"], .sort-icon, .sort-indicator')
    if (!sortIcon) return null

    const classes = Array.from(sortIcon.classList)
    const text = sortIcon.textContent?.toLowerCase() ?? ''

    if (classes.includes('asc') || text.includes('asc') || text.includes('↑')) return 'asc'
    if (classes.includes('desc') || text.includes('desc') || text.includes('↓')) return 'desc'

    return null
  }

  /**
   * Checks if a column is currently sorted
   */
  isColumnSorted(columnIndex: number): boolean {
    return this.getColumnSortDirection(columnIndex) !== null
  }

  /**
   * Gets the width of a column header
   */
  getColumnWidth(columnIndex: number): number {
    const headerCell = this.getHeaderCellByIndex(columnIndex)
    if (!headerCell) return 0

    return headerCell.getBoundingClientRect().width
  }

  /**
   * Gets the CSS classes of a header cell
   */
  getHeaderCellClasses(columnIndex: number): string[] {
    const headerCell = this.getHeaderCellByIndex(columnIndex)
    if (!headerCell) return []

    return Array.from(headerCell.classList)
  }

  /**
   * Checks if a header cell has a specific CSS class
   */
  headerCellHasClass(columnIndex: number, className: string): boolean {
    const classes = this.getHeaderCellClasses(columnIndex)
    return classes.includes(className)
  }

  /**
   * Checks if a column is hidden
   */
  isColumnHidden(columnIndex: number): boolean {
    const headerCell = this.getHeaderCellByIndex(columnIndex)
    if (!headerCell) return false

    const classes = this.getHeaderCellClasses(columnIndex)
    const style = headerCell.style

    return (
      classes.includes('hidden') ||
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      headerCell.getAttribute('aria-hidden') === 'true'
    )
  }

  /**
   * Gets the alignment of a column header
   */
  getColumnAlignment(columnIndex: number): 'left' | 'center' | 'right' | null {
    const headerCell = this.getHeaderCellByIndex(columnIndex)
    if (!headerCell) return null

    const classes = this.getHeaderCellClasses(columnIndex)
    const style = headerCell.style

    if (classes.includes('text-center') || style.textAlign === 'center') return 'center'
    if (classes.includes('text-right') || style.textAlign === 'right') return 'right'
    if (classes.includes('text-left') || style.textAlign === 'left') return 'left'

    return 'left' // default
  }

  /**
   * Finds the index of a column by its title
   */
  findColumnIndexByTitle(title: string): number {
    const titles = this.getColumnTitles()
    return titles.findIndex((t) => t.toLowerCase().includes(title.toLowerCase()))
  }

  /**
   * Checks if a column title contains specific text
   */
  columnTitleContains(columnIndex: number, text: string): boolean {
    const title = this.getColumnTitle(columnIndex)
    return title.toLowerCase().includes(text.toLowerCase())
  }

  /**
   * Gets the total width of all visible columns
   */
  getTotalHeaderWidth(): number {
    const columnCount = this.getColumnCount()
    let totalWidth = 0

    for (let i = 0; i < columnCount; i++) {
      if (!this.isColumnHidden(i)) {
        totalWidth += this.getColumnWidth(i)
      }
    }

    return totalWidth
  }

  /**
   * Checks if the header is sticky/fixed
   */
  isHeaderSticky(): boolean {
    const header = this.getTableHeader()

    const classes = Array.from(header.classList)
    const style = header.style

    return (
      classes.some((cls) => cls.includes('sticky') || cls.includes('fixed')) ||
      style.position === 'sticky' ||
      style.position === 'fixed'
    )
  }
}
