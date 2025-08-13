import { cn } from '../../../../../scalars/lib/utils.js'

interface LoadingBarProps {
  progress?: number
  className?: string
}

const LoadingBar = ({ progress = 50, className }: LoadingBarProps): JSX.Element => {
  const valueProgress = Math.max(0, Math.min(100, progress))

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <progress
        value={valueProgress}
        max={100}
        aria-label="Loading progress"
        className={cn(
          'w-full h-[25px]',
          'appearance-none overflow-hidden rounded-[100px] bg-gray-300',
          '[&::-webkit-progress-bar]:bg-gray-300',
          '[&::-webkit-progress-value]:bg-gray-500',
          '[&::-moz-progress-bar]:bg-gray-500'
        )}
      />
    </div>
  )
}

export default LoadingBar
