import { type FocusTrap as FocusTrapInstance, type Options, createFocusTrap } from 'focus-trap'
import { Children, cloneElement, isValidElement, type ReactNode, useEffect, useRef } from 'react'

/**
 * Thin React wrapper around the ESM `focus-trap` package, providing the subset of
 * `focus-trap-react`'s API used by this package (`active` + `focusTrapOptions`).
 * `focus-trap-react` is published as CommonJS and calls `require('react')`, which breaks
 * in consumers that bundle this package's ESM output with `react` marked as external.
 *
 * Like `focus-trap-react`, the single child element is cloned and receives a ref so
 * the focus trap targets the child directly without adding a wrapper DOM node.
 */
export interface FocusTrapProps {
  active: boolean
  focusTrapOptions?: Options
  children: ReactNode
}

type MutableRefObject<T> = { current: T }
type ChildRef = ((instance: HTMLElement | null) => void) | MutableRefObject<HTMLElement | null> | null | undefined

export const FocusTrap = ({ active, focusTrapOptions, children }: FocusTrapProps) => {
  const elementRef = useRef<HTMLElement | null>(null)
  const trapRef = useRef<FocusTrapInstance | null>(null)

  useEffect(() => {
    if (!active) {
      if (trapRef.current) {
        trapRef.current.deactivate()
        trapRef.current = null
      }
      return
    }

    const node = elementRef.current
    if (!node) return

    const trap = createFocusTrap(node, focusTrapOptions)
    trapRef.current = trap
    trap.activate()

    return () => {
      trap.deactivate()
      if (trapRef.current === trap) {
        trapRef.current = null
      }
    }
    // focus-trap-react only (re)creates the trap on active toggle; options are read at
    // creation time only, matching that behavior.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  const child = Children.only(children)
  if (!isValidElement<{ ref?: ChildRef }>(child)) {
    throw new Error('FocusTrap: children must be a single valid React element.')
  }

  const originalRef = child.props.ref
  const mergedRef = (node: HTMLElement | null) => {
    elementRef.current = node
    if (typeof originalRef === 'function') {
      originalRef(node)
    } else if (originalRef && typeof originalRef === 'object' && 'current' in originalRef) {
      originalRef.current = node
    }
  }

  return cloneElement(child, { ref: mergedRef })
}
