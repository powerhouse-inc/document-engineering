import type { Props } from './types.js'

const PlaceholderVideo = (props: Props) => {
  return (
    <svg {...props} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M85.3337 69.3333L113.19 87.904C113.591 88.1712 114.058 88.3245 114.54 88.3476C115.021 88.3706 115.5 88.2626 115.926 88.0349C116.351 87.8072 116.706 87.4685 116.954 87.0547C117.202 86.641 117.333 86.1677 117.334 85.6853V41.9733C117.334 41.5041 117.21 41.0432 116.975 40.6371C116.74 40.2309 116.402 39.894 115.995 39.6603C115.588 39.4265 115.127 39.3043 114.658 39.3059C114.189 39.3075 113.728 39.4329 113.323 39.6693L85.3337 56M21.3337 32H74.667C80.558 32 85.3337 36.7756 85.3337 42.6667V85.3333C85.3337 91.2244 80.558 96 74.667 96H21.3337C15.4426 96 10.667 91.2244 10.667 85.3333V42.6667C10.667 36.7756 15.4426 32 21.3337 32Z"
        stroke="currentColor"
        strokeWidth="10.6667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

PlaceholderVideo.displayName = 'PlaceholderVideo'

export default PlaceholderVideo
