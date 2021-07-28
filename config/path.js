import path from 'path'

const ROOT_DIR = path.resolve(__dirname, '..')
const resolvePath = (...args) => path.resolve(ROOT_DIR, ...args)


export { resolvePath }
