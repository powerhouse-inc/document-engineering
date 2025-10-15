import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import type { ReactElement } from 'react'
import { ObjectSetTable } from '../../table/object-set-table.js'
import type { ObjectSetTableConfig } from '../../table/types.js'
import { mockData, type MockedPerson } from '../../table/mock-data.js'

/**
 * Custom render function that wraps components with necessary providers
 * and provides common test utilities for table testing
 */
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>): RenderResult => {
  return render(ui, {
    ...options,
  })
}

/**
 * Creates a simple table configuration for testing
 */
export const createTestTableConfig = (
  overrides?: Partial<ObjectSetTableConfig<MockedPerson>>
): ObjectSetTableConfig<MockedPerson> => {
  return {
    columns: [
      {
        field: 'firstName',
        title: 'First Name',
        type: 'string',
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
    data: mockData,
    allowRowSelection: true,
    showRowNumbers: true,
    ...overrides,
  }
}

/**
 * Renders a test table with the given configuration
 */
export const renderTestTable = (config?: Partial<ObjectSetTableConfig<MockedPerson>>): RenderResult => {
  const tableConfig = createTestTableConfig(config)
  return customRender(<ObjectSetTable {...tableConfig} />)
}

/**
 * Creates mock data for testing
 */
export const createMockPerson = (overrides?: Partial<MockedPerson>): MockedPerson => {
  return {
    id: crypto.randomUUID(),
    firstName: 'Test User',
    walletAddress: '0x1234567890abcdef',
    isActive: true,
    payment: 1000,
    email: 'test@example.com',
    status: 'active',
    address: {
      country: 'US',
      addressLine1: '123 Test St',
      addressLine2: 'Apt 1',
      city: 'Test City',
      state: 'TS',
      zip: '12345',
    },
    ...overrides,
  }
}

/**
 * Creates an array of mock persons for testing
 */
export const createMockPersons = (count: number): MockedPerson[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockPerson({
      id: `test-${index}`,
      firstName: `User ${index}`,
      payment: index * 100,
    })
  )
}

// Re-export everything from testing-library
export * from '@testing-library/react'
export { customRender as render }
