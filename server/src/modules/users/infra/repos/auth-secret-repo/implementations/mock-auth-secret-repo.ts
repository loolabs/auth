import { Result } from '../../../../../../shared/core/result'
import { AuthSecretEntity } from '../../../../../../shared/infra/db/entities/auth-secret.entity'
import { DBError, DBErrors } from '../../../../../../shared/infra/db/errors/errors'
import { AuthSecret } from '../../../../domain/entities/auth-secret'
import { EncryptedClientSecret } from '../../../../domain/value-objects/encrypted-client-secret'
import { AuthSecretMap } from '../../../../mappers/auth-secret-map'
import { AuthSecretRepo } from '../auth-secret-repo'

export class MockAuthSecretRepo implements AuthSecretRepo {
  protected authSecretEntities: Map<string, AuthSecretEntity>

  constructor(authSecretEntities: Array<AuthSecretEntity> = []) {
    this.authSecretEntities = new Map(
      authSecretEntities.map((authSecretEntity) => [authSecretEntity.clientId, authSecretEntity])
    )
  }

  async exists(clientId: string): Promise<Result<boolean, DBErrors>> {
    return Result.ok(this.authSecretEntities.has(clientId))
  }

  async clientNameExists(clientName: string): Promise<Result<boolean, DBErrors>> {
    return Result.ok(this.authSecretEntities.has(clientName))
  }

  async getAuthSecretByClientIdandSecret(
    clientId: string,
    clientSecret: EncryptedClientSecret
  ): Promise<Result<AuthSecret, DBErrors>> {
    const authSecretEntity = this.authSecretEntities.get(clientId)
    if (
      authSecretEntity === undefined ||
      authSecretEntity.encryptedClientSecret != clientSecret.value
    ) {
      return Result.err(new DBError.AuthSecretNotFoundError(clientId))
    }
    return Result.ok(AuthSecretMap.toDomain(authSecretEntity))
  }

  async save(authSecret: AuthSecret): Promise<void> {
    const exists = await this.exists(authSecret.clientId)
    if (exists.isOk() && exists.value) return

    const authSecretEntity = await AuthSecretMap.toPersistence(authSecret)
    this.authSecretEntities.set(authSecretEntity.clientId, authSecretEntity)
    this.authSecretEntities.set(authSecretEntity.clientName, authSecretEntity)
  }
}
