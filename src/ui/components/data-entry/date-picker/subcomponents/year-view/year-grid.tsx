import { YearButton } from './year-button.js'

interface YearRange {
  from: number
  to: number
}
interface YearGridProps {
  displayYears: YearRange
  startMonth?: Date
  endMonth?: Date
  months: Array<{ date: Date }>
  currentYear: number
  onYearSelect: (year: number) => void
}

const YearGrid = ({ displayYears, startMonth, endMonth, months, currentYear, onYearSelect }: YearGridProps) => {
  const years = Array.from({ length: displayYears.to - displayYears.from + 1 }, (_, i) => displayYears.from + i)

  return (
    <div className="grid grid-cols-3 gap-x-[14px] gap-y-[15px]">
      {years.map((year) => (
        <YearButton
          key={year}
          year={year}
          currentYear={currentYear}
          startMonth={startMonth}
          endMonth={endMonth}
          months={months}
          onSelect={onYearSelect}
        />
      ))}
    </div>
  )
}

YearGrid.displayName = 'YearGrid'
export { YearGrid }
