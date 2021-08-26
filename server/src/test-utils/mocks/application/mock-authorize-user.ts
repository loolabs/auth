import { AuthorizeUserUseCase } from '../../../modules/users/application/use-cases/authorize-user/authorize-user-use-case'
import { AuthorizeUserController } from '../../../modules/users/application/use-cases/authorize-user/authorize-user-controller'
import { AuthSecretEntity } from '../../../shared/infra/db/entities/auth-secret.entity'
import { AuthCodeEntity } from '../../../shared/infra/cache/entities/auth-code-entity'
import { MockAuthCodeRepo } from '../../../modules/users/infra/repos/auth-code-repo/implementations/mock-auth-code-repo'
import { MockAuthSecretRepo } from '../../../modules/users/infra/repos/auth-secret-repo/implementations/mock-auth-secret-repo'

const mockAuthorizeUser = async (
  authCodeEntities: Array<AuthCodeEntity> = [],
  authSecretEntities: Array<AuthSecretEntity> = []
) => {
  const authCodeRepo = new MockAuthCodeRepo(authCodeEntities)
  const authSecretRepo = new MockAuthSecretRepo(authSecretEntities)
  const authorizeUserUseCase = new AuthorizeUserUseCase(authCodeRepo, authSecretRepo)
  const authorizeUserController = new AuthorizeUserController(authorizeUserUseCase)

  return { authorizeUserUseCase, authorizeUserController }
}

export { mockAuthorizeUser }
