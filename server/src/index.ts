import { db, app, http } from './setup'

interface AuthOptions {
  port: string
}

const auth = async (options: AuthOptions) => {
  const { orm, repos } = await db.setupMikroDB()
  const migrator = orm.getMigrator()
  await migrator.up()

  const { useCases, controllers } = app.setupApplication(repos)

  const { webServer } = http.setupWaterparkExpress(controllers, useCases, { mikroORM: orm })
  webServer.listen(options.port, () => {
    console.log(`WATERPARK AUTH server running on http://localhost:${port}/api/v1 🦆`)
  })
}

const port = process.env.PORT || '3002'
const options = { port }
auth(options)
