import express from 'express'
import { Result } from '../core/result'
import { LoginUserErrors } from '../../modules/users/application/use-cases/login-user/login-user-errors'
import { AppError } from '../core/app-error'
import { AuthCodeString } from '../../modules/users/domain/value-objects/auth-code'
import { UserDTO } from '../../modules/users/mappers/user-dto'

export type AuthToken = string
//if we choose to adopt other authentication certificate types (like jwt-tokens), this can change
export type AuthCertificate = AuthCodeString

//establish success, error, and combined response types for all authentication methods

//login
export type UserAuthHandlerLoginSuccess = {
  cert?: AuthCertificate
  user: UserDTO
}
export type UserAuthHandlerLoginError = LoginUserErrors.IncorrectPasswordError | AppError.UnexpectedError
export type UserAuthHandlerLoginResponse = Result<UserAuthHandlerLoginSuccess, UserAuthHandlerLoginError> 

export interface UserAuthHandlerLoginOptions {
  req: express.Request, // we make the assumption that all auth handlers will require these
  res: express.Response,
  [key: string]: any //additional, implementation-specific options for auth handlers
}

//creation
export type UserAuthHandlerCreateSuccess = AuthCertificate
export type UserAuthHandlerCreateError = AppError.UnexpectedError
export type UserAuthHandlerCreateResponse = Result<UserAuthHandlerCreateSuccess, UserAuthHandlerCreateError> 

export interface UserAuthHandlerCreateOptions {
  userId: string, // we make the assumption that all auth handlers will require this at the least
  [key: string]: any //additional, implementation-specific options for auth handlers
}

export abstract class UserAuthHandler {
  abstract login(options: UserAuthHandlerLoginOptions): Promise<UserAuthHandlerLoginResponse>
  abstract create(options: UserAuthHandlerCreateOptions): Promise<UserAuthHandlerCreateResponse>
}
