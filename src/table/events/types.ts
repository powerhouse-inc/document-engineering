import type { ColumnDef } from '../table/types.js'

/**
 * Base interface for all table events (most generic level)
 */
export interface BaseTableEvent {
  /**
   * Timestamp when the event occurred
   */
  timestamp: Date
}

/**
 * Base interface for row-level table events
 */
export interface BaseRowEvent<TData = unknown> extends BaseTableEvent {
  /**
   * The row index where the event occurred
   */
  rowIndex: number
  /**
   * The complete row data (optional for events that don't need full row context)
   */
  rowData?: TData
}

/**
 * Base interface for cell-level table events
 */
export interface BaseCellEvent<TData = unknown> extends BaseRowEvent<TData> {
  /**
   * The cell coordinates where the event occurred
   */
  cell: {
    row: number
    column: number
  }
  /**
   * The column definition for the cell
   */
  columnDef: ColumnDef<TData>
}

/**
 * Base interface for column-level table events
 */
export interface BaseColumnEvent extends BaseTableEvent {
  /**
   * The column index where the event occurred
   */
  columnIndex: number
}

/**
 * Validation context for editing and validation events
 */
export interface ValidationContext {
  /**
   * Whether there are currently validation errors
   */
  hasErrors: boolean
  /**
   * Number of current validation errors
   */
  errorCount: number
  /**
   * Applied validation rules (optional)
   */
  validationRules?: string[]
}

/**
 * Event triggered when a cell enters edit mode
 */
export interface EditingStartEvent<TData = unknown> extends BaseCellEvent<TData> {
  /**
   * The current value in the cell before editing
   */
  currentValue: unknown
  /**
   * Whether this is a new row being added
   */
  isAddingRow: boolean
  /**
   * Validation context (optional)
   */
  validationContext?: ValidationContext
}

/**
 * Event triggered when a cell edit is successfully saved
 */
export interface EditingSaveEvent<TData = unknown> extends BaseCellEvent<TData> {
  /**
   * The old value before the edit
   */
  oldValue: unknown
  /**
   * The new value after the edit
   */
  newValue: unknown
  /**
   * Whether this was a new row being added
   */
  isAddingRow: boolean
  /**
   * Validation context (optional)
   */
  validationContext?: ValidationContext
}

/**
 * Event triggered when exiting edit mode (regardless of save/cancel)
 */
export interface EditingExitEvent<TData = unknown> extends BaseCellEvent<TData> {
  /**
   * Whether the edit was saved or cancelled
   */
  saved: boolean
  /**
   * The final value (may be unchanged if cancelled)
   */
  finalValue: unknown
}

/**
 * Event triggered when validation fails
 */
export interface ValidationErrorEvent<TData = unknown> extends BaseCellEvent<TData> {
  /**
   * Array of validation error messages
   */
  errors: string[]
  /**
   * The value that failed validation
   */
  value: unknown
  /**
   * Validation context
   */
  validationContext: ValidationContext
}

/**
 * Event triggered when validation succeeds
 */
export interface ValidationSuccessEvent<TData = unknown> extends BaseCellEvent<TData> {
  /**
   * The value that passed validation
   */
  value: unknown
  /**
   * Validation context
   */
  validationContext: ValidationContext
}

/**
 * Event triggered when validation error state changes
 */
export interface ValidationErrorChangeEvent<TData = unknown> extends BaseCellEvent<TData> {
  /**
   * Previous error state
   */
  previousErrors: string[]
  /**
   * Current error state
   */
  currentErrors: string[]
  /**
   * The value being validated
   */
  value: unknown
  /**
   * Validation context
   */
  validationContext: ValidationContext
}

/**
 * Union type of all possible table event payloads
 */
export type TableEventPayload<TData = unknown> =
  | EditingStartEvent<TData>
  | EditingSaveEvent<TData>
  | EditingExitEvent<TData>
  | ValidationErrorEvent<TData>
  | ValidationSuccessEvent<TData>
  | ValidationErrorChangeEvent<TData>

/**
 * Mapping of event names to their payload types
 */
export interface TableEventMap<TData = unknown> {
  'table:editing:start': EditingStartEvent<TData>
  'table:editing:save': EditingSaveEvent<TData>
  'table:editing:exit': EditingExitEvent<TData>
  'table:editing:validationError': ValidationErrorEvent<TData>
  'table:editing:validationSuccess': ValidationSuccessEvent<TData>
  'table:editing:validationErrorChange': ValidationErrorChangeEvent<TData>
}

/**
 * Generic event listener type
 */
export type TableEventListener<TData = unknown, T extends keyof TableEventMap<TData> = keyof TableEventMap<TData>> = (
  event: CustomEvent<TableEventMap<TData>[T]>
) => void
