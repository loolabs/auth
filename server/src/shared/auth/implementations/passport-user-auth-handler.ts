import passport from 'passport'
import { Result } from '../../core/result'
import { AuthenticateUserUseCaseResponse } from '../../../modules/users/application/use-cases/authenticate-user/authenticate-user-use-case'
import {
  UserAuthHandler,
  UserAuthHandlerCreateOptions,
  UserAuthHandlerCreateResponse,
  UserAuthHandlerLoginOptions,
  UserAuthHandlerLoginResponse,
  UserAuthHandlerLoginSuccess,
} from '../user-auth-handler'
import { AuthCode } from '../../../modules/users/domain/entities/auth-code'
import { AuthCodeString } from '../../../modules/users/domain/value-objects/auth-code'
import { UserMap } from '../../../modules/users/mappers/user-map'

//add implementation-specific auth functions here
export class PassportUserAuthHandler implements UserAuthHandler {
  async login(options: UserAuthHandlerLoginOptions): Promise<UserAuthHandlerLoginResponse> {
    return new Promise((resolve) => {
      passport.authenticate('local', function (err, user: AuthenticateUserUseCaseResponse) {
        if (err) resolve(Result.err(err))
        if (user.isErr()) {
          resolve(Result.err(user.error))
        } else {
          if (!options.params) {
            const successResponse: UserAuthHandlerLoginSuccess = { user: UserMap.toDTO(user.value) }
            options.req.login(user.value, function (err) {
              if (err) {
                resolve(Result.err(err))
              } else {
                resolve(Result.ok(successResponse))
              }
            })
          }
          const authCode = AuthCode.create({
            clientId: options.clientId,
            userId: user.value.userId.id.toString(),
            authCodeString: new AuthCodeString(),
          })
          if (authCode.isErr()) {
            resolve(Result.err(authCode.error))
          } else {
            const successResponse: UserAuthHandlerLoginSuccess = {
              cert: authCode.value.authCodeString,
              user: UserMap.toDTO(user.value),
            }
            options.req.login(user.value, function (err) {
              if (err) {
                resolve(Result.err(err))
              } else {
                resolve(Result.ok(successResponse))
              }
            })
          }
        }
      })(options.req, options.res)
    })
  }

  async create(options: UserAuthHandlerCreateOptions): Promise<UserAuthHandlerCreateResponse> {
    const authCode = AuthCode.create({
      clientId: options.clientId,
      userId: options.userId,
      authCodeString: new AuthCodeString(),
    })
    if (authCode.isErr()) {
      return Result.err(authCode.error)
    }
    return Result.ok(authCode.value.authCodeString)
  }
}
