import type { TableApiBase } from '../logic/types.js'

export interface ObjectSetTableConfig<T extends DataType> {
  apiRef?: React.MutableRefObject<TableApiBase | null>

  /**
   * The columns to display in the table.
   */
  columns: Array<ColumnDef<T>>

  /**
   * The data to display in the table.
   */
  data: T[]

  /**
   * Whether to allow row selection.
   *
   * @default true
   */
  allowRowSelection?: boolean

  /**
   * Whether to show row numbers.
   *
   * @default true
   */
  showRowNumbers?: boolean

  /**
   * The width of the table.
   *
   * @default "auto"
   */
  width?: React.CSSProperties['width']

  /**
   * The minimum number of rows to display in the table. If the data is less than this number,
   * the table will add empty rows to reach the minimum.
   *
   * @default 0
   */
  minRowCount?: number

  /**
   * The minimum height in pixels of the rows.
   *
   * @default "auto"
   */
  minRowHeight?: number | 'auto'

  /**
   * A function that is called when one or multiple rows are deleted.
   *
   * @param rows The rows that are being deleted.
   */
  onDelete?: (rows: T[]) => Promise<void> | void

  /**
   * A function that is called when a new row is added.
   *
   * @param data The data of the new row.
   */
  onAdd?: (data: Record<string, unknown>) => Promise<void> | void

  /**
   * The actions to display in the table when the rows are hovered.
   */
  actions?: ActionConfig<T>
}

export interface ActionConfig<T extends DataType> {
  /**
   * The primary action to display in the table when the rows are hovered.
   */
  primary?: RowAction<T>

  /**
   * The secondary actions to display in the table when the rows are hovered.
   */
  secondary?: Array<Omit<RowAction<T>, 'icon'>>
}

export interface RowContext<T extends DataType> {
  /**
   * The row object.
   */
  row: T

  /**
   * The index of the row.
   */
  rowIndex: number

  /**
   * The table configuration.
   */
  tableConfig: ObjectSetTableConfig<T>
}

export interface RowAction<T extends DataType> {
  /**
   * The label of the action.
   */
  label: string

  /**
   * The callback to call when the action is clicked.
   */
  callback: (context: RowContext<T>) => Promise<void> | void

  /**
   * The icon to display in the action. Recommended to be 16x16px.
   */
  icon?: React.ReactNode
}

export type ColumnType = 'string' | 'number' | 'boolean'

export interface CellContext<T extends DataType = DataType> {
  /**
   * The row object.
   */
  row: T

  /**
   * The column definition.
   */
  column: ColumnDef<T>

  /**
   * The index of the row.
   */
  rowIndex: number

  /**
   * The index of the column.
   */
  columnIndex: number

  /**
   * The table configuration.
   */
  tableConfig: ObjectSetTableConfig<T>
}

/**
 * A function that compares two values.
 *
 * @param a The first value.
 * @param b The second value.
 * @param context The sort context.
 *
 * @example
 */
export type SortFn<T extends DataType = DataType> = (
  a: unknown,
  b: unknown,
  context: SortableColumnContext<T>
) => number

export type OnSortCallbackFn<T extends DataType = DataType> = (context: SortableColumnContext<T>) => void

export interface SortState {
  /**
   * The index of the column that is being sorted.
   */
  columnIndex: number

  /**
   * The direction of the sort.
   */
  direction: SortDirection
}

/**
 * The context for a sortable column.
 *
 * @param T The type of the row object.
 */
export interface SortableColumnContext<T extends DataType> {
  /**
   * The table configuration.
   */
  tableConfig: ObjectSetTableConfig<T>

  /**
   * The column definition.
   */
  columnDef: ColumnDef<T>

  /**
   * The data.
   */
  data: T[]

  /**
   * The sort state.
   */
  sortState: SortState | null
}

/**
 * A function that returns a value from a row object.
 *
 * @param row The row object.
 * @param context The cell context.
 *
 * @example
 * ```ts
 * const valueGetter = (row: T) => row.firstName;
 * ```
 */
export type ValueGetterFn<T extends DataType = DataType> = (row: T, context: CellContext<T>) => unknown

/**
 * A function that formats a value for display in the table.
 *
 * @param value The value to format.
 * @param context The cell context.
 *
 * @default The value is converted to a string.
 *
 * @example
 * ```ts
 * const taxRateValueFormatter = (value: unknown) => {
 *  if (typeof value !== "number") return value?.toString() ?? "N/A";
 *  return `${value * 100}%`;
 * };
 * ```
 */
export type ValueFormatterFn<T extends DataType = DataType> = (value: unknown, context: CellContext<T>) => string

/**
 * A function that renders a cell.
 *
 * @param value The value to display in the cell.
 * @param context The cell context.
 *
 * @example
 * ```ts
 * const renderCell = (value: unknown, context: CellContext<T>) => {
 *   return <div>{value}</div>;
 * };
 * ```
 */
export type RenderCellFn<T extends DataType = DataType, V = unknown> = (
  value: V,
  context: CellContext<T>
) => React.ReactNode

/**
 * A function that renders the header of the column.
 *
 * @param value The value to display in the header.
 * @param context The cell context.
 *
 * @example
 * ```ts
 * const renderHeader = (value: string, context: CellContext<T>) => {
 *   return <div>{value}</div>;
 * };
 * ```
 */
export type RenderHeaderFn<T extends DataType, V = string> = (value: V, context: CellContext<T>) => React.ReactNode

/**
 * A function that is called when a cell is saved.
 *
 * @param newValue The new value of the cell.
 * @param context The cell context.
 *
 * @returns Whether the value was saved.
 */
export type OnCellSaveFn<TData extends DataType, TCellValue> = (
  newValue: TCellValue,
  context: CellContext<TData>
) => boolean

export type RenderCellEditorFn<TData extends DataType, TCellValue> = (
  value: TCellValue,
  onChange: (newValue: TCellValue) => void,
  context: CellContext<TData>
) => React.ReactNode

export type SortDirection = 'asc' | 'desc'

export interface SortableColumnDef<T extends DataType> {
  /**
   * Whether the column is sortable.
   *
   * @default false
   */
  sortable?: boolean

  /**
   * A function that compares two rows.
   *
   * @default The value is compared using the `rowComparator` function.
   *
   * @example
   * ```ts
   * const rowComparator = (a: unknown, b: unknown, context: SortableColumnContext<T>) => {
   *   return (a as number) - (b as number)
   * }
   */
  rowComparator?: SortFn<T>

  /**
   * A function that is called when the column is sorted.
   *
   * @param context The sort context.
   */
  onSort?: OnSortCallbackFn<T>
}

export interface ColumnDef<T extends DataType = DataType> extends SortableColumnDef<T> {
  /**
   * The field from the row object to display in the column.
   * You can use dot notation to access nested fields.
   *
   * @example
   * ```ts
   * {
   *  firstName: "Jhon",
   *  address: {
   *    city: "San Francisco",
   *  }
   * }
   *
   * // field: "firstName" -> (Jhon)
   * // field: "address.city" -> (San Francisco)
   * ```
   */
  field: string

  /**
   * The title of the column.
   *
   * @default The field name capitalized.
   *
   * @example default title
   * ```ts
   * {
   *  field: "firstName",
   *  title: "First Name",
   * }
   * ```
   *
   * @example default for nested fields
   * ```ts
   * {
   *  field: "address.city",
   *  title: "City",
   * }
   * ```
   */
  title?: string

  /**
   * A function that renders the header of the column. Do not to render the header as a `th` element.
   * Instead, render using `div` or `span` elements.
   *
   * @param value The value to display in the header.
   * @param context The cell context.
   *
   * @example
   * ```ts
   * const renderHeader = (value: string, context: CellContext<T>) => {
   *   return <div>{value}</div>;
   * };
   * ```
   */
  renderHeader?: RenderHeaderFn<T>

  /**
   * The type of the column.
   *
   * Based on the type, the value will be formatted differently and if
   * the column is editable, it will render the input depending on the
   * type. Unless a custom `valueFormatter` or `renderCell` is provided.
   *
   * @default "text"
   */
  type?: ColumnType

  /**
   * A function that returns the value to display in the column.
   * If this is provided, the `field` property is ignored.
   *
   * @default The value is the result of the field accessor.
   *
   * @example
   * ```ts
   * const fullNameValueGetter = (row: T) => `${row.firstName} ${row.lastName}`;
   * ```
   *
   * @example
   * ```ts
   * const taxRateValueGetter = (row: T) => {
   *   const taxRate = row.taxRate;
   *   if (!taxRate) {
   *     return taxRate;
   *   }
   *   return taxRate * 100;
   * }
   * ```
   */
  valueGetter?: ValueGetterFn<T>

  /**
   * A function that formats a value for display in the column.
   *
   * @default The value is converted to a string and formatted depending on the column type.
   *
   * @example
   * ```ts
   * const taxRateValueFormatter = (value: unknown) => {
   *  if (typeof value !== "number") return value?.toString() ?? "N/A";
   *  return `${value * 100}%`;
   * };
   * ```
   */
  valueFormatter?: ValueFormatterFn<T>

  /**
   * A function that renders a cell. Do not to render the cell as a `td` element.
   * Instead, render using `div` or `span` elements.
   *
   * @default The value is converted to a string and formatted depending on the column type.
   *
   * @example
   * ```ts
   * const renderCell = (value: unknown, context: CellContext<T>) => {
   *   return <div>
   *     <span className="text-red-900">{value}</span>
   *     <Icon name="my-icon" />
   *   </div>;
   * };
   * ```
   */
  renderCell?: RenderCellFn<T, any>

  /**
   * Whether the column is editable.
   *
   * @default false
   */
  editable?: boolean

  /**
   * A function that is called when a cell is saved.
   *
   * @param newValue The new value of the cell.
   * @param context The cell context.
   *
   * @returns Whether the value was saved.
   */
  onSave?: OnCellSaveFn<T, unknown>

  /**
   * A function that renders the cell editor. The editor requires to be a controlled component
   * to save and validate the value properly using the `value` and `onChange` parameters.
   *
   * @param value The value to display in the cell editor.
   * @param onChange The function to call when the value changes.
   * @param context The cell context.
   *
   * @example
   * ```ts
   * const renderCellEditor = (value: unknown, onChange: (newValue: unknown) => unknown, context: CellContext<T>) => {
   *   return <Input value={value} onChange={(e) => onChange(e.target.value)} />
   * }
   * ```
   */
  renderCellEditor?: RenderCellEditorFn<T, unknown> | null

  /**
   * The width of the column. It accepts any valid CSS width value.
   *
   * @default "auto"
   */
  width?: React.CSSProperties['width']

  /**
   * The minimum width of the column. It accepts any valid CSS width value.
   *
   * @default "auto"
   */
  minWidth?: React.CSSProperties['minWidth']

  /**
   * The maximum width of the column. It accepts any valid CSS width value.
   *
   * @default "auto"
   */
  maxWidth?: React.CSSProperties['maxWidth']

  /**
   * The alignment of the column.
   *
   * @default "left"
   */
  align?: ColumnAlignment
}

export type ColumnAlignment = 'left' | 'center' | 'right'

export type DataType = unknown

export interface TableCellIndex {
  row: number
  column: number
}

export interface IndexedData<T extends DataType = DataType> {
  data: T
  __index: number
}
