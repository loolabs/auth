import { EntityRepository } from '@mikro-orm/core'
import { Result } from '../../../../../../shared/core/result'
import { AuthCodeEntity } from '../../../../../../shared/infra/db/entities/auth-code.entity'
import { DBError, DBErrors } from '../../../../../../shared/infra/db/errors/errors'
import { AuthCode } from '../../../../domain/entities/auth-code'
import { AuthCodeString } from '../../../../domain/value-objects/auth-code'
import { AuthCodeMap } from '../../../../mappers/auth-code-map'
import { AuthCodeRepo } from '../auth-code-repo'

export class MikroAuthCodeRepo implements AuthCodeRepo {
  constructor(protected authCodeEntityRepo: EntityRepository<AuthCodeEntity>) {}

  async getAuthCodeFromAuthCodeString(authCodeString: AuthCodeString): Promise<Result<AuthCode, DBErrors>> {
    const authCode = await this.authCodeEntityRepo.findOne({ clientId: authCodeString.getValue() })
    if (authCode === null) return Result.err(new DBError.AuthSecretNotFoundError(authCodeString.getValue()))
    return Result.ok(AuthCodeMap.toDomain(authCode))
  }

  async save(authCode: AuthCode): Promise<void> {
    const authCodeEntity = await AuthCodeMap.toPersistence(authCode)
    this.authCodeEntityRepo.persist(authCodeEntity)
    this.authCodeEntityRepo.flush()
  }

  async delete(authCode: AuthCode): Promise<void> {
    const authCodeEntity = await AuthCodeMap.toPersistence(authCode)
    this.authCodeEntityRepo.remove(authCodeEntity)
    this.authCodeEntityRepo.flush()
  }
}
