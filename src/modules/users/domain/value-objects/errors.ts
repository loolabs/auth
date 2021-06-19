export namespace UserValueObjectErrors {
  export class InvalidEmail extends Error{
    public constructor(email: string) {
      super(`The email address, ${email} is invalid.`)
    }
  }

  export class InvalidSecretValue extends Error{
    public constructor(message: string) {
      super(message)
    }
  }

  export class InvalidSecretValueComparison extends Error{
    public constructor(message: string) {
      super(message)
    }
  }

  export class InvalidCodeGenerated extends Error{
    public constructor(message: string) {
      super(message)
    }
  }
}
