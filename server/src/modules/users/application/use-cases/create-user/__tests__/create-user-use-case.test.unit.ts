import { mocks } from '../../../../../../test-utils'
import httpMocks from 'node-mocks-http'
import { Err, Result } from '../../../../../../shared/core/result'
import { UserRepo } from '../../../../infra/repos/user-repo/user-repo'
import { UserValueObjectErrors } from '../../../../domain/value-objects/errors'
import { CreateUserDTO } from '../create-user-dto'
import { CreateUserErrors } from '../create-user-errors'
import { CreateUserSuccess, CreateUserUseCase } from '../create-user-use-case'
import { DBError } from '../../../../../../shared/infra/db/errors/errors'

jest.mock('../../../../infra/repos/user-repo/implementations/mock-user-repo')

describe('CreateUserUseCase', () => {
  let createUserDTO: CreateUserDTO
  let userRepo: UserRepo
  let createUserUseCase: CreateUserUseCase

  beforeAll(async () => {
    const createUser = await mocks.mockCreateUser()
    userRepo = createUser.userRepo
    createUserUseCase = createUser.createUserUseCase
  })

  beforeEach(() => {
    createUserDTO = {
      req: httpMocks.createRequest(),
      res: httpMocks.createResponse(),
      body: {
        email: 'john.doe@uwaterloo.ca',
        password: 'secret23',
      },
    }
  })

  test('When executed with valid DTO, should save the user and return an Ok', async () => {
    const mockUser = mocks.mockUser(createUserDTO.body)
    jest
      .spyOn(userRepo, 'exists')
      .mockResolvedValue(Result.err(new DBError.UserNotFoundError(createUserDTO.body.email)))
    jest.spyOn(userRepo, 'getUserByUserEmail').mockResolvedValue(Result.ok(mockUser))

    const createUserResult = await createUserUseCase.execute(createUserDTO)

    expect(userRepo.save).toBeCalled()
    expect(createUserResult.isOk()).toBe(true)
  })

  test('When executed with invalid email, should return UserValueObjectErrors.InvalidEmail', async () => {
    createUserDTO.body.email = 'john.doe@mail.utoronto.ca'
    const createUserResult = await createUserUseCase.execute(createUserDTO)

    expect(createUserResult.isErr()).toBe(true)
    const createUserErr = createUserResult as Err<
      CreateUserSuccess,
      UserValueObjectErrors.InvalidEmail
    >
    expect(createUserErr.error instanceof UserValueObjectErrors.InvalidEmail).toBe(true)
  })

  test('When executed with invalid password, should return UserValueObjectErrors.InvalidSecretValue', async () => {
    createUserDTO.body.password = '2shrt'
    const createUserResult = await createUserUseCase.execute(createUserDTO)

    expect(createUserResult.isErr()).toBe(true)
    const createUserErr = createUserResult as Err<
      CreateUserSuccess,
      UserValueObjectErrors.InvalidSecretValue
    >
    expect(createUserErr.error instanceof UserValueObjectErrors.InvalidSecretValue).toBe(true)
  })

  test('When executed with email that already exists, should return CreateUserErrors.EmailAlreadyExistsError', async () => {
    jest.spyOn(userRepo, 'exists').mockResolvedValue(Result.ok(true))
    const createUserResult = await createUserUseCase.execute(createUserDTO)

    expect(createUserResult.isErr()).toBe(true)
    const createUserErr = createUserResult as Err<
      CreateUserSuccess,
      CreateUserErrors.EmailAlreadyExistsError
    >
    expect(createUserErr.error instanceof CreateUserErrors.EmailAlreadyExistsError).toBe(true)
  })
})
