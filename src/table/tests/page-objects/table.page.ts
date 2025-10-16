import { BaseTablePage } from './base-table.page.js'
import { TableCellPage } from './table-cell.page.js'
import { TableRowPage } from './table-row.page.js'
import { TableHeaderPage } from './table-header.page.js'

/**
 * Unified table page object that provides access to all table functionality
 * through a single object with specialized sub-objects
 *
 * Usage:
 * const table = new TablePage(renderResult)
 * table.getRowCount()                    // Base functionality
 * table.cell.getCellValue(0, 1)         // Cell functionality
 * table.row.isRowSelected(0)            // Row functionality
 * table.header.getColumnTitle(0)        // Header functionality
 */
export class TablePage extends BaseTablePage {
  // Lazy-loaded specialized page objects
  private _cell?: TableCellPage
  private _row?: TableRowPage
  private _header?: TableHeaderPage

  /**
   * Access to cell-specific page object methods
   * Usage: table.cell.getCellValue(0, 1)
   */
  get cell(): TableCellPage {
    this._cell ??= new TableCellPage(this.renderResult)
    return this._cell
  }

  /**
   * Access to row-specific page object methods
   * Usage: table.row.isRowSelected(0)
   */
  get row(): TableRowPage {
    this._row ??= new TableRowPage(this.renderResult)
    return this._row
  }

  /**
   * Access to header-specific page object methods
   * Usage: table.header.getColumnTitle(0)
   */
  get header(): TableHeaderPage {
    this._header ??= new TableHeaderPage(this.renderResult)
    return this._header
  }
}
