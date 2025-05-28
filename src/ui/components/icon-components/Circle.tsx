import type { Props } from './types.js'

const Circle = (props: Props) => {
  return (
    <svg {...props} viewBox="0 0 16 16" fill="currentcolor">
      <circle cx="8" cy="8" r="6.665" />
    </svg>
  )
}

Circle.displayName = 'Circle'

export default Circle
