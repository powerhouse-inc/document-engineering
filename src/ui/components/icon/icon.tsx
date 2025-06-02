import { type ComponentPropsWithoutRef, type CSSProperties, Suspense } from 'react'
import { iconComponents, type IconName } from '../icon-components/index.js'

export type Color = CSSProperties['color']
export type Size = CSSProperties['width']
export function getDimensions(size?: Size) {
  if (!size) return {}

  if (typeof size === 'number') {
    return {
      width: `${size}px`,
      height: `${size}px`,
    }
  }

  return {
    width: size,
    height: size,
  }
}

type IconProps = ComponentPropsWithoutRef<'svg'> & {
  readonly name: IconName
  readonly size?: Size
  readonly color?: Color
}

const Icon = ({ name, size = 24, color, style, ...props }: IconProps) => {
  const dimensions = getDimensions(size)
  const _style = {
    color,
    ...dimensions,
    style,
  }

  const IconComponent = iconComponents[name]

  return (
    // displays div with the same size while icon
    // loads to avoid UI displacement
    <Suspense fallback={<div data-testid="icon-fallback" style={dimensions} />} name="icon-component">
      <IconComponent data-testid="icon-fallback" {...props} style={_style} />
    </Suspense>
  )
}

export { Icon, type IconProps }
