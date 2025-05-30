'use client'

import { Icon } from '../../../../../../ui/components/icon/index.js'
import { cn } from '../../../../../../scalars/lib/utils.js'
import * as React from 'react'
import {
  type CaptionLabelProps,
  DayPicker,
  type DayPickerProps,
  type MonthGridProps,
  type NavProps,
} from 'react-day-picker'
import { buttonVariants } from '../../../../../../scalars/components/fragments/button/index.js'
import type { DatePickerView } from '../../types.js'
import { NavCalendar } from '../calendar-nav/calendar-nav.js'
import { CaptionLabel } from '../caption-label/caption-label.js'
import { MonthGrid } from '../month-grid.js'
import { parseBemTailwindString } from '../utils.js'

const Chevron = (props: {
  className?: string
  /**
   * The size of the chevron.
   *
   * @defaultValue 24
   */
  size?: number
  /** Set to `true` to disable the chevron. */
  disabled?: boolean
  /** The orientation of the chevron. */
  orientation?: 'up' | 'down' | 'left' | 'right'
}) => {
  return <Icon className="size-4" name="ArrowLeft" {...props} />
}

export type CalendarProps = DayPickerProps & {
  /**
   * In the year view, the number of years to display at once.
   * @default 12
   */
  yearRange?: number

  /**
   * Wether to show the year switcher in the caption.
   * @default true
   */
  showYearSwitcher?: boolean

  monthsClassName?: string
  monthCaptionClassName?: string
  weekdaysClassName?: string
  weekdayClassName?: string
  monthClassName?: string
  captionClassName?: string
  captionLabelClassName?: string
  buttonNextClassName?: string
  buttonPreviousClassName?: string
  navClassName?: string
  monthGridClassName?: string
  weekClassName?: string
  dayClassName?: string
  dayButtonClassName?: string
  rangeStartClassName?: string
  rangeEndClassName?: string
  selectedClassName?: string
  todayClassName?: string
  outsideClassName?: string
  disabledClassName?: string
  rangeMiddleClassName?: string
  hiddenClassName?: string
  dayPickerClassName?: string
  disabledDates?: boolean
  yearGridViewClassName?: string
  monthGridViewClassName?: string
  calendarClassName?: string
}

/**
 * A custom calendar component built on top of react-day-picker.
 * @param props The props for the calendar.
 * @default yearRange 12
 * @returns
 */
const Calendar = ({
  // className,
  showOutsideDays = true,
  showYearSwitcher = true,
  yearRange = 12,
  numberOfMonths,
  disabledDates = false,
  yearGridViewClassName,
  monthGridViewClassName,
  calendarClassName,
  ...props
}: CalendarProps) => {
  const [navView, setNavView] = React.useState<DatePickerView>('days')
  const [displayYears, setDisplayYears] = React.useState<{
    from: number
    to: number
  }>(
    React.useMemo(() => {
      const currentYear = new Date().getFullYear()
      return {
        from: currentYear - Math.floor(yearRange / 2 - 1),
        to: currentYear + Math.ceil(yearRange / 2),
      }
    }, [yearRange])
  )
  const { startMonth, endMonth } = props

  const columnsDisplayed = navView === 'years' ? 1 : numberOfMonths

  const buttonNavClassName = buttonVariants({
    variant: 'outline',
    className: 'absolute h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
  })

  const parsedStyles = React.useMemo(() => parseBemTailwindString(calendarClassName), [calendarClassName])

  // TODO: add BEM naming to the calendar
  const baseClass = 'date-picker'

  const _monthsClassName = cn(
    `${baseClass}__months`,
    'relative flex',
    props.monthsClassName,
    parsedStyles['date-picker__months']
  )
  const _monthCaptionClassName = cn(
    `${baseClass}__month-caption`,
    'relative mx-10 flex h-7 items-center justify-center ',
    props.monthCaptionClassName,
    parsedStyles['date-picker__month-caption']
  )
  const _weekdaysClassName = cn(
    `${baseClass}__weekdays`,
    'flex flex-row',
    props.weekdaysClassName,
    parsedStyles['date-picker__weekdays']
  )
  const _weekdayClassName = cn(
    `${baseClass}__weekday`,
    'text-muted-foreground w-8 text-sm font-normal',
    props.weekdayClassName,
    parsedStyles['date-picker__weekday']
  )
  const _monthClassName = cn(`${baseClass}__month`, 'w-full', props.monthClassName)
  const _captionClassName = cn(
    `${baseClass}__caption`,
    'relative flex items-center justify-center pt-1',
    props.captionClassName,
    parsedStyles['date-picker__caption']
  )
  const _captionLabelClassName = cn(
    `${baseClass}__caption-label`,
    'truncate text-sm font-medium',
    props.captionLabelClassName,
    parsedStyles['date-picker__caption-label']
  )
  const _buttonNextClassName = cn(
    `${baseClass}__button-next`,
    buttonNavClassName,
    'right-0',
    props.buttonNextClassName,
    parsedStyles['date-picker__button-next']
  )
  const _buttonPreviousClassName = cn(
    `${baseClass}__button-previous`,
    buttonNavClassName,
    'left-0',
    props.buttonPreviousClassName,
    parsedStyles['date-picker__button-previous']
  )
  const _navClassName = cn(
    `${baseClass}__nav`,
    'flex items-start',
    props.navClassName,
    parsedStyles['date-picker__nav']
  )
  const _monthGridClassName = cn(
    `${baseClass}__month-grid`,
    'mt-[15px] w-auto',
    props.monthGridClassName,
    parsedStyles['date-picker__month-grid']
  )
  const _weekClassName = cn(
    `${baseClass}__week`,
    'mt-[5px] flex w-max items-start',
    props.weekClassName,
    parsedStyles['date-picker__week']
  )
  const _dayClassName = cn(
    `${baseClass}__day`,
    'flex h-[34px] w-8 flex-1 items-center justify-center p-0 text-sm',
    'disabled:pointer-events-none disabled:cursor-not-allowed',
    props.dayClassName,
    parsedStyles['date-picker__day']
  )
  const _dayButtonClassName = cn(
    `${baseClass}__day-button`,
    'size-8 rounded-md p-0 font-normal transition-none aria-selected:opacity-100',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-gray-300',
    props.dayButtonClassName,
    parsedStyles['date-picker__day-button']
  )
  const _rangeStartClassName = cn(
    `${baseClass}__range-start`,
    'day-range-start rounded-s-md',
    props.rangeStartClassName,
    parsedStyles['date-picker__range-start']
  )
  const _rangeEndClassName = cn(`${baseClass}__range-end`, 'day-range-end rounded-e-md', props.rangeEndClassName)
  const _rangeMiddleClassName = cn(
    `${baseClass}__range-middle`,
    'bg-accent !text-foreground [&>button]:!text-foreground [&>button]:hover:!text-foreground [&>button]:bg-transparent [&>button]:hover:bg-transparent',
    props.rangeMiddleClassName,
    parsedStyles['date-picker__range-middle']
  )
  const _selectedClassName = cn(
    `${baseClass}__selected`,
    '[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground',
    'rounded-[4px] bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900',
    props.selectedClassName,
    parsedStyles['date-picker__selected']
  )
  const _todayClassName = cn(
    `${baseClass}__today`,
    '[&>button]:bg-accent [&>button]:text-accent-foreground',
    props.todayClassName,
    parsedStyles['date-picker__today']
  )
  const _outsideClassName = cn(
    `${baseClass}__outside`,
    'day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground opacity-50 aria-selected:opacity-30',
    props.outsideClassName,
    parsedStyles['date-picker__outside']
  )

  const _disabledClassName = cn(
    'text-gray-300 cursor-not-allowed disabled:pointer-events-none',
    props.disabledClassName
  )
  const _hiddenClassName = cn(`${baseClass}__hidden`, 'invisible flex-1', props.hiddenClassName)

  const createNav = React.useCallback(
    (navProps: NavProps) => {
      return (
        <NavCalendar
          {...navProps}
          navView={navView}
          displayYears={displayYears}
          setDisplayYears={setDisplayYears}
          startMonth={startMonth}
          endMonth={endMonth}
          buttonPreviousClassName={_buttonPreviousClassName}
          buttonNextClassName={_buttonNextClassName}
        />
      )
    },
    [navView, displayYears, setDisplayYears, startMonth, endMonth, _buttonPreviousClassName, _buttonNextClassName]
  )

  const createCaptionLabel = React.useCallback(
    (props: CaptionLabelProps) => {
      return <CaptionLabel {...props} showYearSwitcher={showYearSwitcher} navView={navView} setNavView={setNavView} />
    },
    [navView, showYearSwitcher]
  )

  const createMonthGrid = React.useCallback(
    (props: MonthGridProps) => {
      return (
        <MonthGrid
          navView={navView}
          displayYears={displayYears}
          monthGridViewClassName={monthGridViewClassName}
          yearGridViewClassName={yearGridViewClassName}
          setNavView={setNavView}
          actualMonth="some"
          actualYear="some"
          className={calendarClassName}
          {...props}
        />
      )
    },
    [calendarClassName, displayYears, monthGridViewClassName, navView, yearGridViewClassName]
  )
  return (
    <DayPicker
      mode="single"
      showOutsideDays={showOutsideDays}
      numberOfMonths={columnsDisplayed}
      disabled={disabledDates}
      className={cn('w-auto p-3 dark:border-gray-900 dark:bg-slate-600', calendarClassName)}
      classNames={{
        months: _monthsClassName,
        month_caption: _monthCaptionClassName,
        weekdays: _weekdaysClassName,
        weekday: _weekdayClassName,
        month: _monthClassName,
        caption: _captionClassName,
        caption_label: _captionLabelClassName,
        button_next: _buttonNextClassName,
        button_previous: _buttonPreviousClassName,
        nav: _navClassName,
        month_grid: _monthGridClassName,
        week: _weekClassName,
        day: _dayClassName,
        day_button: _dayButtonClassName,
        range_start: _rangeStartClassName,
        range_middle: _rangeMiddleClassName,
        range_end: _rangeEndClassName,
        selected: _selectedClassName,
        today: _todayClassName,
        outside: _outsideClassName,
        disabled: _disabledClassName,
        hidden: _hiddenClassName,
      }}
      components={{
        Chevron,
        Nav: createNav,
        CaptionLabel: createCaptionLabel,
        MonthGrid: createMonthGrid,
      }}
      {...props}
    />
  )
}

Calendar.displayName = 'Calendar'

export { Calendar }
