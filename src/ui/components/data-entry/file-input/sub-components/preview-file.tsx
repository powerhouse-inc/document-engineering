import { cn } from '../../../../../scalars/lib/utils.js'
import { Icon } from '../../../icon/index.js'
import { PREVIEW_STATUS, type PreviewStatus } from '../types.js'
import { STATUS_CONFIG } from '../utils.js'
import LoadingBar from './loading-bar.js'

interface FilePreviewStateProps {
  status: PreviewStatus
  onClose: () => void
  title?: string
  message?: string
}

const PreviewFilePreview = ({
  status,
  onClose,
  title: overrideTitle,
  message: overrideMessage,
}: FilePreviewStateProps) => {
  const config = STATUS_CONFIG[status]

  const isLoading = status === PREVIEW_STATUS.LOADING
  const isCorrupted = status === PREVIEW_STATUS.CORRUPTED_FILE

  const title = overrideTitle ?? config.title
  const message = overrideMessage ?? config.message
  const icon = config.icon

  return (
    <div className="flex flex-col bg-white rounded-md shadow-[1px_4px_15px_0px_rgba(74,88,115,0.25)] px-6 py-4 gap-4 w-full h-full min-h-0">
      <header className="flex justify-between items-center">
        <span className={cn('text-gray-900 text-sm font-normal leading-4.5', isCorrupted && 'text-red-900')}>
          Preview
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="text-gray-400 hover:text-gray-600"
        >
          <Icon name="XmarkLight" size={16} className="text-gray-900" />
        </button>
      </header>

      <div
        className={cn(
          'flex-1 min-h-0 flex flex-col items-center justify-center bg-gray-100 w-full overflow-auto rounded-md',
          isLoading && 'gap-8',
          !isLoading && 'gap-4'
        )}
      >
        <div className="relative">
          <Icon name={icon} size={256} className="text-gray-300" />
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          {title && <h3 className="text-xl font-bold leading-6 text-gray-500">{title}</h3>}
          {isLoading && <LoadingBar progress={50} className="w-[375px]" />}
          {!isCorrupted && message && (
            <p className="text-center text-sm text-gray-500 mx-auto max-w-[375px] whitespace-pre-line">{message}</p>
          )}
        </div>
      </div>
      {isCorrupted && (
        <div className=" border-gray-200">
          <p className="text-xs text-red-900 font-normal leading-4.5">{message}</p>
        </div>
      )}
    </div>
  )
}

export default PreviewFilePreview
