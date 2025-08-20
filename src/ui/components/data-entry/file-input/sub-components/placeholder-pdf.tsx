import PreviewHeader from './preview-header.js'
import { PREVIEW_STATUS, type PreviewStatus } from '../types.js'
import LoadingBar from './loading-bar.js'
import { STATUS_CONFIG_PDF } from '../utils.js'
import { cn } from '../../../../../scalars/lib/utils.js'
import { Icon } from '../../../icon/index.js'

interface PlaceHolderPdfProps {
  status: PreviewStatus
  onClose: () => void
  className?: string
}

export const PlaceHolderPdf = ({ status, onClose, className }: PlaceHolderPdfProps) => {
  const config = STATUS_CONFIG_PDF[status]
  const icon = config.icon

  return (
    <div
      className={cn(
        'flex flex-col bg-white rounded-md shadow-[1px_4px_15px_0px_rgba(37, 44, 56, 0.25)] px-6 py-4 gap-4  border border-gray-200 h-[652px] w-[500px]',
        className
      )}
    >
      <PreviewHeader status={status} onClose={onClose} />
      <div
        className={cn(
          'flex-1 min-h-0 flex flex-col items-center justify-center bg-gray-100 w-full overflow-auto rounded-md',
          status === PREVIEW_STATUS.LOADING && 'gap-8',
          status !== PREVIEW_STATUS.LOADING && 'gap-4'
        )}
      >
        {icon && (
          <div className="relative">
            <Icon name={icon} size={256} className="text-gray-300" />
          </div>
        )}

        <div className="flex flex-col items-center justify-center gap-4">
          {config.title && <h3 className="text-xl font-bold leading-6 text-gray-500">{config.title}</h3>}
          {status === PREVIEW_STATUS.LOADING && <LoadingBar progress={50} className="w-[375px]" />}
          {status === PREVIEW_STATUS.UNSUPPORTED_FORMAT && (
            <p className="text-center text-sm text-gray-500 mx-auto max-w-[375px] whitespace-pre-line">
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
