import type {
  EditingExitEvent,
  EditingSaveEvent,
  EditingStartEvent,
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
