import type { Meta, StoryObj } from '@storybook/react'
import { mockData, type MockedPerson } from './mock-data.js'
import { ObjectSetTable } from './object-set-table.js'
import ComputedColumnsExample from '../examples/computed-columns/computed-columns.js'
import CustomRenderingExample from '../examples/custom-rendering/custom-rendering.js'
import TableEditingExample from '../examples/table-editing/table-editing.js'

/**
 * The `ObjectSetTable` is a flexible, type-safe data table for rendering and editing collections of objects. It supports inline cell editing, row selection, row addition/deletion, custom cell/header rendering, sorting, and a programmatic API for advanced control.
 *
 * ## Table of contents
 *
 * - [Column Definition](?path=/docs/data-display-object-set-table-docs-column-definition--readme)
 * - [Rows](?path=/docs/data-display-object-set-table-docs-rows--readme)
 * - [Cells](?path=/docs/data-display-object-set-table-docs-cells--readme)
 * - [Editing](?path=/docs/data-display-object-set-table-docs-editing--readme)
 * - [Adding](?path=/docs/data-display-object-set-table-docs-adding--readme)
 * - [Deletion](?path=/docs/data-display-object-set-table-docs-deletion--readme)
 * - [Sorting](?path=/docs/data-display-object-set-table-docs-sorting--readme)
 * - [Actions](?path=/docs/data-display-object-set-table-docs-actions--readme)
 * - [API](?path=/docs/data-display-object-set-table-docs-api--readme)
 * - [Keyboard Shortcuts](?path=/docs/data-display-object-set-table-docs-keyboard-shortcuts--readme)
 *
 * ## Installation
 *
 * Install the package and include the styles:
 *
 * ```bash
 * npm install @powerhousedao/document-engineering
 * ```
 *
 * Import the CSS in your app entry (once):
 *
 * ```ts
 * import '@powerhousedao/document-engineering/style.css'
 * ```
 *
 * ## Basic usage
 *
 * ```tsx
 * import { ObjectSetTable } from '@powerhousedao/document-engineering/table'
 * import { useMemo } from 'react'
 *
 * type Person = { id: number; name: string; email: string; active: boolean }
 *
 * const data: Person[] = [
 *   { id: 1, name: 'John Doe', email: 'john@example.com', active: true },
 *   { id: 2, name: 'Jane Smith', email: 'jane@example.com', active: false },
 * ]
 *
 * export default function Example() {
 *   const columns = useMemo(() => [
 *      { field: 'name', title: 'Full Name' },
 *      { field: 'email', title: 'Email Address' },
 *      { field: 'active', type: 'boolean', title: 'Active' },
 *   ], [])
 *
 *   return <ObjectSetTable data={data} columns={columns} />
 * }
 * ```
 */
const meta: Meta<typeof ObjectSetTable> = {
  title: 'Data Display/Object Set Table',
  component: ObjectSetTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    columns: {
      control: 'object',
      description: 'Array of column definitions that specify how data should be displayed and behave.',
      table: {
        type: {
          summary: 'ColumnDef<T>[]',
        },
        readonly: true,
      },
    },
    data: {
      control: 'object',
      description: 'Array of data objects to display in the table.',
      table: {
        type: {
          summary: 'T[]',
        },
        readonly: true,
      },
    },
    allowRowSelection: {
      control: 'boolean',
      description: 'Whether to allow row selection with mouse clicks and keyboard shortcuts.',
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: { summary: 'true' },
      },
    },
    showRowNumbers: {
      control: 'boolean',
      description: 'Whether to show row numbers in the leftmost column.',
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: { summary: 'true' },
      },
    },
    width: {
      control: 'text',
      description: 'The width of the table.',
      table: {
        type: { summary: 'CSSProperties["width"]' },
        defaultValue: { summary: 'auto' },
      },
    },
    minRowCount: {
      control: 'number',
      description:
        'The minimum number of rows to display in the table. If the data is less than this number, the table will add empty rows to reach the minimum.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    maxRowCount: {
      control: 'number',
      description:
        'The maximum number of rows allowed in the table. When this limit is reached, the add functionality will be disabled to prevent exceeding the maximum.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 'Infinity' },
      },
    },
    minRowHeight: {
      control: 'text',
      description: 'The minimum height in pixels of the rows.',
      table: {
        type: { summary: 'number | "auto"' },
        defaultValue: { summary: 'auto' },
      },
    },
    onDelete: {
      control: false,
      description: 'Function called when rows are deleted. Enables row deletion functionality when provided.',
      table: {
        type: { summary: '(rows: T[]) => Promise<void> | void' },
        defaultValue: { summary: 'undefined' },
        readonly: true,
      },
    },
    onAdd: {
      control: false,
      description: 'Function called when a new row is added. Enables row addition functionality when provided.',
      table: {
        type: { summary: '(data: Record<string, unknown>) => Promise<void> | void' },
        defaultValue: { summary: 'undefined' },
        readonly: true,
      },
    },
    actions: {
      control: false,
      description: 'Configuration for row actions that appear on hover. Supports primary and secondary actions.',
      table: {
        type: {
          summary: '{ primary?: RowAction<T>; secondary?: Array<Omit<RowAction<T>, "icon">> }',
        },
        defaultValue: { summary: 'undefined' },
        readonly: true,
      },
    },
    apiRef: {
      control: false,
      description: 'Reference to the table API for programmatic control.',
      table: {
        type: { summary: 'React.MutableRefObject<TableApiBase | null>' },
        defaultValue: { summary: 'undefined' },
        readonly: true,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof ObjectSetTable<MockedPerson>>

/**
 * A simple read-only table without row selection or editing capabilities.
 * Perfect for displaying data that doesn't need to be modified.
 */
export const ReadOnly: Story = {
  args: {
    columns: [
      { field: 'firstName', title: 'First Name' },
      { field: 'email', title: 'Email Address' },
      { field: 'payment', type: 'number', title: 'Payment' },
      { field: 'status', title: 'Status' },
    ],
    data: mockData.slice(0, 4),
    allowRowSelection: false,
    showRowNumbers: false,
  },
}

/**
 * Demonstrates different cell types and their default rendering.
 * Shows how string, number, and boolean types are displayed differently.
 */
export const CellTypes: Story = {
  args: {
    columns: [
      { field: 'firstName', type: 'string', title: 'String Field', editable: true },
      { field: 'payment', type: 'number', title: 'Number Field', editable: true },
      { field: 'isActive', type: 'boolean', title: 'Boolean Field', editable: true },
    ],
    data: mockData.slice(0, 5),
  },
}

/**
 * Shows how to use computed columns with value formatters to transform and categorize data.
 * Demonstrates email domain extraction, payment categorization with badges, and address formatting.
 * This story renders the ComputedColumnsExample component from the examples.
 */
export const ComputedColumns: StoryObj = {
  render: (args) => <ComputedColumnsExample {...args} />,
}

/**
 * Demonstrates advanced custom rendering with icons, avatars, status indicators, and styled components.
 * Shows how to create rich, visually appealing table cells with interactive elements.
 * This story renders the CustomRenderingExample component from the examples.
 */
export const CustomRendering: StoryObj = {
  render: (args) => <CustomRenderingExample {...args} />,
}

export const EditableTable: StoryObj = {
  render: (args) => <TableEditingExample {...args} />,
}

/**
 * Demonstrates row actions functionality with both primary and secondary actions.
 * Shows how to configure hover-based contextual actions for individual rows.
 * The primary action displays with an icon, while secondary actions appear in a dropdown menu.
 */
export const RowActions: Story = {
  args: {
    columns: [
      { field: 'firstName', title: 'Name' },
      { field: 'email', title: 'Email' },
      { field: 'status', title: 'Status' },
      { field: 'payment', type: 'number', title: 'Payment' },
    ],
    data: mockData.slice(0, 6),
    actions: {
      primary: {
        label: 'Edit',
        icon: '✏️', // Using emoji for simplicity in the story
        callback: (context) => {
          // eslint-disable-next-line no-alert
          alert(`Editing ${context.row.firstName} (Row ${context.rowIndex + 1})`)
        },
      },
      secondary: [
        {
          label: 'View Details',
          callback: (context) => {
            // eslint-disable-next-line no-alert
            alert(`Viewing details for ${context.row.firstName}`)
          },
        },
        {
          label: 'Duplicate',
          callback: (context) => {
            // eslint-disable-next-line no-alert
            alert(`Duplicating ${context.row.firstName}`)
          },
        },
        {
          label: 'Archive',
          callback: (context) => {
            // eslint-disable-next-line no-alert
            alert(`Archiving ${context.row.firstName}`)
          },
        },
      ],
    },
  },
}
