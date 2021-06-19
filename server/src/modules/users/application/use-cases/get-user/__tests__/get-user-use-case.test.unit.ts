import { Err, Result } from '../../../../../../shared/core/result'
import { User } from '../../../../domain/entities/user'
import { GetUserDTO } from '../get-user-dto'
import { GetUserUseCase } from '../get-user-use-case'
import { GetUserErrors } from '../get-user-errors'
import { mocks } from '../../../../../../test-utils'
import { CreateUserDTO } from '../../create-user/create-user-dto'
import { UserRepo } from '../../../../infra/repos/user-repo/user-repo'
import { DBError } from '../../../../../../shared/infra/db/errors/errors'

jest.mock('../../../../infra/repos/user-repo/implementations/mikro-user-repo')

describe('GetUserUseCase', () => {
  let userDTO: CreateUserDTO
  let userRepo: UserRepo
  let getUserDTO: GetUserDTO
  let getUserUseCase: GetUserUseCase

  beforeAll(async () => {
    const mockGetUser = await mocks.mockGetUser()
    userRepo = mockGetUser.userRepo
    getUserUseCase = mockGetUser.getUserUseCase
  })

  beforeEach(() => {
    getUserDTO = {
      userId: 'placeholder'
    }
    userDTO = {
      email: 'loolabs@uwaterloo.ca',
      password: 'password'
    }
  })

  test('When executed with valid DTO, should return the user', async () => {
    const mockUser = mocks.mockUser(userDTO)
    getUserDTO.userId = mockUser.id.toString()
    jest.spyOn(userRepo, 'getUserByUserId').mockResolvedValue(Result.ok(mockUser))
    const getUserResult = await getUserUseCase.execute(getUserDTO)
    expect(getUserResult.isOk()).toBe(true)
    if (getUserResult.isOk()) {
      expect(getUserResult.value).toBe(mockUser)
    }
  })

  test('When executed with invalid userId, should return GetUserErrors.GetUserByIdFailedError', async () => {
    const badUserId = getUserDTO.userId = 'incorrectUserId'
    jest.spyOn(userRepo, 'getUserByUserId').mockResolvedValue(Result.err(new DBError.UserNotFoundError(badUserId)))
    const getUserResult = await getUserUseCase.execute(getUserDTO)

    expect(getUserResult.isErr()).toBe(true)
    const getUserErr = getUserResult as Err<User, GetUserErrors.GetUserByIdFailedError>
    expect(getUserErr.error instanceof GetUserErrors.GetUserByIdFailedError).toBe(true)
  })
})
