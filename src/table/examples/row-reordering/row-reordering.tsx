import { useMemo, useState } from 'react'
import { cn } from '../../../scalars/index.js'
import { mockData, type MockedPerson } from '../../table/mock-data.js'
import { ObjectSetTable } from '../../table/object-set-table.js'
import type { ColumnDef, ObjectSetTableConfig } from '../../table/types.js'
import { Icon } from '../../../ui/components/icon/icon.js'

const RowReorderingExample = (props: Omit<ObjectSetTableConfig<MockedPerson>, 'columns' | 'data'>) => {
  const [data, setData] = useState<MockedPerson[]>(mockData.slice(0, 6)) // Use fewer rows for better demo

  const columns = useMemo<Array<ColumnDef<MockedPerson>>>(
    () => [
      {
        field: 'firstName',
        title: 'Name',
        width: 140,
        renderCell: (value: string) => (
          <div className="flex items-center gap-2">
            <Icon name="Person" size={16} className="text-gray-500" />
            <span className="font-medium">{value}</span>
          </div>
        ),
      },
      {
        field: 'email',
        width: 200,
        renderCell: (value: string) => <span className="text-gray-600">{value}</span>,
      },
      {
        field: 'status',
        width: 120,
        renderCell: (value: 'active' | 'inactive') => (
          <div className="flex items-center gap-2">
            <div className={cn('h-2 w-2 rounded-full', value === 'active' ? 'bg-green-500' : 'bg-red-500')} />
            <span className={cn('text-xs font-medium', value === 'active' ? 'text-green-700' : 'text-red-700')}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
          </div>
        ),
      },
      {
        field: 'payment',
        width: 120,
        type: 'number',
      },
    ],
    []
  )

  /**
   * Reorder the rows in the table.
   *
   * @param rows - The rows part of the `data` array to reorder.
   * @param targetRowIndex - The index (0-based) to reorder the rows to, this index is relative to the original array.
   *
   * @example
   * ```
   * data = [1,2,3,4,5]
   * handleReorder([1,2], 3)
   * data = [4,3,1,2,5]
   * ```
   */
  const handleReorder = (rows: MockedPerson[], targetRowIndex: number) => {
    setData((prevData) => {
      const left: MockedPerson[] = []
      const right: MockedPerson[] = []

      prevData.forEach((row, index) => {
        if (!rows.some((incomingRow) => incomingRow.id === row.id)) {
          if (index <= targetRowIndex) {
            left.push(row)
          } else {
            right.push(row)
          }
        }
      })

      return [...left, ...rows, ...right]
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Row Reordering Demo</h3>
        <p className="text-sm text-blue-700">
          Drag and drop rows to reorder them. The table data will update automatically.
        </p>
      </div>

      <ObjectSetTable<MockedPerson>
        columns={columns}
        data={data}
        onReorder={handleReorder}
        allowRowSelection={true}
        showRowNumbers={true}
        minRowCount={10}
        {...props}
      />
    </div>
  )
}

export default RowReorderingExample
