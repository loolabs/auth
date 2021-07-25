import { AuthExpress } from './types'
import { setupVersionedAPIRouter } from './versioned-api-router'
import { BasicWebServerOptions, setupBasicWebServer } from './basic-web-server'
import { Controllers, UseCases } from '../../application'

interface AuthExpressOptions extends BasicWebServerOptions {}

const setupAuthExpress = (
  controllers: Controllers,
  useCases: UseCases,
  options: AuthExpressOptions
): AuthExpress => {
  const apiRouter = setupVersionedAPIRouter(controllers)
  const webServer = setupBasicWebServer(apiRouter, controllers, useCases, options)

  return {
    apiRouter,
    webServer,
  }
}

export { AuthExpressOptions as AuthExpressOptions, setupAuthExpress as setupAuthExpress }
