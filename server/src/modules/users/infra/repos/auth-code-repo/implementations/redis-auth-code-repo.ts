import { Result } from '../../../../../../shared/core/result'
import { AuthCodeEntity } from '../../../../../../shared/infra/cache/entities/auth-code-entity'
import { RedisRepository } from '../../../../../../shared/infra/cache/redis-repository'
import { DBError, DBErrors } from '../../../../../../shared/infra/db/errors/errors'
import { AuthCode } from '../../../../domain/entities/auth-code'
import { AuthCodeString } from '../../../../domain/value-objects/auth-code'
import { AuthCodeMap } from '../../../../mappers/auth-code-map'
import { AuthCodeRepo } from '../auth-code-repo'

export const AUTH_CODE_CACHE_TTL_SECONDS = 300 //5 minutes

export class RedisAuthCodeRepo implements AuthCodeRepo {
  constructor(protected authCodeEntityRepo: RedisRepository<AuthCodeEntity>) {}

  async getAuthCodeFromAuthCodeString(authCodeString: AuthCodeString): Promise<Result<AuthCode, DBErrors>> {
    const authCode = await this.authCodeEntityRepo.getEntity(authCodeString.getValue())
    if (authCode.isErr()) return Result.err(new DBError.AuthSecretNotFoundError(authCodeString.getValue()))
    return Result.ok(AuthCodeMap.toDomain(authCode.value))
  }

  async save(authCode: AuthCode): Promise<void> {
    const authCodeEntity = await AuthCodeMap.toPersistence(authCode)
    this.authCodeEntityRepo.saveEntity(authCodeEntity, {mode: 'EX', value: AUTH_CODE_CACHE_TTL_SECONDS})
  }

  async delete(authCode: AuthCode): Promise<void> {
    const authCodeEntity = await AuthCodeMap.toPersistence(authCode)
    this.authCodeEntityRepo.removeEntity(authCodeEntity)
  }
}
