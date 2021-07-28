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
                discardComments: { removeAll: true },
                normalizeUrl: false
              }
            ]
          })
        ]),
    require('autoprefixer'),
    require('postcss-import')
  ]
}
