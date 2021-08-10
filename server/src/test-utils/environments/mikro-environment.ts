import { db, app, http, cache } from '../../setup'
import { TestEnvironment } from './environment'

export interface MikroEnvironmentVariables {
  webServer: http.WebServer
}

export class MikroTestEnvironment extends TestEnvironment<MikroEnvironmentVariables> {
  protected mikroDB!: db.MikroDB
  protected cacheDB!: cache.RedisCache
  protected application!: app.Application
  protected authExpress!: http.AuthExpress

  public async setup(): Promise<MikroEnvironmentVariables> {
    // must set environment variable DATABASE_URL to postgresql://loolabs:loolabs@localhost/clubs
    // to access postgres container on Docker
    // TODO: fix integration testing
    this.mikroDB = await db.setupMikroDB({ debug: false })
    this.cacheDB = await cache.setupRedisCache()

    this.application = app.setupApplication({ db: this.mikroDB, cache: this.cacheDB })
    const { controllers, useCases } = this.application

    this.authExpress = http.setupAuthExpress(controllers, useCases, { mikroORM: this.mikroDB.orm })
    const { webServer } = this.authExpress

    return { webServer }
  }

  public async teardown() {
    await this.mikroDB.orm.close()
  }
}
