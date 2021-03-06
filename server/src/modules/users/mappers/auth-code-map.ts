import { AuthCodeEntity } from '../../../shared/infra/cache/entities/auth-code-entity'
import { AuthCode } from '../domain/entities/auth-code'
import { AuthCodeString } from '../domain/value-objects/auth-code'

export class AuthCodeMap {
  public static toDomain(authCodeEntity: AuthCodeEntity): AuthCode {
    const authCode = AuthCode.create({
      clientId: authCodeEntity.clientId,
      userId: authCodeEntity.clientId,
      authCodeString: new AuthCodeString(authCodeEntity.authCodeString),
    })
    if (authCode.isErr()) throw new Error() // TODO: check if we should handle error differently

    return authCode.value
  }

  public static async toPersistence(authCode: AuthCode): Promise<AuthCodeEntity> {
    const authCodeEntity = new AuthCodeEntity()
    authCodeEntity.clientId = authCode.clientId
    authCodeEntity.userId = authCode.userId
    authCodeEntity.authCodeString = authCode.authCodeString.getValue()

    return authCodeEntity
  }
}
