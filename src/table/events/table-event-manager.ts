import type {
  DeleteCancelEvent,
  DeleteConfirmEvent,
  DeleteErrorEvent,
  DeleteStartEvent,
  DeleteSuccessEvent,
  EditingExitEvent,
  EditingSaveEvent,
  EditingStartEvent,
  InsertCancelEvent,
  InsertStartEvent,
  InsertSuccessEvent,
  SortChangeEvent,
  SortClearEvent,
  TableEventMap,
  ValidationErrorChangeEvent,
  ValidationErrorEvent,
  ValidationSuccessEvent,
} from './types.js'

/**
 * TableEventManager handles dispatching of custom events for table operations.
 * Provides type-safe event triggering methods and centralized event management.
 */
export class TableEventManager<TData = unknown> {
  private element: HTMLElement | Document | null

  constructor(element: HTMLElement | Document | null = null) {
    this.element = element ?? document
  }

  /**
   * Updates the element reference for event dispatching
   */
  setElement(element: HTMLElement | Document | null): void {
    this.element = element ?? document
  }

  private printWarning(message: string): void {
    if (process.env.NODE_ENV === 'development') {
      // This is a warning that is only shown in development mode for better DX
      // eslint-disable-next-line no-console
      console.warn(message)
    }
  }

  /**
   * Generic method to trigger any table event
   */
  private triggerEvent<K extends keyof TableEventMap<TData>>(eventType: K, payload: TableEventMap<TData>[K]): void {
    if (!this.element) {
      this.printWarning(`TableEventManager: Cannot dispatch event '${eventType}' - no element reference`)
      return
    }

    const event = new CustomEvent(eventType, {
      detail: payload,
      bubbles: true,
      cancelable: false,
    })

    this.element.dispatchEvent(event)
  }

  /**
   * Triggers when a cell enters edit mode
   */
  triggerEditingStart(payload: Omit<EditingStartEvent<TData>, 'timestamp'>): void {
    this.triggerEvent('table:editing:start', {
      ...payload,
      timestamp: new Date(),
    })
  }

  /**
   * Triggers when a cell edit is successfully saved
   */
  triggerEditingSave(payload: Omit<EditingSaveEvent<TData>, 'timestamp'>): void {
    this.triggerEvent('table:editing:save', {
      ...payload,
      timestamp: new Date(),
    })
  }

  /**
   * Triggers when exiting edit mode (regardless of save/cancel)
   */
  triggerEditingExit(payload: Omit<EditingExitEvent<TData>, 'timestamp'>): void {
    this.triggerEvent('table:editing:exit', {
      ...payload,
      timestamp: new Date(),
    })
  }

  /**
   * Triggers when validation fails
   */
  triggerValidationError(payload: Omit<ValidationErrorEvent<TData>, 'timestamp'>): void {
    this.triggerEvent('table:editing:validationError', {
      ...payload,
      timestamp: new Date(),
    })
  }

  /**
   * Triggers when validation succeeds
   */
  triggerValidationSuccess(payload: Omit<ValidationSuccessEvent<TData>, 'timestamp'>): void {
    this.triggerEvent('table:editing:validationSuccess', {
      ...payload,
      timestamp: new Date(),
    })
  }

  /**
   * Triggers when validation error state changes
   */
  triggerValidationErrorChange(payload: Omit<ValidationErrorChangeEvent<TData>, 'timestamp'>): void {
    this.triggerEvent('table:editing:validationErrorChange', {
      ...payload,
      timestamp: new Date(),
    })
  }

  /**
   * Triggers when a delete operation starts
   */
  triggerDeleteStart(payload: Omit<DeleteStartEvent<TData>, 'timestamp'>): void {
    this.triggerEvent('table:delete:start', {
      ...payload,
      timestamp: new Date(),
    })
  }

  /**
   * Triggers when user confirms the deletion
   */
  triggerDeleteConfirm(payload: Omit<DeleteConfirmEvent<TData>, 'timestamp'>): void {
    this.triggerEvent('table:delete:confirm', {
      ...payload,
      timestamp: new Date(),
    })
  }

  /**
   * Triggers when deletion is successfully completed
   */
  triggerDeleteSuccess(payload: Omit<DeleteSuccessEvent<TData>, 'timestamp'>): void {
    this.triggerEvent('table:delete:success', {
      ...payload,
      timestamp: new Date(),
    })
  }

  /**
   * Triggers when deletion is cancelled
   */
  triggerDeleteCancel(payload: Omit<DeleteCancelEvent<TData>, 'timestamp'>): void {
    this.triggerEvent('table:delete:cancel', {
      ...payload,
      timestamp: new Date(),
    })
  }

  /**
   * Triggers when deletion fails due to an error
   */
  triggerDeleteError(payload: Omit<DeleteErrorEvent<TData>, 'timestamp'>): void {
    this.triggerEvent('table:delete:error', {
      ...payload,
      timestamp: new Date(),
    })
  }

  /**
   * Triggers when a new row insertion starts
   */
  triggerInsertStart(payload: Omit<InsertStartEvent<TData>, 'timestamp'>): void {
    this.triggerEvent('table:insert:start', {
      ...payload,
      timestamp: new Date(),
    })
  }

  /**
   * Triggers when a new row insertion is successfully completed
   */
  triggerInsertSuccess(payload: Omit<InsertSuccessEvent<TData>, 'timestamp'>): void {
    this.triggerEvent('table:insert:success', {
      ...payload,
      timestamp: new Date(),
    })
  }

  /**
   * Triggers when a new row insertion is cancelled
   */
  triggerInsertCancel(payload: Omit<InsertCancelEvent<TData>, 'timestamp'>): void {
    this.triggerEvent('table:insert:cancel', {
      ...payload,
      timestamp: new Date(),
    })
  }

  /**
   * Triggers when column sort direction changes
   */
  triggerSortChange(payload: Omit<SortChangeEvent<TData>, 'timestamp'>): void {
    this.triggerEvent('table:sort:change', {
      ...payload,
      timestamp: new Date(),
    })
  }

  /**
   * Triggers when column sorting is cleared
   */
  triggerSortClear(payload: Omit<SortClearEvent<TData>, 'timestamp'>): void {
    this.triggerEvent('table:sort:clear', {
      ...payload,
      timestamp: new Date(),
    })
  }

  /**
   * Add an event listener for a specific table event
   */
  addEventListener<K extends keyof TableEventMap<TData>>(
    eventType: K,
    listener: (event: CustomEvent<TableEventMap<TData>[K]>) => void,
    options?: AddEventListenerOptions
  ): void {
    if (!this.element) {
      this.printWarning(`TableEventManager: Cannot add listener for '${eventType}' - no element reference`)
      return
    }

    this.element.addEventListener(eventType, listener as EventListener, options)
  }

  /**
   * Remove an event listener for a specific table event
   */
  removeEventListener<K extends keyof TableEventMap<TData>>(
    eventType: K,
    listener: (event: CustomEvent<TableEventMap<TData>[K]>) => void,
    options?: EventListenerOptions
  ): void {
    if (!this.element) {
      this.printWarning(`TableEventManager: Cannot remove listener for '${eventType}' - no element reference`)
      return
    }

    this.element.removeEventListener(eventType, listener as EventListener, options)
  }
}
