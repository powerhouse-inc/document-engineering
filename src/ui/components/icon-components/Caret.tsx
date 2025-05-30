import type { Props } from './types.js'

const Caret = (props: Props) => {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentcolor">
      <path d="M10 16L10 12.8L10 11.2L10 8L14 12L10 16Z" />
    </svg>
  )
}

Caret.displayName = 'Caret'

export default Caret
