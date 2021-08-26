import express from 'express'
import httpMocks from 'node-mocks-http'
import { AppError } from '../../../../../../shared/core/app-error'
import { Result } from '../../../../../../shared/core/result'
import { DiscoverSPDTO } from '../discover-sp-dto'
import { DiscoverSPErrors } from '../discover-sp-errors'
import { DiscoverSPUseCase } from '../discover-sp-use-case'
import { DiscoverSPController } from '../discover-sp-controller'
import { mocks } from '../../../../../../test-utils'

jest.mock('../discover-sp-use-case')

describe('DiscoverSPController', () => {
  let discoverSPDTO: DiscoverSPDTO
  let discoverSPController: DiscoverSPController
  let mockResponse: express.Response

  beforeAll(async () => {
    const discoverSP = await mocks.mockDiscoverSP()
    discoverSPController = discoverSP.discoverSPController
    mockResponse = httpMocks.createResponse()
    discoverSPDTO = {
      client_name: 'testclient',
      redirect_uri: 'loolabs.com/cb',
    }
  })

  test('When the DiscoverSPUseCase returns Ok, the DiscoverSPController returns 200 OK', async () => {
    const useCaseResolvedValue = {
      clientId: '232039sdkljkasldj',
      clientSecret: '65039sdasd123kljkasldj',
    }
    jest
      .spyOn(DiscoverSPUseCase.prototype, 'execute')
      .mockResolvedValue(Result.ok(useCaseResolvedValue))

    const result = await discoverSPController.executeImpl(discoverSPDTO, mockResponse)

    expect(result.statusCode).toBe(200)
  })

  test('When the DiscoverSPUseCase returns DiscoverSPErrors, DiscoverSPController returns 400 Bad Request', async () => {
    jest
      .spyOn(DiscoverSPUseCase.prototype, 'execute')
      .mockResolvedValue(
        Result.err(new DiscoverSPErrors.ClientNameAlreadyInUse(discoverSPDTO.client_name))
      )

    const result = await discoverSPController.executeImpl(discoverSPDTO, mockResponse)

    expect(result.statusCode).toBe(400)
  })

  test('When the DiscoverSPUseCase returns AppError.UnexpectedError, DiscoverSPController returns 500 Internal Server Error', async () => {
    jest
      .spyOn(DiscoverSPUseCase.prototype, 'execute')
      .mockResolvedValue(Result.err(new AppError.UnexpectedError('Unexpected error')))

    const result = await discoverSPController.executeImpl(discoverSPDTO, mockResponse)

    expect(result.statusCode).toBe(500)
  })
})
