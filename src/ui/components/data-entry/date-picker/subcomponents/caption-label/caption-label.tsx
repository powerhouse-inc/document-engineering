import type { HTMLAttributes } from 'react'
import { Icon } from '../../../../../../ui/components/icon/index.js'
import { cn } from '../../../../../../scalars/lib/index.js'
import { Button } from '../../../../../../scalars/components/fragments/button/index.js'
import type { DatePickerView } from '../../types.js'

interface CaptionLabelProps extends HTMLAttributes<HTMLSpanElement> {
  showYearSwitcher: boolean
  navView: DatePickerView
  setNavView: (navView: DatePickerView) => void
  dateFormat?: string
}

const CaptionLabel = (props: CaptionLabelProps): JSX.Element => {
  const { children, showYearSwitcher, navView, setNavView, dateFormat, ...rest } = props
  const isHiddenMonthButton = dateFormat !== 'YYYY'
  const navigateTo = ['YYYY-MM', 'MMM-YYYY', 'MMM-YYYY'].includes(dateFormat ?? '')

  if (!showYearSwitcher) return <span {...rest}>{children}</span>

  // Convert children to a string and split by space to separate the month and the year
  const [monthAbbreviation, yearNumber] = (children as string).split(' ')

  const isSelectedMonth = navView === 'months'
  const isSelectedYear = navView === 'years'

  return (
    <div className={cn('flex items-center gap-2 text-gray-600', isSelectedMonth ? 'text-gray-900' : 'text-gray-600')}>
      <Button
        className={cn('truncate text-sm font-semibold', isSelectedYear ? 'text-gray-900' : 'text-gray-600')}
        variant="ghost"
        onClick={() => {
          setNavView('years')
        }}
      >
        {isHiddenMonthButton && (
          <span className={cn(isSelectedMonth ? 'text-gray-900' : 'text-gray-600')}>{monthAbbreviation}</span>
        )}
        <span className={cn(isSelectedYear ? 'text-gray-900' : 'text-gray-600')}>{yearNumber}</span>
      </Button>
      {navView === 'days' && (
        <Icon
          className="size-[18px] cursor-pointer text-gray-600"
          name="TriangleDown"
          onClick={() => {
            setNavView('years')
          }}
        />
      )}
      {navView !== 'days' && isHiddenMonthButton && (
        <Button
          variant="ghost"
          onClick={() => {
            setNavView(navigateTo ? 'years' : 'days')
          }}
        >
          <Icon className="size-[18px] text-gray-900" name="CrossCircle" />
        </Button>
      )}
    </div>
  )
}
CaptionLabel.displayName = 'CaptionLabel'
export { CaptionLabel }
