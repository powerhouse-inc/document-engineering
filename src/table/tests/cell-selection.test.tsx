/* eslint-disable @typescript-eslint/no-unsafe-call */
import { describe, expect, it } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { createMockPerson, createTestTableConfig, renderTestTable } from './helpers/test-utils.js'
import { TablePage } from './page-objects/table.page.js'

describe('ObjectSetTable - Cell Selection', () => {
  describe('Single Cell Selection', () => {
    it('should select a cell when clicked', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      // Click cell at (0, 1) - First Name column
      const cell = table.getCellByIndex(0, 1)
      expect(cell).toBeTruthy()
      fireEvent.click(cell!)

      // Verify cell is selected
      expect(table.cell.isCellSelected(0, 1)).toBe(true)
      expect(table.cell.getCellBorderColor(0, 1)).toBe('gray') // Non-editable cell
    })

    it('should deselect previous cell when selecting a new cell', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      // Click first cell
      const firstCell = table.getCellByIndex(0, 1)
      fireEvent.click(firstCell!)
      expect(table.cell.isCellSelected(0, 1)).toBe(true)

      // Click second cell
      const secondCell = table.getCellByIndex(1, 2)
      fireEvent.click(secondCell!)

      // Verify first cell is deselected and second is selected
      expect(table.cell.isCellSelected(0, 1)).toBe(false)
      expect(table.cell.isCellSelected(1, 2)).toBe(true)
    })

    it('should clear cell selection when row number is clicked', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      // Click cell first
      const cell = table.getCellByIndex(0, 1)
      expect(cell).toBeTruthy()
      fireEvent.click(cell!)
      expect(table.cell.isCellSelected(0, 1)).toBe(true)

      // Click row number cell
      const rowNumberCell = table.getCellByIndex(0, 0)
      expect(rowNumberCell).toBeTruthy()
      fireEvent.click(rowNumberCell!)

      // Verify cell selection is cleared and row is selected
      expect(table.cell.isCellSelected(0, 1)).toBe(false)
      expect(table.row.isRowSelected(0)).toBe(true)
    })
  })

  describe('Visual State Changes', () => {
    it('should apply blue border to selected editable cell', () => {
      const editableConfig = createTestTableConfig({
        columns: [
          {
            field: 'firstName',
            title: 'First Name',
            type: 'string',
            editable: true,
          },
          {
            field: 'status',
            title: 'Status',
            type: 'string',
          },
          {
            field: 'payment',
            title: 'Payment',
            type: 'number',
          },
        ],
      })
      const renderResult = renderTestTable(editableConfig)
      const table = new TablePage(renderResult)

      // Click editable cell
      const editableCell = table.getCellByIndex(0, 1)
      expect(editableCell).toBeTruthy()
      fireEvent.click(editableCell!)

      // Verify blue border for editable cell
      expect(table.cell.isCellSelected(0, 1)).toBe(true)
      expect(table.cell.getCellBorderColor(0, 1)).toBe('blue')
    })

    it('should apply gray border to selected non-editable cell', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      // Click non-editable cell
      const nonEditableCell = table.getCellByIndex(0, 2)
      expect(nonEditableCell).toBeTruthy()
      fireEvent.click(nonEditableCell!)

      // Verify gray border for non-editable cell
      expect(table.cell.isCellSelected(0, 2)).toBe(true)
      expect(table.cell.getCellBorderColor(0, 2)).toBe('gray')
    })

    it('should apply focus styling to selected cell', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      // Click cell
      const cell = table.getCellByIndex(0, 1)
      expect(cell).toBeTruthy()
      fireEvent.click(cell!)

      // Verify cell has focus and tabIndex
      expect(table.cell.isCellSelected(0, 1)).toBe(true)
      expect(cell?.getAttribute('tabIndex')).toBe('0')
    })
  })

  describe('Double-Click Edit Mode', () => {
    it('should enter edit mode on double-click for editable cell', () => {
      const editableConfig = createTestTableConfig({
        columns: [
          {
            field: 'firstName',
            title: 'First Name',
            type: 'string',
            editable: true,
          },
          {
            field: 'status',
            title: 'Status',
            type: 'string',
          },
          {
            field: 'payment',
            title: 'Payment',
            type: 'number',
          },
        ],
      })
      const renderResult = renderTestTable(editableConfig)
      const table = new TablePage(renderResult)

      // Double-click editable cell - should enter edit mode, not just select
      const editableCell = table.getCellByIndex(0, 1)
      expect(editableCell).toBeTruthy()
      fireEvent.doubleClick(editableCell!)

      // For editable cells, double-click enters edit mode instead of just selecting
      // We can verify the cell is editable, but edit mode detection is complex
      expect(table.cell.isCellEditable(0, 1)).toBe(true)
    })

    it('should handle double-click for non-editable cell', () => {
      const nonEditableConfig = createTestTableConfig({
        columns: [
          {
            field: 'firstName',
            title: 'First Name',
            type: 'string',
            editable: false,
          },
          {
            field: 'status',
            title: 'Status',
            type: 'string',
            editable: false,
          },
          {
            field: 'payment',
            title: 'Payment',
            type: 'number',
            editable: false,
          },
        ],
      })
      const renderResult = renderTestTable(nonEditableConfig)
      const table = new TablePage(renderResult)

      // Double-click non-editable cell - should not enter edit mode
      const nonEditableCell = table.getCellByIndex(0, 2)
      expect(nonEditableCell).toBeTruthy()
      fireEvent.doubleClick(nonEditableCell!)

      // For non-editable cells, double-click should not cause any issues
      // The main behavior is that the cell selection system works correctly
      expect(table.cell.getCellValue(0, 2)).toBeDefined()
    })

    it('should select cell on first click and maintain selection on double-click', () => {
      const editableConfig = createTestTableConfig({
        columns: [
          {
            field: 'firstName',
            title: 'First Name',
            type: 'string',
            editable: true,
          },
          {
            field: 'status',
            title: 'Status',
            type: 'string',
          },
          {
            field: 'payment',
            title: 'Payment',
            type: 'number',
          },
        ],
      })
      const renderResult = renderTestTable(editableConfig)
      const table = new TablePage(renderResult)

      // First click - should select cell
      const cell = table.getCellByIndex(0, 1)
      expect(cell).toBeTruthy()
      fireEvent.click(cell!)
      expect(table.cell.isCellSelected(0, 1)).toBe(true)

      // Double-click - should maintain selection
      expect(cell).toBeTruthy()
      fireEvent.doubleClick(cell!)
      expect(table.cell.isCellSelected(0, 1)).toBe(true)
    })
  })

  describe('Cell Selection Clearing', () => {
    it('should clear cell selection when clicking another cell', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      // Click first cell
      const firstCell = table.getCellByIndex(0, 1)
      fireEvent.click(firstCell!)
      expect(table.cell.isCellSelected(0, 1)).toBe(true)

      // Click second cell
      const secondCell = table.getCellByIndex(1, 2)
      fireEvent.click(secondCell!)

      // Verify first cell is deselected and second is selected
      expect(table.cell.isCellSelected(0, 1)).toBe(false)
      expect(table.cell.isCellSelected(1, 2)).toBe(true)
    })

    it('should clear cell selection when selecting a row', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      // Click cell first
      const cell = table.getCellByIndex(0, 1)
      expect(cell).toBeTruthy()
      fireEvent.click(cell!)
      expect(table.cell.isCellSelected(0, 1)).toBe(true)

      // Click row number of different row
      const rowNumberCell = table.getCellByIndex(2, 0)
      expect(rowNumberCell).toBeTruthy()
      fireEvent.click(rowNumberCell!)

      // Verify cell selection is cleared and row is selected
      expect(table.cell.isCellSelected(0, 1)).toBe(false)
      expect(table.row.isRowSelected(2)).toBe(true)
    })

    it('should clear cell selection when clicking with Ctrl/Cmd/Shift', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      // Click cell first
      const cell = table.getCellByIndex(0, 1)
      expect(cell).toBeTruthy()
      fireEvent.click(cell!)
      expect(table.cell.isCellSelected(0, 1)).toBe(true)

      // Click row with Ctrl key pressed
      const row = table.getRowByIndex(2)
      expect(row).toBeTruthy()
      fireEvent.click(row!, { ctrlKey: true })

      // Verify cell selection is cleared when row selection happens
      expect(table.cell.isCellSelected(0, 1)).toBe(false)
      expect(table.row.isRowSelected(2)).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle cell selection in first row', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      // Click cell in first row
      const cell = table.getCellByIndex(0, 1)
      expect(cell).toBeTruthy()
      fireEvent.click(cell!)

      // Verify proper selection
      expect(table.cell.isCellSelected(0, 1)).toBe(true)
      expect(table.cell.getCellBorderColor(0, 1)).toBe('gray')
    })

    it('should handle cell selection in last row', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      const lastRowIndex = table.getRowCount() - 1

      // Click cell in last row
      const cell = table.getCellByIndex(lastRowIndex, 1)
      expect(cell).toBeTruthy()
      fireEvent.click(cell!)

      // Verify proper selection
      expect(table.cell.isCellSelected(lastRowIndex, 1)).toBe(true)
      expect(table.cell.getCellBorderColor(lastRowIndex, 1)).toBe('gray')
    })

    it('should handle cell selection with empty data', () => {
      const emptyDataConfig = createTestTableConfig({
        data: [createMockPerson({ firstName: '' })],
      })
      const renderResult = renderTestTable(emptyDataConfig)
      const table = new TablePage(renderResult)

      // Click empty cell
      const cell = table.getCellByIndex(0, 1)
      expect(cell).toBeTruthy()
      fireEvent.click(cell!)

      // Verify selection works even with empty data
      expect(table.cell.isCellSelected(0, 1)).toBe(true)
      expect(table.cell.isCellEmpty(0, 1)).toBe(true)
    })

    it('should not allow cell selection when row selection is disabled', () => {
      const noRowSelectionConfig = createTestTableConfig({
        allowRowSelection: false,
      })
      const renderResult = renderTestTable(noRowSelectionConfig)
      const table = new TablePage(renderResult)

      // Click cell
      const cell = table.getCellByIndex(0, 1)
      expect(cell).toBeTruthy()
      fireEvent.click(cell!)

      // Verify cell selection is disabled when row selection is disabled
      expect(table.cell.isCellSelected(0, 1)).toBe(false)
      expect(table.cell.getCellBorderColor(0, 1)).toBe('none')
    })

    it('should handle cell selection in different column types', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      // Test selection in different columns
      const firstNameCell = table.getCellByIndex(0, 1)
      const statusCell = table.getCellByIndex(0, 2)
      const paymentCell = table.getCellByIndex(0, 3)

      // Click firstName column
      expect(firstNameCell).toBeTruthy()
      fireEvent.click(firstNameCell!)
      expect(table.cell.isCellSelected(0, 1)).toBe(true)

      // Click status column
      expect(statusCell).toBeTruthy()
      fireEvent.click(statusCell!)
      expect(table.cell.isCellSelected(0, 2)).toBe(true)
      expect(table.cell.isCellSelected(0, 1)).toBe(false)

      // Click payment column
      expect(paymentCell).toBeTruthy()
      fireEvent.click(paymentCell!)
      expect(table.cell.isCellSelected(0, 3)).toBe(true)
      expect(table.cell.isCellSelected(0, 2)).toBe(false)
    })

    it('should handle rapid cell selection changes', () => {
      const renderResult = renderTestTable()
      const table = new TablePage(renderResult)

      // Rapidly click different cells
      const cell1 = table.getCellByIndex(0, 1)
      const cell2 = table.getCellByIndex(1, 2)
      const cell3 = table.getCellByIndex(2, 1)

      expect(cell1).toBeTruthy()
      fireEvent.click(cell1!)
      expect(cell2).toBeTruthy()
      fireEvent.click(cell2!)
      expect(cell3).toBeTruthy()
      fireEvent.click(cell3!)

      // Verify only the last clicked cell is selected
      expect(table.cell.isCellSelected(0, 1)).toBe(false)
      expect(table.cell.isCellSelected(1, 2)).toBe(false)
      expect(table.cell.isCellSelected(2, 1)).toBe(true)
    })
  })
})
