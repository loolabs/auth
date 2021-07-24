import { UseCaseWithDTO } from '../../../../../shared/app/use-case-with-dto'
import { AppError } from '../../../../../shared/core/app-error'
import { Result } from '../../../../../shared/core/result'
import { ProtectedUserDTO } from './protected-user-dto'

export type ProtectedUserUseCaseError =
  | AppError.UnexpectedError

export type ProtectedUserSuccess = {
  email: string
}

export type ProtectedUserUseCaseResponse = Result<ProtectedUserSuccess, ProtectedUserUseCaseError>

export class ProtectedUserUseCase
  implements UseCaseWithDTO<ProtectedUserDTO, ProtectedUserUseCaseResponse> {

  async execute(dto: ProtectedUserDTO): Promise<ProtectedUserUseCaseResponse> {
    const res: ProtectedUserSuccess = {
      email: dto.user.email.value
    }
    try {
      return Result.ok(res)
    } catch (err) {
      return Result.err(new AppError.UnexpectedError(err))
    }
  }
}
