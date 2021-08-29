import { UseCaseWithDTO } from '../../../../../shared/app/use-case-with-dto'
import { AppError } from '../../../../../shared/core/app-error'
import { Result } from '../../../../../shared/core/result'
import { User } from '../../../domain/entities/user'
import { UserValueObjectErrors } from '../../../domain/value-objects/errors'
import { UserEmail } from '../../../domain/value-objects/user-email'
import { UserPassword } from '../../../domain/value-objects/user-password'
import { UserRepo } from '../../../infra/repos/user-repo/user-repo'
import { CreateUserDTO } from './create-user-dto'
import { CreateUserErrors } from './create-user-errors'
import {
  UserAuthHandler,
  UserAuthHandlerLoginResponse,
} from '../../../../../shared/auth/user-auth-handler'
import { ParamList, ParamPair } from '../../../../../shared/app/param-list'
import { UserDTO } from '../../../mappers/user-dto'
import { UserMap } from '../../../mappers/user-map'

export type CreateUserUseCaseError =
  | UserValueObjectErrors.InvalidEmail
  | UserValueObjectErrors.InvalidSecretValue
  | CreateUserErrors.EmailAlreadyExistsError
  | AppError.UnexpectedError

export interface CreateUserClientRequestSuccess {
  redirectParams: ParamList
  redirectUrl: string
}

export interface CreateUserNonClientRequestSuccess {
  user: UserDTO
}

// TODO: perhaps better to decouple these into separate use-cases or further subclasses
export type CreateUserSuccess = CreateUserClientRequestSuccess | CreateUserNonClientRequestSuccess

export type CreateUserUseCaseResponse = Result<CreateUserSuccess, CreateUserUseCaseError>

export class CreateUserUseCase implements UseCaseWithDTO<CreateUserDTO, CreateUserUseCaseResponse> {
  constructor(private userAuthHandler: UserAuthHandler, private userRepo: UserRepo) {}

  async execute(dto: CreateUserDTO): Promise<CreateUserUseCaseResponse> {
    const emailResult = UserEmail.create(dto.body.email)
    const passwordResult = UserPassword.create({
      value: dto.body.password,
      hashed: false,
    })

    const results = [emailResult, passwordResult] as const
    if (!Result.resultsAllOk(results)) {
      return Result.err(Result.getFirstError(results).error)
    }

    const email = results[0].value
    const password = results[1].value

    const userAlreadyExists = await this.userRepo.exists(email)

    if (userAlreadyExists.isOk() && userAlreadyExists.value) {
      return Result.err(new CreateUserErrors.EmailAlreadyExistsError(email.value))
    }

    const userResult = User.create({
      email,
      password,
      emailVerified: false,
      isDeleted: false,
    })
    if (userResult.isErr()) return userResult

    const user = userResult.value
    await this.userRepo.save(user)
    const updatedUser = await this.userRepo.getUserByUserEmail(email)
    if (updatedUser.isErr())
      return Result.err(new AppError.UnexpectedError(updatedUser.error.message))

    if (dto.params) {
      const userAuthHandlerLoginOptions = { req: dto.req, res: dto.res }
      const userAuthHandlerLoginResponse: UserAuthHandlerLoginResponse =
        await this.userAuthHandler.login(userAuthHandlerLoginOptions)
      if (userAuthHandlerLoginResponse.isErr()) {
        return Result.err(userAuthHandlerLoginResponse.error)
      } else {
        const params = dto.params
        const redirectParams = new ParamList(
          Object.entries(params).map((paramPair) => new ParamPair(paramPair[0], paramPair[1]))
        )
        const loginUserSuccessResponse: CreateUserSuccess = {
          redirectParams: redirectParams,
          redirectUrl: `${process.env.PUBLIC_HOST}/authorize`,
        }
        return Result.ok(loginUserSuccessResponse)
      }
    } else {
      return Result.ok({
        user: UserMap.toDTO(updatedUser.value),
      })
    }
  }
}
