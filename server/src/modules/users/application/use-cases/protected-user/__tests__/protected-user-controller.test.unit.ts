import httpMocks from 'node-mocks-http'
import { Result } from '../../../../../../shared/core/result'
import { ProtectedUserDTO } from '../protected-user-dto'
import { ProtectedUserSuccess, ProtectedUserUseCase } from '../protected-user-use-case'
import { AppError } from '../../../../../../shared/core/app-error'
import { ProtectedUserController } from '../protected-user-controller'
import { mocks } from '../../../../../../test-utils'
import { CreateUserDTOBody } from '../../create-user/create-user-dto'

// TODO: how to show developer these mocks are necessary when building a controller? aka must be synced with buildController()
jest.mock('../../../../infra/repos/user-repo/implementations/mikro-user-repo')
jest.mock('../protected-user-use-case')

describe('ProtectedUserController', () => {

  let protectedUserDTO: ProtectedUserDTO
  let userDTO: CreateUserDTOBody
  let protectedUserController: ProtectedUserController
  beforeAll(async () => {
    const protectedUser = await mocks.mockProtectedUser()
    protectedUserController = protectedUser.protectedUserController
  })

  beforeEach(() => {
    userDTO = {
      email: 'loolabs@uwaterloo.ca',
      password: 'password',
    },
    protectedUserDTO = {
      user: mocks.mockUser(userDTO)
    }
  })
  
  test('When the ProtectedUserUserCase returns Ok, the ProtectedUserController returns 200 OK', async () => {
    const mockResponse = httpMocks.createResponse()
    const useCaseResolvedValue: ProtectedUserSuccess = {
      email: userDTO.email
    }
    jest.spyOn(ProtectedUserUseCase.prototype, 'execute').mockResolvedValue(Result.ok(useCaseResolvedValue))

    const result = await protectedUserController.executeImpl(protectedUserDTO, mockResponse)

    expect(result.statusCode).toBe(200)
  }),

  test('When the ProtectedUserUseCase returns AppError.UnexpectedError, ProtectedUserController returns 500 Internal Server Error', async () => {
    const mockResponse = httpMocks.createResponse()
    jest
      .spyOn(ProtectedUserUseCase.prototype, 'execute')
      .mockResolvedValue(Result.err(new AppError.UnexpectedError('Unexpected error')))

    const result = await protectedUserController.executeImpl(protectedUserDTO, mockResponse)

    expect(result.statusCode).toBe(500)
  })
})
