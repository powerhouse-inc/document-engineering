import { Button } from '../../../../../scalars/components/fragments/button/index.js'
import { cn } from '../../../../../scalars/lib/utils.js'
import type { TimePeriod } from '../type.js'

interface TimePeriodSelectorProps {
  selectedPeriod?: TimePeriod
  setSelectedPeriod: (period: TimePeriod) => void
}

const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({ selectedPeriod, setSelectedPeriod }) => (
  <div className="absolute right-1 top-[48px] z-10 flex flex-col time-picker__period">
    {['AM', 'PM'].map((period) => (
      <Button
        variant="ghost"
        key={period}
        onClick={() => {
          setSelectedPeriod(period as TimePeriod)
        }}
        data-selected={selectedPeriod === period}
        className={cn(
          'h-[20px] w-[16px] text-[12px] font-normal leading-[28px] transition-colors',
          selectedPeriod === period ? 'font-normal text-gray-900' : 'font-normal text-gray-300'
        )}
      >
        {period}
      </Button>
    ))}
  </div>
)

export default TimePeriodSelector
