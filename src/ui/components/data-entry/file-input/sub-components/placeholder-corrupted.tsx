import { cn } from '../../../../../scalars/lib/utils.js'
import { Icon } from '../../../icon/index.js'
import type { PreviewType } from '../types.js'
import { getBrokenFileIcon } from '../utils.js'
import PreviewHeader from './preview-header.js'

interface PlaceHolderCorruptedProps {
  onClose: () => void
  className?: string
  typePreview: PreviewType
}

export const PlaceHolderCorrupted = ({ onClose, className, typePreview }: PlaceHolderCorruptedProps) => {
  const iconBroken = getBrokenFileIcon(typePreview)

  return (
    <div
      className={cn(
        'flex flex-col bg-white rounded-md shadow-[1px_4px_15px_0px_rgba(74,88,115,0.25)] px-6 py-4 gap-4 w-full h-full',
        className
      )}
    >
      <PreviewHeader status="error" onClose={onClose} title="Corrupted File" />
      <div className="flex flex-col items-center justify-center bg-gray-100 w-full rounded-md overflow-hidden flex-1">
        <div className="relative">
          <Icon name={iconBroken} size={128} className="text-gray-300" />
        </div>
      </div>

      <div className="border-gray-200">
        <p className="text-xs text-red-900 font-normal leading-4.5">
          Your file is corrupted and cannot be shown in the preview
        </p>
      </div>
    </div>
  )
}
