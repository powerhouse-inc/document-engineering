import type { Meta, StoryObj } from '@storybook/react'
import { mockData, type MockedPerson } from './mock-data.js'
import { ObjectSetTable } from './object-set-table.js'
import ComputedColumnsExample from './examples/computed-columns/computed-columns.js'
import CustomRenderingExample from './examples/custom-rendering/custom-rendering.js'
import TableEditingExample from './examples/table-editing/table-editing.js'

/**
 * The `ObjectSetTable` component is a powerful data table that displays collections of objects in a structured format.
 * It provides built-in support for row selection, inline editing, different cell types, and flexible column configuration.
 *
 * ## Overview
 *
 * The `ObjectSetTable` displays data in a structured tabular format with support for:
 * - **Interactive Editing**: Click cells to edit values inline
 * - **Row Selection**: Multi-row selection with keyboard shortcuts
 * - **Row Addition**: Add new rows inline with automatic form validation
 * - **Row Deletion**: Remove rows with confirmation dialogs
 * - **Row Actions**: Context-sensitive actions that appear on row hover
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
 *   renderCellEditor?: (value: unknown, onChange: (newValue: unknown) => unknown, context: CellContext<T>) => React.ReactNode;
 *   width?: React.CSSProperties["width"];
 *   minWidth?: React.CSSProperties["minWidth"];
 *   maxWidth?: React.CSSProperties["maxWidth"];
 *   align?: "left" | "center" | "right";
 *   sortable?: boolean;
 *   rowComparator?: (a: unknown, b: unknown, context: SortableColumnContext<T>) => number;
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
 * ### Sorting Configuration
 *
 * | Property | Type | Default | Description |
 * |----------|------|---------|-------------|
 * | `sortable` | `boolean` | `false` | Enable column sorting |
 * | `rowComparator` | `(a: unknown, b: unknown, context: SortableColumnContext<T>) => number` | Type-based comparator | Custom sorting logic |
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
 * ### Row Addition
 *
 * Enable inline row addition with automatic form validation:
 *
 * ```tsx
 * const handleAdd = async (newRowData: Record<string, unknown>) => {
 *   // Create new item with proper structure
 *   const newItem: Person = {
 *     id: generateId(),
 *     name: '',
 *     email: '',
 *     status: 'inactive',
 *     ...newRowData, // Apply the edited data
 *   };
 *
 *   // Add to your data source
 *   setData(prevData => [...prevData, newItem]);
 * };
 *
 * <ObjectSetTable
 *   data={data}
 *   columns={columns}
 *   onAdd={handleAdd}  // Enables row addition functionality
 * />
 * ```
 *
 * When `onAdd` is provided:
 * - An empty insertion row automatically appears at the bottom of the table
 * - Users can click on cells in the insertion row to start editing
 * - After editing a cell and pressing Enter or navigating away, the `onAdd` callback is triggered
 * - The insertion row integrates with the existing form validation system
 *
 * ### Row Deletion
 *
 * Enable row deletion with confirmation:
 *
 * ```tsx
 * const handleDelete = async (rows: Person[]) => {
 *   // Perform deletion logic (API calls, etc.)
 *   console.log('Deleting rows:', rows);
 *   // Remove from your data source
 *   setData(prevData =>
 *     prevData.filter(item => !rows.includes(item))
 *   );
 * };
 *
 * <ObjectSetTable
 *   data={data}
 *   columns={columns}
 *   onDelete={handleDelete}  // Enables deletion functionality
 * />
 * ```
 *
 * ### Row Actions
 *
 * Enable contextual actions that appear when hovering over table rows. Row actions provide a clean interface for performing operations on individual rows without cluttering the table interface.
 *
 * ```tsx
 * const actions = {
 *   primary: {
 *     label: 'Edit',
 *     icon: <Icon name="EditPencil" size={16} />,
 *     callback: async (context: RowContext<Person>) => {
 *       // Handle primary action
 *       console.log('Editing row:', context.row);
 *     },
 *   },
 *   secondary: [
 *     {
 *       label: 'Duplicate',
 *       callback: async (context: RowContext<Person>) => {
 *         // Handle secondary action
 *         const newRow = { ...context.row, id: generateId() };
 *         setData(prevData => [...prevData, newRow]);
 *       },
 *     },
 *     {
 *       label: 'Archive',
 *       callback: async (context: RowContext<Person>) => {
 *         // Handle archive action
 *         await archiveUser(context.row.id);
 *       },
 *     },
 *   ],
 * };
 *
 * <ObjectSetTable
 *   data={data}
 *   columns={columns}
 *   actions={actions}  // Enables row actions
 * />
 * ```
 *
 * **Row Actions Configuration:**
 *
 * | Property | Type | Description |
 * |----------|------|-------------|
 * | `primary` | `RowAction<T>` | Single primary action displayed as main button |
 * | `secondary` | `Array<Omit<RowAction<T>, 'icon'>>` | Secondary actions in dropdown menu |
 *
 * **RowAction Interface:**
 *
 * ```tsx
 * interface RowAction<T> {
 *   label: string;                           // Action display name
 *   callback: (context: RowContext<T>) => Promise<void> | void;  // Action handler
 *   icon?: React.ReactNode;                  // Optional icon (primary only, recommended 16x16 pixels)
 * }
 *
 * interface RowContext<T> {
 *   row: T;                                  // Current row data
 *   rowIndex: number;                        // Row position in table
 *   tableConfig: ObjectSetTableConfig<T>;    // Full table configuration
 * }
 * ```
 *
 * **Action Behavior:**
 * - Actions appear on the right side of the table when hovering over a row
 * - Primary action displays with its icon as a clickable button
 * - Secondary actions appear in a dropdown menu triggered by a "more" button
 * - Actions automatically hide when the mouse leaves the row area
 * - Both action types receive the same `RowContext<T>` for consistent data access
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
 * ### Row Actions Context
 *
 * Row actions receive a `RowContext<T>` object providing access to complete row information:
 *
 * ```tsx
 * {
 *   primary: {
 *     label: "Edit User",
 *     callback: (context) => {
 *       // Access current row data
 *       const user = context.row;
 *
 *       // Use row position for tracking
 *       console.log(`Editing row ${context.rowIndex + 1}`);
 *
 *       // Access table configuration for conditional logic
 *       const canEdit = context.tableConfig.columns
 *         .some(col => col.editable);
 *
 *       if (canEdit) {
 *         openEditDialog(user);
 *       }
 *     }
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
 * | `getSelectedRowIndexes()` | Gets the indexes of selected rows | `number[]` |
 *
 * ### Cell Editing API
 *
 * Control cell editing programmatically:
 *
 * | Method | Description | Parameters | Returns |
 * |--------|-------------|------------|---------|
 * | `isEditable()` | Checks if at least one column is editable | None | `boolean` |
 * | `canEditCell(row, column)` | Checks if a cell can be edited | `row: number, column: number` | `boolean` |
 * | `isEditing()` | Checks if table is in edit mode | None | `boolean` |
 * | `isEditingCell(row, column)` | Checks if specific cell is being edited | `row: number, column: number` | `boolean` |
 * | `enterCellEditMode(row, column)` | Enters edit mode for a cell | `row: number, column: number` | `void` |
 * | `exitCellEditMode(save?)` | Exits edit mode | `save?: boolean = true` | `Promise<void>` |
 *
 * ### Row Deletion API
 *
 * Control row deletion programmatically:
 *
 * | Method | Description | Parameters | Returns |
 * |--------|-------------|------------|---------|
 * | `canDelete()` | Checks if row deletion is enabled | None | `boolean` |
 * | `deleteRows(rows)` | Deletes rows with confirmation dialog | `rows: number[]` | `Promise<void>` |
 *
 * **Note:** Row deletion requires the `onDelete` prop to be provided in the table configuration.
 * The `deleteRows` method will show a confirmation dialog before proceeding with deletion.
 *
 * ### Row Addition API
 *
 * Control row addition programmatically:
 *
 * | Method | Description | Parameters | Returns |
 * |--------|-------------|------------|---------|
 * | `canAdd()` | Checks if row addition is enabled | None | `boolean` |
 * | `isAdding()` | Checks if table is currently in adding mode | None | `boolean` |
 *
 * **Note:** Row addition requires the `onAdd` prop to be provided in the table configuration.
 * When `onAdd` is provided, an insertion row automatically appears that allows users to add new data.
 *
 * ### Sorting API
 *
 * Control table sorting programmatically:
 *
 * | Method | Description | Parameters | Returns |
 * |--------|-------------|------------|---------|
 * | `sortRows(columnIndex, direction)` | Sorts rows by the specified column | `columnIndex: number, direction: 'asc' | 'desc' | null` | `void` |
 * | `getCurrentSortInfo()` | Gets current sorting information | None | `SortingInfo | null` |
 *
 * ### General Public Methods
 *
 * | Method | Description | Returns |
 * |--------|-------------|---------|
 * | `getHTMLTable()` | Gets the underlying HTML table element | `HTMLTableElement | null` |
 * | `getTotalRowsCount()` | Gets the total number of rows in the table, including the empty rows | `number` |
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
 *
 * #### Row Deletion Control
 *
 * ```tsx
 * const handleDeleteSelected = async () => {
 *   const selectedIndexes = apiRef.current?.selection.getSelectedRowIndexes() ?? [];
 *   if (selectedIndexes.length > 0) {
 *     await apiRef.current?.deleteRows(selectedIndexes);
 *   }
 * };
 *
 * const checkCanDelete = () => {
 *   return apiRef.current?.canDelete() ?? false;
 * };
 * ```
 *
 * #### Sorting Control
 *
 * ```tsx
 * const handleSort = () => {
 *   // Sort by first column in ascending order
 *   apiRef.current?.sortRows(0, 'asc');
 * };
 *
 * const handleClearSort = () => {
 *   // Clear sorting
 *   apiRef.current?.sortRows(0, null);
 * };
 *
 * const getCurrentSort = () => {
 *   const sortInfo = apiRef.current?.getCurrentSortInfo();
 *   console.log(sortInfo); // { columnIndex: 0, direction: 'asc' } or null
 * };
 * ```
 *
 * #### Row Addition Control
 *
 * ```tsx
 * const checkCanAdd = () => {
 *   return apiRef.current?.canAdd() ?? false;
 * };
 *
 * const checkIsAdding = () => {
 *   return apiRef.current?.isAdding() ?? false;
 * };
 *
 * // The insertion row is automatically managed, but you can check its state
 * const handleCellEdit = () => {
 *   if (apiRef.current?.isAdding()) {
 *     console.log('User is currently adding a new row');
 *   }
 * };
 * ```
 *
 * ### Row Deletion
 *
 * Enable row deletion with confirmation:
 *
 * ```tsx
 * const handleDelete = async (rows: Person[]) => {
 *   // Perform deletion logic (API calls, etc.)
 *   console.log('Deleting rows:', rows);
 *   // Remove from your data source
 *   setData(prevData =>
 *     prevData.filter(item => !rows.includes(item))
 *   );
 * };
 *
 * <ObjectSetTable
 *   data={data}
 *   columns={columns}
 *   onDelete={handleDelete}  // Enables deletion functionality
 * />
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
 * Shows how text, number, and boolean types are displayed differently.
 */
export const CellTypes: Story = {
  args: {
    columns: [
      { field: 'firstName', type: 'text', title: 'Text Field', editable: true },
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
