const shell = require('shelljs')
const crossEnv = require('cross-env')
const buidMode = process.argv[2].split('=')[1]

console.log(`\x1b[32m开始编译${buidMode}`)

// console.log('\033[40;32m',  'SATRT  开始编译${buidMode}')
console.log('当前构建版本为：')

const version = shell.exec('git describe --abbrev=0').stdout.trim()

if (!version && buidMode === 'production') {
  console.warn('\x1b[91m \n\nprd构建前请先打tag!\n')
}

const cmd = `BUILD_VERSION=${version} NODE_ENV=${buidMode} webpack --config=config/webpack.config.babel.js`
shell.exec('npm run clean')
crossEnv(cmd.split(' '))
