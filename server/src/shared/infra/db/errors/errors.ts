import { AppError } from '../../../core/app-error'

export namespace DBError {
  export class UserNotFoundError extends Error {
    public constructor(identifier: string) {
      super()
      this.message = `The user with attribute (id/email) ${identifier} could not be found.`
    }
  }
  export class AuthSecretNotFoundError extends Error {
    public constructor(identifier: string) {
      super()
      this.message = `The auth secret with clientId ${identifier} could not be found.`
    }
  }
  export class AuthCodeNotFoundError extends Error {
    public constructor(identifier: string) {
      super()
      this.message = `The auth code ${identifier} could not be found.`
    }
  }
  export class PasswordsNotEqualError extends Error {
    public constructor(identifier: string) {
      super()
      this.message = `An invalid password for the user with attribute (id/email) ${identifier} was provided.`
    }
  }
  export class AuthSecretsNotEqualError extends Error {
    public constructor(identifier: string) {
      super()
      this.message = `An invalid client secret ${identifier} was provided.`
    }
  }
}

export type DBErrors =
  | DBError.UserNotFoundError
  | DBError.AuthSecretNotFoundError
  | DBError.AuthCodeNotFoundError
  | DBError.PasswordsNotEqualError
  | AppError.UnexpectedError
