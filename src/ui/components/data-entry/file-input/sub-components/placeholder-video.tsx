import { PREVIEW_STATUS, type PreviewStatus } from '../types.js'
import { STATUS_CONFIG_VIDEO } from '../utils.js'
import { cn } from '../../../../../scalars/lib/utils.js'
import { Icon } from '../../../icon/index.js'
import PreviewHeader from './preview-header.js'
import LoadingBar from './loading-bar.js'

interface FilePreviewStateProps {
  status: PreviewStatus
  onClose: () => void
  className?: string
}

export const PlaceHolderVideo = ({ status, onClose, className }: FilePreviewStateProps) => {
  const config = STATUS_CONFIG_VIDEO[status]
  const icon = config.icon

  return (
    <div
      className={cn(
        'flex flex-col bg-white rounded-md shadow-[1px_4px_15px_0px_rgba(74,88,115,0.25)] px-6 py-4 gap-4',
        className
      )}
    >
      <PreviewHeader status={status} onClose={onClose} title="Video Preview" />
      <div className="flex flex-col items-center justify-center bg-gray-100 w-full rounded-md overflow-hidden flex-1">
        {icon && (
          <div className="relative">
            <Icon name={icon} size={128} className="text-gray-300" />
          </div>
        )}

        <div className="flex flex-col items-center justify-center gap-4">
          {config.title && <h3 className="text-xl font-bold leading-6 text-gray-500">{config.title}</h3>}
          {status === PREVIEW_STATUS.LOADING && <LoadingBar progress={50} className="w-[272px]" />}
          {status !== PREVIEW_STATUS.CORRUPTED_FILE && config.message && (
            <p className="text-center text-sm text-gray-500 mx-auto max-w-[296px] whitespace-pre-line">
              {config.message}
            </p>
          )}
        </div>
      </div>
      {status === PREVIEW_STATUS.CORRUPTED_FILE && (
        <div className=" border-gray-200">
          <p className="text-xs text-red-900 font-normal leading-4.5">{config.message}</p>
        </div>
      )}
    </div>
  )
}
