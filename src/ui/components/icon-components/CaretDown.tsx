import type { Props } from './types.js'

const CaretDown = (props: Props) => {
  return (
    <svg {...props} viewBox="0 0 16 16" fill="currentcolor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.28221 5.22951C3.98888 4.9235 3.51331 4.9235 3.21999 5.22951C2.92667 5.53552 2.92667 6.03168 3.21999 6.33769L7.46885 10.7704C7.47802 10.78 7.48736 10.7892 7.49688 10.7982C7.50402 10.8049 7.51125 10.8115 7.51858 10.8179C7.81368 11.0756 8.25385 11.0598 8.53115 10.7705L12.78 6.33777C13.0733 6.03175 13.0733 5.5356 12.78 5.22958C12.4867 4.92357 12.0111 4.92357 11.7178 5.22958L8.00004 9.10822L4.28221 5.22951Z"
      />
    </svg>
  )
}

CaretDown.displayName = 'CaretDown'

export default CaretDown
