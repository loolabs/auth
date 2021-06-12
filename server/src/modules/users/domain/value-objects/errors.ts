export namespace UserValueObjectErrors {
  export class InvalidEmail {
    public message: string
    public constructor(email: string) {
      this.message = `The email address, ${email} is invalid.`
    }
  }

  export class InvalidSecretValue {
    public message: string
    public constructor(message: string) {
      this.message = message
    }
  }

  export class InvalidSecretValueComparison {
    public message: string
    public constructor(message: string) {
      this.message = message
    }
  }

  export class InvalidCodeGenerated {
    public message: string
    public constructor(message: string) {
      this.message = message
    }
  }
}
