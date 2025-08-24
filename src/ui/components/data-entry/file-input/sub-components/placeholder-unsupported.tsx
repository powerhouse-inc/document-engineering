import PreviewHeader from './preview-header.js'
import { cn } from '../../../../../scalars/lib/utils.js'
import { Icon } from '../../../icon/index.js'

interface PlaceHolderPdfProps {
  onClose: () => void
}

export const PlaceHolderUnsupported = ({ onClose }: PlaceHolderPdfProps) => {
  return (
    <div className="flex flex-col bg-white rounded-md shadow-[1px_4px_15px_0px_rgba(37, 44, 56, 0.25)] px-6 py-4 gap-4 border border-gray-200 w-full h-full">
      <PreviewHeader status="idle" onClose={onClose} />
      <div
        className={cn(
          'flex-1 min-h-0 flex flex-col items-center justify-center bg-gray-100 w-full overflow-auto rounded-md'
        )}
      >
        <div className="relative">
          <Icon name="ContentUnavailableIcon" size={256} className="text-gray-300" />
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <h3 className="text-xl font-bold leading-6 text-gray-500">Opss!</h3>

          <p className="text-center text-sm text-gray-500 mx-auto max-w-[375px] whitespace-pre-line">
            It looks like we still don&apos;t support this format. (We are working on it) Please try to upload it with a
            different Format.
          </p>
        </div>
      </div>
    </div>
  )
}
