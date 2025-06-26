import { FocusTrap } from 'focus-trap-react'
import { useRef } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { useInternalTableState } from './table-provider/table-provider.js'

const TableFocusTrap = ({ children }: { children: React.ReactNode }) => {
  const {
    state: { selectedCellIndex },
    api,
  } = useInternalTableState()
  const ref = useRef<HTMLTableElement>(null)

  useOnClickOutside(ref, (event) => {
    const { x, y } = (event.target as HTMLElement).getBoundingClientRect()

    // if the click was inside the table, we don't need to do anything
    // this could happen if a dropdown, tooltip or any other element is mounted outside the table in the DOM
    const tableRect = ref.current?.getBoundingClientRect()
    if (tableRect) {
      if (x >= tableRect.left && x <= tableRect.right && y >= tableRect.top && y <= tableRect.bottom) {
        return
      }
    }

    if (api.selection.haveSelectedCells()) {
      if (api.isEditing()) {
        void api.exitCellEditMode(true)
      }
      api.selection.clearCellSelection()
    }
  })

  //   return children;
  return (
    <div ref={ref}>
      <FocusTrap active={!!selectedCellIndex} focusTrapOptions={{ allowOutsideClick: true }}>
        {children}
      </FocusTrap>
    </div>
  )
}

export { TableFocusTrap }
