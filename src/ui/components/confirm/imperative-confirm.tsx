import { type ComponentType, useState } from 'react'
import { type Root, createRoot } from 'react-dom/client'

/**
 * ESM-native reimplementation of the minimal `react-confirm` surface used by this package.
 * `react-confirm` is published as CommonJS and calls `require('react')`, which breaks in
 * consumers that bundle this package's ESM output with `react` marked as external.
 * This module is API-compatible with react-confirm's default `createConfirmation`
 * (DOM-tree mounter) for the subset of functionality used by `confirm.tsx`.
 */

export type ConfirmDialogProps<P, R> = {
  dismiss: () => void
  proceed: (value: R) => void
  cancel: (value?: unknown) => void
  show: boolean
} & P

export type ConfirmDialog<P, R> = ComponentType<ConfirmDialogProps<P, R>>

type ConfirmableInjected<R> = {
  dispose: () => void
  resolve: (value: R) => void
  reject: (value?: unknown) => void
}

type ConfirmableComponent<P, R> = ComponentType<P & ConfirmableInjected<R>>

export const confirmable = <P, R>(Component: ConfirmDialog<P, R>): ConfirmableComponent<P, R> => {
  const Confirmable = ({ dispose, reject, resolve, ...other }: P & ConfirmableInjected<R>) => {
    const [show, setShow] = useState(true)

    const dismiss = () => {
      setShow(false)
      dispose()
    }

    const cancel = (value?: unknown) => {
      setShow(false)
      reject(value)
    }

    const proceed = (value: R) => {
      setShow(false)
      resolve(value)
    }

    return <Component cancel={cancel} dismiss={dismiss} proceed={proceed} show={show} {...(other as unknown as P)} />
  }
  return Confirmable
}

type MountRecord = { wrapper: HTMLElement; root: Root }
const DEFAULT_UNMOUNT_DELAY_MS = 1000

export const createConfirmation = <P, R>(
  Component: ConfirmableComponent<P, R>,
  unmountDelay: number = DEFAULT_UNMOUNT_DELAY_MS,
  mountingNode?: HTMLElement
): ((props: P) => Promise<R>) => {
  return (props: P) => {
    let record: MountRecord | undefined

    const dispose = () => {
      setTimeout(() => {
        if (!record) return
        const { wrapper, root } = record
        root.unmount()
        if (wrapper.parentNode) {
          wrapper.parentNode.removeChild(wrapper)
        }
        record = undefined
      }, unmountDelay)
    }

    const promise = new Promise<R>((resolve, reject) => {
      const host = mountingNode ?? document.body
      const wrapper = host.appendChild(document.createElement('div'))
      const root = createRoot(wrapper)
      record = { wrapper, root }

      root.render(
        <Component {...(props as P & ConfirmableInjected<R>)} dispose={dispose} resolve={resolve} reject={reject} />
      )
    })

    return promise.then(
      (result) => {
        dispose()
        return result
      },
      (error) => {
        dispose()
        return Promise.reject(error as Error)
      }
    )
  }
}
