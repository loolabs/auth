import { Repos, DB } from './types'
import { MockUserRepo } from '../../modules/users/infra/repos/implementations/mock-user-repo'
import { UserEntity } from '../../shared/infra/db/entities/user.entity'

interface MockEntities {
  users?: Array<UserEntity>
}

interface MockRepos extends Repos {
  user: MockUserRepo
}

const setupMockRepos = (entities: MockEntities): MockRepos => {
  return {
    user: new MockUserRepo(entities.users),
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
