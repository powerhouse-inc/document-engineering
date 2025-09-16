import type { PrivateTableApiBase, TableApiBase } from './types.js'

/**
 * Creates a public API proxy that wraps a private table API implementation.
 * The proxy automatically filters out private methods (those starting with '_')
 * and provides access only to the public interface.
 */
function createPublicTableApi<TData>(privateApi: PrivateTableApiBase<TData>): TableApiBase<TData> {
  const mutedMethods = ['_getConfig', '_getState', '_createCellContext']

  return new Proxy(privateApi, {
    get(target, prop, receiver) {
      // Block access to private methods (those starting with _)
      if (typeof prop === 'string' && mutedMethods.includes(prop)) {
        throw new Error(`Access to private method '${prop}' is not allowed`)
      }

      // Get the value from the target
      const value: unknown = Reflect.get(target, prop, receiver)

      // If it's a function, bind it to the target to preserve 'this' context
      if (typeof value === 'function') {
        return (...args: unknown[]) => (value as (...args: unknown[]) => unknown).call(target, ...args)
      }

      return value
    },

    set(target, prop, value, receiver) {
      // Block setting private properties
      if (typeof prop === 'string' && mutedMethods.includes(prop)) {
        throw new Error(`Setting private property '${prop}' is not allowed`)
      }

      return Reflect.set(target, prop, value, receiver)
    },

    has(target, prop) {
      // Hide private properties from 'in' operator
      if (typeof prop === 'string' && mutedMethods.includes(prop)) {
        return false
      }

      return Reflect.has(target, prop)
    },

    ownKeys(target) {
      // Filter out private properties from Object.keys(), etc.
      return Reflect.ownKeys(target).filter((key) => typeof key !== 'string' || !mutedMethods.includes(key))
    },
  }) as TableApiBase<TData>
}

export { createPublicTableApi }
