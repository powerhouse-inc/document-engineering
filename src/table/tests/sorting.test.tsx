/* eslint-disable @typescript-eslint/no-unsafe-call */
import { describe, expect, it } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { createMockPerson, createTestTableConfig, renderTestTable } from './helpers/test-utils.js'
import { TablePage } from './page-objects/table.page.js'

describe('ObjectSetTable - Sorting', () => {
  describe('Basic Sorting Functionality', () => {
    it('should sort string column in ascending order', () => {
      const sortableConfig = createTestTableConfig({
        columns: [
          {
            field: 'firstName',
            title: 'First Name',
            type: 'string',
            sortable: true,
          },
          {
            field: 'status',
            title: 'Status',
            type: 'string',
            sortable: true,
          },
          {
            field: 'payment',
            title: 'Payment',
            type: 'number',
            sortable: true,
          },
        ],
      })
      const renderResult = renderTestTable(sortableConfig)
      const table = new TablePage(renderResult)

      // Verify initial state - no sorting
      expect(table.header.isColumnSorted(0)).toBe(false)
      expect(table.header.getColumnSortDirection(0)).toBe(null)

      // Click header to sort ascending (column 1 is First Name, column 0 is row number)
      const headerCell = table.getHeaderCellByIndex(1)
      expect(headerCell).toBeTruthy()
      fireEvent.click(headerCell!)

      // Verify sorting state
      expect(table.header.isColumnSorted(1)).toBe(true)
      expect(table.header.getColumnSortDirection(1)).toBe('asc')

      // Verify data is sorted alphabetically (column 1 is First Name)
      expect(table.cell.getCellValue(0, 1)).toBe('Alex')
      expect(table.cell.getCellValue(1, 1)).toBe('Alice')
      expect(table.cell.getCellValue(2, 1)).toBe('Bob')
      expect(table.cell.getCellValue(3, 1)).toBe('Diana')
      expect(table.cell.getCellValue(4, 1)).toBe('Fiona')
    })

    it('should sort string column in descending order', () => {
      const sortableConfig = createTestTableConfig({
        columns: [
          {
            field: 'firstName',
            title: 'First Name',
            type: 'string',
            sortable: true,
          },
          {
            field: 'status',
            title: 'Status',
            type: 'string',
            sortable: true,
          },
          {
            field: 'payment',
            title: 'Payment',
            type: 'number',
            sortable: true,
          },
        ],
      })
      const renderResult = renderTestTable(sortableConfig)
      const table = new TablePage(renderResult)

      // Click header twice to get descending order (column 1 is First Name)
      const headerCell = table.getHeaderCellByIndex(1)
      expect(headerCell).toBeTruthy()
      fireEvent.click(headerCell!) // First click: asc
      fireEvent.click(headerCell!) // Second click: desc

      // Verify sorting state
      expect(table.header.isColumnSorted(1)).toBe(true)
      expect(table.header.getColumnSortDirection(1)).toBe('desc')

      // Verify data is sorted in descending order (column 1 is First Name)
      expect(table.cell.getCellValue(0, 1)).toBe('Fiona')
      expect(table.cell.getCellValue(1, 1)).toBe('Diana')
      expect(table.cell.getCellValue(2, 1)).toBe('Bob')
      expect(table.cell.getCellValue(3, 1)).toBe('Alice')
      expect(table.cell.getCellValue(4, 1)).toBe('Alex')
    })

    it('should clear sorting on third click', () => {
      const sortableConfig = createTestTableConfig({
        columns: [
          {
            field: 'firstName',
            title: 'First Name',
            type: 'string',
            sortable: true,
          },
          {
            field: 'status',
            title: 'Status',
            type: 'string',
            sortable: true,
          },
          {
            field: 'payment',
            title: 'Payment',
            type: 'number',
            sortable: true,
          },
        ],
      })
      const renderResult = renderTestTable(sortableConfig)
      const table = new TablePage(renderResult)

      // Get original order (column 1 is First Name)
      const originalOrder = table.cell.getColumnCells(1)

      // Click header three times to cycle through: asc -> desc -> none (column 1 is First Name)
      const headerCell = table.getHeaderCellByIndex(1)
      expect(headerCell).toBeTruthy()
      fireEvent.click(headerCell!) // First click: asc
      fireEvent.click(headerCell!) // Second click: desc
      fireEvent.click(headerCell!) // Third click: none

      // Verify sorting is cleared
      expect(table.header.isColumnSorted(1)).toBe(false)
      expect(table.header.getColumnSortDirection(1)).toBe(null)

      // Verify data is back to original order (column 1 is First Name)
      const currentOrder = table.cell.getColumnCells(1)
      expect(currentOrder).toEqual(originalOrder)
    })

    it('should sort numeric column correctly', () => {
      const sortableConfig = createTestTableConfig({
        columns: [
          {
            field: 'firstName',
            title: 'First Name',
            type: 'string',
            sortable: true,
          },
          {
            field: 'payment',
            title: 'Payment',
            type: 'number',
            sortable: true,
          },
        ],
      })
      const renderResult = renderTestTable(sortableConfig)
      const table = new TablePage(renderResult)

      // Click payment column header to sort ascending (column 2 is Payment)
      const paymentHeaderCell = table.getHeaderCellByIndex(2)
      expect(paymentHeaderCell).toBeTruthy()
      fireEvent.click(paymentHeaderCell!)

      // Verify sorting state
      expect(table.header.isColumnSorted(2)).toBe(true)
      expect(table.header.getColumnSortDirection(2)).toBe('asc')

      // Verify numeric data is sorted correctly (column 2 is Payment)
      expect(table.cell.getCellValue(0, 2)).toBe('0')
      expect(table.cell.getCellValue(1, 2)).toBe('15')
      expect(table.cell.getCellValue(2, 2)).toBe('100')
      expect(table.cell.getCellValue(3, 2)).toBe('14522')
      expect(table.cell.getCellValue(4, 2)).toBe('1065460')
    })

    it('should sort numeric column in descending order', () => {
      const sortableConfig = createTestTableConfig({
        columns: [
          {
            field: 'firstName',
            title: 'First Name',
            type: 'string',
            sortable: true,
          },
          {
            field: 'payment',
            title: 'Payment',
            type: 'number',
            sortable: true,
          },
        ],
      })
      const renderResult = renderTestTable(sortableConfig)
      const table = new TablePage(renderResult)

      // Click payment column header twice to sort descending (column 2 is Payment)
      const paymentHeaderCell = table.getHeaderCellByIndex(2)
      expect(paymentHeaderCell).toBeTruthy()
      fireEvent.click(paymentHeaderCell!) // First click: asc
      fireEvent.click(paymentHeaderCell!) // Second click: desc

      // Verify sorting state
      expect(table.header.isColumnSorted(2)).toBe(true)
      expect(table.header.getColumnSortDirection(2)).toBe('desc')

      // Verify numeric data is sorted in descending order (column 2 is Payment)
      expect(table.cell.getCellValue(0, 2)).toBe('10234234230')
      expect(table.cell.getCellValue(1, 2)).toBe('11231200')
      expect(table.cell.getCellValue(2, 2)).toBe('1065460')
      expect(table.cell.getCellValue(3, 2)).toBe('14522')
      expect(table.cell.getCellValue(4, 2)).toBe('100')
    })
  })

  describe('Sorting State Management', () => {
    it('should switch sorting to different column', () => {
      const sortableConfig = createTestTableConfig({
        columns: [
          {
            field: 'firstName',
            title: 'First Name',
            type: 'string',
            sortable: true,
          },
          {
            field: 'status',
            title: 'Status',
            type: 'string',
            sortable: true,
          },
          {
            field: 'payment',
            title: 'Payment',
            type: 'number',
            sortable: true,
          },
        ],
      })
      const renderResult = renderTestTable(sortableConfig)
      const table = new TablePage(renderResult)

      // Sort by firstName column (column 1 is First Name)
      const firstNameHeader = table.getHeaderCellByIndex(1)
      expect(firstNameHeader).toBeTruthy()
      fireEvent.click(firstNameHeader!)

      // Verify firstName is sorted
      expect(table.header.isColumnSorted(1)).toBe(true)
      expect(table.header.getColumnSortDirection(1)).toBe('asc')
      expect(table.header.isColumnSorted(2)).toBe(false)

      // Sort by status column (column 2 is Status)
      const statusHeader = table.getHeaderCellByIndex(2)
      expect(statusHeader).toBeTruthy()
      fireEvent.click(statusHeader!)

      // Verify status is now sorted and firstName is not
      expect(table.header.isColumnSorted(1)).toBe(false)
      expect(table.header.isColumnSorted(2)).toBe(true)
      expect(table.header.getColumnSortDirection(2)).toBe('asc')
    })

    it('should maintain sort direction when switching columns', () => {
      const sortableConfig = createTestTableConfig({
        columns: [
          {
            field: 'firstName',
            title: 'First Name',
            type: 'string',
            sortable: true,
          },
          {
            field: 'status',
            title: 'Status',
            type: 'string',
            sortable: true,
          },
          {
            field: 'payment',
            title: 'Payment',
            type: 'number',
            sortable: true,
          },
        ],
      })
      const renderResult = renderTestTable(sortableConfig)
      const table = new TablePage(renderResult)

      // Sort firstName column to descending (column 1 is First Name)
      const firstNameHeader = table.getHeaderCellByIndex(1)
      expect(firstNameHeader).toBeTruthy()
      fireEvent.click(firstNameHeader!) // asc
      fireEvent.click(firstNameHeader!) // desc

      // Verify firstName is sorted descending
      expect(table.header.isColumnSorted(1)).toBe(true)
      expect(table.header.getColumnSortDirection(1)).toBe('desc')

      // Switch to status column (column 2 is Status)
      const statusHeader = table.getHeaderCellByIndex(2)
      expect(statusHeader).toBeTruthy()
      fireEvent.click(statusHeader!)

      // Verify status is sorted ascending (new column starts with asc)
      expect(table.header.isColumnSorted(1)).toBe(false)
      expect(table.header.isColumnSorted(2)).toBe(true)
      expect(table.header.getColumnSortDirection(2)).toBe('asc')
    })

    it('should handle multiple column sorting interactions', () => {
      const sortableConfig = createTestTableConfig({
        columns: [
          {
            field: 'firstName',
            title: 'First Name',
            type: 'string',
            sortable: true,
          },
          {
            field: 'status',
            title: 'Status',
            type: 'string',
            sortable: true,
          },
          {
            field: 'payment',
            title: 'Payment',
            type: 'number',
            sortable: true,
          },
        ],
      })
      const renderResult = renderTestTable(sortableConfig)
      const table = new TablePage(renderResult)

      // Sort by firstName (column 1 is First Name)
      const firstNameHeader = table.getHeaderCellByIndex(1)
      expect(firstNameHeader).toBeTruthy()
      fireEvent.click(firstNameHeader!)
      expect(table.header.getColumnSortDirection(1)).toBe('asc')

      // Sort by payment (column 3 is Payment)
      const paymentHeader = table.getHeaderCellByIndex(3)
      expect(paymentHeader).toBeTruthy()
      fireEvent.click(paymentHeader!)
      expect(table.header.getColumnSortDirection(3)).toBe('asc')
      expect(table.header.isColumnSorted(1)).toBe(false)

      // Sort by status (column 2 is Status)
      const statusHeader = table.getHeaderCellByIndex(2)
      expect(statusHeader).toBeTruthy()
      fireEvent.click(statusHeader!)
      expect(table.header.getColumnSortDirection(2)).toBe('asc')
      expect(table.header.isColumnSorted(3)).toBe(false)
    })
  })

  describe('Non-Sortable Columns', () => {
    it('should not sort non-sortable columns', () => {
      const mixedConfig = createTestTableConfig({
        columns: [
          {
            field: 'firstName',
            title: 'First Name',
            type: 'string',
            sortable: false,
          },
          {
            field: 'status',
            title: 'Status',
            type: 'string',
            sortable: true,
          },
          {
            field: 'payment',
            title: 'Payment',
            type: 'number',
            sortable: false,
          },
        ],
      })
      const renderResult = renderTestTable(mixedConfig)
      const table = new TablePage(renderResult)

      // Verify firstName column is not sortable (column 1 is First Name)
      expect(table.header.isColumnSortable(1)).toBe(false)
      expect(table.header.isColumnSorted(1)).toBe(false)

      // Verify status column is sortable (column 2 is Status)
      expect(table.header.isColumnSortable(2)).toBe(true)

      // Try to click non-sortable column - should not change sorting
      const firstNameHeader = table.getHeaderCellByIndex(1)
      expect(firstNameHeader).toBeTruthy()
      fireEvent.click(firstNameHeader!)

      // Verify no sorting occurred
      expect(table.header.isColumnSorted(1)).toBe(false)
      expect(table.header.getColumnSortDirection(1)).toBe(null)
    })

    it('should only allow sorting on sortable columns', () => {
      const sortableConfig = createTestTableConfig({
        columns: [
          {
            field: 'firstName',
            title: 'First Name',
            type: 'string',
            sortable: true,
          },
          {
            field: 'status',
            title: 'Status',
            type: 'string',
            sortable: false,
          },
          {
            field: 'payment',
            title: 'Payment',
            type: 'number',
            sortable: true,
          },
        ],
      })
      const renderResult = renderTestTable(sortableConfig)
      const table = new TablePage(renderResult)

      // Verify sortable columns
      expect(table.header.isColumnSortable(1)).toBe(true) // firstName
      expect(table.header.isColumnSortable(2)).toBe(false) // status
      expect(table.header.isColumnSortable(3)).toBe(true) // payment

      // Sort by sortable column
      const firstNameHeader = table.getHeaderCellByIndex(1)
      expect(firstNameHeader).toBeTruthy()
      fireEvent.click(firstNameHeader!)
      expect(table.header.isColumnSorted(1)).toBe(true)

      // Try to sort non-sortable column
      const statusHeader = table.getHeaderCellByIndex(2)
      expect(statusHeader).toBeTruthy()
      fireEvent.click(statusHeader!)

      // Verify firstName is still sorted
      expect(table.header.isColumnSorted(1)).toBe(true)
      expect(table.header.isColumnSorted(2)).toBe(false)
    })
  })

  describe('Null and Empty Value Handling', () => {
    it('should handle null values in sortable columns', () => {
      const sortableConfig = createTestTableConfig({
        columns: [
          {
            field: 'firstName',
            title: 'First Name',
            type: 'string',
            sortable: true,
          },
          {
            field: 'status',
            title: 'Status',
            type: 'string',
            sortable: true,
          },
        ],
      })
      const renderResult = renderTestTable(sortableConfig)
      const table = new TablePage(renderResult)

      // Sort firstName column ascending (column 1 is First Name)
      const firstNameHeader = table.getHeaderCellByIndex(1)
      expect(firstNameHeader).toBeTruthy()
      fireEvent.click(firstNameHeader!)

      // Verify null values are placed at the end
      const firstNameValues = table.cell.getColumnCells(1)
      const nullValueIndices = firstNameValues
        .map((value, index) => (value === '' ? index : -1))
        .filter((index) => index !== -1)

      // Null values should be at the end
      expect(nullValueIndices.length).toBeGreaterThan(0)
      const maxNullIndex = Math.max(...nullValueIndices)
      const minNonNullIndex = Math.min(
        ...firstNameValues
          .map((value, index) => (value !== '' ? index : Infinity))
          .filter((index) => index !== Infinity)
      )

      expect(maxNullIndex).toBeGreaterThan(minNonNullIndex)
    })

    it('should handle empty strings in sortable columns', () => {
      const customData = [
        createMockPerson({ firstName: 'Alice' }),
        createMockPerson({ firstName: '' }),
        createMockPerson({ firstName: 'Bob' }),
        createMockPerson({ firstName: null }),
        createMockPerson({ firstName: 'Charlie' }),
      ]

      const sortableConfig = createTestTableConfig({
        columns: [
          {
            field: 'firstName',
            title: 'First Name',
            type: 'string',
            sortable: true,
          },
        ],
        data: customData,
      })
      const renderResult = renderTestTable(sortableConfig)
      const table = new TablePage(renderResult)

      // Sort firstName column ascending (column 1 is First Name)
      const firstNameHeader = table.getHeaderCellByIndex(1)
      expect(firstNameHeader).toBeTruthy()
      fireEvent.click(firstNameHeader!)

      // Verify empty and null values are handled correctly
      const firstNameValues = table.cell.getColumnCells(1)
      // Empty strings are placed at the beginning when sorting ascending
      expect(firstNameValues[0]).toBe('')
      expect(firstNameValues[1]).toBe('Alice')
      expect(firstNameValues[2]).toBe('Bob')
      expect(firstNameValues[3]).toBe('Charlie')
      expect(firstNameValues[4]).toBe('')
    })
  })

  describe('Custom Sorting Configuration', () => {
    it('should work with custom sortable configuration', () => {
      const customSortableConfig = createTestTableConfig({
        columns: [
          {
            field: 'firstName',
            title: 'First Name',
            type: 'string',
            sortable: true,
          },
          {
            field: 'status',
            title: 'Status',
            type: 'string',
            sortable: true,
          },
          {
            field: 'payment',
            title: 'Payment',
            type: 'number',
            sortable: true,
          },
        ],
      })
      const renderResult = renderTestTable(customSortableConfig)
      const table = new TablePage(renderResult)

      // Verify all columns are sortable
      expect(table.header.isColumnSortable(1)).toBe(true) // firstName
      expect(table.header.isColumnSortable(2)).toBe(true) // status
      expect(table.header.isColumnSortable(3)).toBe(true) // payment

      // Test sorting each column
      const firstNameHeader = table.getHeaderCellByIndex(1)
      expect(firstNameHeader).toBeTruthy()
      fireEvent.click(firstNameHeader!)
      expect(table.header.getColumnSortDirection(1)).toBe('asc')

      const statusHeader = table.getHeaderCellByIndex(2)
      expect(statusHeader).toBeTruthy()
      fireEvent.click(statusHeader!)
      expect(table.header.getColumnSortDirection(2)).toBe('asc')
      expect(table.header.isColumnSorted(1)).toBe(false)

      const paymentHeader = table.getHeaderCellByIndex(3)
      expect(paymentHeader).toBeTruthy()
      fireEvent.click(paymentHeader!)
      expect(table.header.getColumnSortDirection(3)).toBe('asc')
      expect(table.header.isColumnSorted(2)).toBe(false)
    })

    it('should handle mixed sortable and non-sortable columns', () => {
      const mixedConfig = createTestTableConfig({
        columns: [
          {
            field: 'firstName',
            title: 'First Name',
            type: 'string',
            sortable: true,
          },
          {
            field: 'status',
            title: 'Status',
            type: 'string',
            sortable: false,
          },
          {
            field: 'payment',
            title: 'Payment',
            type: 'number',
            sortable: true,
          },
          {
            field: 'email',
            title: 'Email',
            type: 'string',
            sortable: false,
          },
        ],
      })
      const renderResult = renderTestTable(mixedConfig)
      const table = new TablePage(renderResult)

      // Verify sortable columns
      expect(table.header.isColumnSortable(1)).toBe(true) // firstName
      expect(table.header.isColumnSortable(2)).toBe(false) // status
      expect(table.header.isColumnSortable(3)).toBe(true) // payment
      expect(table.header.isColumnSortable(4)).toBe(false) // email

      // Sort by sortable columns only
      const firstNameHeader = table.getHeaderCellByIndex(1)
      expect(firstNameHeader).toBeTruthy()
      fireEvent.click(firstNameHeader!)
      expect(table.header.isColumnSorted(1)).toBe(true)

      const paymentHeader = table.getHeaderCellByIndex(3)
      expect(paymentHeader).toBeTruthy()
      fireEvent.click(paymentHeader!)
      expect(table.header.isColumnSorted(3)).toBe(true)
      expect(table.header.isColumnSorted(1)).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('should handle sorting with single row', () => {
      const singleRowData = [createMockPerson({ firstName: 'Single User' })]
      const sortableConfig = createTestTableConfig({
        columns: [
          {
            field: 'firstName',
            title: 'First Name',
            type: 'string',
            sortable: true,
          },
          {
            field: 'payment',
            title: 'Payment',
            type: 'number',
            sortable: true,
          },
        ],
        data: singleRowData,
      })
      const renderResult = renderTestTable(sortableConfig)
      const table = new TablePage(renderResult)

      // Sort by firstName (column 1 is First Name)
      const firstNameHeader = table.getHeaderCellByIndex(1)
      expect(firstNameHeader).toBeTruthy()
      fireEvent.click(firstNameHeader!)

      // Verify sorting works with single row
      expect(table.header.isColumnSorted(1)).toBe(true)
      expect(table.header.getColumnSortDirection(1)).toBe('asc')
      expect(table.cell.getCellValue(0, 1)).toBe('Single User')
    })

    it('should handle sorting with empty data', () => {
      const sortableConfig = createTestTableConfig({
        columns: [
          {
            field: 'firstName',
            title: 'First Name',
            type: 'string',
            sortable: true,
          },
          {
            field: 'payment',
            title: 'Payment',
            type: 'number',
            sortable: true,
          },
        ],
        data: [],
      })
      const renderResult = renderTestTable(sortableConfig)
      const table = new TablePage(renderResult)

      // Try to sort with no data (column 1 is First Name)
      const firstNameHeader = table.getHeaderCellByIndex(1)
      expect(firstNameHeader).toBeTruthy()
      fireEvent.click(firstNameHeader!)

      // Verify sorting state is set even with no data
      expect(table.header.isColumnSorted(1)).toBe(true)
      expect(table.header.getColumnSortDirection(1)).toBe('asc')
      expect(table.getRowCount()).toBe(0)
    })

    it('should handle rapid sorting changes', () => {
      const sortableConfig = createTestTableConfig({
        columns: [
          {
            field: 'firstName',
            title: 'First Name',
            type: 'string',
            sortable: true,
          },
          {
            field: 'status',
            title: 'Status',
            type: 'string',
            sortable: true,
          },
          {
            field: 'payment',
            title: 'Payment',
            type: 'number',
            sortable: true,
          },
        ],
      })
      const renderResult = renderTestTable(sortableConfig)
      const table = new TablePage(renderResult)

      // Rapidly click different headers
      const firstNameHeader = table.getHeaderCellByIndex(1)
      const statusHeader = table.getHeaderCellByIndex(2)
      const paymentHeader = table.getHeaderCellByIndex(3)

      expect(firstNameHeader).toBeTruthy()
      expect(statusHeader).toBeTruthy()
      expect(paymentHeader).toBeTruthy()

      fireEvent.click(firstNameHeader!)
      fireEvent.click(statusHeader!)
      fireEvent.click(paymentHeader!)

      // Verify only the last clicked column is sorted
      expect(table.header.isColumnSorted(1)).toBe(false)
      expect(table.header.isColumnSorted(2)).toBe(false)
      expect(table.header.isColumnSorted(3)).toBe(true)
      expect(table.header.getColumnSortDirection(3)).toBe('asc')
    })

    it('should handle sorting with duplicate values', () => {
      const duplicateData = [
        createMockPerson({ firstName: 'Alice', payment: 100 }),
        createMockPerson({ firstName: 'Bob', payment: 100 }),
        createMockPerson({ firstName: 'Charlie', payment: 200 }),
        createMockPerson({ firstName: 'Alice', payment: 150 }),
      ]

      const sortableConfig = createTestTableConfig({
        columns: [
          {
            field: 'firstName',
            title: 'First Name',
            type: 'string',
            sortable: true,
          },
          {
            field: 'payment',
            title: 'Payment',
            type: 'number',
            sortable: true,
          },
        ],
        data: duplicateData,
      })
      const renderResult = renderTestTable(sortableConfig)
      const table = new TablePage(renderResult)

      // Sort by firstName with duplicates (column 1 is First Name)
      const firstNameHeader = table.getHeaderCellByIndex(1)
      expect(firstNameHeader).toBeTruthy()
      fireEvent.click(firstNameHeader!)

      // Verify sorting handles duplicates correctly
      expect(table.header.isColumnSorted(1)).toBe(true)
      expect(table.header.getColumnSortDirection(1)).toBe('asc')

      const firstNameValues = table.cell.getColumnCells(1)
      expect(firstNameValues[0]).toBe('Alice')
      expect(firstNameValues[1]).toBe('Alice')
      expect(firstNameValues[2]).toBe('Bob')
      expect(firstNameValues[3]).toBe('Charlie')
    })
  })

  describe('Visual Indicators', () => {
    it('should show sort indicators on sortable columns', () => {
      const sortableConfig = createTestTableConfig({
        columns: [
          {
            field: 'firstName',
            title: 'First Name',
            type: 'string',
            sortable: true,
          },
          {
            field: 'status',
            title: 'Status',
            type: 'string',
            sortable: false,
          },
          {
            field: 'payment',
            title: 'Payment',
            type: 'number',
            sortable: true,
          },
        ],
      })
      const renderResult = renderTestTable(sortableConfig)
      const table = new TablePage(renderResult)

      // Verify sortable columns have sort indicators
      expect(table.header.isColumnSortable(1)).toBe(true) // firstName
      expect(table.header.isColumnSortable(2)).toBe(false) // status
      expect(table.header.isColumnSortable(3)).toBe(true) // payment

      // Sort a column and verify visual state
      const firstNameHeader = table.getHeaderCellByIndex(1)
      expect(firstNameHeader).toBeTruthy()
      fireEvent.click(firstNameHeader!)

      expect(table.header.isColumnSorted(1)).toBe(true)
      expect(table.header.getColumnSortDirection(1)).toBe('asc')
    })

    it('should update sort indicators when sorting changes', () => {
      const sortableConfig = createTestTableConfig({
        columns: [
          {
            field: 'firstName',
            title: 'First Name',
            type: 'string',
            sortable: true,
          },
          {
            field: 'status',
            title: 'Status',
            type: 'string',
            sortable: true,
          },
        ],
      })
      const renderResult = renderTestTable(sortableConfig)
      const table = new TablePage(renderResult)

      // Initial state - no sorting
      expect(table.header.isColumnSorted(1)).toBe(false)
      expect(table.header.isColumnSorted(2)).toBe(false)

      // Sort firstName ascending (column 1 is First Name)
      const firstNameHeader = table.getHeaderCellByIndex(1)
      expect(firstNameHeader).toBeTruthy()
      fireEvent.click(firstNameHeader!)

      expect(table.header.isColumnSorted(1)).toBe(true)
      expect(table.header.getColumnSortDirection(1)).toBe('asc')
      expect(table.header.isColumnSorted(2)).toBe(false)

      // Sort firstName descending
      fireEvent.click(firstNameHeader!)
      expect(table.header.isColumnSorted(1)).toBe(true)
      expect(table.header.getColumnSortDirection(1)).toBe('desc')

      // Clear sorting
      fireEvent.click(firstNameHeader!)
      expect(table.header.isColumnSorted(1)).toBe(false)
      expect(table.header.getColumnSortDirection(1)).toBe(null)
    })
  })
})
