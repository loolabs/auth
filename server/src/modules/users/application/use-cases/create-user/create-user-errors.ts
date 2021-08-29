export namespace CreateUserErrors {
  export class EmailAlreadyExistsError extends Error {
    public constructor(email: string) {
      super(`An account with the email ${email} already exists`)
    }
  }
}
