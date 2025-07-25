import type { Props } from './types.js'

const ArrowDownUp = (props: Props) => {
  return (
    <svg {...props} viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.6667 10.6665L12.0001 13.3332M12.0001 13.3332L9.33341 10.6665M12.0001 13.3332V2.6665M2.66675 5.33317L5.33341 2.6665M5.33341 2.6665L8.00008 5.33317M5.33341 2.6665V13.3332"
        stroke="currentcolor"
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

ArrowDownUp.displayName = 'ArrowDownUp'

export default ArrowDownUp
