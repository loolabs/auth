import express from 'express'
import { LoginUserUseCase } from './login-user-use-case'
import { LoginUserDTO, loginUserDTOSchema } from './login-user-dto'
import { LoginUserErrors } from './login-user-errors'
import { UserValueObjectErrors } from '../../../domain/value-objects/errors'
import { ControllerWithDTO } from '../../../../../shared/app/controller-with-dto'
import { Result } from '../../../../../shared/core/result'
import { ValidationError } from 'joi'

export class LoginUserController extends ControllerWithDTO<LoginUserUseCase> {
  constructor(useCase: LoginUserUseCase) {
    super(useCase)
  }

  buildDTO(
    req: express.Request,
    res: express.Response
  ): Result<LoginUserDTO, Array<ValidationError>> {
    const errs: Array<ValidationError> = []
    let params: any = req.params
    if (Object.keys(req.params).length === 0) {
      params = undefined
    }
    const compiledValidationBody = {
      req,
      res,
      body: req.body,
      params,
    }
    const bodyResult = this.validate(compiledValidationBody, loginUserDTOSchema)
    if (bodyResult.isOk()) {
      const body: LoginUserDTO = bodyResult.value
      return Result.ok(body)
    } else {
      errs.push(bodyResult.error)
      return Result.err(errs)
    }
  }

  async executeImpl(dto: LoginUserDTO, res: express.Response): Promise<express.Response> {
    try {
      const result = await this.useCase.execute(dto)

      if (result.isOk()) {
        if ('user' in result.value) {
          return this.ok(res, result.value)
        } else {
          return this.redirect(res, result.value.redirectUrl, result.value.redirectParams)
        }
      } else {
        const error = result.error

        switch (error.constructor) {
          case UserValueObjectErrors.InvalidEmail:
            return this.clientError(res, error.message)
          case UserValueObjectErrors.InvalidSecretValue:
            return this.clientError(res, error.message)
          case LoginUserErrors.IncorrectPasswordError:
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
