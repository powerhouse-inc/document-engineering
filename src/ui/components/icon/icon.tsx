import { type IconName, iconComponents } from '../icon-components/index.js'
import type { Props } from '../icon-components/types.js'
import { type Color, getDimensions, type Size } from '@powerhousedao/design-system'
import { type ComponentPropsWithoutRef, type ComponentType, type ElementType, lazy, Suspense, useMemo } from 'react'

export type IconProps = ComponentPropsWithoutRef<'svg'> & {
  readonly name: IconName
  readonly size?: Size
  readonly color?: Color
}
export function Icon({ name, size = 24, color, style, ...props }: IconProps) {
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
