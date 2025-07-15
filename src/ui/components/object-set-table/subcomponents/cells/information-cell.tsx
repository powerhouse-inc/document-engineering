import { Icon } from '../../../icon/icon.js'
import { useInternalTableState } from '../table-provider/table-provider.js'
import { TableCellBasic } from './basic-cell.js'

interface InformationCellProps {
  rowIndex: number
  emptyRow?: boolean
}

const InformationCell = ({ rowIndex, emptyRow }: InformationCellProps) => {
  const {
    state: { selectedRowIndexes },
    api,
  } = useInternalTableState()

  const canDelete = api.canDelete()

  return (
    <TableCellBasic className="min-w-[40px] max-w-[40px]">
      {!emptyRow && canDelete && selectedRowIndexes.includes(rowIndex) && (
        <div
          className="flex flex-1 w-full items-center justify-center cursor-pointer text-red-900"
          onClick={() => {
            void api.deleteRows([rowIndex])
          }}
        >
          <Icon name="Trash" size={16} />
        </div>
      )}
    </TableCellBasic>
  )
}

export { InformationCell }
