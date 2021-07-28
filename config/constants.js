import { resolvePath } from './path'
// SDK名称
const NAME_SPACE = 'Liveroom'
const PORT = 3011
const SRC_DIR = resolvePath('src')
const BUILD_DIR = resolvePath('build')
const THIRD_PARTY = []

// SDK运行选项
const SDKOptions = {}
// SDK运行代码
const SDK_EXE = `${NAME_SPACE}.init(${JSON.stringify(SDKOptions)})`

export { PORT, SRC_DIR, BUILD_DIR, SDK_EXE, NAME_SPACE, THIRD_PARTY }
