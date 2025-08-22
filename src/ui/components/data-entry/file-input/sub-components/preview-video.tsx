import { cn } from '../../../../../scalars/lib/utils.js'
import PreviewHeader from './preview-header.js'

interface VideoPreviewProps {
  onClose?: () => void
  preview?: string
  className?: string
}

const PreviewVideo = ({ onClose = () => null, preview, className }: VideoPreviewProps) => {
  return (
    <div
      className={cn(
        'flex flex-col bg-white rounded-md shadow-[1px_4px_15px_0px_rgba(74,88,15,0.25)] px-6 py-4 gap-4 w-full h-full',
        className
      )}
    >
      <PreviewHeader status="idle" onClose={onClose} title="Video Preview" />

      <div className="flex-1 flex justify-center items-center rounded-md overflow-hidden">
        <video
          src={preview}
          controls
          aria-label="Video player"
          className="w-full h-full rounded-md overflow-hidden object-contain"
        >
          <p>Your browser does not support the video preview.</p>
        </video>
      </div>
    </div>
  )
}

export default PreviewVideo
