// @ts-ignore: Ignore ts errors in setup files
const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(proxy(['/api/v1', '/storage'], { target: 'http://127.0.0.1:8000' }))
  app.use(
    proxy(['/public'], {
      target: 'http://127.0.0.1:8000',
      pathRewrite: {
        '^/public': '/',
      }
    })
  )
}
