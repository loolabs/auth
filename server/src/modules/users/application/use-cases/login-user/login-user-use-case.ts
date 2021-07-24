import { UseCaseWithDTO } from '../../../../../shared/app/use-case-with-dto'
import { UserAuthHandler, UserAuthHandlerLoginError, UserAuthHandlerLoginResponse } from '../../../../../shared/auth/user-auth-handler'
import  '../../../../../shared/auth/user-auth-handler'
import { LoginUserDTO } from './login-user-dto'
import { ParamList, ParamPair } from '../../../../../shared/app/param-list'
import { AppError } from '../../../../../shared/core/app-error'
import { LoginUserErrors } from './login-user-errors'
import { Result } from '../../../../../shared/core/result'
import { UserDTO } from '../../../mappers/user-dto'
import { CreateUserErrors } from '../create-user/create-user-errors'

export type LoginUserUseCaseError =
  | LoginUserErrors.InvalidOpenIDParamsError
  | UserAuthHandlerLoginError
  | AppError.UnexpectedError

export interface LoginUserSuccessRedirect  {
  redirectParams: ParamList
  redirectUrl: string
}

export interface LoginUserSuccessUser  {
  user: UserDTO
}

export type LoginUserSuccess =  LoginUserSuccessRedirect | LoginUserSuccessUser 

export type LoginUserUseCaseResponse = Result<LoginUserSuccess, LoginUserUseCaseError>

export const OPEN_ID_SCOPE = 'open_id'
export const OPEN_ID_RESPONSE_TYPE = 'code'

export class LoginUserUseCase
  implements UseCaseWithDTO<LoginUserDTO, LoginUserUseCaseResponse> {
  private userAuthHandler: UserAuthHandler

  constructor(userAuthHandler: UserAuthHandler) {
    this.userAuthHandler = userAuthHandler
  }

  async execute(dto: LoginUserDTO): Promise<LoginUserUseCaseResponse> {
    const userAuthHandlerLoginOptions = {
      req: dto.req,
      res: dto.res,
      params: dto.params
    }
    const userAuthHandlerLoginResponse: UserAuthHandlerLoginResponse = await this.userAuthHandler.login(userAuthHandlerLoginOptions)
    if(userAuthHandlerLoginResponse.isErr()){
      return Result.err(userAuthHandlerLoginResponse.error)
    } else {
      const params = dto.params;
      if(params && params.scope){
        if(params.scope !== OPEN_ID_SCOPE || params.response_type !== OPEN_ID_RESPONSE_TYPE){
          return Result.err(new CreateUserErrors.InvalidOpenIDParamsError())
        }
      } 
      if(params && params.scope && userAuthHandlerLoginResponse.value.cert){
        const redirectParams = new ParamList([
          new ParamPair('code', userAuthHandlerLoginResponse.value.cert.getValue())
        ])
        const loginUserSuccessResponse: LoginUserSuccess = {
          redirectParams: redirectParams,
          redirectUrl: params.redirect_uri
        }
        return Result.ok(loginUserSuccessResponse)
      } else {
        const loginUserSuccessResponse: LoginUserSuccess = {
          user: userAuthHandlerLoginResponse.value.user
        }
        return Result.ok(loginUserSuccessResponse)
      }
    }
  }
}
