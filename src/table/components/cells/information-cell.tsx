import { FormMessageList } from '../../../scalars/components/fragments/form-message/message-list.js'
import { Icon } from '../../../ui/components/icon/icon.js'
import { Tooltip, TooltipProvider } from '../../../ui/components/tooltip/tooltip.js'
import { useInternalTableState } from '../table-provider/table-provider.js'
import { TableCellBasic } from './basic-cell.js'

interface InformationCellProps {
  rowIndex: number
}

const InformationCell = ({ rowIndex }: InformationCellProps) => {
  const {
    state: { selectedCellIndex, selectedRowErrors },
  } = useInternalTableState()

  return (
    <TableCellBasic className="min-w-[40px] max-w-[40px] [&_div]:justify-center">
      <div className="flex items-center justify-center h-full w-full">
        {selectedCellIndex?.row === rowIndex && Array.isArray(selectedRowErrors) && selectedRowErrors.length > 0 && (
          <TooltipProvider>
            <Tooltip content={<FormMessageList messages={selectedRowErrors} type="error" />} align="end" side="bottom">
              <Icon name="Error" size={16} className="text-red-900" />
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </TableCellBasic>
  )
}

export { InformationCell }
