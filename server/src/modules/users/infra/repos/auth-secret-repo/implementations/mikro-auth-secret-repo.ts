import { EntityRepository } from '@mikro-orm/core'
import { Result } from '../../../../../../shared/core/result'
import { AuthSecretEntity } from '../../../../../../shared/infra/db/entities/auth-secret.entity'
import { DBError, DBErrors } from '../../../../../../shared/infra/db/errors/errors'
import { AuthSecret } from '../../../../domain/entities/auth-secret'
import { EncryptedClientSecret } from '../../../../domain/value-objects/encrypted-client-secret'
import { AuthSecretMap } from '../../../../mappers/auth-secret-map'
import { AuthSecretRepo } from '../../auth-secret-repo/auth-secret-repo'

export class MikroAuthSecretRepo implements AuthSecretRepo {
  constructor(protected authSecretEntityRepo: EntityRepository<AuthSecretEntity>) {}

  async exists(clientId: string, decodedRedirectUri?: string): Promise<Result<boolean, DBErrors>> {
    const authSecretEntity = await this.authSecretEntityRepo.findOne({
      clientId: clientId,
      ...{ decodedRedirectUri },
    })
    return Result.ok(authSecretEntity !== null)
  }

  async clientNameExists(clientName: string): Promise<Result<boolean, DBErrors>> {
    const authSecretEntity = await this.authSecretEntityRepo.findOne({
      clientName,
    })
    return Result.ok(authSecretEntity !== null)
  }

  async getAuthSecretByClientIdandSecret(
    clientId: string,
    clientSecret: EncryptedClientSecret
  ): Promise<Result<AuthSecret, DBErrors>> {
    const authSecret = await this.authSecretEntityRepo.findOne({ clientId: clientId })
    if (authSecret === null) return Result.err(new DBError.AuthSecretNotFoundError(clientId))

    const authSecretsEqual = await clientSecret.compareSecret(authSecret.encryptedClientSecret)
    if (authSecretsEqual.isOk() && !authSecretsEqual.value) {
      return Result.err(new DBError.AuthSecretsNotEqualError(clientSecret.value))
    }
    return Result.ok(AuthSecretMap.toDomain(authSecret))
  }

  async save(authSecret: AuthSecret): Promise<void> {
    const exists = await this.exists(authSecret.clientId)

    if (exists.isOk() && exists.value) return

    const authSecretEntity = await AuthSecretMap.toPersistence(authSecret)
    this.authSecretEntityRepo.persist(authSecretEntity)
    this.authSecretEntityRepo.flush()
  }
}
