import express from 'express'
import { DiscoverSPUseCase } from './discover-sp-use-case'
import { DiscoverSPDTO, discoverSPDTOSchema } from './discover-sp-dto'
import { DiscoverSPErrors } from './discover-sp-errors'
import { ControllerWithDTO } from '../../../../../shared/app/controller-with-dto'
import { Result } from '../../../../../shared/core/result'
import { ValidationError } from 'joi'

export class DiscoverSPController extends ControllerWithDTO<DiscoverSPUseCase> {
  constructor(useCase: DiscoverSPUseCase) {
    super(useCase)
  }

  buildDTO(req: express.Request): Result<DiscoverSPDTO, Array<ValidationError>> {
    const errs: Array<ValidationError> = []
    const compiledValidationBody = {
      authHeader: req.headers.authorization,
      params: req.params,
    }
    const bodyResult = this.validate(compiledValidationBody, discoverSPDTOSchema)
    if (bodyResult.isOk()) {
      const body: DiscoverSPDTO = bodyResult.value
      return Result.ok(body)
    } else {
      errs.push(bodyResult.error)
      return Result.err(errs)
    }
  }

  async executeImpl(dto: DiscoverSPDTO, res: express.Response): Promise<express.Response> {
    try {
      const result = await this.useCase.execute(dto)

      if (result.isOk()) {
        return this.ok(res, result.value)
      } else {
        const error = result.error

        switch (error.constructor) {
          case DiscoverSPErrors.ClientNameAlreadyInUse:
            return this.clientError(res, error.message)
          default:
            return this.fail(res, error.message)
        }
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
