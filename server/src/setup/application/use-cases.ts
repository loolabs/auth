import { UseCases } from './types'
import { Repos } from '../database'
import { CreateUserUseCase } from '../../modules/users/application/use-cases/create-user/create-user-use-case'
import { LoginUserUseCase } from '../../modules/users/application/use-cases/login-user/login-user-use-case'
import { PassportUserAuthHandler } from '../../shared/auth/implementations/passport-user-auth-handler'
import { GetUserUseCase } from '../../modules/users/application/use-cases/get-user/get-user-use-case'
import { AuthenticateUserUseCase } from '../../modules/users/application/use-cases/authenticate-user/authenticate-user-use-case'
import { ProtectedUserUseCase } from '../../modules/users/application/use-cases/protected-user/protected-user-use-case'

export const setupUseCases = (repos: Repos): UseCases => {
  return {
    createUser: new CreateUserUseCase(new PassportUserAuthHandler(), repos.user),
    loginUser: new LoginUserUseCase(new PassportUserAuthHandler()),
    getUser: new GetUserUseCase(repos.user),
    authUser: new AuthenticateUserUseCase(repos.user),
    protectedUser: new ProtectedUserUseCase()
  }
}
