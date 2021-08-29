import express from 'express'
import httpMocks from 'node-mocks-http'
import { AppError } from '../../../../../../shared/core/app-error'
import { Result } from '../../../../../../shared/core/result'
import { DiscoverSPDTO } from '../discover-sp-dto'
import { DiscoverSPErrors } from '../discover-sp-errors'
import { DiscoverSPUseCase } from '../discover-sp-use-case'
import { DiscoverSPController } from '../discover-sp-controller'
import { mocks } from '../../../../../../test-utils'

describe('DiscoverSPController', () => {
  let discoverSPDTO: DiscoverSPDTO
  let discoverSPController: DiscoverSPController
  let discoverSPUseCase: DiscoverSPUseCase
  let mockResponse: express.Response

  beforeAll(async () => {
    const discoverSP = await mocks.mockDiscoverSP()
    discoverSPController = discoverSP.discoverSPController
    discoverSPUseCase = discoverSP.discoverSPUseCase
    mockResponse = httpMocks.createResponse()
    discoverSPDTO = {
      client_name: 'testclient',
      redirect_uri: 'www.loolabs.org/cb',
    }
  })

  test('When the DiscoverSPUseCase returns Ok, the DiscoverSPController returns 200 OK', async () => {
    const useCaseResolvedValue = {
      clientId: 'fcc89db61d93607afbb7008df9197570',
      clientSecret: '81281dd17eafeda8f34b2192aff22f2a',
    }
    jest.spyOn(discoverSPUseCase, 'execute').mockResolvedValue(Result.ok(useCaseResolvedValue))

    const result = await discoverSPController.executeImpl(discoverSPDTO, mockResponse)

    expect(result.statusCode).toBe(200)
  })

  test('When the DiscoverSPUseCase returns DiscoverSPErrors, DiscoverSPController returns 400 Bad Request', async () => {
    jest
      .spyOn(discoverSPUseCase, 'execute')
      .mockResolvedValue(
        Result.err(new DiscoverSPErrors.ClientNameAlreadyInUse(discoverSPDTO.client_name))
      )

    const result = await discoverSPController.executeImpl(discoverSPDTO, mockResponse)

    expect(result.statusCode).toBe(400)
  })

  test('When the DiscoverSPUseCase returns AppError.UnexpectedError, DiscoverSPController returns 500 Internal Server Error', async () => {
    jest
      .spyOn(discoverSPUseCase, 'execute')
      .mockResolvedValue(Result.err(new AppError.UnexpectedError('Unexpected error')))

    const result = await discoverSPController.executeImpl(discoverSPDTO, mockResponse)

    expect(result.statusCode).toBe(500)
  })
})
