import { Result } from '../../../../../shared/core/result'
import { DBErrors } from '../../../../../shared/infra/db/errors/errors'
import { AuthCode } from '../../../domain/entities/auth-code'
import { AuthCodeString } from '../../../domain/value-objects/auth-code'

export abstract class AuthCodeRepo {
  abstract getAuthCodeFromAuthCodeString(authCodeString: AuthCodeString): Promise<Result<AuthCode, DBErrors>>
  abstract save(authCode: AuthCode): Promise<void>
  abstract delete(authCode: AuthCode): Promise<void>
}
