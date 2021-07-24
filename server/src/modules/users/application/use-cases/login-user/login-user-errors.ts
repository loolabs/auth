export namespace LoginUserErrors {
  export class IncorrectPasswordError {
    public message: string
    public constructor() {
      this.message = `Incorrect email/password combination provided.`
    }
  }

  export class InvalidOpenIDParamsError extends Error {
    public constructor() {
      super(`Invalid OpenID parameters were provided.`)
    }
  }
}
