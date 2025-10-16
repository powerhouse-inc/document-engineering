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
    return (firstCell.textContent || '').trim()
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
    return rows.findIndex((row) => (row.textContent || '').includes(text))
  }

  /**
   * Checks if a row contains specific text
   */
  rowContains(rowIndex: number, text: string): boolean {
    const row = this.getRowByIndex(rowIndex)
    if (!row) return false

    return (row.textContent || '').includes(text)
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

  /**
   * Gets all action buttons in a row (from the portal)
   */
  getRowActionButtons(_rowIndex: number): HTMLElement[] {
    // Actions are rendered in a portal, so we need to look in the document body
    const actionContainers = document.querySelectorAll('.fixed.z-5')
    const buttons: HTMLElement[] = []

    actionContainers.forEach((container) => {
      const actionButtons = container.querySelectorAll('.cursor-pointer')
      buttons.push(...(Array.from(actionButtons) as HTMLElement[]))
    })

    return buttons
  }

  /**
   * Gets the primary action button for a row
   */
  getPrimaryActionButton(_rowIndex: number): HTMLElement | null {
    // Look for the cursor-pointer element that is NOT a dropdown trigger
    const portalElements = document.querySelectorAll('.fixed.z-5')
    for (const portal of portalElements) {
      // Only look in visible portals (the one that's currently hovered)
      if (portal.classList.contains('hidden')) {
        continue
      }

      const buttons = portal.querySelectorAll('.cursor-pointer')
      for (const button of buttons) {
        // Skip dropdown trigger buttons - look for the one that's not the dropdown trigger
        if (
          button.getAttribute('data-slot') === 'dropdown-menu-trigger' ||
          button.getAttribute('aria-haspopup') === 'menu'
        ) {
          continue
        }
        // This should be the primary action button
        return button as HTMLElement
      }
    }
    return null
  }

  /**
   * Gets the secondary actions dropdown trigger button
   */
  getSecondaryActionsButton(_rowIndex: number): HTMLElement | null {
    // Look for the cursor-pointer element that has a dropdown trigger or vertical dots icon
    const portalElements = document.querySelectorAll('.fixed.z-5')
    for (const portal of portalElements) {
      // Only look in visible portals (the one that's currently hovered)
      if (portal.classList.contains('hidden')) {
        continue
      }

      const buttons = portal.querySelectorAll('.cursor-pointer')
      for (const button of buttons) {
        // Check if this button has dropdown attributes or vertical dots icon
        if (
          button.getAttribute('data-slot') === 'dropdown-menu-trigger' ||
          button.getAttribute('aria-haspopup') === 'menu'
        ) {
          return button as HTMLElement
        }
      }
    }
    return null
  }

  /**
   * Checks if row actions are visible (in the DOM)
   */
  isRowActionsVisible(_rowIndex: number): boolean {
    // Actions are rendered in portals, so we need to check if any portal elements exist
    // For now, we'll check if any portal elements exist since we can't easily distinguish between rows
    const portalElements = document.querySelectorAll('.fixed.z-5')
    return portalElements.length > 0
  }

  /**
   * Clicks the primary action button for a row
   */
  clickPrimaryAction(rowIndex: number): void {
    const primaryButton = this.getPrimaryActionButton(rowIndex)
    if (primaryButton) {
      primaryButton.click()
    }
  }

  /**
   * Clicks the secondary actions dropdown trigger
   */
  clickSecondaryActionsButton(rowIndex: number): void {
    const secondaryButton = this.getSecondaryActionsButton(rowIndex)
    if (secondaryButton) {
      secondaryButton.click()
    }
  }

  /**
   * Gets all items in the secondary actions dropdown menu
   */
  getSecondaryActionItems(): HTMLElement[] {
    const dropdownMenu = document.querySelector('[role="menu"]')
    if (!dropdownMenu) return []

    const menuItems = dropdownMenu.querySelectorAll('[role="menuitem"]')
    return Array.from(menuItems) as HTMLElement[]
  }

  /**
   * Clicks a specific secondary action by label
   */
  clickSecondaryAction(actionLabel: string): void {
    const menuItems = this.getSecondaryActionItems()
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    const targetItem = menuItems.find((item) => item.textContent && item.textContent.includes(actionLabel))
    if (targetItem) {
      targetItem.click()
    }
  }

  /**
   * Checks if the secondary actions dropdown is open
   */
  isSecondaryActionsDropdownOpen(): boolean {
    const dropdownMenu = document.querySelector('[role="menu"]')
    return dropdownMenu !== null
  }
}
