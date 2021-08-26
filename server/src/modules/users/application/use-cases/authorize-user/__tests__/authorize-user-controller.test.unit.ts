import express from 'express'
import httpMocks from 'node-mocks-http'
import { AppError } from '../../../../../../shared/core/app-error'
import { Result } from '../../../../../../shared/core/result'
import { AuthorizeUserDTO } from '../authorize-user-dto'
import { AuthorizeUserErrors } from '../authorize-user-errors'
import { AuthorizeUserUseCase } from '../authorize-user-use-case'
import { AuthorizeUserController } from '../authorize-user-controller'
import { mocks } from '../../../../../../test-utils'
import { ParamList, ParamPair } from '../../../../../../shared/app/param-list'

jest.mock('../authorize-user-use-case')
jest.mock('../authorize-user-use-case')

describe('AuthorizeUserController', () => {
  let authorizeUserDTO: AuthorizeUserDTO
  let authorizeUserController: AuthorizeUserController
  let mockResponse: express.Response

  beforeAll(async () => {
    const authorizeUser = await mocks.mockAuthorizeUser()
    authorizeUserController = authorizeUser.authorizeUserController
    mockResponse = httpMocks.createResponse()
    authorizeUserDTO = {
      req: httpMocks.createRequest(),
      params: {
        client_id: 'i291u92jksdn',
        response_type: 'code',
        redirect_uri: 'www.loolabs.com',
        scope: 'openid',
      },
    }
  })

  test('When the AuthorizeUserUseCase returns Ok, the AuthorizeUserController returns 302 Redirect', async () => {
    const useCaseResolvedValue = {
      redirectParams: new ParamList([new ParamPair('type', 'test')]),
      redirectUrl: 'test@loolabs.com',
    }
    jest
      .spyOn(AuthorizeUserUseCase.prototype, 'execute')
      .mockResolvedValue(Result.ok(useCaseResolvedValue))

    const result = await authorizeUserController.executeImpl(authorizeUserDTO, mockResponse)
    expect(result.statusCode).toBe(302)
  })

  test('When the AuthorizeUserUseCase returns AuthorizeUserErrors.InvalidRequestParameters, AuthorizeUserController returns 400 Bad Request', async () => {
    jest
      .spyOn(AuthorizeUserUseCase.prototype, 'execute')
      .mockResolvedValue(Result.err(new AuthorizeUserErrors.InvalidRequestParameters()))

    const result = await authorizeUserController.executeImpl(authorizeUserDTO, mockResponse)

    expect(result.statusCode).toBe(400)
  })

  test('When the AuthorizeUserUseCase returns AuthorizeUserErrors.UserNotAuthenticated, AuthorizeUserController returns 302 Redirect', async () => {
    const useCaseErrorValue = {
      redirectParams: new ParamList([new ParamPair('type', 'test')]),
      redirectUrl: 'test@loolabs.com',
    }
    jest
      .spyOn(AuthorizeUserUseCase.prototype, 'execute')
      .mockResolvedValue(Result.err(useCaseErrorValue))

    const result = await authorizeUserController.executeImpl(authorizeUserDTO, mockResponse)
    expect(result.statusCode).toBe(302)
  })

  test('When the AuthorizeUserUseCase returns AppError.UnexpectedError, AuthorizeUserController returns 500 Internal Server Error', async () => {
    jest
      .spyOn(AuthorizeUserUseCase.prototype, 'execute')
      .mockResolvedValue(Result.err(new AppError.UnexpectedError('Unexpected error')))

    const result = await authorizeUserController.executeImpl(authorizeUserDTO, mockResponse)

    expect(result.statusCode).toBe(500)
  })
})
