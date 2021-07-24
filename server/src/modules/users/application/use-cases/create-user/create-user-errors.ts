export namespace CreateUserErrors {
  export class EmailAlreadyExistsError extends Error {
    public constructor(email: string) {
      super(`An account with the email ${email} already exists`)
    }
  }

  export class InvalidOpenIDParamsError extends Error {
    public constructor() {
      super(`Invalid OpenID parameters were provided.`)
    }
  }
}
