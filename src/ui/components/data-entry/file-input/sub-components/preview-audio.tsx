import { cn } from '../../../../../scalars/lib/utils.js'
import PreviewHeader from './preview-header.js'

interface AudioPreviewProps {
  onClose?: () => void
  preview?: string
  className?: string
}

const PreviewAudio = ({ onClose = () => null, preview, className }: AudioPreviewProps) => {
  return (
    <div
      className={cn(
        'flex flex-col bg-white rounded-md shadow-[1px_4px_15px_0px_rgba(74,88,15,0.25)] px-6 py-4 gap-4 w-full h-full',
        className
      )}
    >
      <PreviewHeader status="idle" onClose={onClose} title="Audio Preview" />

      <div className="flex-1 flex items-center justify-center">
        <audio src={preview} controls className="w-full" aria-label="Audio player">
          <p>Your browser does not support the audio preview.</p>
        </audio>
      </div>
    </div>
  )
}

export default PreviewAudio
