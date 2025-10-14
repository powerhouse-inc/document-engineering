import { cn } from '../../../scalars/lib/utils.js'
import { getTextAlignmentClasses } from './utils.js'
import type { CellContext, DataType } from '../../table/types.js'
import countries, { type Countries } from 'world-countries'
import { useMemo } from 'react'
import { CircleFlag } from 'react-circle-flags'

const RenderCountryCell = <T extends DataType = DataType>(value: unknown, context: CellContext<T>) => {
  const countryValue = useMemo(
    () => (countries as unknown as Countries).find((country) => country.cca2 === value),
    [value]
  )

  return (
    <div className={cn('flex items-center gap-2', getTextAlignmentClasses(context))}>
      {countryValue && <CircleFlag className="size-4" countryCode={countryValue.cca2.toLowerCase()} height={16} />}
      {countryValue?.name.common ?? ''}
    </div>
  )
}

export { RenderCountryCell as renderCountryCell }
