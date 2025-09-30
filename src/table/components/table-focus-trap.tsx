import { FocusTrap } from 'focus-trap-react'
import { useRef } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { useInternalTableState } from './table-provider/table-provider.js'

const TableFocusTrap = ({ children }: { children: React.ReactNode }) => {
  const {
    state: { selectedCellIndex },
    api,
  } = useInternalTableState()
  const ref = useRef<HTMLDivElement>(null)

  useOnClickOutside(ref, (event) => {
    const { x, y } = (event.target as HTMLElement).getBoundingClientRect()

    // if the click was inside the table, we don't need to do anything
    // this could happen if a dropdown, tooltip or any other element is mounted outside the table in the DOM
    const tableRect = ref.current?.getBoundingClientRect()
    if (tableRect) {
      if (x >= tableRect.left && x <= tableRect.right && y >= tableRect.top && y <= tableRect.bottom) {
        return
      } else {
        // the focus trap is over the table, but the portal elements like dropdowns, tooltips, etc. are mounted
        // outside the table in the DOM which causes a focus trap deactivation if clicked in those portal elements
        // we need to detect if the click was in a portal element, and if so, we handle it as if it was inside the table
        const portal = document.querySelector('[data-radix-popper-content-wrapper]')
        if (portal?.contains(event.target as Node)) {
          // the click was inside the portal element
          return
        }
      }
    }

    if (api.selection.haveSelectedCells()) {
      if (api.isEditing()) {
        event.preventDefault()
        void api.exitCellEditMode(true)
        return // do not clear the cell selection
      }
      api.selection.clearCellSelection()
    }
  })

  return (
    <div ref={ref}>
      <FocusTrap
        active={!!selectedCellIndex}
        focusTrapOptions={{
          allowOutsideClick: true,
          escapeDeactivates: false,
        }}
      >
        {children}
      </FocusTrap>
    </div>
  )
}

export { TableFocusTrap }
