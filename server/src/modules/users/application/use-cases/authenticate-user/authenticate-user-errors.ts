export namespace AuthenticateUserErrors {
  export class AuthenticationFailedError extends Error {
    public constructor(email: string, message: string) {
      super()
      this.message = `Authentication for user with ${email} failed: ${message}`
    }
  }
}
