import { UseCaseWithDTO } from '../../../../../shared/app/use-case-with-dto'
import {
  UserAuthHandler,
  UserAuthHandlerLoginError,
  UserAuthHandlerLoginResponse,
} from '../../../../../shared/auth/user-auth-handler'
import '../../../../../shared/auth/user-auth-handler'
import { LoginUserDTO } from './login-user-dto'
import { ParamList, ParamPair } from '../../../../../shared/app/param-list'
import { AppError } from '../../../../../shared/core/app-error'
import { Result } from '../../../../../shared/core/result'
import { UserDTO } from '../../../mappers/user-dto'

export type LoginUserUseCaseError = UserAuthHandlerLoginError | AppError.UnexpectedError

export interface LoginUserSuccessRedirect {
  redirectParams: ParamList
  redirectUrl: string
}

export interface LoginUserSuccessUser {
  user: UserDTO
}

export type LoginUserSuccess = LoginUserSuccessRedirect | LoginUserSuccessUser

export type LoginUserUseCaseResponse = Result<LoginUserSuccess, LoginUserUseCaseError>

export class LoginUserUseCase implements UseCaseWithDTO<LoginUserDTO, LoginUserUseCaseResponse> {
  private userAuthHandler: UserAuthHandler

  constructor(userAuthHandler: UserAuthHandler) {
    this.userAuthHandler = userAuthHandler
  }

  async execute(dto: LoginUserDTO): Promise<LoginUserUseCaseResponse> {
    const userAuthHandlerLoginOptions = {
      req: dto.req,
      res: dto.res,
    }
    const userAuthHandlerLoginResponse: UserAuthHandlerLoginResponse =
      await this.userAuthHandler.login(userAuthHandlerLoginOptions)
    if (userAuthHandlerLoginResponse.isErr()) {
      return Result.err(userAuthHandlerLoginResponse.error)
    } else {
      const params = dto.params
      if (params) {
        const redirectParams = new ParamList(
          Object.entries(params).map((paramPair) => new ParamPair(paramPair[0], paramPair[1]))
        )
        const loginUserSuccessResponse: LoginUserSuccess = {
          redirectParams: redirectParams,
          redirectUrl: `${process.env.PUBLIC_HOST}/authorize`,
        }
        return Result.ok(loginUserSuccessResponse)
      } else {
        const loginUserSuccessResponse: LoginUserSuccess = {
          user: userAuthHandlerLoginResponse.value.user,
        }
        return Result.ok(loginUserSuccessResponse)
      }
    }
  }
}
