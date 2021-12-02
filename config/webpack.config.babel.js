import webpack from 'webpack'
import HtmlPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import 'colors'
import dotenv from 'dotenv'
import getCSSModuleLocalIdent from 'react-dev-utils/getCSSModuleLocalIdent'
import {BUILD_DIR, NAME_SPACE, PORT, SDK_EXE, THIRD_PARTY} from './constants'
// import { resolvePath as resolve } from './path'

const path = require('path')
const fs = require('fs')

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)


const isDev = process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV === 'test'
const isPrd = !isDev && !isTest

console.log(`当前构建环境：${process.env.NODE_ENV}\n\n`.green)

const envParse = dotenv.config({
  path: resolveApp(`./.env.${process.env.NODE_ENV}`)
})
const env = envParse.parsed

const prdVersion = process.env.BUILD_VERSION || ''
const staticAssetName = isDev ? '[path][name].[ext]?[hash:8]' : '[hash:8].[ext]'

const thirdPartyJS = THIRD_PARTY
const getCssLoader = () => {
  return {
    loader: 'css-loader',
    options: {
      sourceMap: !isPrd,
      import: true
    }
  }
}
const cssLoader = getCssLoader()

const entry = {}
if (isPrd && prdVersion) {
  entry[
    `${NAME_SPACE.toLowerCase()}${isPrd && prdVersion ? `-${prdVersion}` : ''}`
    ] = './src/index.js'
} else {
  entry[`${NAME_SPACE.toLowerCase()}`] = './src/index.js'
}


if (!isDev) {
  // entry[`${NAME_SPACE.toLowerCase()}-latest`] = './src/index.js'
}

const options = {
  entry,
  mode: isPrd ? 'production' : 'development',
  output: {
    path: BUILD_DIR,
    filename: '[name].min.js',
    library: NAME_SPACE,
    libraryTarget: 'window',
    libraryExport: 'default'
  },
  devtool: !isPrd ? 'source-map' : 'none',
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': resolveApp('src'),
      utils: resolveApp('src/utils'),
      config: resolveApp('src/config'),
      comp: resolveApp('src/component'),
      api: resolveApp('src/api')
    }
  },

  devServer: {
    contentBase: BUILD_DIR,
    useLocalIp: true,
    compress: true,
    port: PORT,
    host: '0.0.0.0'
  },
  optimization: {
    minimize: !isDev,
    minimizer: [
      new TerserPlugin({
        sourceMap: !isPrd,
        terserOptions: {

          parse: {
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
            drop_console: isPrd
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true
          }
        }
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules|@babel(?:\/|\\{1,2})runtime/
      },
      {
        test: /\.css$/,
        use: ['style-loader', cssLoader, 'postcss-loader']
      },
      {
        test: /\.less$/,
        exclude: /\.module\.less$/,
        use: ['style-loader', cssLoader, 'postcss-loader', {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true
            }
          }
        }]
      },
      {
        test: /\.module\.less$/,
        use: ['style-loader', {
          loader: 'css-loader',
          options: {
            modules: {
              getLocalIdent: getCSSModuleLocalIdent
            },
            sourceMap: !isPrd,
            localsConvention: 'camelCase'
          }
        }, 'postcss-loader', {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true
            }
          }
        }]
      },
      {
        test: /\.(styl)$/,
        exclude: /\.module\.styl$/,
        use: ['style-loader', cssLoader, 'postcss-loader', 'stylus-loader']
      },
      {
        test: /\.module\.styl$/,
        // exclude: /\.styl$/,
        use: ['style-loader', {
          loader: 'css-loader',
          options: {
            modules: {
              getLocalIdent: getCSSModuleLocalIdent
            },
            sourceMap: !isPrd,
            localsConvention: 'camelCase'
          }
        }, 'postcss-loader', 'stylus-loader']
      },

      {
        test: /[\\/]?template[\\/].*[\s\S]+\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: isPrd,
              removeComments: isPrd,
              collapseWhitespace: isPrd
            }
          }
        ]
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: staticAssetName,
            limit: 4096
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlPlugin({
      hash: true,
      filename: 'index.html',
      template: './src/index.ejs',
      inject: 'head',
      files: {
        js: thirdPartyJS
      },
      SDKExec: SDK_EXE
    }),
    new webpack.DefinePlugin({
      __DEV__: isDev,
      __TEST__: isTest,
      __PRD__: isPrd,
      __VER__: JSON.stringify(prdVersion),
      'process.env': JSON.stringify(env)
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './public/',
          to: BUILD_DIR,
          filter: (fileName) => {
            return /.md$/.test(fileName)
          }
        }
      ]
    })
  ]
}

// if (isPrd) {
//   const prodPlugins = [
//     new uglify({
//       uglifyOptions: {
//         compress: {
//           drop_console: true
//         },
//         output: {
//           comments: false,
//           beautify: false
//         }
//       }
//     })
//   ]
//   options.plugins.push(...prodPlugins)
// }

export default options
