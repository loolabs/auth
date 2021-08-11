import { db, app, http, cache } from './setup'

interface AuthOptions {
  port: string
}

const auth = async (options: AuthOptions) => {
  const dbRepo = await db.setupMikroDB()
  const cacheRepo = await cache.setupRedisCache()
  const migrator = dbRepo.orm.getMigrator()
  await migrator.up()

  const { useCases, controllers } = app.setupApplication({ db: dbRepo, cache: cacheRepo })

  const { webServer } = http.setupAuthExpress(controllers, useCases, { mikroORM: dbRepo.orm })
  webServer.listen(options.port, () => {
    console.log(`LOOLABS AUTH server running on http://localhost:${port}/api/v1 🦆`)
  })
}

const port = process.env.PORT || '3002'
const options = { port }
auth(options)
