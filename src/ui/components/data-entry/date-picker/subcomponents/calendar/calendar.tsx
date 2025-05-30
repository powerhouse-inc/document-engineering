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
  footerButtonClassName?: string
  yearGridViewClassName?: string
  monthGridViewClassName?: string
}

/**
 * A custom calendar component built on top of react-day-picker.
 * @param props The props for the calendar.
 * @default yearRange 12
 * @returns
 */
const Calendar = ({
  className,
  showOutsideDays = true,
  showYearSwitcher = true,
  yearRange = 12,
  numberOfMonths,
  disabledDates = false,
  footerButtonClassName,
  yearGridViewClassName,
  monthGridViewClassName,
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

  const _monthsClassName = cn('relative flex', props.monthsClassName)
  const _monthCaptionClassName = cn('relative mx-10 flex h-7 items-center justify-center ', props.monthCaptionClassName)
  const _weekdaysClassName = cn('flex flex-row', props.weekdaysClassName)
  const _weekdayClassName = cn('text-muted-foreground w-8 text-sm font-normal', props.weekdayClassName)
  const _monthClassName = cn('w-full', props.monthClassName)
  const _captionClassName = cn('relative flex items-center justify-center pt-1', props.captionClassName)
  const _captionLabelClassName = cn('truncate text-sm font-medium', props.captionLabelClassName)
  const buttonNavClassName = buttonVariants({
    variant: 'outline',
    className: 'absolute h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
  })
  const _buttonNextClassName = cn(buttonNavClassName, 'right-0', props.buttonNextClassName)
  const _buttonPreviousClassName = cn(buttonNavClassName, 'left-0', props.buttonPreviousClassName)
  const _navClassName = cn('flex items-start', props.navClassName)
  const _monthGridClassName = cn('mt-[15px]', 'w-auto', props.monthGridClassName)
  const _weekClassName = cn('mt-[5px] flex w-max items-start', props.weekClassName)
  const _dayClassName = cn('flex h-[34px] w-8 flex-1 items-center justify-center p-0 text-sm', props.dayClassName)
  const _dayButtonClassName = cn(
    buttonVariants({ variant: 'ghost' }),
    'size-8 rounded-md p-0 font-normal transition-none aria-selected:opacity-100',
    props.dayButtonClassName
  )
  const buttonRangeClassName =
    'bg-accent [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground'
  const _rangeStartClassName = cn(buttonRangeClassName, 'day-range-start rounded-s-md', props.rangeStartClassName)
  const _rangeEndClassName = cn(buttonRangeClassName, 'day-range-end rounded-e-md', props.rangeEndClassName)
  const _rangeMiddleClassName = cn(
    'bg-accent !text-foreground [&>button]:!text-foreground [&>button]:hover:!text-foreground [&>button]:bg-transparent [&>button]:hover:bg-transparent',
    props.rangeMiddleClassName
  )
  const _selectedClassName = cn(
    '[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground',
    'rounded-[4px] bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900',
    props.selectedClassName
  )
  const _todayClassName = cn('[&>button]:bg-accent [&>button]:text-accent-foreground', props.todayClassName)
  const _outsideClassName = cn(
    'day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground opacity-50 aria-selected:opacity-30',
    props.outsideClassName
  )
  const _disabledClassName = cn('text-gray-300 cursor-not-allowed', props.disabledClassName)
  const _hiddenClassName = cn('invisible flex-1', props.hiddenClassName)

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
          footerButtonClassName={footerButtonClassName}
          monthGridViewClassName={monthGridViewClassName}
          yearGridViewClassName={yearGridViewClassName}
          setNavView={setNavView}
          actualMonth="some"
          actualYear="some"
          className={className}
          {...props}
        />
      )
    },
    [className, displayYears, footerButtonClassName, monthGridViewClassName, navView, yearGridViewClassName]
  )

  return (
    <DayPicker
      mode="single"
      showOutsideDays={showOutsideDays}
      numberOfMonths={columnsDisplayed}
      disabled={disabledDates}
      className={cn('w-auto p-3 dark:border-gray-900 dark:bg-slate-600', className)}
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
