import type { TableApiBase } from './logic/types.js'

export interface ObjectSetTableConfig<T> {
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
}

export type CellType = 'text' | 'number' | 'boolean'

export interface CellContext<T = any> {
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
export type ValueGetterFn<T> = (row: T, context: CellContext<T>) => unknown

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
export type ValueFormatterFn<T> = (value: unknown, context: CellContext<T>) => string

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
export type RenderCellFn<T, V = unknown> = (value: V, context: CellContext<T>) => React.ReactNode

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
export type RenderHeaderFn<T, V = string> = (value: V, context: CellContext<T>) => React.ReactNode

/**
 * A function that is called when a cell is saved.
 *
 * @param newValue The new value of the cell.
 * @param context The cell context.
 *
 * @returns Whether the value was saved.
 */
export type OnCellSaveFn<TData, TCellValue> = (newValue: TCellValue, context: CellContext<TData>) => boolean

export interface ColumnDef<T = any> {
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
  type?: CellType

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

export type DataType = any

export interface TableCellIndex {
  row: number
  column: number
}
