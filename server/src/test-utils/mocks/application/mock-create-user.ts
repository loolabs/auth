import { MockUserRepo } from '../../../modules/users/infra/repos/user-repo/implementations/mock-user-repo'
import { CreateUserUseCase } from '../../../modules/users/application/use-cases/create-user/create-user-use-case'
import { CreateUserController } from '../../../modules/users/application/use-cases/create-user/create-user-controller'
import { User } from '../../../modules/users/domain/entities/user'
import { UserMap } from '../../../modules/users/mappers/user-map'
import { MockUserAuthHandler } from '../../../shared/auth/implementations/mock-user-auth-handler'

const mockCreateUser = async (users: Array<User> = []) => {
  const userRepo = new MockUserRepo(await Promise.all(users.map(UserMap.toPersistence)))
  const createUserUseCase = new CreateUserUseCase(new MockUserAuthHandler, userRepo)
  const createUserController = new CreateUserController(createUserUseCase)

  return { userRepo, createUserUseCase, createUserController }
}

export { mockCreateUser }
