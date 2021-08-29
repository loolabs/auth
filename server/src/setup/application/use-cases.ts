import { UseCases } from './types'
import { CreateUserUseCase } from '../../modules/users/application/use-cases/create-user/create-user-use-case'
import { LoginUserUseCase } from '../../modules/users/application/use-cases/login-user/login-user-use-case'
import { PassportUserAuthHandler } from '../../shared/auth/implementations/passport-user-auth-handler'
import { GetUserUseCase } from '../../modules/users/application/use-cases/get-user/get-user-use-case'
import { AuthenticateUserUseCase } from '../../modules/users/application/use-cases/authenticate-user/authenticate-user-use-case'
import { Persistence } from '../persistence/persistence'
import { AuthorizeUserUseCase } from '../../modules/users/application/use-cases/authorize-user/authorize-user-use-case'
import { GetTokenUseCase } from '../../modules/users/application/use-cases/get-token/get-token-use-case'
import { DiscoverSPUseCase } from '../../modules/users/application/use-cases/discover-sp/discover-sp-use-case'

export const setupUseCases = ({ db, cache }: Persistence): UseCases => {
  return {
    createUser: new CreateUserUseCase(new PassportUserAuthHandler(), db.repos.user),
    loginUser: new LoginUserUseCase(new PassportUserAuthHandler()),
    getUser: new GetUserUseCase(db.repos.user),
    authenticateUser: new AuthenticateUserUseCase(db.repos.user),
    authorizeUser: new AuthorizeUserUseCase(cache.repos.authCode, db.repos.authSecret),
    discoverSP: new DiscoverSPUseCase(db.repos.authSecret),
    getToken: new GetTokenUseCase(cache.repos.authCode, db.repos.authSecret),
  }
}
