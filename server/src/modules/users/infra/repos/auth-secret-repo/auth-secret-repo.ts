import { Result } from '../../../../../shared/core/result'
import { DBErrors } from '../../../../../shared/infra/db/errors/errors'
import { AuthSecret } from '../../../domain/entities/auth-secret'

export abstract class AuthSecretRepo {
  abstract exists(clientId: string): Promise<Result<boolean, DBErrors>>
  abstract getAuthSecretByClientId(clientId: string): Promise<Result<AuthSecret, DBErrors>>
  abstract save(authSecret: AuthSecret): Promise<void>
}
