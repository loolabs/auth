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
import { UserAuthHandler } from '../../../../../shared/auth/user-auth-handler'
import { ParamList, ParamPair } from '../../../../../shared/app/param-list'
import { UserDTO } from '../../../mappers/user-dto'
import { UserMap } from '../../../mappers/user-map'

export type CreateUserUseCaseError =
  | UserValueObjectErrors.InvalidEmail
  | UserValueObjectErrors.InvalidSecretValue
  | CreateUserErrors.EmailAlreadyExistsError
  | CreateUserErrors.InvalidOpenIDParamsError
  | AppError.UnexpectedError

export interface CreateUserClientRequestSuccess { 
  redirectParams: ParamList,
  redirectUrl: string
}  

export interface CreateUserNonClientRequestSuccess {
  user: UserDTO
}  

// TODO: perhaps better to decouple these into separate use-cases or further subclasses
export type CreateUserSuccess = CreateUserClientRequestSuccess | CreateUserNonClientRequestSuccess

export type CreateUserUseCaseResponse = Result<CreateUserSuccess, CreateUserUseCaseError>

export class CreateUserUseCase implements UseCaseWithDTO<CreateUserDTO, CreateUserUseCaseResponse> {
  constructor(private authHandler: UserAuthHandler, private userRepo: UserRepo) {}

  async execute(dto: CreateUserDTO): Promise<CreateUserUseCaseResponse> {
    if(dto.params && dto.params.scope){
      if(dto.params.scope !== 'openid' || dto.params.response_type !== 'code'){
        return Result.err(new CreateUserErrors.InvalidOpenIDParamsError())
      }
    } 
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

    try {
      const userAlreadyExists = await this.userRepo.exists(email)

      if (userAlreadyExists && userAlreadyExists.isOk()){
        return Result.err(new CreateUserErrors.EmailAlreadyExistsError(email.value))
      }
        
      const userResult = User.create({
        email,
        password,
      })
      if (userResult.isErr()) return userResult

      const user = userResult.value
      await this.userRepo.save(user)
      const updatedUser = await this.userRepo.getUserByUserEmail(email);
      if(updatedUser.isErr())
        return Result.err(new AppError.UnexpectedError(updatedUser.error.message))

      if(!dto.params || !dto.params.scope){
        return Result.ok({
          user: UserMap.toDTO(updatedUser.value)
        })
      } else {
        const userAuthHandlerCreateOptions = {
          userId: updatedUser.value.id.toString(),
          clientId: dto.params.client_id
        } 
        const authHandlerResponse = await this.authHandler.create(userAuthHandlerCreateOptions)
  
        if(authHandlerResponse.isErr())
          return authHandlerResponse
        
        const redirectParams = new ParamList([
          new ParamPair('code', authHandlerResponse.value.getValue())
        ])
        const createUserSuccessResponse: CreateUserSuccess = {
          redirectParams: redirectParams,
          redirectUrl: dto.params.redirect_uri
        }
  
        return Result.ok(createUserSuccessResponse)
      }
            
    } catch (err) {
      return Result.err(new AppError.UnexpectedError(err))
    }
  }
}
