import { Icon } from '../../../icon/icon.js'
import PreviewHeader from './preview-header.js'
import type { PreviewStatus } from '../types.js'
import { cn } from '../../../../../scalars/lib/utils.js'

interface PlaceHolderRecordProps {
  status: PreviewStatus
  onClose: () => void
  className?: string
}

export const PlaceHolderRecord = ({ status, onClose, className }: PlaceHolderRecordProps) => {
  return (
    <div
      className={cn(
        'flex flex-col bg-white rounded-md shadow-[1px_4px_15px_0px_rgba(74,88,15,0.25)] px-6 py-4 gap-4 w-full',
        className
      )}
    >
      <PreviewHeader status={status} onClose={onClose} title="Audio Preview" />

      <div className="flex flex-col items-center justify-center bg-gray-100 w-full rounded-md overflow-hidden flex-1">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <Icon name="History" size={32} className="text-gray-500" />
        </div>
        <p className="text-gray-700 font-xl">Loading</p>
        <div className="w-full flex justify-center bg-gray-200 rounded-full h-4 mt-2 mx-4">
          <div className="bg-gray-500 h-4 rounded-full" style={{ width: '70%' }} />
        </div>
      </div>
    </div>
  )
}
