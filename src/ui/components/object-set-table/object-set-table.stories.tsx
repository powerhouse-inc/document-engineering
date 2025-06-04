import type { Meta, StoryObj } from '@storybook/react'
import { mockData, type MockedPerson } from './mock-data.js'
import { ObjectSetTable } from './object-set-table.js'
import ComputedColumnsExample from './examples/computed-columns/computed-columns.js'
import CustomRenderingExample from './examples/custom-rendering/custom-rendering.js'

/**
 * The `ObjectSetTable` component is a powerful data table that displays collections of objects in a structured format.
 * It provides built-in support for row selection, inline editing, different cell types, and flexible column configuration.
 *
 * ## Overview
 *
 * The `ObjectSetTable` displays data in a structured tabular format with support for:
 * - **Interactive Editing**: Click cells to edit values inline
 * - **Row Selection**: Multi-row selection with keyboard shortcuts
 * - **Flexible Columns**: Configurable display, formatting, and behavior
 * - **Type Safety**: Full TypeScript support for data and configurations
 * - **Keyboard Navigation**: Navigate and interact using keyboard only
 *
 * ## Core Concepts
 *
 * ### Column Definitions
 *
 * The heart of `ObjectSetTable` is the **column definition** system. Each column is configured
 * through a `ColumnDef<T>` object that controls every aspect of that column's behavior:
 *
 * ```tsx
 * interface ColumnDef<T = any> {
 *   field: string;
 *   title?: string;
 *   type?: "text" | "number" | "boolean";
 *   valueGetter?: (row: T, context: CellContext<T>) => unknown;
 *   valueFormatter?: (value: unknown, context: CellContext<T>) => string;
 *   renderHeader?: (value: unknown, context: CellContext<T>) => React.ReactNode;
 *   renderCell?: (value: unknown, context: CellContext<T>) => React.ReactNode;
 *   editable?: boolean;
 *   onSave?: (newValue: unknown, context: CellContext<T>) => boolean;
 *   width?: React.CSSProperties["width"];
 *   minWidth?: React.CSSProperties["minWidth"];
 *   maxWidth?: React.CSSProperties["maxWidth"];
 *   align?: "left" | "center" | "right";
 * }
 * ```
 *
 * ### Data Flow Architecture
 *
 * Data flows through a pipeline of functions for maximum flexibility:
 *
 * ```
 * Raw Data → valueGetter → valueFormatter → renderCell → Display
 *                ↓              ↓              ↓
 *           Extract Value   Format Value   Render UI
 * ```
 *
 * Each step is customizable, allowing fine-grained control over data presentation.
 *
 * ---
 *
 * ## Column Definition Reference
 *
 * ### Required Properties
 *
 * | Property | Type | Description |
 * |----------|------|-------------|
 * | `field` | `string` | Field path in data object. Supports dot notation for nested access |
 *
 * ### Display Configuration
 *
 * | Property | Type | Default | Description |
 * |----------|------|---------|-------------|
 * | `title` | `string` | Field name (capitalized) | Column header text |
 * | `type` | `"text" | "number" | "boolean"` | `"text"` | Determines default formatting and editing behavior |
 * | `align` | `"left" | "center" | "right"` | `"left"` | Text alignment within cells |
 *
 * ### Layout Configuration
 *
 * | Property | Type | Default | Description |
 * |----------|------|---------|-------------|
 * | `width` | `React.CSSProperties["width"]` | `"auto"` | Column width (any valid CSS width) |
 * | `minWidth` | `React.CSSProperties["minWidth"]` | `"auto"` | Minimum column width |
 * | `maxWidth` | `React.CSSProperties["maxWidth"]` | `"auto"` | Maximum column width |
 *
 * ### Data Processing
 *
 * | Property | Type | Default | Description |
 * |----------|------|---------|-------------|
 * | `valueGetter` | `(row: T, context: CellContext<T>) => unknown` | Field accessor (using the `field` property) | Extract value from row data |
 * | `valueFormatter` | `(value: unknown, context: CellContext<T>) => string` | Type-based formatter | Format value for display |
 * | `renderHeader` | `(value: unknown, context: CellContext<T>) => ReactNode` | Default header renderer | Custom header rendering |
 * | `renderCell` | `(value: unknown, context: CellContext<T>) => ReactNode` | Type-based renderer | Custom cell rendering |
 *
 * ### Editing Configuration
 *
 * | Property | Type | Default | Description |
 * |----------|------|---------|-------------|
 * | `editable` | `boolean` | `false` | Enable inline cell editing |
 * | `onSave` | `(newValue: any, context: CellContext<T>) => boolean` | Update data array | Handle cell value changes |
 *
 * ---
 *
 * ## Usage Patterns
 *
 * ### Basic Data Display
 *
 * ```tsx
 * const data = [
 *   { id: 1, name: "John Doe", email: "john@example.com" },
 *   { id: 2, name: "Jane Smith", email: "jane@example.com" },
 * ];
 *
 * // should be memoized to avoid unnecessary re-renders
 * const columns = useMemo(() => [
 *   { field: "name", title: "Full Name" },
 *   { field: "email", title: "Email Address" },
 * ], []);
 *
 * <ObjectSetTable data={data} columns={columns} />
 * ```
 *
 * ### Nested Field Access
 *
 * Use dot notation to access nested object properties:
 *
 * ```tsx
 * const data = [
 *   { user: { name: "John", address: { city: "NYC", country: "USA" } } }
 * ];
 *
 * const columns = [
 *   { field: "user.name", title: "Name" },
 *   { field: "user.address.city", title: "City" },
 *   { field: "user.address.country", title: "Country" },
 * ];
 * ```
 *
 * ### Cell Types and Formatting
 *
 * Different cell types provide appropriate formatting and editing interfaces:
 *
 * ```tsx
 * const columns = [
 *   { field: "name", type: "text" },           // Text input when editing
 *   { field: "age", type: "number" },          // Number input, right-aligned
 *   { field: "active", type: "boolean" },      // Checkbox display and editing
 * ];
 * ```
 *
 * ### Custom Value Processing
 *
 * Transform data through the processing pipeline:
 *
 * ```tsx
 * {
 *   field: "salary",
 *   valueGetter: (row) => row.annualSalary / 12,           // Convert annual to monthly
 *   valueFormatter: (value) => `$${value.toLocaleString()}`, // Format as currency
 *   renderCell: (formatted) => <strong>{formatted}</strong>   // Bold display
 * }
 * ```
 *
 * ### Computed Columns
 *
 * Create columns from calculated values:
 *
 * ```tsx
 * {
 *   field: "computed", // field is ignored when valueGetter is provided
 *   title: "Full Name",
 *   valueGetter: (row) => `${row.firstName} ${row.lastName}`,
 * }
 * ```
 *
 * ### Inline Editing
 *
 * Enable cell editing with save handling:
 *
 * ```tsx
 * {
 *   field: "email",
 *   editable: true,
 *   onSave: (newValue, context) => {
 *     // Validate and save the new value
 *     if (newValue.includes("@")) {
 *       context.row.email = newValue;
 *       return true; // Save successful
 *     }
 *     return false; // Save failed
 *   }
 * }
 * ```
 *
 * ### Custom Header Rendering
 *
 * ```tsx
 * {
 *   field: "status",
 *   renderHeader: (value: string) => (
 *     <div className="flex items-center px-[12px] py-[15px] text-left text-[14px] font-medium leading-[14px] text-gray-500">
 *       <span>{value}</span>
 *       <TooltipProvider>
 *         <Tooltip content="User status" side="right">
 *           <Icon name="InfoSquare" size={16} className="ml-1 text-gray-500" />
 *         </Tooltip>
 *       </TooltipProvider>
 *     </div>
 *   )
 * }
 * ```
 *
 * ### Custom Cell Rendering
 *
 * Full control over cell appearance:
 *
 * ```tsx
 * {
 *   field: "status",
 *   renderCell: (value, context) => (
 *     <div className="flex items-center gap-2">
 *       <StatusIcon status={value} />
 *       <span className={getStatusColor(value)}>{value}</span>
 *     </div>
 *   )
 * }
 * ```
 *
 * ---
 *
 * ## Table Configuration
 *
 * ### Row Selection
 *
 * ```tsx
 * <ObjectSetTable
 *   data={data}
 *   columns={columns}
 *   allowRowSelection={true}  // Enable row selection (default: true)
 * />
 * ```
 *
 * **Selection Interactions:**
 * - **Click**: Select single row
 * - **Ctrl/Cmd + Click**: Toggle row selection
 * - **Shift + Click**: Select range of rows
 *
 * ### Row Numbers
 *
 * ```tsx
 * <ObjectSetTable
 *   data={data}
 *   columns={columns}
 *   showRowNumbers={true}     // Show row numbers column (default: true)
 * />
 * ```
 *
 * ---
 *
 * ## Keyboard Shortcuts
 *
 * | Key Combination | Action |
 * |----------------|--------|
 * | **Click** | Select cell or start editing |
 * | **Arrow Keys** | Navigate between cells |
 * | **Enter** | Start/stop editing mode |
 * | **Escape** | Cancel editing |
 * | **Ctrl/Cmd + Click** | Toggle row selection |
 * | **Shift + Click** | Select range of rows |
 *
 * ---
 *
 * ## Advanced Usage
 *
 * ### Context Object
 *
 * The `CellContext<T>` object provides access to surrounding data:
 *
 * ```tsx
 * interface CellContext<T> {
 *   row: T;                           // Current row data
 *   column: ColumnDef<T>;            // Column definition
 *   rowIndex: number;                // Row position
 *   columnIndex: number;             // Column position
 *   tableConfig: ObjectSetTableConfig<T>; // Full table configuration
 * }
 * ```
 *
 * Use context for complex rendering logic:
 *
 * ```tsx
 * {
 *   field: "priority",
 *   renderCell: (value, context) => {
 *     const isLastRow = context.rowIndex === context.tableConfig.data.length - 1;
 *     const isHighPriority = value === "high";
 *
 *     return (
 *       <span className={cn(
 *         isHighPriority && "text-red-600 font-bold",
 *         isLastRow && "border-b-2"
 *       )}>
 *         {value}
 *       </span>
 *     );
 *   }
 * }
 * ```
 *
 * ## Table API usage
 *
 * The `ObjectSetTable` provides a programmatic API through the `apiRef` prop that allows you to control
 * the table's behavior from your component code. This is useful for implementing custom controls,
 * handling external events, or building advanced user interfaces.
 *
 * ### Getting Started with the API
 *
 * To use the table API, create a ref and pass it to the `apiRef` prop:
 *
 * ```tsx
 * import { useRef } from 'react';
 * import type { TableApiBase } from './types';
 *
 * const MyComponent = () => {
 *   const apiRef = useRef<TableApiBase>(null);
 *
 *   return (
 *     <ObjectSetTable
 *       data={data}
 *       columns={columns}
 *       apiRef={apiRef}
 *     />
 *   );
 * };
 * ```
 *
 * ### Selection Management API
 *
 * The `selection` property provides comprehensive control over row and cell selection:
 *
 * #### Row Selection Methods
 *
 * | Method | Description | Parameters |
 * |--------|-------------|------------|
 * | `selectRow(index)` | Selects a single row (clears other selections) | `index: number` |
 * | `toggleRow(index)` | Toggles selection state of a row | `index: number` |
 * | `selectAllRows()` | Selects all rows in the table | None |
 * | `toggleSelectAll()` | Toggles between all selected and all deselected | None |
 * | `selectRange(from, to)` | Selects a range of rows | `from: number, to: number` |
 * | `selectFromLastActiveRow(index)` | Selects from last selected row to target row | `index: number` |
 *
 * #### Cell Selection Methods
 *
 * | Method | Description | Parameters |
 * |--------|-------------|------------|
 * | `selectCell(row, column)` | Selects a specific cell | `row: number, column: number` |
 * | `clearCellSelection()` | Clears current cell selection | None |
 * | `clear()` | Clears all selections (rows and cells) | None |
 *
 * #### Selection State Methods
 *
 * | Method | Description | Returns |
 * |--------|-------------|---------|
 * | `canSelectRows()` | Checks if row selection is enabled | `boolean` |
 * | `canSelectCells()` | Checks if cell selection is enabled | `boolean` |
 * | `haveSelectedCells()` | Checks if any cells are selected | `boolean` |
 *
 * ### Cell Editing API
 *
 * Control cell editing programmatically:
 *
 * | Method | Description | Parameters | Returns |
 * |--------|-------------|------------|---------|
 * | `canEditCell(row, column)` | Checks if a cell can be edited | `row: number, column: number` | `boolean` |
 * | `isEditing()` | Checks if table is in edit mode | None | `boolean` |
 * | `isEditingCell(row, column)` | Checks if specific cell is being edited | `row: number, column: number` | `boolean` |
 * | `enterCellEditMode(row, column)` | Enters edit mode for a cell | `row: number, column: number` | `void` |
 * | `exitCellEditMode(save?)` | Exits edit mode | `save?: boolean = true` | `void` |
 *
 * ### DOM Access
 *
 * | Method | Description | Returns |
 * |--------|-------------|---------|
 * | `getHTMLTable()` | Gets the underlying HTML table element | `HTMLTableElement | null` |
 *
 * ### Usage Examples
 *
 * #### Basic Selection Control
 *
 * ```tsx
 * const handleSelectAll = () => {
 *   apiRef.current?.selection.selectAllRows();
 * };
 *
 * const handleClearSelection = () => {
 *   apiRef.current?.selection.clear();
 * };
 *
 * const handleSelectRange = () => {
 *   apiRef.current?.selection.selectRange(0, 2); // Select first 3 rows
 * };
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
 * Shows how text, number, and boolean types are displayed differently.
 */
export const CellTypes: Story = {
  args: {
    columns: [
      { field: 'firstName', type: 'text', title: 'Text Field' },
      { field: 'payment', type: 'number', title: 'Number Field' },
      { field: 'isActive', type: 'boolean', title: 'Boolean Field' },
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
  render: () => <ComputedColumnsExample />,
}

/**
 * Demonstrates advanced custom rendering with icons, avatars, status indicators, and styled components.
 * Shows how to create rich, visually appealing table cells with interactive elements.
 * This story renders the CustomRenderingExample component from the examples.
 */
export const CustomRendering: StoryObj = {
  render: () => <CustomRenderingExample />,
}
