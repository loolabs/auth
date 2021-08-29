import { UseCaseWithDTO } from '../../../../../shared/app/use-case-with-dto'
import { AppError } from '../../../../../shared/core/app-error'
import { Result } from '../../../../../shared/core/result'
import { AuthorizeUserDTO } from './authorize-user-dto'
import { AuthorizeUserErrors } from './authorize-user-errors'
import { ParamList, ParamPair } from '../../../../../shared/app/param-list'
import { AuthCodeRepo } from '../../../infra/repos/auth-code-repo/auth-code-repo'
import { AuthSecretRepo } from '../../../infra/repos/auth-secret-repo/auth-secret-repo'
import { AuthCode } from '../../../domain/entities/auth-code'
import { AuthCodeString } from '../../../domain/value-objects/auth-code-string'
import { User } from '../../../domain/entities/user'

export type AuthorizeUserUseCaseClientError =
  | AuthorizeUserErrors.InvalidRequestParameters
  | AppError.UnexpectedError

export type AuthorizeUserUseCaseRedirectError = {
  redirectParams: ParamList
  redirectUrl: string
}

export type AuthorizeUserUseCaseError =
  | AuthorizeUserUseCaseClientError
  | AuthorizeUserUseCaseRedirectError

export interface AuthorizeUserSuccess {
  redirectParams: ParamList
  redirectUrl: string
}

export type AuthorizeUserUseCaseResponse = Result<AuthorizeUserSuccess, AuthorizeUserUseCaseError>

export class AuthorizeUserUseCase
  implements UseCaseWithDTO<AuthorizeUserDTO, AuthorizeUserUseCaseResponse>
{
  constructor(private authCodeRepo: AuthCodeRepo, private authSecretRepo: AuthSecretRepo) {}

  async execute(dto: AuthorizeUserDTO): Promise<AuthorizeUserUseCaseResponse> {
    const params = dto.params
    const decodedUri = decodeURI(params.redirect_uri)
    const authSecretExists = await this.authSecretRepo.exists(params.client_id, decodedUri)
    if (authSecretExists.isErr() || authSecretExists.value === false) {
      return Result.err(new AuthorizeUserErrors.InvalidRequestParameters())
    }
    const user = dto.req.user as User
    if (user === undefined) {
      const redirectParams = new ParamList(
        Object.entries(params).map((paramPair) => new ParamPair(paramPair[0], paramPair[1]))
      )
      return Result.err({
        redirectParams,
        redirectUrl: `${process.env.PUBLIC_HOST}/login`,
      })
    }
    const authCode = AuthCode.create({
      clientId: params.client_id,
      userId: user.userId.id.toString(),
      userEmail: user.email.value,
      userEmailVerified: user.isEmailVerified || false,
      authCodeString: new AuthCodeString(),
    })
    if (authCode.isErr()) {
      return Result.err(new AppError.UnexpectedError('Authcode creation failed'))
    }
    await this.authCodeRepo.save(authCode.value)
    const redirectParams = new ParamList([
      new ParamPair('code', authCode.value.authCodeString.getValue()),
    ])
    const AuthorizeUserSuccessResponse: AuthorizeUserSuccess = {
      redirectParams: redirectParams,
      redirectUrl: params.redirect_uri,
    }

    return Result.ok(AuthorizeUserSuccessResponse)
  }
}
