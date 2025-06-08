import { useMemo } from 'react'
import { cn } from '../../../../../scalars/index.js'
import { mockData, type MockedPerson } from '../../mock-data.js'
import { ObjectSetTable } from '../../object-set-table.js'
import type { ColumnDef } from '../../types.js'
import { Icon } from '../../../icon/icon.js'
import { Tooltip, TooltipProvider } from '../../../tooltip/tooltip.js'

const CustomRenderingExample = () => {
  const columns = useMemo<Array<ColumnDef<MockedPerson>>>(
    () => [
      {
        field: 'firstName',
        title: 'User',
        renderCell: (value: string) => (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-800 font-semibold text-xs">
              {value.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium">{value}</span>
          </div>
        ),
        sortable: true,
      },
      {
        field: 'status',
        renderHeader: (value: string) => (
          <div className="flex items-center px-[12px] py-[15px] text-left text-[14px] font-medium leading-[14px] text-gray-500">
            <span>{value}</span>
            <TooltipProvider>
              <Tooltip content="User status" side="right">
                <Icon name="InfoSquare" size={16} className="ml-1 text-gray-500" />
              </Tooltip>
            </TooltipProvider>
          </div>
        ),
        renderCell: (value: 'active' | 'inactive') => (
          <div className="flex items-center gap-2">
            <div className={cn('h-2 w-2 rounded-full', value === 'active' ? 'bg-green-500' : 'bg-red-500')} />
            <span className={cn('font-medium', value === 'active' ? 'text-green-700' : 'text-red-700')}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
          </div>
        ),
      },
      {
        field: 'payment',
        type: 'number',
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
        title: 'Active',
        renderCell: (value: boolean) => (
          <div className="flex justify-center">
            {value ? (
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

  return <ObjectSetTable<MockedPerson> columns={columns} data={mockData} />
}

export default CustomRenderingExample
