import { createContext } from 'react'

const ctxs = {}

const getContext = (name, defaultValue) => {
  let ctx = ctxs[name]
  if (!ctx) {
    ctx = ctxs[name] = createContext(defaultValue || {})
  }
  return ctx
}
export default getContext
