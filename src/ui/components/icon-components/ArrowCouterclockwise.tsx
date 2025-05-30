import type { Props } from './types.js'

const ArrowCouterclockwise = (props: Props) => {
  return (
    <svg {...props} width="16" height="16" viewBox="0 0 16 16" fill="currentcolor" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.99384 0V2C11.3076 2 13.9938 4.68626 13.9938 8C13.9938 11.314 11.3076 14 7.99384 14C4.6801 14 1.99384 11.314 1.99384 8C1.99384 6.928 2.27897 5.88653 2.8063 4.9792C2.99137 4.66087 3.4047 4.565 3.72297 4.75C4.0413 4.935 4.13724 5.34833 3.95217 5.66666C3.5423 6.3718 3.32717 7.16533 3.32717 8C3.32717 10.5773 5.4165 12.6667 7.99384 12.6667C10.5712 12.6667 12.6605 10.5773 12.6605 8C12.6605 5.42266 10.5712 3.33333 7.99384 3.33333V5.33333L5.32717 2.66667L7.99384 0Z" />
    </svg>
  )
}

ArrowCouterclockwise.displayName = 'ArrowCouterclockwise'

export default ArrowCouterclockwise
