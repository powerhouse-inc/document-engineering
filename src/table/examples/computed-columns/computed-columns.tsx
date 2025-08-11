import { useMemo } from 'react'
import { cn } from '../../../scalars/lib/utils.js'
import { mockData, type MockedPerson } from '../../table/mock-data.js'
import { ObjectSetTable } from '../../table/object-set-table.js'
import type { ColumnDef, ObjectSetTableConfig } from '../../table/types.js'

const ComputedColumnsExample = (props: Omit<ObjectSetTableConfig<MockedPerson>, 'columns' | 'data'>) => {
  const columns = useMemo<Array<ColumnDef<MockedPerson>>>(
    () => [
      { field: 'firstName', title: 'Name', width: '100px' },
      {
        field: 'email',
        title: 'Email Domain',
        width: '150px',
        editable: true,
        valueFormatter: (value) => {
          if (typeof value !== 'string') return value?.toString() ?? 'N/A'
          return value.toString().split('@')[1]
        },
      },
      {
        field: 'payment',
        title: 'Payment Category',
        width: '180px',
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
        width: '200px',
        valueFormatter: (value) => {
          const addr = value as MockedPerson['address']
          return `${addr.addressLine1}, ${addr.city}, ${addr.state} ${addr.zip}`
        },
      },
    ],
    []
  )

  return (
    <ObjectSetTable<MockedPerson>
      columns={columns}
      data={mockData.slice(0, 6)}
      allowRowSelection={true}
      showRowNumbers={true}
      {...props}
    />
  )
}

export default ComputedColumnsExample
