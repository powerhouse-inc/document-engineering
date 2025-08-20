import { cn } from '../../../../../scalars/lib/utils.js'
import { PREVIEW_STATUS, type PreviewStatus } from '../types.js'
import { PlaceHolderVideo } from './placeholder-video.js'
import PreviewHeader from './preview-header.js'

interface VideoPreviewProps {
  onClose?: () => void
  preview?: string
  className?: string
  status: PreviewStatus
}

const PreviewVideo = ({ status, onClose = () => null, preview, className }: VideoPreviewProps) => {
  if (status === PREVIEW_STATUS.SUCCESS && preview) {
    return (
      <div
        className={cn(
          'flex flex-col bg-white rounded-md shadow-[1px_4px_15px_0px_rgba(74,88,15,0.25)] px-6 py-4 gap-4 w-full',
          className
        )}
      >
        <PreviewHeader status={status} onClose={onClose} title="Audio Preview" />

        <div className="flex justify-center items-center h-full w-full rounded-md overflow-hidden">
          <video src={preview} controls aria-label="Video player" className="rounded-md overflow-hidden">
            <p>Your browser does not support the video preview.</p>
          </video>
        </div>
      </div>
    )
  }

  return <PlaceHolderVideo status={status} onClose={onClose} className={cn('w-full h-full', className)} />
}

export default PreviewVideo
