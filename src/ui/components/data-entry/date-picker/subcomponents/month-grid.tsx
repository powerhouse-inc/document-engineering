import { type MonthGridProps, useDayPicker } from 'react-day-picker'
import type { DatePickerView } from '../types.js'
import { YearGrid } from './year-view/year-grid.js'
import CalendarDateFooter from './calendar-date-footer/calendar-date-footer.js'
import { MonthView } from './months-view/month-view.js'
import type { PropsWithChildren } from 'react'
import { format } from 'date-fns'
import { MONTHS } from './utils.js'
import { cn } from '../../../../../scalars/lib/utils.js'

interface Props extends PropsWithChildren<MonthGridProps> {
  navView: DatePickerView
  yearGridViewClassName?: string
  displayYears: { from: number; to: number }
  startMonth?: Date
  endMonth?: Date
  monthGridViewClassName?: string
  setNavView: (view: DatePickerView) => void
  actualMonth: string
  actualYear: string
  className?: string
}
const MonthGrid = ({
  navView,
  yearGridViewClassName,
  displayYears,
  startMonth,
  endMonth,
  monthGridViewClassName,
  setNavView,
  className,
  children,
  ...props
}: Props) => {
  const { goToMonth, months } = useDayPicker()

  const actualYear = format(months[0].date, 'yyyy')
  const actualMonth = format(months[0].date, 'MMMM')
  if (navView === 'years') {
    return (
      <div className={cn('mt-[18px] flex flex-col gap-2', yearGridViewClassName)}>
        <YearGrid
          displayYears={displayYears}
          startMonth={startMonth}
          endMonth={endMonth}
          months={months}
          currentYear={new Date().getFullYear()}
          onYearSelect={(year) => {
            goToMonth(new Date(year, MONTHS.indexOf(actualMonth)))
            setNavView('months')
          }}
        />
        <div>
          <CalendarDateFooter navView={navView} setNavView={setNavView} />
        </div>
      </div>
    )
  }
  if (navView === 'months') {
    return (
      <div className={cn('mt-[15px] flex flex-col gap-3', monthGridViewClassName)}>
        <MonthView
          actualMonth={actualMonth}
          actualYear={actualYear}
          onMonthSelect={(year, monthIndex) => {
            goToMonth(new Date(year, monthIndex))
            setNavView('days')
          }}
        />
        <div>
          <CalendarDateFooter navView={navView} setNavView={setNavView} />
        </div>
      </div>
    )
  }
  return (
    <table className={className} {...props}>
      {children}
    </table>
  )
}

MonthGrid.displayName = 'MonthGrid'
export { MonthGrid }
