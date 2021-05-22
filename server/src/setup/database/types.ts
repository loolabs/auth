import { UserRepo } from '../../modules/users/infra/repos/user-repo'

export interface Repos {
  user: UserRepo
}

export interface DB {
  repos: Repos
}
