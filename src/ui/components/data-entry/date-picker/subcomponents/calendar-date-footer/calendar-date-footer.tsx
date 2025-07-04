import { Button } from '../../../../../../scalars/components/fragments/button/index.js'
import { cn } from '../../../../../../scalars/lib/utils.js'
import type { DatePickerView } from '../../types.js'

interface CalendarDateHeaderProps {
  navView: DatePickerView
  setNavView: (navView: DatePickerView) => void
}

const CalendarDateFooter = ({ navView, setNavView }: CalendarDateHeaderProps) => {
  return (
    <div className={cn('flex flex-row justify-between', 'date-picker__date-footer')}>
      <Button
        variant="ghost"
        onClick={() => {
          setNavView('years')
        }}
        className={cn(
          'w-[114px] py-2 text-gray-500',
          'rounded-[6px] border border-gray-200 bg-white',
          navView === 'years' && 'bg-gray-100'
        )}
      >
        Year
      </Button>
      <Button
        variant="ghost"
        onClick={() => {
          setNavView('months')
        }}
        className={cn(
          'w-[114px] py-2 text-gray-500',
          'rounded-[6px] border border-gray-200 bg-white',
          navView === 'months' && 'bg-gray-100'
        )}
      >
        Month
      </Button>
    </div>
  )
}

export default CalendarDateFooter
