import express from 'express'
import { GetTokenUseCase } from './get-token-use-case'
import { GetTokenDTO, getTokenDTOSchema } from './get-token-dto'
import { GetTokenErrors } from './get-token-errors'
import { ControllerWithDTO } from '../../../../../shared/app/controller-with-dto'
import { Result } from '../../../../../shared/core/result'
import { ValidationError } from 'joi'

export class GetTokenController extends ControllerWithDTO<GetTokenUseCase> {
  constructor(useCase: GetTokenUseCase) {
    super(useCase)
  }

  buildDTO(req: express.Request): Result<GetTokenDTO, Array<ValidationError>> {
    const errs: Array<ValidationError> = []
    const compiledValidationBody = {
      authHeader: req.headers.authorization,
      params: req.params,
    }
    const bodyResult = this.validate(compiledValidationBody, getTokenDTOSchema)
    if (bodyResult.isOk()) {
      const body: GetTokenDTO = bodyResult.value
      return Result.ok(body)
    } else {
      errs.push(bodyResult.error)
      return Result.err(errs)
    }
  }

  async executeImpl(dto: GetTokenDTO, res: express.Response): Promise<express.Response> {
    try {
      const result = await this.useCase.execute(dto)

      if (result.isOk()) {
        return this.ok(res, result.value)
      } else {
        const error = result.error

        switch (error.constructor) {
          case GetTokenErrors.InvalidCredentials:
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
