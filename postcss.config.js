const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
  plugins: [
    ...(isDev
      ? []
      : [
          require('cssnano')({
            preset: [
              'default',
              {
                discardComments: { removeAll: true }
              }
            ]
          })
        ]),
    require('autoprefixer'),
    require('postcss-import')
  ]
}
