import { mocks } from '../../../../../../test-utils'
import { AppError } from '../../../../../../shared/core/app-error'
import { Result } from '../../../../../../shared/core/result'
import { UserValueObjectErrors } from '../../../../domain/value-objects/errors'
import { CreateUserController } from '../create-user-controller'
import { CreateUserDTOBody } from '../create-user-dto'
import { CreateUserErrors } from '../create-user-errors'
import { CreateUserSuccess, CreateUserUseCase } from '../create-user-use-case'
import { UserMap } from '../../../../mappers/user-map'

describe('CreateUserController', () => {
  const createUserDTO: CreateUserDTOBody = {
    email: 'john.doe@uwaterloo.ca',
    password: 'secret23',
  }
  let createUserController: CreateUserController
  let createUserUseCase: CreateUserUseCase
  beforeAll(async () => {
    const createUser = await mocks.mockCreateUser()
    createUserController = createUser.createUserController
    createUserUseCase = createUser.createUserUseCase
  })

  test('When the CreateUserUseCase returns Ok, the CreateUserController returns 200 OK', async () => {
    const user = mocks.mockUser(createUserDTO)

    const useCaseResolvedValue: CreateUserSuccess = {
      user: UserMap.toDTO(user),
    }

    jest.spyOn(createUserUseCase, 'execute').mockResolvedValue(Result.ok(useCaseResolvedValue))

    const { req, res } = mocks.mockHandlerParams(createUserDTO)
    await createUserController.execute(req, res)
    expect(res.statusCode).toBe(200)
  })

  test('When the CreateUserUseCase returns UserValueObjectErrors.InvalidEmail, CreateUserController returns 400 Bad Request', async () => {
    jest
      .spyOn(createUserUseCase, 'execute')
      .mockResolvedValue(Result.err(new UserValueObjectErrors.InvalidEmail(createUserDTO.email)))

    const { req, res } = mocks.mockHandlerParams(createUserDTO)
    await createUserController.execute(req, res)
    expect(res.statusCode).toBe(400)
  })

  test('When the DTO is invalid, CreateUserController returns 400 Bad Request', async () => {
    const invalidCreateUserDTO = Object.assign({}, createUserDTO) as any // shallow copy
    invalidCreateUserDTO.email = 42

    const { req, res } = mocks.mockHandlerParams(invalidCreateUserDTO)
    await createUserController.execute(req, res)
    expect(res.statusCode).toBe(400)
  })

  test('When the CreateUserUseCase returns UserValueObjectErrors.InvalidSecretValue, CreateUserController returns 400 Bad Request', async () => {
    jest
      .spyOn(createUserUseCase, 'execute')
      .mockResolvedValue(
        Result.err(new UserValueObjectErrors.InvalidSecretValue(createUserDTO.password))
      )

    const { req, res } = mocks.mockHandlerParams(createUserDTO)
    await createUserController.execute(req, res)
    expect(res.statusCode).toBe(400)
  })

  test('When the CreateUserUseCase returns CreateUserErrors.EmailAlreadyExistsError, CreateUserController returns 409 Conflict', async () => {
    jest
      .spyOn(createUserUseCase, 'execute')
      .mockResolvedValue(
        Result.err(new CreateUserErrors.EmailAlreadyExistsError(createUserDTO.email))
      )

    const { req, res } = mocks.mockHandlerParams(createUserDTO)
    await createUserController.execute(req, res)
    expect(res.statusCode).toBe(409)
  })

  test('When the CreateUserUseCase returns AppError.UnexpectedError, CreateUserController returns 500 Internal Server Error', async () => {
    jest
      .spyOn(createUserUseCase, 'execute')
      .mockResolvedValue(Result.err(new AppError.UnexpectedError('Unexpected error')))

    const { req, res } = mocks.mockHandlerParams(createUserDTO)
    await createUserController.execute(req, res)
    expect(res.statusCode).toBe(500)
  })
})
