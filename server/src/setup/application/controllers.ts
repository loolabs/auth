import { UseCases, Controllers } from './types'
import { CreateUserController } from '../../modules/users/application/use-cases/create-user/create-user-controller'
import { LoginUserController } from '../../modules/users/application/use-cases/login-user/login-user-controller'
import { ProtectedUserController } from '../../modules/users/application/use-cases/protected-user/protected-user-controller'

export const setupControllers = (useCases: UseCases): Controllers => {
  return {
    createUser: new CreateUserController(useCases.createUser),
    loginUser: new LoginUserController(useCases.loginUser),
    protectedUser: new ProtectedUserController(useCases.protectedUser)
  }
}
