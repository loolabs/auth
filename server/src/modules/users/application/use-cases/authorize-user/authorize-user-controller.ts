import express from 'express'
import { ControllerWithDTO } from '../../../../../shared/app/controller-with-dto'
import { AuthorizeUserUseCase } from './authorize-user-use-case'
import { AuthorizeUserDTO, AuthorizeUserDTOSchema } from './authorize-user-dto'
import { AuthorizeUserErrors } from './authorize-user-errors'
import { Result } from '../../../../../shared/core/result'
import { ValidationError } from 'joi'

export class AuthorizeUserController extends ControllerWithDTO<AuthorizeUserUseCase> {
  constructor(useCase: AuthorizeUserUseCase) {
    super(useCase)
  }

  buildDTO(req: express.Request): Result<AuthorizeUserDTO, Array<ValidationError>> {
    let params: any = req.params
    const errs: Array<ValidationError> = []
    const compiledRequest = {
      req,
      params,
    }
    const bodyResult = this.validate(compiledRequest, AuthorizeUserDTOSchema)
    if (bodyResult.isOk()) {
      const body = bodyResult.value
      return Result.ok(body)
    } else {
      errs.push(bodyResult.error)
      return Result.err(errs)
    }
  }

  async executeImpl<Res extends express.Response>(dto: AuthorizeUserDTO, res: Res): Promise<Res> {
    try {
      const result = await this.useCase.execute(dto)

      if (result.isOk()) {
        return this.redirect(res, result.value.redirectUrl, result.value.redirectParams)
      } else {
        const error = result.error
        if ('redirectParams' in error) {
          return this.redirect(res, error.redirectUrl, error.redirectParams)
        }
        switch (error.constructor) {
          case AuthorizeUserErrors.InvalidRequestParameters:
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
