import { UseCases, Controllers } from './types'
import { CreateUserController } from '../../modules/users/application/use-cases/create-user/create-user-controller'
import { LoginUserController } from '../../modules/users/application/use-cases/login-user/login-user-controller'
import { AuthorizeUserController } from '../../modules/users/application/use-cases/authorize-user/authorize-user-controller'
import { DiscoverSPController } from '../../modules/users/application/use-cases/discover-sp/discover-sp-controller'
import { GetTokenController } from '../../modules/users/application/use-cases/get-token/get-token-controller'

export const setupControllers = (useCases: UseCases): Controllers => {
  return {
    createUser: new CreateUserController(useCases.createUser),
    loginUser: new LoginUserController(useCases.loginUser),
    authorizeUser: new AuthorizeUserController(useCases.authorizeUser),
    discoverSP: new DiscoverSPController(useCases.discoverSP),
    getToken: new GetTokenController(useCases.getToken),
  }
}
