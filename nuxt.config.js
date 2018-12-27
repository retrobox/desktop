module.exports = {
  mode: 'spa',
  head: {
    title: 'desktop',
    link: [
      {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons'}
    ]
  },
  loading: false, // Disable default loading bar
  build: {
    extend(config, {isDev, isClient}) {
      if (isDev && isClient) {
        // Run ESLint on save
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      // Extend only webpack config for client-bundle
      if (isClient) {
        config.target = 'electron-renderer'
      }
    }
  },
  dev: process.env.NODE_ENV === 'DEV',
  css: [
    'vuetify/dist/vuetify.min.css'
  ],
  plugins: [
    '~plugins/vuetify'
  ]
}
