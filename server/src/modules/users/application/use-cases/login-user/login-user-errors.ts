export namespace LoginUserErrors {
  export class IncorrectPasswordError extends Error {
    public constructor() {
      super()
      this.message = `Incorrect email/password combination provided.`
    }
  }
}
