//import { mocks } from '..'
import { MikroEnvironmentVariables, MikroTestEnvironment } from './mikro-environment'

export class MockEntityMikroTestEnvironment extends MikroTestEnvironment {
  constructor(_ids: Array<any>) {
    super()
  }

  public async setup(): Promise<MikroEnvironmentVariables> {
    const variables = await super.setup()

    //const { entityRepos } = this.mikroDB

    return variables
  }

  public async teardown() {
    //const { entityRepos } = this.mikroDB

    await super.teardown()
  }
}
