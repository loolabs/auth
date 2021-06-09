import { AuthCodeRepo } from '../../modules/users/infra/repos/auth-code-repo/auth-code-repo';
import { AuthSecretRepo } from '../../modules/users/infra/repos/auth-secret-repo/auth-secret-repo';
import { UserRepo } from '../../modules/users/infra/repos/user-repo/user-repo'

export interface Repos {
  user: UserRepo,
  authCode: AuthCodeRepo,
  authSecret: AuthSecretRepo
}

export interface DB {
  repos: Repos
}
