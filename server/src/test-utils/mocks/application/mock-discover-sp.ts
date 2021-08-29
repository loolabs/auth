import { DiscoverSPUseCase } from '../../../modules/users/application/use-cases/discover-sp/discover-sp-use-case'
import { DiscoverSPController } from '../../../modules/users/application/use-cases/discover-sp/discover-sp-controller'
import { MockAuthSecretRepo } from '../../../modules/users/infra/repos/auth-secret-repo/implementations/mock-auth-secret-repo'
import { AuthSecretEntity } from '../../../shared/infra/db/entities/auth-secret.entity'

const mockDiscoverSP = async (authSecretEntities: Array<AuthSecretEntity> = []) => {
  const authSecretRepo = new MockAuthSecretRepo(authSecretEntities)
  const discoverSPUseCase = new DiscoverSPUseCase(authSecretRepo)
  const discoverSPController = new DiscoverSPController(discoverSPUseCase)

  return { discoverSPUseCase, discoverSPController }
}

export { mockDiscoverSP }
