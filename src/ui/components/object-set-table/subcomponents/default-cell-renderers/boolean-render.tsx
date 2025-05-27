import { Checkbox } from '../../../data-entry/checkbox/checkbox.js'

const renderBooleanCell = (value: unknown) => {
  return (
    <div className="flex w-full justify-center">
      <Checkbox value={String(value) === 'true'} disabled={true} />
    </div>
  )
}

export { renderBooleanCell }
