import httpMocks from 'node-mocks-http'
import { AppError } from '../../../../../../shared/core/app-error'
import { Result } from '../../../../../../shared/core/result'
import { UserValueObjectErrors } from '../../../../domain/value-objects/errors'
import { UserMap } from '../../../../mappers/user-map'
import { LoginUserDTO } from '../login-user-dto'
import { LoginUserErrors } from '../login-user-errors'
import { LoginUserUseCase } from '../login-user-use-case'
import { LoginUserController } from '../login-user-controller'
import { mocks } from '../../../../../../test-utils'
import { CreateUserDTOBody } from '../../create-user/create-user-dto'

// TODO: how to show developer these mocks are necessary when building a controller? aka must be synced with buildController()
jest.mock('../../../../infra/repos/user-repo/implementations/mikro-user-repo')
jest.mock('../login-user-use-case')

describe('LoginUserController', () => {
  let loginUserDTO: LoginUserDTO
  let userDTO: CreateUserDTOBody
  let loginUserController: LoginUserController

  beforeAll(async () => {
    const loginUser = await mocks.mockLoginUser()
    loginUserController = loginUser.loginUserController
  })

  beforeEach(() => {
    userDTO = {
      email: 'loolabs@uwaterloo.ca',
      password: 'password',
    },
    loginUserDTO = {
      req: httpMocks.createRequest(),
      res: httpMocks.createResponse(),
      body: userDTO,
    }
  })

  test('When the LoginUserUseCase returns Ok, the LoginUserController returns 200 OK', async () => {
    const user = mocks.mockUser(userDTO)
    const useCaseResolvedValue = {
      user: UserMap.toDTO(user),
    }
    jest.spyOn(LoginUserUseCase.prototype, 'execute').mockResolvedValue(Result.ok(useCaseResolvedValue))

    const result = await loginUserController.executeImpl(loginUserDTO, loginUserDTO.res)

    expect(result.statusCode).toBe(200)
  })

  test('When the LoginUserUseCase returns UserValueObjectErrors.InvalidEmail, LoginUserController returns 400 Bad Request', async () => {
    jest
      .spyOn(LoginUserUseCase.prototype, 'execute')
      .mockResolvedValue(Result.err(new UserValueObjectErrors.InvalidEmail(userDTO.email)))

    const result = await loginUserController.executeImpl(loginUserDTO, loginUserDTO.res)

    expect(result.statusCode).toBe(400)
  })

  test('When the LoginUserUseCase returns UserValueObjectErrors.InvalidSecretValue, LoginUserController returns 400 Bad Request', async () => {
    const mockResponse = httpMocks.createResponse()
    jest
      .spyOn(LoginUserUseCase.prototype, 'execute')
      .mockResolvedValue(
        Result.err(new UserValueObjectErrors.InvalidSecretValue(userDTO.password))
      )

    const result = await loginUserController.executeImpl(loginUserDTO, mockResponse)

    expect(result.statusCode).toBe(400)
  })

  test('When the LoginUserUseCase returns LoginUserErrors.IncorrectPasswordError, LoginUserController returns 400 Unauthorized', async () => {
    jest
      .spyOn(LoginUserUseCase.prototype, 'execute')
      .mockResolvedValue(
        Result.err(new LoginUserErrors.IncorrectPasswordError())
      )

    const result = await loginUserController.executeImpl(loginUserDTO, loginUserDTO.res)

    expect(result.statusCode).toBe(400)
  })

  test('When the LoginUserUseCase returns AppError.UnexpectedError, LoginUserController returns 500 Internal Server Error', async () => {
    jest
      .spyOn(LoginUserUseCase.prototype, 'execute')
      .mockResolvedValue(Result.err(new AppError.UnexpectedError('Unexpected error')))

    const result = await loginUserController.executeImpl(loginUserDTO, loginUserDTO.res)

    expect(result.statusCode).toBe(500)
  })
})
