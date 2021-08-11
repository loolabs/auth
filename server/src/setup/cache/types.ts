import { AuthCodeRepo } from '../../modules/users/infra/repos/auth-code-repo/auth-code-repo'

export interface Repos {
  authCode: AuthCodeRepo
}

export interface Cache {
  repos: Repos
}
