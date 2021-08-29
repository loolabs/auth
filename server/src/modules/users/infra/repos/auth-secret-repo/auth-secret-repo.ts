import { Result } from '../../../../../shared/core/result'
import { DBErrors } from '../../../../../shared/infra/db/errors/errors'
import { AuthSecret } from '../../../domain/entities/auth-secret'
import { EncryptedClientSecret } from '../../../domain/value-objects/encrypted-client-secret'

export abstract class AuthSecretRepo {
  abstract exists(clientId: string, decodedRedirectUri?: string): Promise<Result<boolean, DBErrors>>
  abstract clientNameExists(clientName: string): Promise<Result<boolean, DBErrors>>
  abstract getAuthSecretByClientIdandSecret(
    clientId: string,
    clientSecret: EncryptedClientSecret
  ): Promise<Result<AuthSecret, DBErrors>>
  abstract save(authSecret: AuthSecret): Promise<void>
}
