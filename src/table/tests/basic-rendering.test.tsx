import { describe, expect, it } from 'vitest'
import { createMockPerson, createTestTableConfig, renderTestTable } from './helpers/test-utils.js'
import { TablePage } from './page-objects/table.page.js'
import { mockData } from '../table/mock-data.js'

describe('ObjectSetTable - Basic Rendering', () => {
  describe('Table Structure', () => {
    it('should render table with correct number of rows and columns', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      expect(table.isTablePresent()).toBe(true)
      expect(table.getRowCount()).toBe(mockData.length)
      expect(table.getColumnCount()).toBe(4) // row number + firstName, status, payment columns
    })

    it('should have proper DOM structure with thead and tbody', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      expect(table.getTable()).toBeInTheDocument()
      expect(table.getTableHeader()).toBeInTheDocument()
      expect(table.getTableBody()).toBeInTheDocument()
      expect(table.getTable().tagName).toBe('TABLE')
      expect(table.getTableHeader().tagName).toBe('THEAD')
      expect(table.getTableBody().tagName).toBe('TBODY')
    })

    it('should render table with custom width configuration', () => {
      const renderResult = renderTestTable({ width: '800px' })
      const table = new TablePage(renderResult)

      expect(table.isTablePresent()).toBe(true)
      expect(table.getTable().style.minWidth).toBe('800px')
    })

    it('should render empty table when no data provided', () => {
      const renderResult = renderTestTable({ data: [] })
      const table = new TablePage(renderResult)

      expect(table.isTablePresent()).toBe(true)
      expect(table.getRowCount()).toBe(0)
      expect(table.getColumnCount()).toBe(4)
      expect(table.header.getColumnTitles()).toEqual(['#', 'First Name', 'Status', 'Payment'])
    })
  })

  describe('Header Rendering', () => {
    it('should display all column titles correctly', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      const columnTitles = table.header.getColumnTitles()
      expect(columnTitles).toEqual(['#', 'First Name', 'Status', 'Payment'])
      expect(columnTitles).toHaveLength(4)
    })

    it('should show row number column when showRowNumbers is true', () => {
      const renderResult = renderTestTable({ showRowNumbers: true })
      const table = new TablePage(renderResult)

      expect(table.header.getColumnTitle(0)).toBe('#')
      expect(table.getColumnCount()).toBe(4)
    })

    it('should not show row number column when showRowNumbers is false', () => {
      const renderResult = renderTestTable({ showRowNumbers: false })
      const table = new TablePage(renderResult)

      const columnTitles = table.header.getColumnTitles()
      const nonEmptyTitles = columnTitles.filter((title) => title !== '')
      expect(nonEmptyTitles).toEqual(['First Name', 'Status', 'Payment'])
      expect(nonEmptyTitles).toHaveLength(3)
      expect(table.header.getColumnTitle(1)).toBe('First Name')
    })

    it('should find column index by title', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      expect(table.header.findColumnIndexByTitle('First Name')).toBe(1)
      expect(table.header.findColumnIndexByTitle('Status')).toBe(2)
      expect(table.header.findColumnIndexByTitle('Payment')).toBe(3)
      expect(table.header.findColumnIndexByTitle('Non-existent')).toBe(-1)
    })

    it('should apply proper styling to header cells', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      const headerClasses = table.header.getHeaderCellClasses(0)
      expect(Array.isArray(headerClasses)).toBe(true)
      expect(headerClasses.length).toBeGreaterThan(0)

      for (let i = 0; i < table.getColumnCount(); i++) {
        const classes = table.header.getHeaderCellClasses(i)
        expect(classes.length).toBeGreaterThan(0)
      }
    })
  })

  describe('Cell Data Display', () => {
    it('should display correct data in cells', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      expect(table.header.getColumnTitles()).toEqual(['#', 'First Name', 'Status', 'Payment'])

      // Test first row data
      expect(table.cell.getCellValue(0, 0)).toBe('1')
      expect(table.cell.getCellValue(0, 1)).toBe('Alice')
      expect(table.cell.getCellValue(0, 2)).toBe('active')
      expect(table.cell.getCellValue(0, 3)).toBe('100')

      // Test second row data
      expect(table.cell.getCellValue(1, 0)).toBe('2')
      expect(table.cell.getCellValue(1, 1)).toBe('Bob')
      expect(table.cell.getCellValue(1, 2)).toBe('inactive')
      expect(table.cell.getCellValue(1, 3)).toBe('1065460')
    })

    it('should render cells with appropriate input types for editing', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      expect(table.cell.getCellDataType(0, 1)).toBe('text')
      expect(table.cell.getCellDataType(0, 3)).toBe('text')
      expect(table.cell.getCellDataType(2, 1)).toBe('text')
    })

    it('should maintain column data integrity across all rows', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      const firstNameColumn = table.cell.getColumnCells(1)
      expect(firstNameColumn).toHaveLength(7)
      expect(firstNameColumn).toContain('Alice')
      expect(firstNameColumn).toContain('Bob')
      expect(firstNameColumn).toContain('Diana')
      expect(firstNameColumn).toContain('Fiona')
      expect(firstNameColumn).toContain('Alex')
      expect(firstNameColumn).toContain('')
    })

    it('should support text search functionality within cells', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      expect(table.cell.cellContains(0, 1, 'Alice')).toBe(true)
      expect(table.cell.cellContains(0, 1, 'alice')).toBe(false)
      expect(table.cell.cellContains(0, 2, 'active')).toBe(true)
      expect(table.cell.cellContains(0, 3, '100')).toBe(true)
      expect(table.cell.cellContains(1, 2, 'inactive')).toBe(true)
    })

    it('should handle numeric data with various magnitudes', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      expect(table.cell.getCellValue(0, 3)).toBe('100')
      expect(table.cell.getCellValue(1, 3)).toBe('1065460')
      expect(table.cell.getCellValue(3, 3)).toBe('11231200')
      expect(table.cell.getCellValue(4, 3)).toBe('10234234230')
      expect(table.cell.getCellValue(5, 3)).toBe('0')
      expect(table.cell.getCellValue(6, 3)).toBe('15')
    })
  })

  describe('Row Data Display', () => {
    it('should display row numbers correctly (1-indexed)', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      expect(table.row.getRowNumber(0)).toBe('1')
      expect(table.row.getRowNumber(1)).toBe('2')
      expect(table.row.getRowNumber(2)).toBe('3')
      expect(table.row.getRowNumber(6)).toBe('7')
    })

    it('should provide structured row data with column mapping', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      const firstRowObject = table.row.getRowDataAsObject(0)
      expect(firstRowObject).toEqual({
        '#': '1',
        'First Name': 'Alice',
        Status: 'active',
        Payment: '100',
      })

      const secondRowObject = table.row.getRowDataAsObject(1)
      expect(secondRowObject['First Name']).toBe('Bob')
      expect(secondRowObject.Status).toBe('inactive')
      expect(secondRowObject.Payment).toBe('1065460')
    })

    it('should provide complete row data access and maintain consistency', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      // Test individual row data access
      const firstRowData = table.row.getRowData(0)
      expect(firstRowData).toHaveLength(4)
      expect(firstRowData).toEqual(['1', 'Alice', 'active', '100'])

      const secondRowData = table.row.getRowData(1)
      expect(secondRowData).toEqual(['2', 'Bob', 'inactive', '1065460'])

      // Test data consistency across all rows
      expect(table.getRowCount()).toBe(7)
      for (let i = 0; i < 7; i++) {
        const rowData = table.row.getRowData(i)
        expect(rowData).toHaveLength(4)
        expect(rowData[0]).toBe((i + 1).toString())
      }
    })

    it('should support row-level text search functionality', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      expect(table.row.rowContains(0, 'Alice')).toBe(true)
      expect(table.row.rowContains(0, 'active')).toBe(true)
      expect(table.row.rowContains(0, '100')).toBe(true)
      expect(table.row.rowContains(0, 'Non-existent')).toBe(false)

      expect(table.row.rowContains(1, 'Bob')).toBe(true)
      expect(table.row.rowContains(1, 'inactive')).toBe(true)
      expect(table.row.rowContains(3, 'Diana')).toBe(true)
    })

    it('should enable row lookup by content search', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      expect(table.row.findRowIndexByText('Alice')).toBe(0)
      expect(table.row.findRowIndexByText('Bob')).toBe(1)
      expect(table.row.findRowIndexByText('Diana')).toBe(3)
      expect(table.row.findRowIndexByText('Alex')).toBe(6)
      expect(table.row.findRowIndexByText('Non-existent')).toBe(-1)

      expect(table.row.findRowIndexByText('active')).toBe(0)
      expect(table.row.findRowIndexByText('inactive')).toBe(1)
    })
  })

  describe('Configuration Options', () => {
    it('should handle custom column configuration with nested fields', () => {
      const customConfig = createTestTableConfig({
        columns: [
          {
            field: 'firstName',
            title: 'Name',
            type: 'string',
          },
          {
            field: 'address.city',
            title: 'City',
            type: 'string',
          },
          {
            field: 'payment',
            title: 'Amount',
            type: 'number',
          },
        ],
        showRowNumbers: true,
      })
      const renderResult = renderTestTable(customConfig)
      const table = new TablePage(renderResult)

      expect(table.header.getColumnTitles()).toEqual(['#', 'Name', 'City', 'Amount'])
      expect(table.cell.getCellValue(0, 1)).toBe('Alice')
      expect(table.cell.getCellValue(0, 2)).toBe('San Francisco')
      expect(table.cell.getCellValue(0, 3)).toBe('100')
    })

    it('should handle different data types in columns', () => {
      const customConfig = createTestTableConfig({
        columns: [
          {
            field: 'firstName',
            title: 'Name',
            type: 'string',
          },
          {
            field: 'isActive',
            title: 'Active',
            type: 'boolean',
          },
          {
            field: 'payment',
            title: 'Payment',
            type: 'number',
          },
        ],
        showRowNumbers: false,
      })
      const renderResult = renderTestTable(customConfig)
      const table = new TablePage(renderResult)

      const columnTitles = table.header.getColumnTitles()
      const nonEmptyTitles = columnTitles.filter((title) => title !== '')
      expect(nonEmptyTitles).toHaveLength(3)
      expect(nonEmptyTitles).toEqual(['Name', 'Active', 'Payment'])
      expect(table.cell.getCellValue(0, 1)).toBe('Alice')
      expect(table.cell.getCellValue(0, 2)).toBe('')
      expect(table.cell.getCellValue(0, 3)).toBe('100')
    })
  })

  describe('Edge Cases', () => {
    it('should handle single row of data', () => {
      const singlePerson = createMockPerson({ firstName: 'Single User' })
      const renderResult = renderTestTable({ data: [singlePerson] })
      const table = new TablePage(renderResult)

      expect(table.getRowCount()).toBe(1)
      expect(table.cell.getCellValue(0, 1)).toBe('Single User')
      expect(table.row.getRowNumber(0)).toBe('1')
    })

    it('should handle single column configuration', () => {
      const singleColumnConfig = createTestTableConfig({
        columns: [
          {
            field: 'firstName',
            title: 'Name',
            type: 'string',
          },
        ],
        showRowNumbers: true,
      })
      const renderResult = renderTestTable(singleColumnConfig)
      const table = new TablePage(renderResult)

      expect(table.getColumnCount()).toBe(2)
      expect(table.header.getColumnTitles()).toEqual(['#', 'Name'])
      expect(table.cell.getCellValue(0, 0)).toBe('1')
      expect(table.cell.getCellValue(0, 1)).toBe('Alice')
    })

    it('should handle special characters in text', () => {
      const specialPerson = createMockPerson({
        firstName: 'José María',
        status: 'active' as 'active' | 'inactive',
        payment: 1000,
      })
      const renderResult = renderTestTable({ data: [specialPerson] })
      const table = new TablePage(renderResult)

      expect(table.cell.getCellValue(0, 1)).toBe('José María')
      expect(table.cell.getCellValue(0, 2)).toBe('active')
      expect(table.cell.cellContains(0, 1, 'José')).toBe(true)
      expect(table.cell.cellContains(0, 1, 'María')).toBe(true)
    })

    it('should handle zero and negative numbers', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      expect(table.cell.getCellValue(5, 3)).toBe('0')
      expect(table.cell.getCellDataType(5, 3)).toBe('text')
    })
  })

  describe('Table Data Integrity', () => {
    it('should handle mixed data types correctly', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      expect(table.cell.getCellValue(0, 1)).toBe('Alice')
      expect(table.cell.getCellValue(0, 3)).toBe('100')
      expect(table.cell.getCellValue(1, 3)).toBe('1065460')
      expect(table.cell.getCellValue(5, 3)).toBe('0')
    })

    it('should handle null and empty values appropriately', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      // Test empty cells
      expect(table.cell.getCellValue(2, 1)).toBe('')
      expect(table.cell.isCellEmpty(2, 1)).toBe(true)
      expect(table.cell.getCellValue(4, 1)).toBe('')
      expect(table.cell.isCellEmpty(4, 1)).toBe(true)

      // Test that other cells in the same row still have data
      expect(table.cell.getCellValue(2, 2)).toBe('active')
      expect(table.cell.getCellValue(2, 3)).toBe('14522')
    })
  })
})
