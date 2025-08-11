import { useMemo, useRef } from 'react'
import { ObjectSetTable } from '../../table/object-set-table.js'
import { mockData, type MockedPerson } from '../../table/mock-data.js'
import type { TableApiBase } from '../../logic/types.js'
import { cn } from '../../../scalars/lib/utils.js'
import type { ColumnDef } from '../../table/types.js'
import { Button } from './button.js'
import { Form } from '../../../scalars/components/form/form.js'
import { NumberField } from '../../../scalars/components/number-field/number-field.js'

const ApiUsageExample = () => {
  const apiRef = useRef<TableApiBase>(null)
  const columns = useMemo<Array<ColumnDef<MockedPerson>>>(
    () => [
      { field: 'firstName', title: 'Name', sortable: true },
      {
        field: 'email',
        title: 'Email Domain',
        editable: true,
        valueFormatter: (value) => {
          if (typeof value !== 'string') return value?.toString() ?? 'N/A'
          return value.toString().split('@')[1]
        },
      },
      {
        field: 'payment',
        title: 'Payment Category',
        editable: true,
        valueFormatter: (value: unknown) => {
          if (typeof value !== 'number') return value?.toString() ?? 'N/A'
          if (value === 0) return 'No Payment'
          if (value < 1000) return 'Low'
          if (value < 100000) return 'Medium'
          return 'High'
        },
        renderCell: (value: string) => (
          <span
            className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              (value === 'No Payment' || value === 'N/A') && 'bg-gray-100 text-gray-700',
              value === 'Low' && 'bg-yellow-100 text-yellow-700',
              value === 'Medium' && 'bg-blue-100 text-blue-700',
              value === 'High' && 'bg-green-100 text-green-700'
            )}
          >
            {value}
          </span>
        ),
      },
      {
        field: 'address',
        title: 'Full Address',
        editable: true,
        valueFormatter: (value) => {
          const addr = value as MockedPerson['address']
          return `${addr.addressLine1}, ${addr.city}, ${addr.state} ${addr.zip}`
        },
      },
    ],
    []
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold mb-2">Controls</h2>
        <div className="flex flex-col gap-2">
          <div className="flex gap-6 mb-4">
            <Button variant="primary" onClick={() => apiRef.current?.selection.selectAllRows()}>
              Select All
            </Button>
            <Button variant="danger" onClick={() => apiRef.current?.selection.clear()}>
              Deselect All
            </Button>
            <Button variant="primary" onClick={() => apiRef.current?.selection.toggleSelectAll()}>
              Toggle Select All
            </Button>
          </div>

          <div className="flex gap-6 items-center">
            <Form
              className="flex gap-1 items-center"
              onSubmit={(data: { rowIndex: number }) => {
                apiRef.current?.selection.selectRow(data.rowIndex)
              }}
            >
              <NumberField className="w-16" name="rowIndex" minValue={0} maxValue={mockData.length - 2} />

              <Button variant="primary" type="submit">
                Select Row
              </Button>
            </Form>

            <Form
              className="flex gap-1 items-center"
              onSubmit={(data: { rowIndex: number; rowIndex2: number }) => {
                apiRef.current?.selection.selectRange(data.rowIndex, data.rowIndex2)
              }}
            >
              <NumberField className="w-16" name="rowIndex" minValue={0} maxValue={mockData.length - 2} />
              <NumberField className="w-16" name="rowIndex2" minValue={0} maxValue={mockData.length - 2} />

              <Button variant="primary" type="submit">
                Select range
              </Button>
            </Form>
          </div>

          <div className="flex gap-6 items-center">
            <Form
              className="flex gap-1 items-center"
              onSubmit={(data: { rowIndex: number; colIndex: number }) => {
                apiRef.current?.selection.selectCell(data.rowIndex, data.colIndex)
              }}
            >
              <NumberField className="w-16" name="rowIndex" minValue={0} maxValue={mockData.length - 2} />
              <NumberField className="w-16" name="colIndex" minValue={0} maxValue={columns.length - 1} />

              <Button variant="primary" type="submit">
                Select cell
              </Button>
            </Form>
          </div>

          <div className="flex gap-6 items-center">
            <Button
              variant="primary"
              onClick={() => {
                const direction = apiRef.current?.getCurrentSortInfo()?.direction === 'asc' ? 'desc' : 'asc'
                apiRef.current?.sortRows(0, direction)
              }}
            >
              Sort by Name
            </Button>
          </div>
        </div>
      </div>

      <ObjectSetTable<MockedPerson> columns={columns} data={mockData} apiRef={apiRef} />
    </div>
  )
}

export { ApiUsageExample }
