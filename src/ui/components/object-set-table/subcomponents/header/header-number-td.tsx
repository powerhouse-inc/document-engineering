import { useMemo } from 'react'
import { cn } from '../../../../../scalars/lib/utils.js'
import { useInternalTableState } from '../table-provider/table-provider.js'
import { HeaderCell } from './header-cell.js'

interface HeaderNumberTdProps extends React.HTMLAttributes<HTMLTableCellElement> {
  isAllRowsSelected: boolean
  handleSelectAllRows: () => void
}

const HeaderNumberTd: React.FC<HeaderNumberTdProps> = ({
  className,
  isAllRowsSelected,
  handleSelectAllRows,
  ...props
}) => {
  const {
    config: { showRowNumbers, allowRowSelection, data },
  } = useInternalTableState()

  /**
   * Calculate the width of the header number cell based on the maximum number
   * of characters that the rows are going to have.
   */
  const maxRowCharacters = data.length.toString().length
  const elementWidth = useMemo(() => {
    if (!showRowNumbers) {
      // the column is shown but the row numbers are not
      return '35px'
    }

    const inputText = maxRowCharacters.toString()
    const font = '500 14px Inter'

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (context) {
      context.font = font
      const width = context.measureText(inputText).width
      return `${width + 24}px`
    }

    return '10px'
  }, [maxRowCharacters, showRowNumbers])

  if (!showRowNumbers && !allowRowSelection) {
    return null
  }

  return (
    <HeaderCell
      className={cn(
        'select-none border-r border-gray-300 text-center',
        allowRowSelection && 'cursor-pointer',
        isAllRowsSelected && 'bg-blue-900 text-white',
        className
      )}
      style={{ width: elementWidth, minWidth: elementWidth }}
      onClick={handleSelectAllRows}
      {...props}
    >
      {showRowNumbers ? '#' : ''}
    </HeaderCell>
  )
}

export { HeaderNumberTd }
