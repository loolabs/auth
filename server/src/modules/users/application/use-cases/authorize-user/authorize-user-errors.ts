export namespace AuthorizeUserErrors {
  export class InvalidRequestParameters extends Error {
    public constructor() {
      super(`Invalid openid request parameters supplied.`)
    }
  }
  export class UserNotAuthenticated extends Error {
    public constructor(email: string) {
      super(`The user with email ${email} is not authenticated.`)
    }
  }
}
