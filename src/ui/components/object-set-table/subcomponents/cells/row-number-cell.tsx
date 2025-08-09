import { cn } from '../../../../../scalars/lib/utils.js'
import { useInternalTableState } from '../table-provider/table-provider.js'
import { TableCellBasic } from './basic-cell.js'

interface RowNumberCellProps {
  index: number
  handleSelectRowOnClick?: (event: React.MouseEvent<HTMLTableCellElement>) => void
  selected: boolean
  hasErrors: boolean
}

const RowNumberCell: React.FC<RowNumberCellProps> = ({ index, handleSelectRowOnClick, selected, hasErrors }) => {
  const {
    config: { showRowNumbers, allowRowSelection, minRowHeight },
  } = useInternalTableState()

  if (!showRowNumbers && !allowRowSelection) {
    // if allow selection is enabled we need to show the row anyways
    // to allow the user to select the row
    return null
  }

  return (
    <TableCellBasic
      className={cn(
        'select-none border-r border-gray-300 text-center',
        allowRowSelection && 'cursor-pointer',
        selected && !hasErrors && 'bg-blue-900 text-white'
      )}
      onClick={handleSelectRowOnClick}
    >
      <div className="flex flex-1 items-center justify-center py-4" style={{ minHeight: minRowHeight }}>
        {showRowNumbers ? index : ''}
      </div>
    </TableCellBasic>
  )
}

export { RowNumberCell }
