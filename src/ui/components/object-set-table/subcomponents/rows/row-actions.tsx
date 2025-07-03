import { useCallback, useRef } from 'react'
import type { DataType, ObjectSetTableConfig, RowAction } from '../../types.js'
import { useInternalTableState } from '../table-provider/table-provider.js'
import { Icon } from '../../../icon/icon.js'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../dropdown-menu/index.js'
import { cn } from '../../../../../scalars/lib/utils.js'

interface RowActionsProps<T> {
  open: boolean
  row: T
  rowIndex: number
  rowRef: React.RefObject<HTMLTableRowElement>
  primaryAction?: RowAction<T>
  secondaryActions?: Array<RowAction<T>>

  isSecondaryActionsOpen: boolean
  handleSecondaryActionsOpen: () => void
  handleSecondaryActionsClose: () => void
}

const RowActions = <T extends DataType>({
  open,
  row,
  rowIndex,
  rowRef,
  primaryAction,
  secondaryActions,

  isSecondaryActionsOpen,
  handleSecondaryActionsOpen,
  handleSecondaryActionsClose,
}: RowActionsProps<T>) => {
  const { api, config } = useInternalTableState()

  const selfRef = useRef<HTMLDivElement>(null)
  const tableRect = api.getHTMLTable()?.getBoundingClientRect()

  const handlePrimaryAction = useCallback(() => {
    if (primaryAction) {
      void primaryAction.callback({
        row,
        rowIndex,
        tableConfig: config as ObjectSetTableConfig<T>,
      })
    }
  }, [config, primaryAction, row, rowIndex])

  const haveOnlyOneAction = (!!primaryAction && !secondaryActions) || (!!secondaryActions && !primaryAction)

  return (
    <div
      ref={selfRef}
      className={cn(
        open || isSecondaryActionsOpen ? 'block opacity-100' : 'hidden opacity-0',
        'fixed z-5 transition-opacity duration-200'
      )}
      style={{
        left: `${(tableRect?.right ?? 0) + (haveOnlyOneAction ? -16 : -48)}px`,
        top: `${(rowRef.current?.getBoundingClientRect().top ?? 0) + 10}px`,
      }}
    >
      <div className="flex h-full w-full items-center justify-center">
        <div className="rounded-md border border-gray-300 bg-gray-50 shadow-[2px_4px_7px_0px_rgba(107,122,150,0.25)]">
          <div className="flex gap-2 p-[3px] text-gray-500">
            {primaryAction && (
              <div
                className="flex w-6 h-6 items-center justify-center cursor-pointer hover:bg-gray-100 hover:text-gray-600 rounded-sm"
                onClick={handlePrimaryAction}
              >
                {primaryAction.icon ?? <Icon name="ArrowLeft" className="rotate-180" size={16} />}
              </div>
            )}
            {secondaryActions && (
              <DropdownMenu
                open={isSecondaryActionsOpen}
                onOpenChange={(open) => {
                  if (open) {
                    handleSecondaryActionsOpen()
                  } else {
                    handleSecondaryActionsClose()
                  }
                }}
              >
                <DropdownMenuTrigger asChild>
                  <div className="flex w-6 h-6 items-center justify-center cursor-pointer hover:bg-gray-100 hover:text-gray-600 rounded-sm">
                    <Icon name="VerticalDots" size={16} />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  alignOffset={-4}
                  sideOffset={6}
                  onMouseLeave={handleSecondaryActionsClose}
                >
                  {secondaryActions.map((action) => (
                    <DropdownMenuItem
                      key={action.label}
                      onClick={() => {
                        void action.callback({
                          row,
                          rowIndex,
                          tableConfig: config as ObjectSetTableConfig<T>,
                        })
                      }}
                    >
                      {action.icon && action.icon} {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export { RowActions }
