import { useMemo, useState } from 'react'
import { cn, EnumField } from '../../../../../scalars/index.js'
import { mockData, type MockedPerson } from '../../mock-data.js'
import { ObjectSetTable } from '../../object-set-table.js'
import type { CellContext, ColumnDef, ObjectSetTableConfig } from '../../types.js'
import { Icon } from '../../../icon/icon.js'

const TableEditingExample = (props: Omit<ObjectSetTableConfig<MockedPerson>, 'columns' | 'data'>) => {
  const [data, setData] = useState<MockedPerson[]>(mockData)

  const columns = useMemo<Array<ColumnDef<MockedPerson>>>(
    () => [
      {
        field: 'firstName',
        title: 'User',
        editable: true,
        sortable: true,
        width: 140,
        onSave: (value: unknown, context: CellContext<MockedPerson>) => {
          setData((prevData) => {
            const newData = [...prevData]
            newData[context.rowIndex].firstName = value as string
            return newData
          })
          return true
        },
      },
      {
        field: 'status',
        width: 130,
        editable: true,
        onSave: (value: unknown, context: CellContext<MockedPerson>) => {
          setData((prevData) => {
            const newData = [...prevData]
            newData[context.rowIndex].status = value as 'active' | 'inactive'
            return newData
          })
          return true
        },
        renderCell: (value: 'active' | 'inactive') => (
          <div className="flex items-center gap-2">
            <div className={cn('h-2 w-2 rounded-full', value === 'active' ? 'bg-green-500' : 'bg-red-500')} />
            <span className={cn('font-medium', value === 'active' ? 'text-green-700' : 'text-red-700')}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
          </div>
        ),
        renderCellEditor: (
          value: unknown,
          onChange: (newValue: 'active' | 'inactive') => void,
          context: CellContext<MockedPerson>
        ) => {
          return (
            <div>
              <EnumField
                name={context.column.field}
                autoFocus
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
                variant="Select"
                value={String(value)}
                onChange={(value: string | string[]) => {
                  onChange(value as 'active' | 'inactive')
                }}
              />
            </div>
          )
        },
      },
      {
        field: 'payment',
        width: 140,
        type: 'number',
        editable: true,
        onSave: (value: unknown, context: CellContext<MockedPerson>) => {
          setData((prevData) => {
            const newData = [...prevData]
            newData[context.rowIndex].payment = value as number
            return newData
          })
          return true
        },
        renderCell: (value: number) => (
          <div className="flex items-center justify-end">
            <span className="font-semibold text-gray-900">${value.toLocaleString()}</span>
            {value > 1000000 ? (
              <Icon name="ArrowUp" size={16} className="ml-1 text-green-500" />
            ) : (
              <Icon name="ArrowUp" size={16} className="ml-1 text-red-500 rotate-180" />
            )}
          </div>
        ),
        sortable: true,
        defaultSortDirection: 'desc',
      },
      {
        field: 'isActive',
        width: 80,
        title: 'Active',
        type: 'boolean',
        editable: true,
        align: 'center',
        onSave: (value: unknown, context: CellContext<MockedPerson>) => {
          setData((prevData) => {
            const newData = [...prevData]
            newData[context.rowIndex].isActive = value as boolean
            return newData
          })
          return true
        },
        renderCell: (value: string) => (
          <div className="flex justify-center">
            {value === 'true' ? (
              <Icon name="CheckCircle" size={20} className="text-green-500" />
            ) : (
              <Icon name="CrossCircle" size={20} className="text-red-500" />
            )}
          </div>
        ),
      },
    ],
    []
  )

  return <ObjectSetTable<MockedPerson> columns={columns} data={data} minRowCount={10} {...props} />
}

export default TableEditingExample
