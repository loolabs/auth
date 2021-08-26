import { UseCaseWithDTO } from '../../../../../shared/app/use-case-with-dto'
import '../../../../../shared/auth/user-auth-handler'
import { GetTokenDTO } from './get-token-dto'
import { AppError } from '../../../../../shared/core/app-error'
import { GetTokenErrors } from './get-token-errors'
import { Result } from '../../../../../shared/core/result'
import { AuthCodeRepo } from '../../../infra/repos/auth-code-repo/auth-code-repo'
import { AuthCodeString } from '../../../domain/value-objects/auth-code-string'
import { DBError } from '../../../../../shared/infra/db/errors/errors'
import { AuthSecretRepo } from '../../../infra/repos/auth-secret-repo/auth-secret-repo'
import { EncryptedClientSecret } from '../../../domain/value-objects/encrypted-client-secret'
import { AuthCode } from '../../../domain/entities/auth-code'
import jwt from 'jsonwebtoken'

export type GetTokenUseCaseError = GetTokenErrors.InvalidCredentials | AppError.UnexpectedError

export type GetTokenIdToken = string

export type GetTokenSupportedResponseType = GetTokenIdToken

export type GetTokenUseCaseResponse = Result<GetTokenSupportedResponseType, GetTokenUseCaseError>

export const ID_TOKEN_EXPIRY_TIME_SECONDS = 300 //5 minutes

export class GetTokenUseCase implements UseCaseWithDTO<GetTokenDTO, GetTokenUseCaseResponse> {
  private authCodeRepo
  private authSecretRepo

  constructor(authCodeRepo: AuthCodeRepo, authSecretRepo: AuthSecretRepo) {
    this.authCodeRepo = authCodeRepo
    this.authSecretRepo = authSecretRepo
  }

  async execute(dto: GetTokenDTO): Promise<GetTokenUseCaseResponse> {
    const authHeader = dto.authHeader
    const params = dto.params

    const authCodeString = new AuthCodeString(params.code)

    const authCodeResult = await this.authCodeRepo.getAuthCodeFromAuthCodeString(authCodeString)

    if (authCodeResult.isErr()) {
      if (authCodeResult.error.constructor === DBError.AuthCodeNotFoundError) {
        return Result.err(new GetTokenErrors.InvalidCredentials())
      } else {
        return Result.err(authCodeResult.error)
      }
    } else {
      const authHeaderValue = authHeader.split(' ')[1]
      const authHeaderValueDecoded = Buffer.from(authHeaderValue, 'base64').toString('utf-8')
      const serviceProviderCredentials = authHeaderValueDecoded.split(':')
      const clientId = serviceProviderCredentials[0]
      const clientSecret = serviceProviderCredentials[1]
      const encryptedClientSecret = EncryptedClientSecret.create({
        value: clientSecret,
        hashed: false,
      })
      if (encryptedClientSecret.isErr() || clientId != authCodeResult.value.clientId) {
        return Result.err(new GetTokenErrors.InvalidCredentials())
      }
      const authSecretResult = await this.authSecretRepo.getAuthSecretByClientIdandSecret(
        clientId,
        encryptedClientSecret.value
      )
      if (authSecretResult.isErr()) {
        return Result.err(new GetTokenErrors.InvalidCredentials())
      }
      this.authCodeRepo.delete(authCodeResult.value)
      const successResponse: GetTokenSupportedResponseType = this.generateIdToken(
        authCodeResult.value,
        encryptedClientSecret.value
      )

      return Result.ok(successResponse)
    }
  }

  private generateIdToken(authCode: AuthCode, authSecret: EncryptedClientSecret): GetTokenIdToken {
    //currently using HMAC symmetric signing via the client secret
    return jwt.sign(
      {
        iss: `${process.env.PUBLIC_HOST}`,
        sub: authCode.userId,
        aud: authCode.clientId,
        iat: new Date().getTime() / 1000,
        exp: (new Date().getTime() + ID_TOKEN_EXPIRY_TIME_SECONDS * 1000) / 1000,
        email: authCode.userEmail,
        email_verified: authCode.userEmailVerified,
      },
      authSecret.value
    )
  }
}
