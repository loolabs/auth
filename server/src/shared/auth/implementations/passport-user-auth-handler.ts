import passport from 'passport'
import { Result } from '../../core/result'
import { AuthenticateUserUseCaseResponse } from '../../../modules/users/application/use-cases/authenticate-user/authenticate-user-use-case'
import {
  UserAuthHandler,
  UserAuthHandlerLoginOptions,
  UserAuthHandlerLoginResponse,
  UserAuthHandlerLoginSuccess,
} from '../user-auth-handler'
import { UserMap } from '../../../modules/users/mappers/user-map'

//add implementation-specific auth functions here
export class PassportUserAuthHandler implements UserAuthHandler {
  async login(options: UserAuthHandlerLoginOptions): Promise<UserAuthHandlerLoginResponse> {
    return new Promise((resolve) => {
      passport.authenticate('local', async function (err, user: AuthenticateUserUseCaseResponse) {
        if (err) {
          resolve(Result.err(err))
        } else if (user.isErr()) {
          resolve(Result.err(user.error))
        } else {
          const successResponse: UserAuthHandlerLoginSuccess = { user: UserMap.toDTO(user.value) }
          options.req.login(user.value, function (err) {
            if (err) {
              resolve(Result.err(err))
            } else {
              resolve(Result.ok(successResponse))
            }
          })
        }
      })(options.req, options.res)
    })
  }
}
