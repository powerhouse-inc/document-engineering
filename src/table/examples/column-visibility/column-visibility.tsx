import { useMemo, useState } from 'react'
import { mockData, type MockedPerson } from '../../table/mock-data.js'
import { ObjectSetTable } from '../../table/object-set-table.js'
import type { ColumnDef } from '../../table/types.js'
import { Button } from '../../../ui/components/button/button.js'
import { Icon } from '../../../ui/components/icon/icon.js'

const ColumnVisibilityExample = () => {
  const [hiddenColumns, setHiddenColumns] = useState<string[]>(['email'])

  const toggleColumn = (field: string) => {
    setHiddenColumns((prev) => (prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]))
  }

  const columns = useMemo<Array<ColumnDef<MockedPerson>>>(
    () => [
      {
        field: 'firstName',
        title: 'Name',
        width: 140,
        hidden: hiddenColumns.includes('firstName'),
      },
      {
        field: 'email',
        title: 'Email',
        width: 200,
        hidden: hiddenColumns.includes('email'),
      },
      {
        field: 'status',
        title: 'Status',
        width: 120,
        hidden: hiddenColumns.includes('status'),
      },
      {
        field: 'payment',
        title: 'Payment',
        width: 120,
        type: 'number',
        hidden: hiddenColumns.includes('payment'),
        align: 'right',
      },
      {
        field: 'isActive',
        title: 'Active',
        width: 80,
        hidden: hiddenColumns.includes('isActive'),
      },
    ],
    [hiddenColumns]
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Column Visibility Demo</h3>
        <p className="text-sm text-blue-700 mb-3">
          Toggle column visibility to show/hide columns dynamically. The table maintains consistent column indices and
          API functionality even when columns are hidden.
        </p>

        <div className="flex flex-wrap gap-2">
          {columns.map((option) => (
            <Button
              key={option.field}
              variant={hiddenColumns.includes(option.field) ? 'secondary' : 'default'}
              size="sm"
              onClick={() => {
                toggleColumn(option.field)
              }}
              className="flex items-center gap-2"
            >
              <Icon name={hiddenColumns.includes(option.field) ? 'Show' : 'Hide'} size={14} />
              {option.title}
            </Button>
          ))}
        </div>
      </div>

      <ObjectSetTable<MockedPerson>
        columns={columns}
        data={mockData.slice(0, 6)}
        allowRowSelection={true}
        showRowNumbers={true}
      />
    </div>
  )
}

export default ColumnVisibilityExample
