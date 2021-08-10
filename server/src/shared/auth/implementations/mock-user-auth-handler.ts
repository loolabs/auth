import { Result } from '../../core/result'
import {
  UserAuthHandler,
  UserAuthHandlerCreateOptions,
  UserAuthHandlerCreateResponse,
  UserAuthHandlerLoginOptions,
  UserAuthHandlerLoginResponse,
  UserAuthHandlerLoginSuccess,
} from '../user-auth-handler'
import { AppError } from '../../core/app-error'
import { AuthCodeString } from '../../../modules/users/domain/value-objects/auth-code'
import { mocks } from '../../../test-utils'
import { CreateUserDTOBody } from '../../../modules/users/application/use-cases/create-user/create-user-dto'
import { UserMap } from '../../../modules/users/mappers/user-map'

export const LOGIN_ERROR = 'login_error'
export const CREATE_ERROR = 'create_error'

//add implementation-specific auth functions here
export class MockUserAuthHandler implements UserAuthHandler {
  async login(options: UserAuthHandlerLoginOptions): Promise<UserAuthHandlerLoginResponse> {
    return new Promise((resolve) => {
      if (options.req.body.status == LOGIN_ERROR) {
        resolve(Result.err(new AppError.UnexpectedError(LOGIN_ERROR)))
      } else {
        const authCodeString = new AuthCodeString('test_authcode_string')
        const createUserDTObody: CreateUserDTOBody = {
          email: 'john.doe@uwaterloo.ca',
          password: 'secret23',
        }
        const user = mocks.mockUser(createUserDTObody)
        const successResponse: UserAuthHandlerLoginSuccess = {
          cert: authCodeString,
          user: UserMap.toDTO(user),
        }
        resolve(Result.ok(successResponse))
      }
    })
  }

  async create(options: UserAuthHandlerCreateOptions): Promise<UserAuthHandlerCreateResponse> {
    if (options.userId == CREATE_ERROR)
      return Result.err(new AppError.UnexpectedError('Account creation failed'))
    const authCodeString = new AuthCodeString('test_authcode_string')
    return Result.ok(authCodeString)
  }
}
