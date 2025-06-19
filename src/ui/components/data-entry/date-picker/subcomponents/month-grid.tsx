import { type MonthGridProps, useDayPicker } from 'react-day-picker'
import type { DatePickerView } from '../types.js'
import { YearGrid } from './year-view/year-grid.js'
import CalendarDateFooter from './calendar-date-footer/calendar-date-footer.js'
import { MonthView } from './months-view/month-view.js'
import type { PropsWithChildren } from 'react'
import { format } from 'date-fns'
import { MONTHS } from './utils.js'
import { cn } from '../../../../../scalars/lib/utils.js'
import { getDateFormat } from '../../date-time-picker/utils.js'

interface Props extends PropsWithChildren<MonthGridProps> {
  navView: DatePickerView
  displayYears: { from: number; to: number }
  startMonth?: Date
  endMonth?: Date
  setNavView: (view: DatePickerView) => void
  dateFormat?: string
  handleCalendarMonthYearSelect: (year: number, monthIndex: number) => void
}
const MonthGrid = ({
  navView,
  displayYears,
  startMonth,
  endMonth,
  setNavView,
  className,
  children,
  dateFormat,
  handleCalendarMonthYearSelect,
  ...props
}: Props) => {
  const { goToMonth, months } = useDayPicker()
  const internalFormat = getDateFormat(dateFormat ?? '')
  const monthFormat = ['yyyy-MM', 'MM/yyyy', 'MM/yyyy', 'MMM-yyyy', 'YYYY'].includes(internalFormat ?? '')
  const yearFormat = dateFormat === 'YYYY' && internalFormat === 'yyyy-MM-dd'
  const actualYear = format(months[0].date, 'yyyy')
  const actualMonth = format(months[0].date, 'MMMM')

  if (yearFormat) {
    return (
      <div className={cn('mt-[18px] flex flex-col gap-2', 'date-picker__year-grid--view')}>
        <YearGrid
          displayYears={displayYears}
          startMonth={startMonth}
          endMonth={endMonth}
          months={months}
          currentYear={new Date().getFullYear()}
          onYearSelect={(year) => {
            handleCalendarMonthYearSelect(year, 0)
          }}
        />
      </div>
    )
  }

  if (monthFormat) {
    if (navView === 'years') {
      return (
        <div className={cn('mt-[18px] flex flex-col gap-2', 'date-picker__year-grid--view')}>
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
        <div className={cn('mt-[15px] flex flex-col gap-3', 'date-picker__month-grid--view')}>
          <MonthView
            actualMonth={actualMonth}
            actualYear={actualYear}
            onMonthSelect={(year, monthIndex) => {
              handleCalendarMonthYearSelect(year, monthIndex)
            }}
          />
          <div>
            <CalendarDateFooter navView={navView} setNavView={setNavView} />
          </div>
        </div>
      )
    }
  }
  if (navView === 'years') {
    return (
      <div className={cn('mt-[18px] flex flex-col gap-2', 'date-picker__year-grid--view')}>
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
      <div className={cn('mt-[15px] flex flex-col gap-3', 'date-picker__month-grid--view')}>
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
