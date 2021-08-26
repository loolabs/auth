import express from 'express'
import httpMocks from 'node-mocks-http'
import { AppError } from '../../../../../../shared/core/app-error'
import { Result } from '../../../../../../shared/core/result'
import { GetTokenDTO } from '../get-token-dto'
import { GetTokenErrors } from '../get-token-errors'
import { GetTokenUseCase } from '../get-token-use-case'
import { GetTokenController } from '../get-token-controller'
import { mocks } from '../../../../../../test-utils'

jest.mock('../get-token-use-case')

describe('GetTokenController', () => {
  let getTokenDTO: GetTokenDTO
  let getTokenController: GetTokenController
  let mockResponse: express.Response

  beforeAll(async () => {
    const getToken = await mocks.mockGetToken()
    getTokenController = getToken.getTokenController
    mockResponse = httpMocks.createResponse()
    getTokenDTO = {
      authHeader: 'asdklasdoladoassald',
      params: {
        code: 'sd',
        grant_type: 'code',
        response_type: 'id',
      },
    }
  })

  test('When the GetTokenUseCase returns Ok, the GetTokenController returns 200 OK', async () => {
    const useCaseResolvedValue = 'asdklasdhnjkjkewhf'
    jest
      .spyOn(GetTokenUseCase.prototype, 'execute')
      .mockResolvedValue(Result.ok(useCaseResolvedValue))

    const result = await getTokenController.executeImpl(getTokenDTO, mockResponse)

    expect(result.statusCode).toBe(200)
  })

  test('When the GetTokenUseCase returns GetTokenErrors.InvalidCredentials, GetTokenController returns 400 Bad Request', async () => {
    jest
      .spyOn(GetTokenUseCase.prototype, 'execute')
      .mockResolvedValue(Result.err(new GetTokenErrors.InvalidCredentials()))

    const result = await getTokenController.executeImpl(getTokenDTO, mockResponse)

    expect(result.statusCode).toBe(400)
  })

  test('When the GetTokenUseCase returns AppError.UnexpectedError, GetTokenController returns 500 Internal Server Error', async () => {
    jest
      .spyOn(GetTokenUseCase.prototype, 'execute')
      .mockResolvedValue(Result.err(new AppError.UnexpectedError('Unexpected error')))

    const result = await getTokenController.executeImpl(getTokenDTO, mockResponse)

    expect(result.statusCode).toBe(500)
  })
})
