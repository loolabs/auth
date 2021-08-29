import { UseCaseWithDTO } from '../../../../../shared/app/use-case-with-dto'
import '../../../../../shared/auth/user-auth-handler'
import { DiscoverSPDTO } from './discover-sp-dto'
import { AppError } from '../../../../../shared/core/app-error'
import { DiscoverSPErrors } from './discover-sp-errors'
import { Result } from '../../../../../shared/core/result'
import { AuthSecretRepo } from '../../../infra/repos/auth-secret-repo/auth-secret-repo'
import { EncryptedClientSecret } from '../../../domain/value-objects/encrypted-client-secret'
import { AuthSecret } from '../../../domain/entities/auth-secret'
import crypto from 'crypto'

export type DiscoverSPUseCaseError =
  | DiscoverSPErrors.ClientNameAlreadyInUse
  | AppError.UnexpectedError

export interface DiscoverSPSuccess {
  clientId: string
  clientSecret: string
}

export type DiscoverSPUseCaseResponse = Result<DiscoverSPSuccess, DiscoverSPUseCaseError>

export class DiscoverSPUseCase implements UseCaseWithDTO<DiscoverSPDTO, DiscoverSPUseCaseResponse> {
  constructor(private authSecretRepo: AuthSecretRepo) {}

  async execute(dto: DiscoverSPDTO): Promise<DiscoverSPUseCaseResponse> {
    const authSecretExists = await this.authSecretRepo.clientNameExists(dto.client_name)
    if (authSecretExists.isErr()) {
      return Result.err(
        new AppError.UnexpectedError('Unexpected error when validating client name.')
      )
    }
    if (authSecretExists.value) {
      return Result.err(new DiscoverSPErrors.ClientNameAlreadyInUse(dto.client_name))
    }
    const encryptedClientSecret = EncryptedClientSecret.create({
      value: crypto.randomBytes(32).toString('hex'),
      hashed: false,
    })
    if (encryptedClientSecret.isErr()) {
      return Result.err(
        new AppError.UnexpectedError('Unexpected error when creating client secret.')
      )
    }
    const authSecret = AuthSecret.create({
      clientName: dto.client_name,
      encryptedClientSecret: encryptedClientSecret.value,
      decodedRedirectUri: decodeURI(dto.redirect_uri),
      isVerified: false,
      clientId: crypto.randomBytes(32).toString('hex'),
    })
    if (authSecret.isErr()) {
      return Result.err(new AppError.UnexpectedError('Unexpected error when saving client secret.'))
    }
    await this.authSecretRepo.save(authSecret.value)
    return Result.ok({
      clientId: Buffer.from(authSecret.value.clientId).toString('base64'),
      clientSecret: Buffer.from(encryptedClientSecret.value.value).toString('base64'),
    })
  }
}
