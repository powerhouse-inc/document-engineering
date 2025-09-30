import { useEffect, useMemo, useRef, useState } from 'react'
import { ObjectSetTable } from '../../table/object-set-table.js'
import { mockData, type MockedPerson } from '../../table/mock-data.js'
import type { TableApiBase } from '../../logic/types.js'
import { cn } from '../../../scalars/lib/utils.js'
import type { CellContext, ColumnDef } from '../../table/types.js'
import { EventLogCard } from './event-log-card.js'
import type { TableEventMap } from '../../events/index.js'

export interface EventLog {
  id: string
  timestamp: string
  type: string
  details: string
  data?: unknown
}

const EventsExample = () => {
  const apiRef = useRef<TableApiBase<MockedPerson>>(null)
  const [eventLogs, setEventLogs] = useState<EventLog[]>([])
  const [data, setData] = useState<MockedPerson[]>(mockData)

  const addEventLog = (type: string, details: string, data?: unknown) => {
    const newEvent: EventLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      type,
      details,
      data,
    }
    setEventLogs((prev) => [newEvent, ...prev])
  }

  const clearEventLogs = () => {
    setEventLogs([])
  }

  useEffect(() => {
    const api = apiRef.current
    if (!api) return

    const handleEditingStart = ((event: CustomEvent<TableEventMap<MockedPerson>['table:editing:start']>) => {
      const { columnDef, isAddingRow } = event.detail
      addEventLog(
        'editing:start',
        `Started editing ${columnDef.field} at row ${event.detail.cell.row}, column ${event.detail.cell.column}${isAddingRow ? ' (new row)' : ''}`,
        event.detail
      )
    }) as EventListener

    const handleEditingSave = ((event: CustomEvent<TableEventMap<MockedPerson>['table:editing:save']>) => {
      const { columnDef, oldValue, newValue, isAddingRow } = event.detail
      addEventLog(
        'editing:save',
        `Saved ${columnDef.field}: ${String(oldValue)} → ${String(newValue)}${isAddingRow ? ' (new row)' : ''}`,
        event.detail
      )
    }) as EventListener

    const handleEditingExit = ((event: CustomEvent<TableEventMap<MockedPerson>['table:editing:exit']>) => {
      const { columnDef, saved } = event.detail
      addEventLog('editing:exit', `Exited editing ${columnDef.field} (${saved ? 'saved' : 'cancelled'})`, event.detail)
    }) as EventListener

    const handleValidationError = ((
      event: CustomEvent<TableEventMap<MockedPerson>['table:editing:validationError']>
    ) => {
      const { columnDef, errors } = event.detail
      addEventLog(
        'editing:validationError',
        `Validation failed for ${columnDef.field}: ${errors.join(', ')}`,
        event.detail
      )
    }) as EventListener

    const handleValidationSuccess = ((
      event: CustomEvent<TableEventMap<MockedPerson>['table:editing:validationSuccess']>
    ) => {
      const { columnDef } = event.detail
      addEventLog('editing:validationSuccess', `Validation passed for ${columnDef.field}`, event.detail)
    }) as EventListener

    const handleValidationErrorChange = ((
      event: CustomEvent<TableEventMap<MockedPerson>['table:editing:validationErrorChange']>
    ) => {
      const { columnDef, previousErrors, currentErrors } = event.detail
      const hasErrors = currentErrors.length > 0
      const hadErrors = previousErrors.length > 0
      let details = ''
      if (!hadErrors && hasErrors) {
        details = `Validation errors appeared for ${columnDef.field}: ${currentErrors.join(', ')}`
      } else if (hadErrors && !hasErrors) {
        details = `Validation errors cleared for ${columnDef.field}`
      } else if (hadErrors && hasErrors) {
        details = `Validation errors changed for ${columnDef.field}: ${currentErrors.join(', ')}`
      }
      addEventLog('editing:validationErrorChange', details, event.detail)
    }) as EventListener

    // Delete event handlers
    const handleDeleteStart = ((event: CustomEvent<TableEventMap<MockedPerson>['table:delete:start']>) => {
      const { rowCount, requiresConfirmation } = event.detail
      addEventLog(
        'delete:start',
        `Starting deletion of ${rowCount} row(s)${requiresConfirmation ? ' (confirmation required)' : ''}`,
        event.detail
      )
    }) as EventListener

    const handleDeleteConfirm = ((event: CustomEvent<TableEventMap<MockedPerson>['table:delete:confirm']>) => {
      const { rowCount, confirmationDetails } = event.detail
      const details = confirmationDetails
        ? `User confirmed deletion of ${rowCount} row(s) - "${confirmationDetails.title}"`
        : `User confirmed deletion of ${rowCount} row(s)`
      addEventLog('delete:confirm', details, event.detail)
    }) as EventListener

    const handleDeleteSuccess = ((event: CustomEvent<TableEventMap<MockedPerson>['table:delete:success']>) => {
      const { rowCount, remainingRowCount } = event.detail
      addEventLog(
        'delete:success',
        `Successfully deleted ${rowCount} row(s). ${remainingRowCount} rows remaining.`,
        event.detail
      )
    }) as EventListener

    const handleDeleteCancel = ((event: CustomEvent<TableEventMap<MockedPerson>['table:delete:cancel']>) => {
      const { rowCount, reason } = event.detail
      const reasonText = {
        user_cancelled: 'User cancelled',
        validation_failed: 'Validation failed',
        permission_denied: 'Permission denied',
      }[reason]
      addEventLog('delete:cancel', `Deletion cancelled: ${reasonText} (${rowCount} row(s))`, event.detail)
    }) as EventListener

    const handleDeleteError = ((event: CustomEvent<TableEventMap<MockedPerson>['table:delete:error']>) => {
      const { rowCount, error } = event.detail
      addEventLog('delete:error', `Deletion failed for ${rowCount} row(s): ${error.message}`, event.detail)
    }) as EventListener

    // Insert event handlers
    const handleInsertStart = ((event: CustomEvent<TableEventMap<MockedPerson>['table:insert:start']>) => {
      const { field, currentRowCount } = event.detail
      addEventLog(
        'insert:start',
        `Starting to add new row via ${field} field (${currentRowCount} rows currently)`,
        event.detail
      )
    }) as EventListener

    const handleInsertSuccess = ((event: CustomEvent<TableEventMap<MockedPerson>['table:insert:success']>) => {
      const { insertedData, field, newRowCount, insertedRowIndex } = event.detail
      addEventLog(
        'insert:success',
        `New row added via ${field}: ${JSON.stringify(insertedData)} (${newRowCount} rows total, inserted at index ${insertedRowIndex})`,
        event.detail
      )
    }) as EventListener

    const handleInsertCancel = ((event: CustomEvent<TableEventMap<MockedPerson>['table:insert:cancel']>) => {
      const { field, cancelledValue, reason } = event.detail
      const reasonText = {
        user_cancelled: 'User cancelled',
        empty_value: 'Empty value',
        validation_failed: 'Validation failed',
      }[reason]
      addEventLog(
        'insert:cancel',
        `Insertion cancelled for ${field}: ${reasonText} (value: ${String(cancelledValue)})`,
        event.detail
      )
    }) as EventListener

    // Sort event handlers
    const handleSortChange = ((event: CustomEvent<TableEventMap<MockedPerson>['table:sort:change']>) => {
      const { columnDef, previousDirection, newDirection, previousColumnIndex } = event.detail
      const directionText = (dir: string | null) => {
        switch (dir) {
          case 'asc':
            return 'ascending'
          case 'desc':
            return 'descending'
          case null:
            return 'none'
          default:
            return 'none'
        }
      }

      let details = `Sort changed for column "${columnDef.field}"`
      if (previousColumnIndex !== null && previousColumnIndex !== event.detail.columnIndex) {
        details += ` (switched from column ${previousColumnIndex})`
      }
      details += `: ${directionText(previousDirection)} → ${directionText(newDirection)}`

      addEventLog('sort:change', details, event.detail)
    }) as EventListener

    const handleSortClear = ((event: CustomEvent<TableEventMap<MockedPerson>['table:sort:clear']>) => {
      const { columnDef, previousSortState } = event.detail
      const directionText = previousSortState.direction === 'asc' ? 'ascending' : 'descending'
      addEventLog('sort:clear', `Sort cleared for column "${columnDef.field}" (was ${directionText})`, event.detail)
    }) as EventListener

    const tableElement = api.getHTMLTable()!
    tableElement.addEventListener('table:editing:start', handleEditingStart)
    tableElement.addEventListener('table:editing:save', handleEditingSave)
    tableElement.addEventListener('table:editing:exit', handleEditingExit)
    tableElement.addEventListener('table:editing:validationError', handleValidationError)
    tableElement.addEventListener('table:editing:validationSuccess', handleValidationSuccess)
    tableElement.addEventListener('table:editing:validationErrorChange', handleValidationErrorChange)
    tableElement.addEventListener('table:insert:start', handleInsertStart)
    tableElement.addEventListener('table:insert:success', handleInsertSuccess)
    tableElement.addEventListener('table:insert:cancel', handleInsertCancel)
    tableElement.addEventListener('table:delete:start', handleDeleteStart)
    tableElement.addEventListener('table:delete:confirm', handleDeleteConfirm)
    tableElement.addEventListener('table:delete:success', handleDeleteSuccess)
    tableElement.addEventListener('table:delete:cancel', handleDeleteCancel)
    tableElement.addEventListener('table:delete:error', handleDeleteError)
    tableElement.addEventListener('table:sort:change', handleSortChange)
    tableElement.addEventListener('table:sort:clear', handleSortClear)

    return () => {
      // Cleanup event listeners
      tableElement.removeEventListener('table:editing:start', handleEditingStart)
      tableElement.removeEventListener('table:editing:save', handleEditingSave)
      tableElement.removeEventListener('table:editing:exit', handleEditingExit)
      tableElement.removeEventListener('table:editing:validationError', handleValidationError)
      tableElement.removeEventListener('table:editing:validationSuccess', handleValidationSuccess)
      tableElement.removeEventListener('table:editing:validationErrorChange', handleValidationErrorChange)
      tableElement.removeEventListener('table:insert:start', handleInsertStart)
      tableElement.removeEventListener('table:insert:success', handleInsertSuccess)
      tableElement.removeEventListener('table:insert:cancel', handleInsertCancel)
      tableElement.removeEventListener('table:delete:start', handleDeleteStart)
      tableElement.removeEventListener('table:delete:confirm', handleDeleteConfirm)
      tableElement.removeEventListener('table:delete:success', handleDeleteSuccess)
      tableElement.removeEventListener('table:delete:cancel', handleDeleteCancel)
      tableElement.removeEventListener('table:delete:error', handleDeleteError)
      tableElement.removeEventListener('table:sort:change', handleSortChange)
      tableElement.removeEventListener('table:sort:clear', handleSortClear)
    }
  }, [])

  const handleAdd = (newRowData: Record<string, unknown>) => {
    // Simulate adding the new row to the data
    const newRow: MockedPerson = {
      id: Math.random().toString(),
      firstName: (newRowData.firstName as string) || 'New Person',
      walletAddress: (newRowData.walletAddress as string) || '0x0000000000000000',
      isActive: (newRowData.isActive as boolean) || true,
      payment: (newRowData.payment as number) || 0,
      email: (newRowData.email as string) || 'new@example.com',
      status: 'active',
      address: {
        country: 'US',
        addressLine1: '',
        addressLine2: '',
        city: 'New City',
        state: 'NY',
        zip: '00000',
      },
    }
    setData((prev) => [...prev, newRow])
  }

  const handleDelete = (rows: MockedPerson[]) => {
    // Remove the deleted rows from the data
    const deletedIds = rows.map((row) => row.id)
    setData((prev) => prev.filter((row) => !deletedIds.includes(row.id)))
  }

  const handleCellSave = (fieldName: keyof MockedPerson) => (value: unknown, context: CellContext<MockedPerson>) => {
    setData((prevData) => {
      const newData = [...prevData]
      // Type assertion is needed here since we know the value type matches the field
      ;(newData[context.rowIndex] as unknown as Record<string, unknown>)[fieldName] = value
      return newData
    })
    return true
  }

  const columns = useMemo<Array<ColumnDef<MockedPerson>>>(
    () => [
      {
        field: 'firstName',
        title: 'Name',
        sortable: true,
        editable: true,
        onSave: handleCellSave('firstName'),
      },
      {
        field: 'email',
        title: 'Email',
        editable: true,
        onSave: handleCellSave('email'),
      },
      {
        field: 'payment',
        title: 'Payment',
        type: 'currency',
        sortable: true,
        editable: true,
        onSave: handleCellSave('payment'),
      },
      {
        field: 'isActive',
        title: 'Active',
        type: 'boolean',
        editable: true,
        onSave: handleCellSave('isActive'),
      },
      {
        field: 'status',
        title: 'Status',
        sortable: true,
        editable: true,
        onSave: handleCellSave('status'),
        renderCell: (value: string) => (
          <span
            className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              value === 'active' && 'bg-green-100 text-green-700',
              value === 'inactive' && 'bg-red-100 text-red-700'
            )}
          >
            {value}
          </span>
        ),
      },
    ],
    []
  )

  const actions = useMemo(
    () => ({
      primary: {
        label: 'Edit',
        callback: () => undefined,
        icon: <span>✏️</span>,
      },
      secondary: [
        {
          label: 'View Details',
          callback: () => undefined,
        },
        {
          label: 'Duplicate',
          callback: () => undefined,
        },
      ],
    }),
    []
  )

  return (
    <div className="flex gap-6">
      {/* Table Section */}
      <div className="flex-1">
        <h2 className="text-lg font-bold mb-4">Object Set Table with Event Logging</h2>
        <ObjectSetTable<MockedPerson>
          columns={columns}
          data={data}
          apiRef={apiRef}
          onAdd={handleAdd}
          onDelete={handleDelete}
          //   onReorder={handleReorder}
          actions={actions}
        />
      </div>

      {/* Event Log Section */}
      <EventLogCard eventLogs={eventLogs} clearEventLogs={clearEventLogs} />
    </div>
  )
}

export { EventsExample }
