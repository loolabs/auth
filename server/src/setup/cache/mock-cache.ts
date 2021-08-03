import { AuthCodeRepo } from '../../modules/users/infra/repos/auth-code-repo/auth-code-repo'
import { MockAuthCodeRepo } from '../../modules/users/infra/repos/auth-code-repo/implementations/mock-auth-code-repo'
import { AuthCodeEntity } from '../../shared/infra/cache/entities/auth-code-entity'
import { Repos, Cache } from './types'


interface MockEntities {
  authCodes?: Array<AuthCodeEntity>
}

interface MockRepos extends Repos {
  authCode: AuthCodeRepo
}

const setupMockRepos = (entities: MockEntities): MockRepos => {
  return {
    authCode: new MockAuthCodeRepo(entities.authCodes)
  }
}

interface MockDB extends Cache {
  repos: MockRepos
}

const setupMockDB = (entities: MockEntities): MockDB => {
  return {
    repos: setupMockRepos(entities),
  }
}

export { MockEntities, MockRepos, MockDB, setupMockDB }
