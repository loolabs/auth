import { Result } from '../../../../../shared/core/result'
import { DBErrors } from '../../../../../shared/infra/db/errors/errors'
import { AuthSecret } from '../../../domain/entities/auth-secret/auth-secret'

export abstract class AuthSecretRepo {
  abstract getAuthSecretByClientId(clientId: string): Promise<Result<AuthSecret, DBErrors>>
}
