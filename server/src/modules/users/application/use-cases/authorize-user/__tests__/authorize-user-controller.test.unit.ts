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

describe('AuthorizeUserController', () => {
  let authorizeUserDTO: AuthorizeUserDTO
  let authorizeUserUseCase: AuthorizeUserUseCase
  let authorizeUserController: AuthorizeUserController
  let mockResponse: express.Response

  beforeAll(async () => {
    const authorizeUser = await mocks.mockAuthorizeUser()
    authorizeUserController = authorizeUser.authorizeUserController
    authorizeUserUseCase = authorizeUser.authorizeUserUseCase
    mockResponse = httpMocks.createResponse()
    authorizeUserDTO = {
      req: httpMocks.createRequest(),
      params: {
        client_id: '6a88757bceaddaf03540dbd891dfb828',
        response_type: 'code',
        redirect_uri: 'www.loolabs.org',
        scope: 'openid',
      },
    }
  })

  test('When the AuthorizeUserUseCase returns Ok, the AuthorizeUserController returns 302 Redirect', async () => {
    const useCaseResolvedValue = {
      redirectParams: new ParamList([new ParamPair('type', 'test')]),
      redirectUrl: 'www.loolabs.org',
    }
    jest.spyOn(authorizeUserUseCase, 'execute').mockResolvedValue(Result.ok(useCaseResolvedValue))

    const result = await authorizeUserController.executeImpl(authorizeUserDTO, mockResponse)
    expect(result.statusCode).toBe(302)
  })

  test('When the AuthorizeUserUseCase returns AuthorizeUserErrors.InvalidRequestParameters, AuthorizeUserController returns 400 Bad Request', async () => {
    jest
      .spyOn(authorizeUserUseCase, 'execute')
      .mockResolvedValue(Result.err(new AuthorizeUserErrors.InvalidRequestParameters()))

    const result = await authorizeUserController.executeImpl(authorizeUserDTO, mockResponse)

    expect(result.statusCode).toBe(400)
  })

  test('When the AuthorizeUserUseCase returns AuthorizeUserErrors.UserNotAuthenticated, AuthorizeUserController returns 302 Redirect', async () => {
    const useCaseErrorValue = {
      redirectParams: new ParamList([new ParamPair('type', 'test')]),
      redirectUrl: 'www.loolabs.org',
    }
    jest.spyOn(authorizeUserUseCase, 'execute').mockResolvedValue(Result.err(useCaseErrorValue))

    const result = await authorizeUserController.executeImpl(authorizeUserDTO, mockResponse)
    expect(result.statusCode).toBe(302)
  })

  test('When the AuthorizeUserUseCase returns AppError.UnexpectedError, AuthorizeUserController returns 500 Internal Server Error', async () => {
    jest
      .spyOn(authorizeUserUseCase, 'execute')
      .mockResolvedValue(Result.err(new AppError.UnexpectedError('Unexpected error')))

    const result = await authorizeUserController.executeImpl(authorizeUserDTO, mockResponse)

    expect(result.statusCode).toBe(500)
  })
})
