export namespace GetTokenErrors {
  export class InvalidCredentials extends Error {
    public constructor() {
      super()
      this.message = `Incorrect authentication credentials provided.`
    }
  }
}
