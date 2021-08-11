import { Repos, DB } from './types'
import { MockUserRepo } from '../../modules/users/infra/repos/user-repo/implementations/mock-user-repo'
import { UserEntity } from '../../shared/infra/db/entities/user.entity'
import { MockAuthSecretRepo } from '../../modules/users/infra/repos/auth-secret-repo/implementations/mock-auth-secret-repo'
import { AuthSecretEntity } from '../../shared/infra/db/entities/auth-secret.entity'

interface MockEntities {
  users?: Array<UserEntity>
  authSecret?: Array<AuthSecretEntity>
}

interface MockRepos extends Repos {
  user: MockUserRepo
  authSecret: MockAuthSecretRepo
}

const setupMockRepos = (entities: MockEntities): MockRepos => {
  return {
    user: new MockUserRepo(entities.users),
    authSecret: new MockAuthSecretRepo(entities.authSecret)
  }
}

interface MockDB extends DB {
  repos: MockRepos
}

const setupMockDB = (entities: MockEntities): MockDB => {
  return {
    repos: setupMockRepos(entities),
  }
}

export { MockEntities, MockRepos, MockDB, setupMockDB }
