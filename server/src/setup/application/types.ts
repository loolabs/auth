import { CreateUserUseCase } from '../../modules/users/application/use-cases/create-user/create-user-use-case'
import { CreateUserController } from '../../modules/users/application/use-cases/create-user/create-user-controller'
import { LoginUserUseCase } from '../../modules/users/application/use-cases/login-user/login-user-use-case'
import { GetUserUseCase } from '../../modules/users/application/use-cases/get-user/get-user-use-case'
import { AuthenticateUserUseCase } from '../../modules/users/application/use-cases/authenticate-user/authenticate-user-use-case'
import { LoginUserController } from '../../modules/users/application/use-cases/login-user/login-user-controller'
import { ProtectedUserUseCase } from '../../modules/users/application/use-cases/protected-user/protected-user-use-case'
import { ProtectedUserController } from '../../modules/users/application/use-cases/protected-user/protected-user-controller'

export interface UseCases {
  createUser: CreateUserUseCase
  loginUser: LoginUserUseCase
  getUser: GetUserUseCase
  authUser: AuthenticateUserUseCase
  protectedUser: ProtectedUserUseCase
}

export interface Controllers {
  createUser: CreateUserController
  loginUser: LoginUserController,
  protectedUser: ProtectedUserController
}

export interface Application {
  useCases: UseCases
  controllers: Controllers
}
