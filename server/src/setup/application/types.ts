import { CreateUserUseCase } from '../../modules/users/application/use-cases/create-user/create-user-use-case'
import { CreateUserController } from '../../modules/users/application/use-cases/create-user/create-user-controller'
import { LoginUserUseCase } from '../../modules/users/application/use-cases/login-user/login-user-use-case'
import { GetUserUseCase } from '../../modules/users/application/use-cases/get-user/get-user-use-case'
import { AuthenticateUserUseCase } from '../../modules/users/application/use-cases/authenticate-user/authenticate-user-use-case'
import { LoginUserController } from '../../modules/users/application/use-cases/login-user/login-user-controller'
import { AuthorizeUserUseCase } from '../../modules/users/application/use-cases/authorize-user/authorize-user-use-case'
import { DiscoverSPUseCase } from '../../modules/users/application/use-cases/discover-sp/discover-sp-use-case'
import { GetTokenUseCase } from '../../modules/users/application/use-cases/get-token/get-token-use-case'
import { AuthorizeUserController } from '../../modules/users/application/use-cases/authorize-user/authorize-user-controller'
import { DiscoverSPController } from '../../modules/users/application/use-cases/discover-sp/discover-sp-controller'
import { GetTokenController } from '../../modules/users/application/use-cases/get-token/get-token-controller'

export interface UseCases {
  createUser: CreateUserUseCase
  loginUser: LoginUserUseCase
  getUser: GetUserUseCase
  authenticateUser: AuthenticateUserUseCase
  authorizeUser: AuthorizeUserUseCase
  discoverSP: DiscoverSPUseCase
  getToken: GetTokenUseCase
}

export interface Controllers {
  createUser: CreateUserController
  loginUser: LoginUserController
  authorizeUser: AuthorizeUserController
  discoverSP: DiscoverSPController
  getToken: GetTokenController
}

export interface Application {
  useCases: UseCases
  controllers: Controllers
}
