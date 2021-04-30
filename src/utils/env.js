// 判断当前是哪个环境
const currentEnv = process.env.INIT_APP_ENV
const ctext = currentEnv !== 'prod' ? `开课吧${currentEnv}` : '开课吧'

// 不要删除，用来识别当前项目环境
console.log(
  `\n %c ${ctext} %c https://kaikeba.com \n`,
  'color: #fff; background: #03a8e8; padding:5px 0; font-size:12px;font-weight: bold;',
  'background: #03a8e8; padding:5px 0; font-size:12px;'
)

export const isDevEnv = currentEnv === 'dev'
export const isPreEnv = currentEnv === 'pre'
export const isTestEnv = currentEnv === 'test'
export const isProdEnv = currentEnv === 'prod'

const apiPrefix = {
  dev: 'test',
  test: 'test',
  pre: 'pre',
  prod: ''
}

export const getApiPrefix = apiPrefix[currentEnv]
export const apiBaseUrl = `https://open${getApiPrefix}.kaikeba.com/`
