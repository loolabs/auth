import { Result } from '../../../../../../shared/core/result'
import { AuthCodeEntity } from '../../../../../../shared/infra/cache/entities/auth-code-entity'
import { DBError, DBErrors } from '../../../../../../shared/infra/db/errors/errors'
import { AuthCode } from '../../../../domain/entities/auth-code'
import { AuthCodeString } from '../../../../domain/value-objects/auth-code'
import { AuthCodeMap } from '../../../../mappers/auth-code-map'
import { AuthCodeRepo } from '../auth-code-repo'

export class MockAuthCodeRepo implements AuthCodeRepo {
  protected authCodeEntities: Map<string, AuthCodeEntity>

  constructor(authCodeEntities: Array<AuthCodeEntity> = []) {
    this.authCodeEntities = new Map(
      authCodeEntities.map((authCodeEntity) => [authCodeEntity.clientId, authCodeEntity])
    )
  }

  async getAuthCodeFromAuthCodeString(
    authCodeString: AuthCodeString
  ): Promise<Result<AuthCode, DBErrors>> {
    const authCodeEntity = this.authCodeEntities.get(authCodeString.getValue())

    if (authCodeEntity === undefined) {
      return Result.err(new DBError.AuthCodeNotFoundError(authCodeString.getValue()))
    }
    return Result.ok(AuthCodeMap.toDomain(authCodeEntity))
  }

  async save(authCode: AuthCode): Promise<void> {
    const authCodeEntity = await AuthCodeMap.toPersistence(authCode)
    this.authCodeEntities.set(authCodeEntity.authCodeString, authCodeEntity)
  }

  async delete(authCode: AuthCode): Promise<void> {
    this.authCodeEntities.delete(authCode.clientId)
  }
}
