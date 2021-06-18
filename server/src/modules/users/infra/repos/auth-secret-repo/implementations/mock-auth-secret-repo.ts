import { Result } from '../../../../../../shared/core/result'
import { AuthSecretEntity } from '../../../../../../shared/infra/db/entities/auth-secret.entity'
import { DBError, DBErrors } from '../../../../../../shared/infra/db/errors/errors'
import { AuthSecret } from '../../../../domain/entities/auth-secret'
import { AuthSecretMap } from '../../../../mappers/auth-secret-map'
import { AuthSecretRepo } from '../auth-secret-repo'

export class MockAuthSecretRepo implements AuthSecretRepo {
  protected authSecretEntities: Map<string, AuthSecretEntity>

  constructor(authSecretEntities: Array<AuthSecretEntity> = []) {
    this.authSecretEntities = new Map(authSecretEntities.map((authSecretEntity) => 
      [authSecretEntity.clientId, authSecretEntity]
    ))
  }

  async getAuthSecretByClientId(clientId: string): Promise<Result<AuthSecret, DBErrors>> {
    const authSecretEntity = this.authSecretEntities.get(clientId)

    if(authSecretEntity === undefined){
      return Result.err(new DBError.AuthSecretNotFoundError(clientId))
    }
    return Result.ok(AuthSecretMap.toDomain(authSecretEntity))
  }
}
