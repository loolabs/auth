import { GetTokenUseCase } from '../../../modules/users/application/use-cases/get-token/get-token-use-case'
import { GetTokenController } from '../../../modules/users/application/use-cases/get-token/get-token-controller'
import { MockAuthCodeRepo } from '../../../modules/users/infra/repos/auth-code-repo/implementations/mock-auth-code-repo'
import { AuthCodeEntity } from '../../../shared/infra/cache/entities/auth-code-entity'
import { MockAuthSecretRepo } from '../../../modules/users/infra/repos/auth-secret-repo/implementations/mock-auth-secret-repo'
import { AuthSecretEntity } from '../../../shared/infra/db/entities/auth-secret.entity'

const mockGetToken = async (
  authCodeEntities: Array<AuthCodeEntity> = [],
  authSecretEntities: Array<AuthSecretEntity> = []
) => {
  const authCodeRepo = new MockAuthCodeRepo(authCodeEntities)
  const authSecretRepo = new MockAuthSecretRepo(authSecretEntities)
  const getTokenUseCase = new GetTokenUseCase(authCodeRepo, authSecretRepo)
  const getTokenController = new GetTokenController(getTokenUseCase)

  return { getTokenUseCase, getTokenController }
}

export { mockGetToken }
