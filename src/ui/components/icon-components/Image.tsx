import type { Props } from './types.js'

const Image = (props: Props) => {
  return (
    <svg {...props} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M112 80L95.5413 63.5413C93.541 61.5416 90.8284 60.4183 88 60.4183C85.1716 60.4183 82.459 61.5416 80.4587 63.5413L32 112M26.6667 16H101.333C107.224 16 112 20.7756 112 26.6667V101.333C112 107.224 107.224 112 101.333 112H26.6667C20.7756 112 16 107.224 16 101.333V26.6667C16 20.7756 20.7756 16 26.6667 16ZM58.6667 48C58.6667 53.891 53.891 58.6667 48 58.6667C42.109 58.6667 37.3333 53.891 37.3333 48C37.3333 42.109 42.109 37.3333 48 37.3333C53.891 37.3333 58.6667 42.109 58.6667 48Z"
        stroke="currentColor"
        strokeWidth="10.6667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

Image.displayName = 'Image'

export default Image
