import { mocks } from '../../../../../../test-utils'
import { Err, Result } from '../../../../../../shared/core/result'
import { UserRepo } from '../../../../infra/repos/user-repo/user-repo'
import { UserValueObjectErrors } from '../../../../domain/value-objects/errors'
import { CreateUserDTO, CreateUserDTOBody } from '../create-user-dto'
import { CreateUserErrors } from '../create-user-errors'
import { CreateUserSuccess, CreateUserUseCase } from '../create-user-use-case'
import { DBError } from '../../../../../../shared/infra/db/errors/errors'

jest.mock('../../../../infra/repos/user-repo/implementations/mock-user-repo')

describe('CreateUserUseCase', () => {
  let createUserDTOBody: CreateUserDTOBody
  let createUserDTO: CreateUserDTO
  let userRepo: UserRepo
  let createUserUseCase: CreateUserUseCase

  beforeAll(async () => {
    const createUser = await mocks.mockCreateUser()
    userRepo = createUser.userRepo
    createUserUseCase = createUser.createUserUseCase
  })

  beforeEach(() => {
    createUserDTOBody = {
      email: 'john.doe@uwaterloo.ca',
      password: 'secret23',
    },
    createUserDTO = {
      body: createUserDTOBody
    }
  })

  test('When executed with valid DTO, should save the user and return an Ok', async () => {
    const mockUser = mocks.mockUser(createUserDTOBody)
    jest.spyOn(userRepo, 'exists').mockResolvedValue(Result.err(new DBError.UserNotFoundError(createUserDTOBody.email)))
    jest.spyOn(userRepo, 'getUserByUserEmail').mockResolvedValue(Result.ok(mockUser))
    
    const createUserResult = await createUserUseCase.execute(createUserDTO)

    expect(userRepo.save).toBeCalled()
    expect(createUserResult.isOk()).toBe(true)
  })

  test('When executed with invalid email, should return UserValueObjectErrors.InvalidEmail', async () => {
    createUserDTOBody.email = 'john.doe@mail.utoronto.ca'
    createUserDTO = {
      body: createUserDTOBody
    }
    const createUserResult = await createUserUseCase.execute(createUserDTO)

    expect(createUserResult.isErr()).toBe(true)
    const createUserErr = createUserResult as Err<CreateUserSuccess, UserValueObjectErrors.InvalidEmail>
    expect(createUserErr.error instanceof UserValueObjectErrors.InvalidEmail).toBe(true)
  })

  test('When executed with invalid password, should return UserValueObjectErrors.InvalidSecretValue', async () => {
    createUserDTOBody.password = '2shrt'
    createUserDTO = {
      body: createUserDTOBody,
    }
    const createUserResult = await createUserUseCase.execute(createUserDTO)

    expect(createUserResult.isErr()).toBe(true)
    const createUserErr = createUserResult as Err<CreateUserSuccess, UserValueObjectErrors.InvalidSecretValue>
    expect(createUserErr.error instanceof UserValueObjectErrors.InvalidSecretValue).toBe(true)
  })

  test('When executed with email that already exists, should return CreateUserErrors.EmailAlreadyExistsError', async () => {
    jest.spyOn(userRepo, 'exists').mockResolvedValue(Result.ok(true))
    createUserDTO = {
      body: createUserDTOBody
    }
    const createUserResult = await createUserUseCase.execute(createUserDTO)

    expect(createUserResult.isErr()).toBe(true)
    const createUserErr = createUserResult as Err<CreateUserSuccess, CreateUserErrors.EmailAlreadyExistsError>
    expect(createUserErr.error instanceof CreateUserErrors.EmailAlreadyExistsError).toBe(true)
  })
})
