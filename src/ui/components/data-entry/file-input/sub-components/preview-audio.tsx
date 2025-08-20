import { cn } from '../../../../../scalars/lib/utils.js'
import { PREVIEW_STATUS, type PreviewStatus } from '../types.js'
import { PlaceHolderAudio } from './placeholder-audio.js'
import PreviewHeader from './preview-header.js'

interface AudioPreviewProps {
  onClose?: () => void
  preview?: string
  className?: string
  status: PreviewStatus
}

const PreviewAudio = ({ status, onClose = () => null, preview, className }: AudioPreviewProps) => {
  if (status === PREVIEW_STATUS.SUCCESS && preview) {
    return (
      <div
        className={cn(
          'flex flex-col bg-white rounded-md shadow-[1px_4px_15px_0px_rgba(74,88,15,0.25)] px-6 py-4 gap-4 w-full',
          className
        )}
      >
        <PreviewHeader status={status} onClose={onClose} title="Audio Preview" />

        <div className="flex-1 flex items-center justify-center">
          <audio src={preview} controls className="w-full" aria-label="Audio player">
            <p>Your browser does not support the audio preview.</p>
          </audio>
        </div>
      </div>
    )
  }

  return <PlaceHolderAudio status={status} onClose={onClose} className={cn('w-full h-full', className)} />
}

export default PreviewAudio
