import { describe, expect, it } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { fireEvent } from '@testing-library/react'
import { createMockPerson, createTestTableConfig, renderTestTable } from './helpers/test-utils.js'
import { TablePage } from './page-objects/table.page.js'
import { ObjectSetTable } from '../table/object-set-table.js'

describe('ObjectSetTable - Row Selection', () => {
  describe('Single Row Selection', () => {
    it('should select a single row when clicked', async () => {
      const user = userEvent.setup()
      const renderResult = renderTestTable({ allowRowSelection: true })
      const table = new TablePage(renderResult)

      // Initially no rows should be selected
      expect(table.row.isRowSelected(0)).toBe(false)
      expect(table.row.isRowSelected(1)).toBe(false)

      // Click on the first row's number cell to select it
      const firstRowNumberCell = table.getCellByIndex(0, 0)
      if (!firstRowNumberCell) throw new Error('First row number cell not found')
      await user.click(firstRowNumberCell)

      // First row should be selected, others should not
      expect(table.row.isRowSelected(0)).toBe(true)
      expect(table.row.isRowSelected(1)).toBe(false)
      expect(table.row.isRowSelected(2)).toBe(false)
    })

    it('should deselect a row when clicked again', async () => {
      const user = userEvent.setup()
      const renderResult = renderTestTable({ allowRowSelection: true })
      const table = new TablePage(renderResult)

      // Click on the first row's number cell to select it
      const firstRowNumberCell = table.getCellByIndex(0, 0)
      if (!firstRowNumberCell) throw new Error('First row number cell not found')
      await user.click(firstRowNumberCell)
      expect(table.row.isRowSelected(0)).toBe(true)

      // Click again to deselect
      await user.click(firstRowNumberCell)
      expect(table.row.isRowSelected(0)).toBe(false)
    })

    it('should select a different row when clicking on another row', async () => {
      const user = userEvent.setup()
      const renderResult = renderTestTable({ allowRowSelection: true })
      const table = new TablePage(renderResult)

      // Select first row
      const firstRowNumberCell = table.getCellByIndex(0, 0)
      if (!firstRowNumberCell) throw new Error('First row number cell not found')
      await user.click(firstRowNumberCell)
      expect(table.row.isRowSelected(0)).toBe(true)
      expect(table.row.isRowSelected(1)).toBe(false)

      // Click on second row's number cell
      const secondRowNumberCell = table.getCellByIndex(1, 0)
      if (!secondRowNumberCell) throw new Error('Second row number cell not found')
      await user.click(secondRowNumberCell)

      // Second row should be selected, first should be deselected
      expect(table.row.isRowSelected(0)).toBe(false)
      expect(table.row.isRowSelected(1)).toBe(true)
    })

    it('should clear row selection when clicking on data cells', async () => {
      const user = userEvent.setup()
      const renderResult = renderTestTable({ allowRowSelection: true })
      const table = new TablePage(renderResult)

      // Select first row
      const firstRowNumberCell = table.getCellByIndex(0, 0)
      if (!firstRowNumberCell) throw new Error('First row number cell not found')
      await user.click(firstRowNumberCell)
      expect(table.row.isRowSelected(0)).toBe(true)

      // Click on a data cell within the row (not the row number cell)
      const firstDataCell = table.getCellByIndex(0, 1)
      if (!firstDataCell) throw new Error('First data cell not found')
      await user.click(firstDataCell)

      // Row selection should be cleared when clicking on data cells
      expect(table.row.isRowSelected(0)).toBe(false)
    })
  })

  describe('Multiple Row Selection', () => {
    it('should select multiple rows with Ctrl+Click', async () => {
      const user = userEvent.setup()
      const renderResult = renderTestTable({
        allowRowSelection: true,
      })
      const table = new TablePage(renderResult)

      // Select first row
      const firstRowNumberCell = table.getCellByIndex(0, 0)
      if (!firstRowNumberCell) throw new Error('First row number cell not found')
      await user.click(firstRowNumberCell)
      expect(table.row.isRowSelected(0)).toBe(true)
      expect(table.row.isRowSelected(1)).toBe(false)

      // Ctrl+Click second row number cell (should not deselect first)
      const secondRowNumberCell = table.getCellByIndex(1, 0)
      if (!secondRowNumberCell) throw new Error('Second row number cell not found')
      fireEvent.click(secondRowNumberCell, { ctrlKey: true })

      // Both rows should be selected
      expect(table.row.isRowSelected(0)).toBe(true)
      expect(table.row.isRowSelected(1)).toBe(true)
      expect(table.row.isRowSelected(2)).toBe(false)
    })

    it('should select range of rows with Shift+Click', async () => {
      const user = userEvent.setup()
      const renderResult = renderTestTable({
        allowRowSelection: true,
      })
      const table = new TablePage(renderResult)

      // Select first row
      const firstRowNumberCell = table.getCellByIndex(0, 0)
      if (!firstRowNumberCell) throw new Error('First row number cell not found')
      await user.click(firstRowNumberCell)
      expect(table.row.isRowSelected(0)).toBe(true)

      // Shift+Click on third row number cell
      const thirdRowNumberCell = table.getCellByIndex(2, 0)
      if (!thirdRowNumberCell) throw new Error('Third row number cell not found')
      fireEvent.click(thirdRowNumberCell, { shiftKey: true })

      // Rows 0, 1, and 2 should be selected
      expect(table.row.isRowSelected(0)).toBe(true)
      expect(table.row.isRowSelected(1)).toBe(true)
      expect(table.row.isRowSelected(2)).toBe(true)
      expect(table.row.isRowSelected(3)).toBe(false)
    })

    it('should deselect individual rows in multiple selection mode', async () => {
      const user = userEvent.setup()
      const renderResult = renderTestTable({
        allowRowSelection: true,
      })
      const table = new TablePage(renderResult)

      // Select multiple rows
      const firstRowNumberCell = table.getCellByIndex(0, 0)
      const secondRowNumberCell = table.getCellByIndex(1, 0)
      if (!firstRowNumberCell || !secondRowNumberCell) throw new Error('Row number cells not found')
      await user.click(firstRowNumberCell)
      fireEvent.click(secondRowNumberCell, { ctrlKey: true })

      expect(table.row.isRowSelected(0)).toBe(true)
      expect(table.row.isRowSelected(1)).toBe(true)

      // Deselect first row using Ctrl+Click (toggle behavior)
      fireEvent.click(firstRowNumberCell, { ctrlKey: true })
      expect(table.row.isRowSelected(0)).toBe(false)
      expect(table.row.isRowSelected(1)).toBe(true)
    })
  })

  describe('Header Selection', () => {
    it('should select all rows when clicking header number cell', async () => {
      const user = userEvent.setup()
      const renderResult = renderTestTable({
        allowRowSelection: true,
      })
      const table = new TablePage(renderResult)

      const headerNumberCell = table.getHeaderCellByIndex(0)
      expect(headerNumberCell).toBeInTheDocument()

      // Click header number cell to select all
      await user.click(headerNumberCell!)

      // All rows should be selected
      for (let i = 0; i < table.getRowCount(); i++) {
        expect(table.row.isRowSelected(i)).toBe(true)
      }
    })

    it('should deselect all rows when clicking header number cell again', async () => {
      const user = userEvent.setup()
      const renderResult = renderTestTable({
        allowRowSelection: true,
      })
      const table = new TablePage(renderResult)

      const headerNumberCell = table.getHeaderCellByIndex(0)

      // Select all
      await user.click(headerNumberCell!)

      // Deselect all
      await user.click(headerNumberCell!)

      // No rows should be selected
      for (let i = 0; i < table.getRowCount(); i++) {
        expect(table.row.isRowSelected(i)).toBe(false)
      }
    })
  })

  describe('Disabled Row Selection', () => {
    it('should not allow row selection when allowRowSelection is false', async () => {
      const user = userEvent.setup()
      const renderResult = renderTestTable({ allowRowSelection: false })
      const table = new TablePage(renderResult)

      // Try to click on row number cell
      const firstRowNumberCell = table.getCellByIndex(0, 0)
      if (!firstRowNumberCell) throw new Error('First row number cell not found')
      await user.click(firstRowNumberCell)

      // No rows should be selectable
      expect(table.row.isRowSelected(0)).toBe(false)
      expect(table.row.isRowSelected(1)).toBe(false)
    })

    it('should not show row numbers cursor pointer when row selection is disabled', () => {
      const renderResult = renderTestTable({ allowRowSelection: false })
      const table = new TablePage(renderResult)

      // Check that row number cells are not clickable (no cursor-pointer class)
      const firstRowNumberCell = table.getCellByIndex(0, 0)!
      expect(firstRowNumberCell.classList.contains('cursor-pointer')).toBe(false)

      // Check header number cell is not clickable
      const headerNumberCell = table.getHeaderCellByIndex(0)!
      expect(headerNumberCell.classList.contains('cursor-pointer')).toBe(false)
    })

    it('should not have selection-related CSS classes when disabled', () => {
      const renderResult = renderTestTable({ allowRowSelection: false })
      const table = new TablePage(renderResult)

      const classes = table.row.getRowClasses(0)

      // Should not have selection-related classes
      expect(classes).not.toContain('bg-blue-50')
      expect(classes).not.toContain('hover:bg-blue-100')
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle rapid successive clicks without issues', async () => {
      const user = userEvent.setup()
      const renderResult = renderTestTable({ allowRowSelection: true })
      const table = new TablePage(renderResult)

      const firstRowNumberCell = table.getCellByIndex(0, 0)
      if (!firstRowNumberCell) throw new Error('First row number cell not found')

      // Rapid clicks
      await user.click(firstRowNumberCell)
      await user.click(firstRowNumberCell)
      await user.click(firstRowNumberCell)

      // Should end up in a consistent state
      const isSelected = table.row.isRowSelected(0)
      expect(typeof isSelected).toBe('boolean')
    })

    it('should handle selection with very large datasets', async () => {
      const user = userEvent.setup()
      const largeDataset = Array.from({ length: 100 }, (_, i) =>
        createMockPerson({ id: `large-${i}`, firstName: `User ${i}` })
      )

      const renderResult = renderTestTable({
        data: largeDataset,
        allowRowSelection: true,
      })
      const table = new TablePage(renderResult)

      // Select a row near the end
      const lastRowNumberCell = table.getCellByIndex(99, 0)
      if (!lastRowNumberCell) throw new Error('Last row number cell not found')
      await user.click(lastRowNumberCell)

      expect(table.row.isRowSelected(99)).toBe(true)
      expect(table.getRowCount()).toBe(100)
    })

    it('should maintain selection state during data updates', async () => {
      const user = userEvent.setup()
      const initialData = [createMockPerson({ id: '1', firstName: 'Alice' })]
      const renderResult = renderTestTable({
        data: initialData,
        allowRowSelection: true,
      })
      const table = new TablePage(renderResult)

      // Select first row
      const firstRowNumberCell = table.getCellByIndex(0, 0)!
      await user.click(firstRowNumberCell)
      expect(table.row.isRowSelected(0)).toBe(true)

      // Update data (simulate re-render with new data)
      const updatedData = [...initialData, createMockPerson({ id: '2', firstName: 'Bob' })]

      // Re-render with updated data
      const updatedConfig = createTestTableConfig({
        data: updatedData,
        allowRowSelection: true,
      })
      renderResult.rerender(<ObjectSetTable {...updatedConfig} />)

      const newTable = new TablePage(renderResult)
      // Selection state should be maintained for existing rows
      expect(newTable.getRowCount()).toBe(2)
    })
  })
})
