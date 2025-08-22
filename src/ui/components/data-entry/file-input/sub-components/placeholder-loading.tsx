import PreviewHeader from './preview-header.js'
import LoadingBar from './loading-bar.js'
import { cn } from '../../../../../scalars/lib/utils.js'
import { Icon } from '../../../icon/index.js'
import type { PreviewType } from '../types.js'
import { getIconLoading } from '../utils.js'

interface PlaceHolderPdfProps {
  onClose: () => void
  typePreview: PreviewType
}

export const PlaceHolderLoading = ({ onClose, typePreview }: PlaceHolderPdfProps) => {
  const iconLoading = getIconLoading(typePreview)
  return (
    <div className="flex flex-col bg-white rounded-md shadow-[1px_4px_15px_0px_rgba(37, 44, 56, 0.25)] px-6 py-4 gap-4  border border-gray-200 h-[652px] w-[500px]">
      <PreviewHeader status="idle" onClose={onClose} />
      <div
        className={cn(
          'flex-1 min-h-0 flex flex-col items-center justify-center bg-gray-100 w-full overflow-auto rounded-md'
        )}
      >
        <div className="relative">
          <Icon name={iconLoading} size={256} className="text-gray-300" />
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <h3 className="text-xl font-bold leading-6 text-gray-500">Loading</h3>
          <LoadingBar progress={50} className="w-[375px]" />
        </div>
      </div>
    </div>
  )
}
