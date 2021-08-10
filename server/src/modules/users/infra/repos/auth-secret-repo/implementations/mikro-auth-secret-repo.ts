import { EntityRepository } from '@mikro-orm/core'
import { Result } from '../../../../../../shared/core/result'
import { AuthSecretEntity } from '../../../../../../shared/infra/db/entities/auth-secret.entity'
import { DBError, DBErrors } from '../../../../../../shared/infra/db/errors/errors'
import { AuthSecret } from '../../../../domain/entities/auth-secret'
import { AuthSecretMap } from '../../../../mappers/auth-secret-map'
import { AuthSecretRepo } from '../../auth-secret-repo/auth-secret-repo'

export class MikroAuthSecretRepo implements AuthSecretRepo {
  constructor(protected authSecretEntityRepo: EntityRepository<AuthSecretEntity>) {}

  async exists(clientId: string): Promise<Result<boolean, DBErrors>> {
    const authSecretEntity = await this.authSecretEntityRepo.findOne({
      clientId: clientId,
    })
    if (authSecretEntity !== null) {
      return Result.ok(authSecretEntity !== null)
    } else {
      return Result.err(new DBError.AuthSecretNotFoundError(clientId))
    }
  }

  async getAuthSecretByClientId(clientId: string): Promise<Result<AuthSecret, DBErrors>> {
    const authSecret = await this.authSecretEntityRepo.findOne({ clientId: clientId })
    if (authSecret === null) return Result.err(new DBError.AuthSecretNotFoundError(clientId))
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
