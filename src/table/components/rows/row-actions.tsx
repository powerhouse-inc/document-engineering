import { useCallback, useMemo, useRef } from 'react'
import { Portal } from 'react-portal'
import type { DataType, IndexedData, RowAction } from '../../table/types.js'
import { useInternalTableState } from '../table-provider/table-provider.js'
import { Icon } from '../../../ui/components/icon/icon.js'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../ui/components/dropdown-menu/dropdown-menu.js'
import { cn } from '../../../scalars/lib/utils.js'

interface RowActionsProps<T extends DataType> {
  open: boolean
  data: IndexedData<T>
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
  data,
  rowIndex,
  rowRef,
  primaryAction,
  secondaryActions,

  isSecondaryActionsOpen,
  handleSecondaryActionsOpen,
  handleSecondaryActionsClose,
}: RowActionsProps<T>) => {
  const { api, config, state } = useInternalTableState<T>()

  const selfRef = useRef<HTMLDivElement>(null)
  const tableRect = api.getHTMLTable()?.getBoundingClientRect()

  const handlePrimaryAction = useCallback(() => {
    if (primaryAction) {
      void primaryAction.callback({
        row: data.data,
        rowIndex,
        tableConfig: config,
      })
    }
  }, [config, primaryAction, data, rowIndex])

  const deleteActions: Array<RowAction<T>> = useMemo(() => {
    if (!api.canDelete()) {
      return []
    }

    return [
      {
        label: 'Delete',
        callback: async (_context) =>
          api.deleteRows([rowIndex], {
            askConfirmation: true,
            description: `Are you sure you want to delete row #${data.__index + 1}?`,
          }),
      },
      ...(state.selectedRowIndexes.length > 1 && state.selectedRowIndexes.includes(rowIndex)
        ? ([
            {
              label: `Delete ${Math.min(state.selectedRowIndexes.length, state.data.length)} selected rows`,
              callback: async (_context) => api.deleteRows(state.selectedRowIndexes),
            },
          ] satisfies Array<RowAction<T>>)
        : []),
    ]
  }, [api, data.__index, rowIndex, state.data.length, state.selectedRowIndexes])

  const hasSecondaryActions = !!secondaryActions || deleteActions.length > 0
  const haveOnlyOneAction = (!!primaryAction && !hasSecondaryActions) || (hasSecondaryActions && !primaryAction)

  return (
    <Portal>
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
              {(deleteActions.length > 0 || secondaryActions) && (
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
                    {secondaryActions?.map((action) => (
                      <DropdownMenuItem
                        key={action.label}
                        onClick={() => {
                          handleSecondaryActionsClose()
                          void action.callback({
                            row: data.data,
                            rowIndex,
                            tableConfig: config,
                          })
                        }}
                      >
                        {action.icon && action.icon} {action.label}
                      </DropdownMenuItem>
                    ))}

                    {/* delete actions */}
                    {deleteActions.length > 0 && (secondaryActions ?? []).length > 0 && <DropdownMenuSeparator />}
                    {deleteActions.map((action) => (
                      <DropdownMenuItem
                        key={action.label}
                        onClick={() => {
                          handleSecondaryActionsClose()
                          void action.callback({
                            row: data.data,
                            rowIndex,
                            tableConfig: config,
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
    </Portal>
  )
}

export { RowActions }
